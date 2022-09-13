import BaseController from "./BaseController";
import { LayoutType as LayoutType } from "sap/f/library";
import EventBus from "sap/ui/core/EventBus";
import XMLView from "sap/ui/core/mvc/XMLView";
import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Context from "sap/ui/model/Context";
import { IAuthObject, IEvent, IOption, IParent } from "../interface/Interface";
import Fragment from "sap/ui/core/Fragment";
import Popover from "sap/m/Popover";
import CRUDModel from "../model/CRUDModel";

/**
 * @namespace webapp.typescript.controller
 */
export default class Start extends BaseController {
  oFlexibleColumnLayout: FlexibleColumnLayout;
  oEventBus: EventBus;
  mViews: Promise<XMLView> | undefined;
  oDiscardFragment: Popover;

  public onInit(): void {
    this.oEventBus = this.getOwnerComponent().getEventBus();
    this.oEventBus.subscribe("flexible", "setDetailPage", this.setDetailPage.bind(this), this);
    this.oEventBus.subscribe("flexible", "setDetailDetailPage", this.setDetailDetailPage.bind(this), this);
    this.oEventBus.subscribe("navigation", "navToMain", this.navToMain.bind(this), this);
    this.oEventBus.subscribe("navigation", "navToTesting", this.navToTesting.bind(this), this);

    this.oFlexibleColumnLayout = this.byId("fcl") as FlexibleColumnLayout;
  }

  public onExit(): void {
    this.oEventBus.unsubscribe("flexible", "setDetailPage", this.setDetailPage.bind(this), this);
    this.oEventBus.unsubscribe("flexible", "setDetailDetailPage", this.setDetailDetailPage.bind(this), this);
    this.oEventBus.unsubscribe("navigation", "navToMain", this.navToMain.bind(this), this);
    this.oEventBus.unsubscribe("navigation", "navToTesting", this.navToTesting.bind(this), this);
  }

  public setDetailPage(a: string, b: string, oEvent: Event): void {
    const oContext: Context | null = Object.values(oEvent).length ? ((oEvent.getSource() as Control).getBindingContext() as Context) : null;
    void this.loadView({
      id: "midView",
      viewName: "webapp.typescript.view.Detail",
    })
      .then((oDetailView) => {
        this.oFlexibleColumnLayout.addMidColumnPage(oDetailView);
        this.oFlexibleColumnLayout.setLayout(LayoutType.TwoColumnsBeginExpanded);
        return oDetailView;
      })
      .then((oDetailView) => {
        if (oContext) oDetailView.setBindingContext(oContext);
      });
  }

  public setDetailDetailPage(a: string, b: string, oEvent: Event) {
    const sPath = ((oEvent.getSource() as Control).getBindingContext() as Context).getPath().replace("Data", "Posts").replace("/subCategory", "")
    const oContext: Context = (this.getModel() as CRUDModel).createBindingContext(sPath) as Context
    void this.loadView({
      id: "endView",
      viewName: "webapp.typescript.view.DetailDetail",
    })
      .then((oDetailDetailView) => {
        this.oFlexibleColumnLayout.addEndColumnPage(oDetailDetailView);
        this.oFlexibleColumnLayout.setLayout(LayoutType.ThreeColumnsMidExpanded);
        return oDetailDetailView;
      })
      .then((oDetailDetailView) => {
        oDetailDetailView.setBindingContext(oContext);
      });
  }

  public loadView(options: IOption): Promise<XMLView> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment
    const mViews: Promise<XMLView> | any = (this.mViews = this.mViews || Object.create(null));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!mViews[options.id]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      mViews[options.id] = this.getOwnerComponent().runAsOwner(() => {
        return XMLView.create(options);
      }) as Promise<XMLView>;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return mViews[options.id] as unknown as Promise<XMLView>;
  }

  public navToMain(a: string, b: string, oEvent: Event | object): void {
    const sPath: string = (oEvent as IEvent)?.sPath
      ? (oEvent as IEvent).sPath
      : (((oEvent as Event).getSource() as Control).getBindingContext() as Context)?.getPath();
    this.navTo("main", { sPath: sPath.replace(/\//g, "-") }, true);
  }

  public navToTesting(a: string, b: string, oEvent: Event): void {
    const sPath: string = ((oEvent.getSource() as Control).getBindingContext() as Context).getPath();
    this.navTo("test", { sPath: sPath.replace(/\//g, "-") }, true);
  }

  public onPressAvatar(oEvent: Event) {
    if (!this.getSupportModel().getProperty("/auth")) this.loadAuthorizationDialog(oEvent.getSource() as Control);
    else {
      const oButton = oEvent.getSource();
      const oView = this.getView();
      this.oFragment = Fragment.load({
        id: oView?.getId(),
        name: "webapp.typescript.view.fragments.LogOutPopover",
        controller: this,
      }).then((oPopover) => {
        this.oDiscardFragment = oPopover as Popover;
        oView?.addDependent(oPopover as Popover);
        (oPopover as Popover).openBy(oButton, false);
      });
    }
  }

  public handleDiscardPopover() {
    const sEmail = (JSON.parse(localStorage.getItem("auth") as string) as IAuthObject).email
    void (this.getView()?.getModel() as CRUDModel).saveUser(sEmail, "")
    localStorage.clear();
    this.getSupportModel().setProperty("/auth", null);
    this.oDiscardFragment.close();
  }

  public onAfterPopoverClose(oEvent: Event) {
    this.findPopover(oEvent.getSource() as IParent);
  }

  public findPopover(oControl: IParent): void {
    oControl.getMetadata().getElementName() !== "sap.m.Popover"
      ? this.findPopover(oControl.oParent as IParent)
      : (oControl as unknown as Popover).destroy();
  }
}

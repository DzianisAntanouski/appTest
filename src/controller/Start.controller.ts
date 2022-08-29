import BaseController from "./BaseController";
import { LayoutType as LayoutType } from "sap/f/library";
import EventBus from "sap/ui/core/EventBus";
import XMLView from "sap/ui/core/mvc/XMLView";
import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Context from "sap/ui/model/Context";
import { IOption } from "../interface/Interface";
import JSONModel from 'sap/ui/model/json/JSONModel';
import Auth from "../db/Auth";

/**
 * @namespace webapp.typescript.controller
 */
export default class Start extends BaseController {
  oFlexibleColumnLayout: FlexibleColumnLayout;
  bus: EventBus;
  mViews: Promise<XMLView> | undefined;

  public onInit(): void {
    this.bus = this.getOwnerComponent().getEventBus();
    this.bus.subscribe("flexible", "setDetailPage", this.setDetailPage.bind(this), this);
    this.bus.subscribe("flexible", "setDetailDetailPage", this.setDetailDetailPage.bind(this), this);
    this.bus.subscribe("navigation", "navToMain", this.navToMain.bind(this), this);
    this.bus.subscribe("navigation", "navToTesting", this.navToTesting.bind(this), this);

    this.oFlexibleColumnLayout = this.byId("fcl") as FlexibleColumnLayout;
    // void this.fireBaseRead("/FrontEnd", "/SAPUI5").then((data) => console.log(data))
  }

  public onExit(): void {
    this.bus.unsubscribe("flexible", "setDetailPage", this.setDetailPage.bind(this), this);
    this.bus.unsubscribe("flexible", "setDetailDetailPage", this.setDetailDetailPage.bind(this), this);
    this.bus.unsubscribe("navigation", "navToMain", this.navToMain.bind(this), this);
    this.bus.unsubscribe("navigation", "navToTesting", this.navToTesting.bind(this), this);
  }

  public setDetailPage(a: string, b: string, oEvent: Event): void {
    const oContext: Context | null = Object.values(oEvent).length ? ((oEvent.getSource() as Control).getBindingContext() as Context) : null;
    void this.loadView({
      id: "midView",
      viewName: "webapp.typescript.view.Detail",
    })
      .then((detailView) => {
        this.oFlexibleColumnLayout.addMidColumnPage(detailView);
        this.oFlexibleColumnLayout.setLayout(LayoutType.TwoColumnsBeginExpanded);
        return detailView;
      })
      .then((detailView) => {
        if (oContext) detailView.setBindingContext(oContext);
      });
  }

  public setDetailDetailPage(a: string, b: string, oEvent: Event) {
    const oContext: Context = (oEvent.getSource() as Control).getBindingContext() as Context;
    void this.loadView({
      id: "endView",
      viewName: "webapp.typescript.view.DetailDetail",
    })
      .then((detailDetailView) => {
        this.oFlexibleColumnLayout.addEndColumnPage(detailDetailView);
        this.oFlexibleColumnLayout.setLayout(LayoutType.ThreeColumnsMidExpanded);
        return detailDetailView;
      })
      .then((detailDetailView) => {
        detailDetailView.setBindingContext(oContext);
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
    interface IEvent {
      event: boolean
      sPath: string
    }
    const sPath: string = (oEvent as IEvent)?.sPath ? (oEvent as IEvent).sPath : (((oEvent as Event).getSource() as Control).getBindingContext() as Context).getPath();
    this.navTo("main", { sPath: sPath.replace(/\//g, "-") }, true);
  }

  public navToTesting(a: string, b: string, oEvent: Event): void {
    const sPath: string = ((oEvent.getSource() as Control).getBindingContext() as Context).getPath();
    this.navTo("test", { sPath: sPath.replace(/\//g, "-") }, true);
  }


  public onPressAvatar(): void{ 
    if (!(this.getModel("supportModel") as JSONModel).getProperty("/auth")) this.loadAuthorizationDialog();      
  }  



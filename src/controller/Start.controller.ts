import BaseController from "./BaseController";
import {LayoutType as LayoutType}  from "sap/f/library"
import EventBus from "sap/ui/core/EventBus";
import XMLView from "sap/ui/core/mvc/XMLView";
import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";

interface IOption {
    id: string
    viewName: string}

/**
 * @namespace webapp.typescript.controller
 */
export default class Start extends BaseController {
  oFlexibleColumnLayout: FlexibleColumnLayout;  
  bus: EventBus
  mViews: Promise<XMLView> | undefined

  public onInit (): void {    
    this.bus = this.getOwnerComponent().getEventBus()
    this.bus.subscribe("flexible", "setDetailPage", this.setDetailPage.bind(this), this);
    this.bus.subscribe("flexible", "setDetailDetailPage", this.setDetailDetailPage.bind(this), this);

    this.oFlexibleColumnLayout = this.byId("fcl") as FlexibleColumnLayout;
    // void this.fireBaseRead("/FrontEnd", "/SAPUI5").then((data) => console.log(data))
  }

  public onExit (): void {
    this.bus.unsubscribe("flexible", "setDetailPage", this.setDetailPage.bind(this), this);
    this.bus.unsubscribe("flexible", "setDetailDetailPage", this.setDetailDetailPage.bind(this), this);
  }

  public setDetailPage (): void {
    void this.loadView({
      id: "midView",
      viewName: "webapp.typescript.view.Detail"
    }).then((detailView) => {
      this.oFlexibleColumnLayout.addMidColumnPage(detailView);
      this.oFlexibleColumnLayout.setLayout(LayoutType.TwoColumnsBeginExpanded);
    });
  }

  public setDetailDetailPage () {
    void this.loadView({
      id: "endView",
      viewName: "webapp.typescript.view.DetailDetail"
    }).then((detailDetailView) => {
      this.oFlexibleColumnLayout.addEndColumnPage(detailDetailView);
      this.oFlexibleColumnLayout.setLayout(LayoutType.ThreeColumnsMidExpanded);
    });
  }
  
  public loadView (options: IOption): Promise<XMLView> {
    
    // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment
    const mViews: Promise<XMLView> | any = this.mViews = this.mViews || Object.create(null);
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

  public navToMain(): void {
    this.navTo("main");
  }

  public navToTesting(): void {
    this.navTo("test");
  }
}

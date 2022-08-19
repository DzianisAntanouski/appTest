import MessageToast from "sap/m/MessageToast";
import Event from "sap/ui/base/Event";
import EventBus from "sap/ui/core/EventBus";
import BaseController from "./BaseController";

/**
 * @namespace webapp.typescript.controller
 */
export default class DetailDetail extends BaseController {
  bus: EventBus;
  public onInit(): void {
    this.bus = this.getOwnerComponent().getEventBus();
  }
  public handleClose() {
    MessageToast.show("Loading end column...");
    this.bus.publish("flexible", "setDetailPage");
  }
  public handleNavToManage(oEvent: Event) {
    this.bus.publish("navigation", "navToMain", oEvent);
  }

  public handleNavToTest(oEvent: Event) {
    this.bus.publish("navigation", "navToTesting", oEvent);
  }
}

import MessageToast from "sap/m/MessageToast";
import EventBus from "sap/ui/core/EventBus";
import BaseController from "./BaseController";

/**
 * @namespace webapp.typescript.controller
 */
export default class Master extends BaseController {
  bus: EventBus;
  public onInit(): void {
    this.bus = this.getOwnerComponent().getEventBus();
  }
  public handleMasterPress(): void {    
    MessageToast.show("Loading mid column...");
    this.bus.publish("flexible", "setDetailPage");
  }
}

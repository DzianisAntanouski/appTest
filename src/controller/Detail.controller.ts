import MessageToast from "sap/m/MessageToast";
import EventBus from "sap/ui/core/EventBus";
import BaseController from "./BaseController";

/**
 * @namespace webapp.typescript.controller
 */
export default class Detail extends BaseController {
  bus: EventBus;

  public onInit(): void {
    this.bus = this.getOwnerComponent().getEventBus();
  }

  public handleDetailPress(oEvent: Event): void {
    MessageToast.show("Loading end column...setDetailDetailPage");
    this.bus.publish("flexible", "setDetailDetailPage", oEvent);
  }
}

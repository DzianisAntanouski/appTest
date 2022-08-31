import MessageToast from "sap/m/MessageToast";
import EventBus from "sap/ui/core/EventBus";
import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";

/**
 * @namespace webapp.typescript.controller
 */
export default class Master extends BaseController {
  bus: EventBus;

  public onInit(): void {
    this.bus = this.getOwnerComponent().getEventBus();
  }

  public handleMasterPress(oEvent: Event): void {
    MessageToast.show(this.i18n("loadingSubcategoriesMessageText"));
    this.bus.publish("flexible", "setDetailPage", oEvent);
  }
}

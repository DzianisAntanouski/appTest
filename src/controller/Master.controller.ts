import MessageToast from "sap/m/MessageToast";
import EventBus from "sap/ui/core/EventBus";
import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";
import CRUDModel from '../model/CRUDModel';

/**
 * @namespace webapp.typescript.controller
 */
export default class Master extends BaseController {
  oEventBus: EventBus;

  public onInit(): void {
    this.oEventBus = this.getOwnerComponent().getEventBus();    
  }

  public handleMasterPress(oEvent: Event): void {   
    MessageToast.show(this.i18n("loadingSubcategoriesMessageText"));
    this.oEventBus.publish("flexible", "setDetailPage", oEvent);
  }
}

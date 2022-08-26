import MessageToast from "sap/m/MessageToast";
import Event from "sap/ui/base/Event";
import EventBus from "sap/ui/core/EventBus";
import BaseController from "./BaseController";
import Context from 'sap/ui/model/Context';
import JSONModel from "sap/ui/model/json/JSONModel";

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
    interface IOwner {
      createdBy: {
        [key: string]: string
      }
    }
    const sPath: string = (this.getView().getBindingContext() as Context).getPath()
    const sCreatedBy: object = ((this.getModel() as JSONModel).getProperty(sPath) as IOwner).createdBy
    if (!this.getModel("supportModel").getProperty("/auth")) this.loadAuthorizationDialog()
    else if (Object.values(sCreatedBy)[0] === this.getModel("supportModel").getProperty("/auth/email")) {
      this.bus.publish("navigation", "navToMain", oEvent)
    }
    else alert("Вы не являетесь владельцем!");
  }

  public handleNavToTest(oEvent: Event) {
    this.bus.publish("navigation", "navToTesting", oEvent);
  }
}

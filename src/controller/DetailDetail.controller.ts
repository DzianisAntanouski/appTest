import MessageToast from "sap/m/MessageToast";
import Event from "sap/ui/base/Event";
import EventBus from "sap/ui/core/EventBus";
import BaseController from "./BaseController";
import Context from "sap/ui/model/Context";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import { IOwner, IPost } from '../interface/Interface';
import FeedInput from "sap/m/FeedInput";
import DateFormat from "sap/ui/core/format/DateFormat";
import CRUDModel from '../model/CRUDModel';

/**
 * @namespace webapp.typescript.controller
 */
export default class DetailDetail extends BaseController {
  oEventBus: EventBus;

  public onInit(): void {
    this.oEventBus = this.getOwnerComponent().getEventBus();
  }

  /**
   * onPost
   */
  public onPost(oEvent: Event): void {
    if (!this.getSupportModel().getProperty('/auth')) {
      const oControl = (oEvent.getSource() as FeedInput)
      const sText = oControl.getValue()
      const pReturnText = new Promise((resolve, reject) => {
        resolve(sText);        
      });
      
      pReturnText.then((value) => {
        oControl.setValue(value as string);
      });
      return
    } 
    const oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
    const oDate = new Date();
    const sDate = oFormat.format(oDate);
    const oPost: IPost = {
      author: this.getSupportModel().getProperty('/auth').email as string,
      text: (oEvent.getSource() as FeedInput).getValue(),
      date: sDate
    }
    const aPath: string[] = (this.getView()?.getBindingContext() as Context).getPath().split("/")
    void (this.getModel() as CRUDModel).createPost(aPath[2], aPath[3], oPost)
  }

  public handleClose() {
    MessageToast.show(this.i18n("loadingNewPageMessage") as string);
    this.oEventBus.publish("flexible", "setDetailPage");
  }

  /**
   *
   * @param oEvent An Event object consisting of an ID, a source and a map of parameters.
   * Implements sap.ui.base.
   * Poolable and therefore an event object in the event handler will be reset by
   * sap.ui.base.ObjectPool after the event handler is done.
   */
  public handleNavToManage(oEvent: Event) {
    const sPath: string = (this.getView()?.getBindingContext() as Context).getPath();
    const oCreatedBy: object = ((this.getModel() as JSONModel).getProperty(sPath) as IOwner).createdBy;

    if (!this.getSupportModel().getProperty("/auth")) this.loadAuthorizationDialog();
    else if (!oCreatedBy || Object.values(oCreatedBy)[0] === this.getSupportModel().getProperty("/auth/email")) {
      this.oEventBus.publish("navigation", "navToMain", oEvent);
    } else MessageBox.error(this.i18n("authorizationMTPageErrorMessage") as string);
  }

  /**
   *
   * @param oEvent An Event object consisting of an ID, a source and a map of parameters.
   * Implements sap.ui.base.
   * Poolable and therefore an event object in the event handler will be reset by
   * sap.ui.base.ObjectPool after the event handler is done.
   */
  public handleNavToTest(oEvent: Event) {
    this.oEventBus.publish("navigation", "navToTesting", oEvent);
  }
}

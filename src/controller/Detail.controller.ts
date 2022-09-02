import Button from "sap/m/Button";
import Dialog from "sap/m/Dialog";
import Label from "sap/m/Label";
import { DialogType, ButtonType } from "sap/m/library";
import MessageToast from "sap/m/MessageToast";
import TextArea from "sap/m/TextArea";
import Event from "sap/ui/base/Event";
import Core from "sap/ui/core/Core";
import EventBus from "sap/ui/core/EventBus";
import BaseController from "./BaseController";
import FetchDataBase from "../db/FetchDB";
import Context from "sap/ui/model/Context";
import formatter from "../model/formatter";

/**
 * @namespace webapp.typescript.controller
 */
export default class Detail extends BaseController {
  oEventBus: EventBus;
  oSubmitDialog: Dialog;
  formatter = formatter;

  public onInit(): void {
    this.oEventBus = this.getOwnerComponent().getEventBus();
  }

  /**
   *
   * @param oEvent An Event object consisting of an ID, a source and a map of parameters.
   * Implements sap.ui.base.
   * Poolable and therefore an event object in the event handler will be reset by
   * sap.ui.base.ObjectPool after the event handler is done.
   */
  public handleDetailPress(oEvent: Event): void {
    MessageToast.show(this.i18n("loadingNewPageMessage"));
    this.oEventBus.publish("flexible", "setDetailDetailPage", oEvent);
  }

  public onPressAddCategory(): void {
    if (!this.getSupportModel().getProperty("/auth")) this.loadAuthorizationDialog();
    if (this.getSupportModel().getProperty("/auth")) {
      if (!this.oSubmitDialog) {
        this.oSubmitDialog = new Dialog({
          type: DialogType.Message,
          title: this.i18n("confirm"),
          content: [
            new Label({
              text: this.i18n("addSubcategoryDialogLabelText"),
              labelFor: "categoryName",
            }),

            new TextArea("categoryName", {
              width: "100%",
              placeholder: this.i18n("addSubcategoryDialogTextAreaPlaceholder"),

              liveChange: (oEvent: Event): void => {
                const sText: string = (oEvent as unknown as Event).getParameter("value") as string;
                this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
              },
            }),
          ],
          beginButton: new Button({
            type: ButtonType.Emphasized,
            text: this.i18n("addSubcategoryDialogSubmitBtnText"),
            enabled: false,
            press: () => {
              const sText = (Core.byId("categoryName") as TextArea).getValue();
              MessageToast.show(this.i18n("submitMessage", [sText]));
              const aPath: string[] = (this.getView()?.getBindingContext() as Context).getPath().split("/");
              const sEmail: string = this.getSupportModel().getProperty("/auth/email") as string;
              void FetchDataBase.createCategory(sEmail, `/${aPath[2]}`, `/${sText}`).then(() => void this.fireBaseRead());
              void (Core.byId("categoryName") as TextArea).setValue("");
              this.oSubmitDialog.close();
            },
          }),
          endButton: new Button({
            text: this.i18n("addSubcategoryDialogSubmitBtnCancel"),
            press: () => {
              void (Core.byId("categoryName") as TextArea).setValue("");
              this.oSubmitDialog.close();
            },
          }),
        });
      }
      this.oSubmitDialog.open();
    }
  }

  /**
   *
   * @param oEvent An Event object consisting of an ID, a source and a map of parameters.
   * Implements sap.ui.base.
   * Poolable and therefore an event object in the event handler will be reset by
   * sap.ui.base.ObjectPool after the event handler is done.
   */
  onRunTest(oEvent: Event) {
    this.oEventBus.publish("navigation", "navToTesting", oEvent);
  }
}

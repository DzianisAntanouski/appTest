import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import models from "../model/models";
import ListBase from "sap/m/ListBase";
import Context from "sap/ui/model/Context";
import MessageBox from "sap/m/MessageBox";
import Dialog from "sap/m/Dialog";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import UI5Element from "sap/ui/core/Element";

/**
 * @namespace webapp.typescript.controller
 */
export default class Start extends BaseController {
  oFragment: Promise<Dialog | Control | Control[]>;

  onSubmitPress(): void {
    const checkedAnswers = this.getCheckedAnswers();
    if (this.checkBeforeSubmit(checkedAnswers)) {
      this.checkResultsOfTest();
    } else {
      MessageBox.information("You should answer all the questions");
    }
  }

  getCheckedAnswers(): Array<Array<string>> {
    const array: Array<Context[]> = this.getView()
      .getControlsByFieldGroupId("table")
      .filter((oControl) => oControl.getMetadata().getElementName() === "sap.m.Table")
      .map((control) => (control as ListBase).getSelectedContexts());
    return array.map((context) => context.map((el) => el.getPath()));
  }

  checkBeforeSubmit(checkedAnswers: Array<Array<string>>) {
    return checkedAnswers.every((array) => array.length > 0);
  }
  onCancelPress(): void {
    MessageBox.confirm("Do you want to RESET all selected answers?", {
      onClose: (oAction: string) => {
        console.log(oAction);
        if (oAction === "OK") {
          this.resetAllSelectedAnswers();
        }
      },
    });
  }
  resetAllSelectedAnswers(): void {
    // ?? in process
    this.getModel();
  }
  checkResultsOfTest(): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!this.oFragment) {
      const oView = this.getView();
      this.oFragment = Fragment.load({
        id: oView.getId(),
        name: "webapp.typescript.view.fragments.ResultsOfTest",
        controller: this,
      }).then((oMessagePopover) => {
        oView.addDependent(oMessagePopover as UI5Element);
        return oMessagePopover;
      });
    }
    // const oModel = this.getModel() as JSONModel;
    // oModel.setProperty("/newQuestion", JSON.parse(JSON.stringify(this.newQuestion)));
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).open());
  }
}

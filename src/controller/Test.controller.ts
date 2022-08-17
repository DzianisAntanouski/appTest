import BaseController from "./BaseController";
import ListBase from "sap/m/ListBase";
import Context from "sap/ui/model/Context";
import MessageBox from "sap/m/MessageBox";
import Dialog from "sap/m/Dialog";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import UI5Element from "sap/ui/core/Element";
import formatter from "../model/formatter";
import Table from "sap/m/Table";
import { IQuestion } from '../model/models';
import JSONModel from 'sap/ui/model/json/JSONModel';


/**
 * @namespace webapp.typescript.controller
 */
export default class Start extends BaseController {
  formatter = formatter
  oFragment: Promise<Dialog | Control | Control[]>;

  onSubmitPress(): void {
    const checkedAnswers = this.getCheckedAnswers();
    if (this.checkBeforeSubmit(checkedAnswers)) {
      this.setAnswers();
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
    const arrayTable = this.getView().getControlsByFieldGroupId("table").filter((oControl) => oControl.getMetadata().getElementName() === "sap.m.Table") as Table[]
    arrayTable.map((value) => value.removeSelections(true));
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
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).open());
  }

  onCancelFragment() {
    this.resetAllSelectedAnswers();
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).close());
  }
  setAnswers() {
    const model = this.getModel() as JSONModel;
    const question = model.getProperty('/questions') as IQuestion[];
    const rightAnswersWord = question.map(elem => elem.rightAnswer.map(el => { return elem.answers[el - 1] }))
    const clientAnswers = this.getCheckedAnswers()
    const clientAnswersWord = clientAnswers.map((el: string[]) =>
      el.map(elem => {
        const a = model.getProperty(elem) as string;
        return a
      })
    );
    model.setProperty('/additional', []);
    const isTrue = clientAnswersWord.map((elem, index) => elem.map(el => rightAnswersWord[index].includes(el)))
    const objectclientAnswersWord = clientAnswersWord.map((el, index: number) =>
      el.map((elem, i: number) => { return { word: elem, isTrueAnswers: isTrue[index][i] } })
    )
    clientAnswersWord.forEach((elem, index: number) => {
      const question = model.getProperty(`/questions/${index}/question`) as string;
      model.setProperty(`/additional/${index}`, { rightAnswersWord: rightAnswersWord[index], clientAnswersWord: objectclientAnswersWord[index], questionWord: question });
    })
  }
}

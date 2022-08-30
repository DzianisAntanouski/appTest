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
import JSONModel from "sap/ui/model/json/JSONModel";
import { IQuestion, IResult, IResultQuestion } from '../interface/Interface';
import Event from "sap/ui/base/Event";
import FetchDataBase from "../db/FetchDB";


/**
 * @namespace webapp.typescript.controller
 */
export default class Start extends BaseController {
  formatter = formatter;
  oFragment: Promise<Dialog | Control | Control[]>;
  fragment: Promise<Dialog | Control | Control[]>;

  public onInit(): void {
    this.getOwnerComponent().getRouter().getRoute("test")?.attachPatternMatched(this.onPatternMatched.bind(this), this);
  }

  public onPatternMatched(oEvent: Event) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const sPath: string = oEvent.getParameter("arguments").sPath as string;
    const arrayPathLength = sPath.split('-').length
    const replacedPath = sPath.replace(/-/g, "/")
    if (arrayPathLength > 3) {
      this.getView()?.bindObject({
        path: replacedPath,
      });
    } else {
      this.getView()?.bindObject({
        path: `${replacedPath}/questionsAll`
      });
    }

  }

  onSubmitPress(): void {
    const checkedAnswers = this.getCheckedAnswers();
    const text = this.i18n('messageBeforeSubmitAnswers')
    if (this.checkBeforeSubmit(checkedAnswers)) {
      this.setAnswers();
      this.openResultsOfTest();
      this.setTotalResults();
    } else {
      MessageBox.information(text);
    }

  }

  getCheckedAnswers(): Array<Array<string>> {
    const array: Array<Context[]> | undefined = this.getView()?.getControlsByFieldGroupId("table")
      .filter((oControl) => oControl.getMetadata().getElementName() === "sap.m.Table")
      .map((control) => (control as ListBase).getSelectedContexts());
    return array ? array.map((context) => context.map((el) => el.getPath())) : [];
  }

  checkBeforeSubmit(checkedAnswers: Array<Array<string>>) {
    return checkedAnswers.every((array) => array.length > 0);
  }
  checkBeforeReset(checkedAnswers: Array<Array<string>>) {
    return checkedAnswers.some((array) => array.length > 0);
  }

  onCancelPress(): void {
    const checkedAnswers = this.getCheckedAnswers();
    const text = this.i18n('messageBeforeResetAnswers')
    if (this.checkBeforeReset(checkedAnswers)) {
      MessageBox.confirm(text, {
        onClose: (oAction: string) => {
          console.log(oAction);
          if (oAction === "OK") {

            this.resetAllSelectedAnswers();
          }
        },
      });
    }
  }

  resetAllSelectedAnswers(): void {
    const arrayTable = this.getView()?.getControlsByFieldGroupId("table").filter((oControl) => oControl.getMetadata().getElementName() === "sap.m.Table") as Table[];
    arrayTable.map((value) => value.removeSelections(true));
  }

  openResultsOfTest(): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!this.oFragment) {
      const oView = this.getView();
      this.oFragment = Fragment.load({
        id: oView?.getId(),
        name: "webapp.typescript.view.fragments.ResultsOfTest",
        controller: this,
      }).then((oMessagePopover) => {
        oView?.addDependent(oMessagePopover as UI5Element);
        return oMessagePopover;
      });
    }
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).open());
  }

  onCancelFragment() {
    this.resetAllSelectedAnswers();
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).close());
  }

  onCancelFragmentResult() {
    this.resetAllSelectedAnswers();
    void this.fragment.then((oMessagePopover) => (oMessagePopover as Dialog).close());
  }

  calculateResults(index: number, rightAnswersWord: string[][], isTrue: boolean[][]): number {
    const allRight = rightAnswersWord[index].length;
    const clientRight = isTrue[index].filter(el => el === true).length
    const clientFalse = isTrue[index].filter(el => el === false).length
    return +(clientRight / allRight - clientFalse / allRight).toFixed(1)
  }

  getWordRightAnswers(question: IQuestion[] | []): string[][] {
    return question.map((elem: IQuestion) =>
      elem.rightAnswer.map((el) => {
        return elem.answers[el - 1];
      })
    );
  }

  getWordClientAnswers(): string[][] {
    const clientAnswers = this.getCheckedAnswers();
    const model = this.getModel() as JSONModel;
    return clientAnswers.map((el: string[]) =>
      el.map((elem) => {
        const a = model.getProperty(elem) as string;
        return a;
      })
    );
  }

  checkAnswers(clientAnswersWord: string[][], rightAnswersWord: string[][]): boolean[][] {
    return clientAnswersWord.map((elem, index) => elem.map((el) => rightAnswersWord[index].includes(el)))
  }

  getObjectWordClientAnswers(clientAnswersWord: string[][], isTrue: boolean[][]): { word: string, isTrueAnswers: boolean }[][] {
    return clientAnswersWord.map((el, index: number) =>
      el.map((elem, i: number) => {
        return { word: elem, isTrueAnswers: isTrue[index][i] };
      })
    );
  }

  setTotalResults() {
    const data = this.getSupportModel().getProperty('/resultsByQuestions') as IResultQuestion[];
    const number = (data.reduce((prev, current) => prev + current.points, 0) / data.length * 100).toFixed(1)
    this.getSupportModel().setProperty('/currentTotalResult', number)
  }

  setAnswers() {
    const path = this.getView()?.getBindingContext()?.getPath();
    const model = this.getModel() as JSONModel;
    const question: IQuestion[] | [] = Object.values((model.getProperty(path ? path : '') as { name: string, questions: object }).questions);
    const rightAnswersWord = this.getWordRightAnswers(question)
    const clientAnswersWord = this.getWordClientAnswers()
    const isTrue = this.checkAnswers(clientAnswersWord, rightAnswersWord);
    const objectclientAnswersWord = this.getObjectWordClientAnswers(clientAnswersWord, isTrue)

    clientAnswersWord.forEach((elem, index: number) => {
      const questionWord = question[index].question;
      const point = this.calculateResults(index, rightAnswersWord, isTrue)
      this.getSupportModel().setProperty(`/resultsByQuestions/${index}`, {
        rightAnswersWord: rightAnswersWord[index],
        clientAnswersWord: objectclientAnswersWord[index],
        questionWord,
        points: point < 0 ? 0 : point,
      });
    });
  }

  onSaveResults() {
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).close());
    const text = this.i18n('messageAfterSave');
    const buttonStatistic = this.i18n('buttonStatistic');
    const buttonSCancel = this.i18n('btnCancel');
    MessageBox.information(text, {
      actions: [buttonStatistic, buttonSCancel],
      onClose: (oAction: string) => {
        console.log(oAction);
        if (oAction === buttonStatistic) {
          this.onShowStatistics();
        }
      },
    });
    this.setResult()
  }

  getCategorySubcategory() {
    const arrayBinding = this.getView()?.getBindingContext()?.getPath().split('/')
    const category = arrayBinding ? arrayBinding[2] : '';
    const subcategory = arrayBinding ? arrayBinding[4] ? arrayBinding[4] : '' : '';
    return [category, subcategory]
  }

  setResult() {
    const [category, subcategory] = this.getCategorySubcategory()
    const data = new Date().toString();
    const text = this.i18n('anonimus');
    const points = this.getSupportModel().getProperty('/currentTotalResult') as string;
    const emailText = this.getSupportModel().getProperty('/auth/email') as string;
    const emailOrAnonimus = emailText ? emailText : text;
    const results = { email: emailOrAnonimus, category, subcategory, points }
    void FetchDataBase.postResults(results, data, category, subcategory)
    void FetchDataBase.postAllResults(results, data)
      .then(() => {
        void FetchDataBase.getAllResults().then((resp) => {
          const a = (Object.values(resp) as IResult[]).sort((a, b) => +b.points - +a.points);
          this.getSupportModel().setProperty('/results', a)
        })
      })
  }


  onShowStatistics() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!this.fragment) {
      const oView = this.getView();
      this.fragment = Fragment.load({
        id: oView?.getId(),
        name: "webapp.typescript.view.fragments.Statistics",
        controller: this,
      }).then((oMessagePopover) => {
        oView?.addDependent(oMessagePopover as UI5Element);
        return oMessagePopover;
      });
    }
    void this.fragment.then((oMessagePopover) => (oMessagePopover as Dialog).open());
  }
}
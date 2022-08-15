import BaseController from "./BaseController";
import formatter from "../model/formatter";
import JSONModel from "sap/ui/model/json/JSONModel";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Context from "sap/ui/model/Context";
import models from "../model/models";
import { MessageType } from "sap/ui/core/library";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";
import UI5Element from "sap/ui/core/Element";
import Input from "sap/m/Input";
import CheckBox from "sap/m/CheckBox";

/**
 * @namespace webapp.typescript.controller
 */
export default class Main extends BaseController {
  oFragment: Promise<Dialog | Control | Control[]>;
  newQuestion: object = {
    question: "",
    answer: {
      0: "",
      1: "",
      2: "",
      3: "",
    },
    rightAnswer: "",
  };
  private formatter = formatter;

  public onInit(): void {
    const qListModel: JSONModel = this.getOwnerComponent().getModel() as JSONModel;
    const oContext: Context = new Context(qListModel, "/questions/0");
    this.getView().byId("detailDetail").setBindingContext(oContext);
    // this.highlightSwitcher();
  }

  private highlightSwitcher(): void {
    const oContext: Context = this.getView().byId("detailDetail").getBindingContext() as Context;
    const sPath: string = oContext.getPath();

    const sIndex: string = sPath.slice(sPath.search(/\/?[0-9]+/) + 1);
    const oControls: Array<Control> = this.getView().getControlsByFieldGroupId("questions");
    oControls.forEach((elem) => elem.setProperty("highlight", MessageType.None));
    oControls[+sIndex].setProperty("highlight", MessageType.Information);
  }

  public onListItemPress(oEvent: Event): void {
    const oListItem: Control = oEvent.getParameter("srcControl") as Control;
    if (oListItem.getBindingContext()) {
      const oContext: Context = oListItem.getBindingContext() as Context;
      this.getView().byId("detailDetail").setBindingContext(oContext);
    }

    this.highlightSwitcher();
  }

  public onPressEdit(): void {
    const qListModel: JSONModel = this.getModel() as JSONModel;
    qListModel.setProperty("/edit", !qListModel.getProperty("/edit"));
  }

  public onPressNext(oEvent: Event): void {
    const qListModel: JSONModel = this.getModel() as JSONModel;
    const oContext: Context = (oEvent.getSource() as Control).getBindingContext() as Context;
    const sPath: string = oContext.getPath();
    let sIndex: string = sPath.slice(sPath.search(/\/?[0-9]+/) + 1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const aData: object[] = this.getModel().getProperty("/questions");
    if (+sIndex + 1 === aData.length) {
      sIndex = "-1";
    }
    const oNextContext: Context = new Context(qListModel, `/questions/${+sIndex + 1}`);
    this.getView().byId("detailDetail").setBindingContext(oNextContext);

    this.highlightSwitcher();
  }

  private clearFragmentInputs(): void {
    const aInputs: UI5Element[] = [
      this.byId("newQ"),
      this.byId("answer1"),
      this.byId("answer1"),
      this.byId("answer1"),
      this.byId("answer1"),
    ];
    aInputs.forEach((oInput) => (oInput as Input).setValue(""));
    this.getView()
      .getControlsByFieldGroupId("checkBox")
      .forEach((checkBox) => (checkBox as CheckBox).setSelected(false));
  }

  public onPressFragmentClose(): void {
    this.clearFragmentInputs();
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).close());
  }

  public onPressFragmentAdd(): void {
    const getTemplate = (sProp: string): string => {
      return this.getModel().getProperty(`/newQuestion/${sProp}`) as string;
    };
    const aChecked: number[] = this.getView()
      .getControlsByFieldGroupId("checkBox")
      .filter((elem) => (elem as CheckBox).getSelected())
      .map((elem) => +elem.getId().slice(-1));
    const newQuestion = models.createQuestion(
      getTemplate("question"),
      [
        getTemplate("answer/0"),
        getTemplate("answer/1"),
        getTemplate("answer/2"),
        getTemplate("answer/3"),
      ],
      aChecked
    );
    const oModel: JSONModel = this.getModel() as JSONModel;
    const aState: object[] = oModel.getProperty("/questions") as [];
    aState.push(newQuestion);
    oModel.setProperty("/questions", aState);
    this.clearFragmentInputs();
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).close());
  }

  public onPressAddQuestion(): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!this.oFragment) {
      const oView = this.getView();
      this.oFragment = Fragment.load({
        id: oView.getId(),
        name: "webapp.typescript.view.fragments.CreateQuestion",
        controller: this,
      }).then((oMessagePopover) => {
        oView.addDependent(oMessagePopover as UI5Element);
        return oMessagePopover;
      });
    }
    const oModel: JSONModel = this.getModel() as JSONModel;
    oModel.setProperty("/newQuestion", JSON.parse(JSON.stringify(this.newQuestion)));
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).open());
  }
}

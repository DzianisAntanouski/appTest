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
import FetchDataBase from "../db/FetchDB";
import RadioButton from "sap/m/RadioButton";
import { IData, IListItem, IQuestion, IResult, IArguments, IParent, IQuestionStructure } from "../interface/Interface";
import List from "sap/m/List";
import MessageToast from "sap/m/MessageToast";
import MessageBox, { Action } from "sap/m/MessageBox";

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
  oState: IQuestionStructure
  private formatter = formatter;

  public onInit(): void {
    void this.getView().attachAfterRendering(this.changeUIAfterRendering.bind(this));
    void this.getOwnerComponent().getRouter().getRoute("main").attachPatternMatched(this.onPatternMatched.bind(this), this);
    void this.getOwnerComponent().getModel().attachPropertyChange(this.changeProperty.bind(this), this)
  }

  public changeProperty (): void {
    
    if (this.getSupportModel().getProperty("/edit")) {
      this.getSupportModel().setProperty("/change", true)
    }
  }
  
  public onPatternMatched(oEvent: Event) {
    if (!this.getSupportModel().getProperty("/auth")) {
      this.navTo("start");
      MessageToast.show("You don't have access for this page");
      return
    }     
    const sPath: string = (oEvent.getParameter("arguments") as IArguments).sPath;
    this.getView().bindObject({
      path: `${sPath.replace(/-/g, "/")}`,
    });
    this.getSupportModel().setProperty("/selected", false);    
    this.getSupportModel().setProperty("/edit", false);    
       
  }

  public setActive(oEvent: Event): void {
    if ((oEvent.getSource() as List).getItems().length) {
      this.onPressNext();
    }
  }

  public changeUIAfterRendering(): void {
    if (this.getView().byId("detailDetail").getBindingContext()?.getObject()) {
      void this.setChecked();
      void this.highlightSwitcher();
    }
  }

  private highlightSwitcher(): void {
    const oControls: Array<Control> = this.getInputListItem();
    if (!oControls.length) return
    const nIndex: number = oControls.findIndex((elem) => elem.getProperty("highlight") === "Information");
    oControls.forEach((control) => control.setProperty("highlight", MessageType.None));    
    if (nIndex < 0 || nIndex === oControls.length - 1) {
      oControls[0].setProperty("highlight", MessageType.Information);
    } else {
      oControls[nIndex + 1].setProperty("highlight", MessageType.Information);
    }
  }

  private getInputListItem(): Array<Control> {
    const oControls: Array<Control> = this.getView()
      .getControlsByFieldGroupId("questions")
      .filter((elem) => elem.getMetadata().getElementName() === "sap.m.InputListItem");
    return oControls;
  }

  public findListItem(oControl: IParent): IListItem {
    return oControl.getMetadata().getElementName() !== "sap.m.InputListItem"
      ? this.findListItem(oControl.oParent as IParent)
      : (oControl as IListItem).setProperty("highlight", MessageType.Information);
  }

  public onListItemPress(oEvent: Event): void {
    const oListItem: Control = oEvent.getParameter("srcControl") as Control;
    if (oListItem.getBindingContext()) {
      const oContext: Context = oListItem.getBindingContext() as Context;
      this.getView().byId("detailDetail").setBindingContext(oContext);
    }

    this.getInputListItem().forEach((control) => control.setProperty("highlight", MessageType.None));

    this.findListItem(oListItem as IParent);
    
    void this.setChecked();
  }

  public setChecked(): void {
    const rightAnswer: number[] = ((this.getView().byId("detailDetail").getBindingContext() as Context).getObject() as IQuestion).rightAnswer;
    this.getView()
      .getControlsByFieldGroupId("checkBoxRightAnswers")
      .filter((oControl) => oControl.getMetadata().getElementName() === "sap.m.CheckBox")
      .forEach((checkBox, index) => {
        if (rightAnswer.includes(index + 1)) {
          (checkBox as CheckBox).setSelected(true);
        } else {
          (checkBox as CheckBox).setSelected(false);
        }
      });
  }

  public onPressEdit(): void {
    // const qListModel: JSONModel = this.getModel() as JSONModel;
    this.getSupportModel().setProperty("/edit", !this.getSupportModel().getProperty("/edit"));
    this.saveState()
    void this.setChecked();
  }

  public onPressNext(): void {
    void this.highlightSwitcher();
    const oControls: Array<Control> = this.getInputListItem();
    const oControl: Control = oControls.find((elem) => elem.getProperty("highlight") === "Information") as Control;
    const oContext: Context = oControl.getBindingContext() as Context;
    this.getView().byId("detailDetail").setBindingContext(oContext);
    void this.setChecked();
  }

  private clearFragmentInputs(): void {
    const aInputs: UI5Element[] = [this.byId("newQ"), this.byId("answer1"), this.byId("answer1"), this.byId("answer1"), this.byId("answer1")];
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
      return (this.getModel() as JSONModel).getProperty(`/newQuestion/${sProp}`) as string;
    };
    const aChecked: number[] = this.getView()
      .getControlsByFieldGroupId("checkBox")
      .filter((elem) => (elem as CheckBox).getSelected())
      .map((elem) => +elem.getId().slice(-1));
    const newQuestion = models.createQuestion(
      getTemplate("question"),
      [getTemplate("answer/0"), getTemplate("answer/1"), getTemplate("answer/2"), getTemplate("answer/3")],
      aChecked
    );
    // add getContextPath to BaseController
    const aPath: string[] = (this.getView()?.getBindingContext() as Context).getPath().slice(1).split("/");

    void FetchDataBase
      .create(newQuestion, "/" + aPath[1], "/" + aPath[3])
      .then(() => void this.fireBaseRead())
      .then(() => this.getSupportModel().setProperty("/edit", true));
    this.clearFragmentInputs();
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).close());
    void this.getSupportModel().setProperty("/edit", true);
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
    this.getSupportModel().setProperty("/edit", true);
  }

  public onPressDeleteSubCategory() {
    const sPath: string[] = (this.getView().getBindingContext() as Context).getPath().split('/')
    
    void FetchDataBase.deleteCategory(sPath[2], sPath[4]).then(() => {this.navTo("start")})   
  }

  public onPressDeleteQuestion() {
    const oControls: Array<Control> = this.getView()
      .getControlsByFieldGroupId("questions")
      .filter((elem) => elem.getMetadata().getElementName() === "sap.m.RadioButton");
    if ((oControls as RadioButton[]).filter((elem) => elem.getSelected()).length) {
      const sSelectedControl = (oControls as RadioButton[])
        .filter((elem) => elem.getSelected())[0]
        .getBindingContext()
        ?.getPath();

      const sId: string | undefined = (sSelectedControl as string).split("/").pop();
      const aPath: string[] = (this.getView().getBindingContext() as Context).getPath().slice(1).split("/");

      void FetchDataBase.delete(sId as string, "/" + aPath[1], "/" + aPath[3]).then(
        () =>
          void this.fireBaseRead()
            .then(() => this.getSupportModel().setProperty("/edit", true))
            .then(() => (oControls as RadioButton[]).forEach((elem) => elem.setSelected(false)))
      );
    }
  }


  //????????
  /* public onLiveChange(): void {
    // const qListModel: JSONModel = this.getModel() as JSONModel;
    this.getSupportModel().setProperty("/change", true);
  } */

  public onCheck(): void {
    this.getSupportModel().setProperty("/change", true);
  }

  public onSelect(): void {
    // const qListModel: JSONModel = this.getModel() as JSONModel;
    this.getSupportModel().setProperty("/selected", true);
  }
  public onPressSave(): void {
    this.getSupportModel().setProperty("/selected", false);
    // const qListModel: JSONModel = this.getModel() as JSONModel;
    this.getSupportModel().setProperty("/edit", !this.getSupportModel().getProperty("/edit"));
    const oControls: Array<Control> = this.getView()
      .getControlsByFieldGroupId("questions")
      .filter((elem) => elem.getMetadata().getElementName() === "sap.m.RadioButton");
    oControls.forEach((oControl) => (oControl as RadioButton).setSelected(false));

    if (this.getSupportModel().getProperty("/change")) {
      // const qListModel = this.getModel() as JSONModel;
      const aPath: string[] = (this.getView().getBindingContext() as Context).getPath().slice(1).split("/");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const oData: IData[] = ((this.getModel() as JSONModel).getData()[aPath[0]][aPath[1]][aPath[2]][aPath[3]] as IData).questions as IData[];
      const result: IResult[] = Object.values(oData).map((elem) => {
        return {
          id: elem.id,
          body: { answers: elem.answers, question: elem.question, rightAnswer: elem.rightAnswer },
        };
      }) as unknown as IResult[];
      void result.forEach((elem) => void FetchDataBase.patch(elem.id, elem.body, "/" + aPath[1], "/" + aPath[3]));
    }
    this.getSupportModel().setProperty("/change", false);
  }

  public onPressNavBack () {
    if (this.getSupportModel().getProperty("/edit") && this.getSupportModel().getProperty("/change")) {
      const onPressBackAction = () => {
        const sPath = (this.getView().getBindingContext() as Context).getPath();
        (this.getModel() as JSONModel).setProperty(sPath, this.oState)
        this.getSupportModel().setProperty("/edit", false);
        this.getSupportModel().setProperty("/change", false);
        this.onNavBack()
      }
      this.getConfirm(onPressBackAction) 
    } else {
      this.getSupportModel().setProperty("/edit", false);
      this.getSupportModel().setProperty("/change", false);
      this.onNavBack()
    }
    
  }

  public saveState() {
    const sPath = (this.getView().getBindingContext() as Context).getPath();
    const oState = (this.getModel() as JSONModel).getProperty(sPath) as IQuestionStructure
    this.oState = JSON.parse(JSON.stringify(oState)) as IQuestionStructure
  }

  public onPressCancel () {
    if (this.getSupportModel().getProperty("/change")) {
      const onPressYesAction = () => {
        const sPath = (this.getView().getBindingContext() as Context).getPath();
        (this.getModel() as JSONModel).setProperty(sPath, this.oState)
        void this.setChecked();
        void this.highlightSwitcher();
        this.getSupportModel().setProperty("/change", false); 
      }    
      this.getConfirm(onPressYesAction)
    } 
    this.getSupportModel().setProperty("/edit", false);
    this.getSupportModel().setProperty("/change", false);  
  }

  public getConfirm (fn: () => void): void {  
    MessageBox.confirm("Are you shure?", {
        title: "Back",
        actions: [Action.YES, Action.NO],
        onClose: (oAction: string) => {
            if (oAction === Action.YES) {
                fn()
            }
        },
    });
  }
}

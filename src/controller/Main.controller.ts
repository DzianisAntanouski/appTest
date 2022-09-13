import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Context from "sap/ui/model/Context";
import models from "../model/models";
import { MessageType, ValueState } from "sap/ui/core/library";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";
import UI5Element from "sap/ui/core/Element";
import Input from "sap/m/Input";
import CheckBox from "sap/m/CheckBox";
import RadioButton from "sap/m/RadioButton";
import { IData, IListItem, IQuestion, IResult, IArguments, IParent, IQuestionStructure } from "../interface/Interface";
import List from "sap/m/List";
import MessageToast from "sap/m/MessageToast";
import MessageBox, { Action } from "sap/m/MessageBox";
import formatter from "../model/formatter";
import CRUDModel from "../model/CRUDModel";

/**
 * @namespace webapp.typescript.controller
 */
export default class Main extends BaseController {
  formatter = formatter;
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
  oState: IQuestionStructure;

  public onInit(): void {
    void this.getView()?.attachAfterRendering(this.changeUIAfterRendering.bind(this));
    void this.getOwnerComponent().getRouter().getRoute("main")?.attachPatternMatched(this.onPatternMatched.bind(this), this);
  }

  public onStatisticPress(): void {
    void (this.getModel() as CRUDModel).getAllResults().then((resp) => {
      const modifyResp = Object.keys(resp).map(elem => {          
        return {
          date: elem, 
          category: resp[elem]['category'], 
          email: resp[elem]['email'], 
          points: resp[elem]['points'],
          subcategory: resp[elem]['subcategory']
        }
      })
      .filter(elem => (this.getView()?.getBindingContext() as Context).getPath().includes(elem.category) && (this.getView()?.getBindingContext() as Context).getPath().includes(elem.subcategory))      
      this.getSupportModel().setProperty("/results", modifyResp);
    }).then(() => void this.onShowStatistics());
    
  }

  public onCancelFragmentResult() {
    void this.fragmentStatistics.then((oMessagePopover) => (oMessagePopover as Dialog).close());
  }

  public onPatternMatched(oEvent: Event) {
    if((oEvent.getParameter("arguments") as IArguments).sPath === "redirect") {
      this.navTo("start")
      return
    }
    if (!localStorage.auth) {
      this.navTo("start");
      MessageToast.show(this.i18n("authorizationMainPageErrorMessage"));
      return;
    }
    const sPath: string = (oEvent.getParameter("arguments") as IArguments).sPath;
    const sRightPath: string = sPath.replace(/-/g, "/")
    this.getView()?.bindObject({
      path: `${sRightPath}`,
    });
    this.getSupportModel().setProperty("/selected", false);
    this.getSupportModel().setProperty("/edit", false);
    this.onPressNext();
  }

  public setActive(oEvent: Event): void {
    if ((oEvent.getSource() as List).getItems().length) {
      this.onPressNext();
    }
  }

  public changeUIAfterRendering(): void {
    if (this.getView()?.byId("detailDetail")?.getBindingContext()?.getObject()) {
      void this.setChecked();
      void this.highlightSwitcher();
    }
  }

  private highlightSwitcher(): void {
    const oControls: Array<Control> = this.getInputListItem();
    if (!oControls.length) return;
    const nIndex: number = oControls.findIndex((oControl) => oControl.getProperty("highlight") === "Information");
    oControls.forEach((oControl) => oControl.setProperty("highlight", MessageType.None));
    if (nIndex < 0 || nIndex === oControls.length - 1) {
      oControls[0].setProperty("highlight", MessageType.Information);
    } else {
      oControls[nIndex + 1].setProperty("highlight", MessageType.Information);
    }
  }

  private getInputListItem(): Array<Control> {
    const oControls: Control[] | undefined = this.getView()
      ?.getControlsByFieldGroupId("questions")
      .filter((oControl) => oControl.getMetadata().getElementName() === "sap.m.InputListItem");
    return oControls ? oControls : [];
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
      this.getView()?.byId("detailDetail")?.setBindingContext(oContext);
    }

    this.getInputListItem().forEach((oControl) => oControl.setProperty("highlight", MessageType.None));
    this.findListItem(oListItem as IParent);
    void this.setChecked();
  }

  public setChecked(): void {
    const aRightAnswer: number[] = ((this.getView()?.byId("detailDetail")?.getBindingContext() as Context).getObject() as IQuestion).rightAnswer;
    this.getView()
      ?.getControlsByFieldGroupId("checkBoxRightAnswers")
      .filter((oControl) => oControl.getMetadata().getElementName() === "sap.m.CheckBox")
      .forEach((oCheckBox, nIndex) => {
        if (aRightAnswer.includes(nIndex + 1)) {
          (oCheckBox as CheckBox).setSelected(true);
        } else {
          (oCheckBox as CheckBox).setSelected(false);
        }
      });
  }

  public onPressEdit(): void {
    this.getSupportModel().setProperty("/edit", !this.getSupportModel().getProperty("/edit"));
    this.saveState();
    this.setChecked();
  }

  public onPressNext(): void {
    this.highlightSwitcher();
    const oControls: Array<Control> = this.getInputListItem();
    const oControl: Control | undefined = oControls.find((oControl) => oControl.getProperty("highlight") === "Information") as Control;
    const oContext: Context = oControl?.getBindingContext() as Context;
    this.getView()?.byId("detailDetail")?.setBindingContext(oContext);
    this.setChecked();
  }

  private clearFragmentInputs(): void {
    const aInputs = [this.byId("newQ"), this.byId("answer1"), this.byId("answer2"), this.byId("answer3"), this.byId("answer4")];
    aInputs.forEach((oInput) => (oInput as Input).setValue(""));
    this.getView()
      ?.getControlsByFieldGroupId("checkBox")
      .forEach((oCheckBox) => (oCheckBox as CheckBox).setSelected(false));
  }

  public onPressFragmentClose(): void {
    this.clearFragmentInputs();
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).close());
  }

  // public checkAddFragmentsField() {
  //   const checkBoxes = ["cbanswer1", "cbanswer2", "cbanswer3", "cbanswer4"]
  //   const checkSelected = (sId: string) => {
  //     return (this.byId(sId) as CheckBox).getSelected()
  //   }
  //   const checkBoxResult = checkBoxes.map(sId => checkSelected(sId)).filter(oCheckBox => !oCheckBox);
  //   const getAnswersLength = (sId: string) => {
  //     return (this.byId(sId) as Input)
  //   }
  //   const answersId = ["answer1", "answer2", "answer3", "answer4"]
  //   const answersResult = answersId.map(sId => getAnswersLength(sId)).filter(elem => elem.getValue().length < 3)
  //   if (checkBoxResult.length === 4) {
  //     MessageBox.error("Check one or more right answer")
  //     return
  //   } else if((this.byId("newQ") as Input).getValue().length < 3) {
  //     void (this.byId("newQ") as Input).setValueState(ValueState.Error)
  //     void (this.byId("newQ") as Input).setValueStateText("Error: min length 3")      
  //     return
  //   } else if (answersResult.length) {
  //     void answersResult.forEach(oInput => {
  //       oInput.setValueState(ValueState.Error)
  //       oInput.setValueStateText("Error: min length 3")
  //     })
  //     return
  //   }
  // }

  public onPressFragmentAdd(): void {    
    const checkBoxes = ["cbanswer1", "cbanswer2", "cbanswer3", "cbanswer4"]
    const checkSelected = (sId: string) => {
      return (this.byId(sId) as CheckBox).getSelected()
    }
    const checkBoxResult = checkBoxes.map(sId => checkSelected(sId)).filter(oCheckBox => !oCheckBox);
    const getAnswersLength = (sId: string) => {
      return (this.byId(sId) as Input)
    }
    const answersId = ["answer1", "answer2", "answer3", "answer4"]
    const answersResult = answersId.map(sId => getAnswersLength(sId)).filter(elem => elem.getValue().length < 3)
    if (checkBoxResult.length === 4) {
      MessageBox.error("Check one or more right answer")
      return
    } else if((this.byId("newQ") as Input).getValue().length < 3) {
      void (this.byId("newQ") as Input).setValueState(ValueState.Error)
      void (this.byId("newQ") as Input).setValueStateText("Error: min length 3")       
      return
    } else if (answersResult.length) {
      void answersResult.forEach(oInput => {
        oInput.setValueState(ValueState.Error)
        oInput.setValueStateText("Error: min length 3")
      })
      return
    }
    // if (checkSelected("cbanswer1") || checkSelected("cbanswer2") || checkSelected("cbanswer3") || checkSelected("cbanswer4"))
    const getTemplate = (sProp: string): string => {
      return (this.getModel() as JSONModel).getProperty(`/newQuestion/${sProp}`) as string;
    };
    const aCheckedCheckBoxes: number[] | undefined = this.getView()
      ?.getControlsByFieldGroupId("checkBox")
      .filter((elem) => (elem as CheckBox).getSelected())
      .map((elem) => +elem.getId().slice(-1));
    const newQuestion = models.createQuestion(
      getTemplate("question"),
      [getTemplate("answer/0"), getTemplate("answer/1"), getTemplate("answer/2"), getTemplate("answer/3")],
      aCheckedCheckBoxes
    );

    const aPath: string[] = (this.getView()?.getBindingContext() as Context).getPath().slice(1).split("/");

    void (this.getModel() as CRUDModel).create(newQuestion, "/" + aPath[1], "/" + aPath[3])
      .then(() => this.getSupportModel().setProperty("/edit", true));
    this.clearFragmentInputs();
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).close());
    void this.getSupportModel().setProperty("/edit", true);
  }

  public onPressAddQuestion(): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!this.oFragment) {
      const oView = this.getView();
      if (oView) {
        this.oFragment = Fragment.load({
          id: oView.getId(),
          name: "webapp.typescript.view.fragments.CreateQuestion",
          controller: this,
        }).then((oMessagePopover) => {
          oView.addDependent(oMessagePopover as UI5Element);
          return oMessagePopover;
        });
      }
    }
    const oModel: JSONModel = this.getModel() as JSONModel;
    oModel.setProperty("/newQuestion", JSON.parse(JSON.stringify(this.newQuestion)));
    void this.oFragment.then((oMessagePopover) => (oMessagePopover as Dialog).open());
    this.getSupportModel().setProperty("/edit", true);
  }

  public onPressDeleteSubCategory() {
    const sPath: string[] = (this.getView()?.getBindingContext() as Context).getPath().split("/");
    const fetchToRemoveSubCategory = () => {
      void (this.getModel() as CRUDModel).deleteCategory(sPath[2], sPath[4])
        .then(() => {
          this.navTo("start");
        });
    };
    this.getConfirm(fetchToRemoveSubCategory, "mainPageConfirmationDialogText", "mainPageConfirmationDialogTextRemove");
  }

  public onPressDeleteQuestion() {
    const oControls: Control[] | undefined = this.getView()
      ?.getControlsByFieldGroupId("questions")
      .filter((oControl) => oControl.getMetadata().getElementName() === "sap.m.RadioButton");
    if ((oControls as RadioButton[]).filter((elem) => elem.getSelected()).length) {
      const sSelectedControl = (oControls as RadioButton[])
        .filter((oRadioButton) => oRadioButton.getSelected())[0]
        .getBindingContext()
        ?.getPath();

      const sId: string | undefined = (sSelectedControl as string).split("/").pop();
      const aPath: string[] = (this.getView()?.getBindingContext() as Context).getPath().slice(1).split("/");
      const fetchToRemoveQuestion = () => {
        void (this.getModel() as CRUDModel).delete(sId as string, "/" + aPath[1], "/" + aPath[3])
          .then(() => this.getSupportModel().setProperty("/edit", true))
          .then(() => this.getSupportModel().setProperty("/selected", false))
          .then(() => (oControls as RadioButton[]).forEach((oRadioButton) => oRadioButton.setSelected(false)))
      };
      this.getConfirm(fetchToRemoveQuestion, "mainPageConfirmationDialogText", "mainPageConfirmationDialogTextRemove");
    }    
  }

  public onCheck(oEvent: Event): void {
    const sPath: string = ((oEvent.getSource() as CheckBox).getBindingContext() as Context).getPath();
    const nIndex = Number(sPath.slice(-1)) + 1;
    const rightAnswer = sPath.replace(/answers\/[0-9]/g, "rightAnswer");
    let aRightAnswer = this.getModel()?.getProperty(rightAnswer) as number[]
    aRightAnswer.includes(nIndex) ? aRightAnswer = aRightAnswer.filter(elem => elem !== nIndex) : aRightAnswer.push(nIndex);
    
    (this.getModel() as JSONModel).setProperty(rightAnswer, aRightAnswer)
    this.getSupportModel().setProperty("/change", true);
  }

  public onSelect(): void {
    this.getSupportModel().setProperty("/selected", true);
  }

  public onPressSave(): void {
    this.getSupportModel().setProperty("/selected", false);
    this.getSupportModel().setProperty("/edit", !this.getSupportModel().getProperty("/edit"));
    const oControls: Control[] | undefined = this.getView()
      ?.getControlsByFieldGroupId("questions")
      .filter((oControl) => oControl.getMetadata().getElementName() === "sap.m.RadioButton");
    oControls?.forEach((oRadioButton) => (oRadioButton as RadioButton).setSelected(false));

    if (this.getSupportModel().getProperty("/change")) {
      const aPath: string[] = (this.getView()?.getBindingContext() as Context).getPath().slice(1).split("/");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const oData: IData[] = ((this.getModel() as JSONModel).getData()[aPath[0]][aPath[1]][aPath[2]][aPath[3]] as IData).questions as IData[];
      const oDataKeys: string[] = Object.keys(oData);
      const aResult: IResult[] = Object.values(oData).map((elem, index) => {
        return {
          id: oDataKeys[index],
          body: { answers: elem.answers, question: elem.question, rightAnswer: elem.rightAnswer },
        };
      }) as unknown as IResult[];
      void aResult.forEach((elem) => void (this.getModel() as CRUDModel).patch(elem.id, elem.body, "/" + aPath[1], "/" + aPath[3]));
    }
    this.getSupportModel().setProperty("/change", false);
  }

  public onPressNavBack() {
    if (this.getSupportModel().getProperty("/edit") && this.getSupportModel().getProperty("/change")) {
      const onPressBackAction = () => {
        const sPath = (this.getView()?.getBindingContext() as Context).getPath();
        (this.getModel() as JSONModel).setProperty(sPath, this.oState);
        this.getSupportModel().setProperty("/edit", false);
        this.getSupportModel().setProperty("/change", false);
        this.onNavBack();
      };
      this.getConfirm(onPressBackAction, "mainPageConfirmationDialogText", "mainPageConfirmationDialogTitle");
    } else {
      this.getSupportModel().setProperty("/edit", false);
      this.getSupportModel().setProperty("/change", false);
      this.onNavBack();
    }
  }

  public saveState() {
    const sPath = (this.getView()?.getBindingContext() as Context).getPath();
    const oState = (this.getModel() as JSONModel).getProperty(sPath) as IQuestionStructure;
    this.oState = JSON.parse(JSON.stringify(oState)) as IQuestionStructure;
  }

  public onPressCancel() {
    if (this.getSupportModel().getProperty("/change")) {
      const onPressYesAction = () => {
        const sPath = (this.getView()?.getBindingContext() as Context).getPath();
        (this.getModel() as JSONModel).setProperty(sPath, this.oState);
        this.setChecked();
        this.highlightSwitcher();
        this.getSupportModel().setProperty("/change", false);
      };
      this.getConfirm(onPressYesAction, "mainPageConfirmationDialogText", "mainPageConfirmationDialogTitle");
    }
    this.getSupportModel().setProperty("/edit", false);
    this.getSupportModel().setProperty("/change", false);
  }

  public getConfirm(fn: () => void, sDialogText: string, sDialogTitle: string): void {
    MessageBox.confirm(this.i18n(sDialogText), {
      title: this.i18n(sDialogTitle),
      actions: [Action.YES, Action.NO],
      onClose: (oAction: string) => {
        if (oAction === Action.YES) {
          fn();
        }
      },
    });
  }
}

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
import {
  IData,
  IListItem,
  IQuestion,
  IResult,
  IArguments,
  IParent,
  IQuestionStructure,
} from "../interface/Interface";
import List from "sap/m/List";
import MessageToast from "sap/m/MessageToast";
import MessageBox, { Action } from "sap/m/MessageBox";
import formatter from "../model/formatter";
import CRUDModel from "../model/CRUDModel";
import Table from "sap/m/Table";
import Button from "sap/m/Button";
import { events } from "sap/ui/events/PseudoEvents";

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
    void this.getView()?.attachAfterRendering(
      this.changeUIAfterRendering.bind(this)
    );
    void this.getOwnerComponent()
      .getRouter()
      .getRoute("main")
      ?.attachPatternMatched(this.onPatternMatched.bind(this), this);
  }

  public onStatisticPress(): void {
    void (this.getModel() as CRUDModel)
      .getAllResults()
      .then((resp) => {
        const modifyResp = Object.keys(resp)
          .map((elem) => {
            return {
              date: elem,
              category: resp[elem]["category"],
              email: resp[elem]["email"],
              points: resp[elem]["points"],
              subcategory: resp[elem]["subcategory"],
            };
          })
          .filter(
            (elem) =>
              (this.getView()?.getBindingContext() as Context)
                .getPath()
                .includes(elem.category) &&
              (this.getView()?.getBindingContext() as Context)
                .getPath()
                .includes(elem.subcategory)
          );
        this.getSupportModel().setProperty("/results", modifyResp);
      })
      .then(() => void this.onShowStatistics());
  }

  public onCancelFragmentResult() {
    void this.fragmentStatistics.then((oMessagePopover) =>
      (oMessagePopover as Dialog).close()
    );
  }

  public onPatternMatched(oEvent: Event) {
    if ((oEvent.getParameter("arguments") as IArguments).sPath === "redirect") {
      this.navTo("start");
      return;
    }
    if (!localStorage.auth) {
      this.navTo("start");
      MessageToast.show(this.i18n("authorizationMainPageErrorMessage"));
      return;
    }
    const sPath: string = (oEvent.getParameter("arguments") as IArguments)
      .sPath;
    const sRightPath: string = sPath.replace(/-/g, "/");
    this.getView()?.bindObject({
      path: `${sRightPath}`,
    });
    this.getSupportModel().setProperty("/selected", false);
    this.getSupportModel().setProperty("/edit", false);
    this.onPressNext();
    this.defineAddAnswerBtnDisability();
  }

  public setActive(oEvent: Event): void {
    const aListItemsArray = (oEvent.getSource() as List).getItems();
    const oDetailDetailView = this.getView()?.byId("detailDetail");
    if (aListItemsArray.length) {
      // this.onPressNext();
      //! снимаю все хайлайты
      aListItemsArray.forEach((element) => {
        element.setProperty("highlight", MessageType.None);
      });
      this.determineManageTestPageValidity();
      //! сетаю на нужный лист айтем
      aListItemsArray[aListItemsArray.length - 1].setProperty(
        "highlight",
        MessageType.Information
      );
      //! сетаю нужный контекст
      const oNecessaryContext: Context = (oEvent.getSource() as List)
        .getItems()
        [aListItemsArray.length - 1].getBindingContext() as Context;
      oDetailDetailView?.setBindingContext(oNecessaryContext);
      //
      // (oEvent.getSource() as List).setProperty("highlight", MessageType.Information)
    }
  }

  public changeUIAfterRendering(): void {
    if (
      this.getView()?.byId("detailDetail")?.getBindingContext()?.getObject()
    ) {
      void this.setChecked();
      void this.highlightSwitcher();
    }
  }

  private highlightSwitcher(): void {
    const oControls: Array<Control> = this.getInputListItem();
    if (!oControls.length) return;
    const nIndex: number = oControls.findIndex(
      (oControl) => oControl.getProperty("highlight") === "Information"
    );
    oControls.forEach((oControl) =>
      oControl.setProperty("highlight", MessageType.None)
    );
    this.determineManageTestPageValidity();
    if (nIndex < 0 || nIndex === oControls.length - 1) {
      oControls[0].setProperty("highlight", MessageType.Information);
    } else {
      oControls[nIndex + 1].setProperty("highlight", MessageType.Information);
    }
  }

  private getInputListItem(): Array<Control> {
    const oControls: Control[] | undefined = this.getView()
      ?.getControlsByFieldGroupId("questions")
      .filter(
        (oControl) =>
          oControl.getMetadata().getElementName() === "sap.m.InputListItem"
      );
    return oControls ? oControls : [];
  }

  public findListItem(oControl: IParent): IListItem {
    return oControl.getMetadata().getElementName() !== "sap.m.InputListItem"
      ? this.findListItem(oControl.oParent as IParent)
      : (oControl as IListItem).setProperty(
          "highlight",
          MessageType.Information
        );
  }

  public defineAddAnswerBtnDisability() {
    const aQuestions = (this.getView()?.byId("qList") as List).getItems();
    const aAnswers = (this.getView()?.byId("answerstable") as Table).getItems();
    const bIsPageInEditMode = this.getSupportModel().getProperty("/edit");
    const isAddAnswerBtnEnabled =
      bIsPageInEditMode && !!aQuestions.length && aAnswers.length < 4;

    this.getSupportModel().setProperty(
      "/isAddAnswerBtnEnabled",
      isAddAnswerBtnEnabled
    );
  }

  public onListItemPress(oEvent: Event): void {
    const oListItem: Control = oEvent.getParameter("srcControl") as Control;
    if (oListItem.getBindingContext()) {
      const oContext: Context = oListItem.getBindingContext() as Context;
      this.getView()?.byId("detailDetail")?.setBindingContext(oContext);
    }

    this.getInputListItem().forEach((oControl) =>
      oControl.setProperty("highlight", MessageType.None)
    );
    this.determineManageTestPageValidity();
    this.findListItem(oListItem as IParent);
    void this.setChecked();
    this.defineAddAnswerBtnDisability();
  }

  public setChecked(): void {
    const aRightAnswer: number[] = (
      (
        this.getView()?.byId("detailDetail")?.getBindingContext() as Context
      ).getObject() as IQuestion
    ).rightAnswer;
    this.getView()
      ?.getControlsByFieldGroupId("checkBoxRightAnswers")
      .filter(
        (oControl) =>
          oControl.getMetadata().getElementName() === "sap.m.CheckBox"
      )
      .forEach((oCheckBox, nIndex) => {
        if (aRightAnswer.includes(nIndex + 1)) {
          (oCheckBox as CheckBox).setSelected(true);
        } else {
          (oCheckBox as CheckBox).setSelected(false);
        }
      });
  }

  public onPressEdit(): void {
    this.getSupportModel().setProperty(
      "/edit",
      !this.getSupportModel().getProperty("/edit")
    );
    this.saveState();
    this.setChecked();
    this.defineAddAnswerBtnDisability();
  }

  public onPressNext(): void {
    this.highlightSwitcher();
    const oControls: Array<Control> = this.getInputListItem();
    const oControl: Control | undefined = oControls.find(
      (oControl) => oControl.getProperty("highlight") === "Information"
    ) as Control;
    const oContext: Context = oControl?.getBindingContext() as Context;
    this.getView()?.byId("detailDetail")?.setBindingContext(oContext);
    this.setChecked();
    this.defineAddAnswerBtnDisability();
    this.determineManageTestPageValidity();
  }

  private clearFragmentInputs(): void {
    const aInputs = [
      this.byId("newQ"),
      this.byId("answer1"),
      this.byId("answer2"),
      this.byId("answer3"),
      this.byId("answer4"),
    ];
    aInputs.forEach((oInput) => (oInput as Input).setValue(""));
    this.getView()
      ?.getControlsByFieldGroupId("checkBox")
      .forEach((oCheckBox) => (oCheckBox as CheckBox).setSelected(false));
  }

  public onPressFragmentClose(): void {
    this.clearFragmentInputs();
    void this.oFragment.then((oMessagePopover) =>
      (oMessagePopover as Dialog).close()
    );
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
    const checkBoxes = ["cbanswer1", "cbanswer2", "cbanswer3", "cbanswer4"];
    const checkSelected = (sId: string) => {
      return (this.byId(sId) as CheckBox).getSelected();
    };
    const checkBoxResult = checkBoxes
      .map((sId) => checkSelected(sId))
      .filter((oCheckBox) => !oCheckBox);
    const getAnswersLength = (sId: string) => {
      return this.byId(sId) as Input;
    };
    const answersId = ["answer1", "answer2", "answer3", "answer4"];
    const answersResult = answersId
      .map((sId) => getAnswersLength(sId))
      .filter((elem) => elem.getValue().length < 3);
    if (checkBoxResult.length === 4) {
      MessageBox.error("Check one or more right answer");
      return;
    } else if ((this.byId("newQ") as Input).getValue().length < 3) {
      void (this.byId("newQ") as Input).setValueState(ValueState.Error);
      void (this.byId("newQ") as Input).setValueStateText(
        "Error: min length 3"
      );
      return;
    } else if (answersResult.length) {
      void answersResult.forEach((oInput) => {
        oInput.setValueState(ValueState.Error);
        oInput.setValueStateText("Error: min length 3");
      });
      return;
    }
    // if (checkSelected("cbanswer1") || checkSelected("cbanswer2") || checkSelected("cbanswer3") || checkSelected("cbanswer4"))
    const getTemplate = (sProp: string): string => {
      return (this.getModel() as JSONModel).getProperty(
        `/newQuestion/${sProp}`
      ) as string;
    };
    const aCheckedCheckBoxes: number[] | undefined = this.getView()
      ?.getControlsByFieldGroupId("checkBox")
      .filter((elem) => (elem as CheckBox).getSelected())
      .map((elem) => +elem.getId().slice(-1));
    // const newQuestion = models.createQuestion(
    //   getTemplate("question"),
    //   [getTemplate("answer/0"), getTemplate("answer/1"), getTemplate("answer/2"), getTemplate("answer/3")],
    //   aCheckedCheckBoxes
    // );

    const newQuestion = models.createQuestion("", [], []);

    const aPath: string[] = (this.getView()?.getBindingContext() as Context)
      .getPath()
      .slice(1)
      .split("/");
    void (this.getModel() as CRUDModel)
      .create(newQuestion, "/" + aPath[1], "/" + aPath[3])
      .then(() => this.getSupportModel().setProperty("/edit", true));
    this.clearFragmentInputs();
    void this.oFragment.then((oMessagePopover) =>
      (oMessagePopover as Dialog).close()
    );
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
    oModel.setProperty(
      "/newQuestion",
      JSON.parse(JSON.stringify(this.newQuestion))
    );
    void this.oFragment.then((oMessagePopover) =>
      (oMessagePopover as Dialog).open()
    );
    this.getSupportModel().setProperty("/edit", true);
  }

  public onPressDeleteSubCategory() {
    const sPath: string[] = (this.getView()?.getBindingContext() as Context)
      .getPath()
      .split("/");
    const fetchToRemoveSubCategory = () => {
      void (this.getModel() as CRUDModel)
        .deleteCategory(sPath[2], sPath[4])
        .then(() => {
          this.navTo("start");
        });
    };
    this.getConfirm(
      fetchToRemoveSubCategory,
      "mainPageConfirmationDialogText",
      "mainPageConfirmationDialogTextRemove"
    );
  }

  public onPressDeleteQuestion() {
    const oControls: Control[] | undefined = this.getView()
      ?.getControlsByFieldGroupId("questions")
      .filter(
        (oControl) =>
          oControl.getMetadata().getElementName() === "sap.m.RadioButton"
      );
    if (
      (oControls as RadioButton[]).filter((elem) => elem.getSelected()).length
    ) {
      const sSelectedControl = (oControls as RadioButton[])
        .filter((oRadioButton) => oRadioButton.getSelected())[0]
        .getBindingContext()
        ?.getPath();

      const sId: string | undefined = (sSelectedControl as string)
        .split("/")
        .pop();
      const aPath: string[] = (this.getView()?.getBindingContext() as Context)
        .getPath()
        .slice(1)
        .split("/");

      const fetchToRemoveQuestion = () => {
        void (this.getModel() as CRUDModel)
          .delete(sId as string, "/" + aPath[1], "/" + aPath[3])
          .then(() => this.getSupportModel().setProperty("/edit", true))
          .then(() => this.getSupportModel().setProperty("/selected", false))
          .then(() =>
            (oControls as RadioButton[]).forEach((oRadioButton) =>
              oRadioButton.setSelected(false)
            )
          );
      };
      this.getConfirm(
        fetchToRemoveQuestion,
        "mainPageConfirmationDialogText",
        "mainPageConfirmationDialogTextRemove"
      );
    }
  }

  public onCheck(oEvent: Event): void {
    const sPath: string = (
      (oEvent.getSource() as CheckBox).getBindingContext() as Context
    ).getPath();
    const nIndex = Number(sPath.slice(-1)) + 1;
    const rightAnswer = sPath.replace(/answers\/[0-9]/g, "rightAnswer");
    let aRightAnswer = this.getModel()?.getProperty(rightAnswer) as number[];
    aRightAnswer[0] === 5 ? aRightAnswer.shift() : null
    aRightAnswer.includes(nIndex)
      ? (aRightAnswer = aRightAnswer.filter((elem) => elem !== nIndex))
      : aRightAnswer.push(nIndex);

    (this.getModel() as JSONModel).setProperty(rightAnswer, aRightAnswer);
    this.getSupportModel().setProperty("/change", true);
  }

  public onSelect(): void {
    this.getSupportModel().setProperty("/selected", true);
  }

  public onPressSave(): void {
    this.getSupportModel().setProperty("/selected", false);

    const oControls: Control[] | undefined = this.getView()
      ?.getControlsByFieldGroupId("questions")
      .filter(
        (oControl) =>
          oControl.getMetadata().getElementName() === "sap.m.RadioButton"
      );
    oControls?.forEach((oRadioButton) =>
      (oRadioButton as RadioButton).setSelected(false)
    );
    // ! this.getSupportModel().getProperty("/change")
    this.determineManageTestPageValidity();
    if (this.getSupportModel().getProperty("/isManageTestPageValid")) {
      const aPath: string[] = (this.getView()?.getBindingContext() as Context)
        .getPath()
        .slice(1)
        .split("/");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const oData: IData[] = (
        (this.getModel() as JSONModel).getData()[aPath[0]][aPath[1]][aPath[2]][
          aPath[3]
        ] as IData
      ).questions as IData[];
      const oDataKeys: string[] = Object.keys(oData);
      const aResult: IResult[] = Object.values(oData).map((elem, index) => {
        return {
          id: oDataKeys[index],
          body: {
            answers: elem.answers,
            question: elem.question,
            rightAnswer: elem.rightAnswer,
          },
        };
      }) as unknown as IResult[];

      void aResult.forEach(
        (elem) =>
          void (this.getModel() as CRUDModel).patch(
            elem.id,
            elem.body,
            "/" + aPath[1],
            "/" + aPath[3]
          )
      );

      // disable save btn
      this.getSupportModel().setProperty(
        "/edit",
        !this.getSupportModel().getProperty("/edit")
      );
    }
    this.getSupportModel().setProperty("/change", false);
    this.defineAddAnswerBtnDisability();
  }

  public onPressNavBack() {
    if (
      this.getSupportModel().getProperty("/edit") &&
      this.getSupportModel().getProperty("/change")
    ) {
      const onPressBackAction = () => {
        const sPath = (
          this.getView()?.getBindingContext() as Context
        ).getPath();
        (this.getModel() as JSONModel).setProperty(sPath, this.oState);
        this.getSupportModel().setProperty("/edit", false);
        this.getSupportModel().setProperty("/change", false);
        this.onNavBack();
      };
      this.getConfirm(
        onPressBackAction,
        "mainPageConfirmationDialogText",
        "mainPageConfirmationDialogTitle"
      );
    } else {
      this.getSupportModel().setProperty("/edit", false);
      this.getSupportModel().setProperty("/change", false);
      this.onNavBack();
    }
  }

  public saveState() {
    const sPath = (this.getView()?.getBindingContext() as Context).getPath();
    const oState = (this.getModel() as JSONModel).getProperty(
      sPath
    ) as IQuestionStructure;
    this.oState = JSON.parse(JSON.stringify(oState)) as IQuestionStructure;
  }

  public onPressCancel() {
    // if (this.getSupportModel().getProperty("/change")) {
    //   const onPressYesAction = () => {
    //     // (this.getModel() as JSONModel).setProperty(sPath, this.oState);
    //     this.setChecked();
    //     this.highlightSwitcher();
    //     this.getSupportModel().setProperty("/change", false);
    //   };
    //   this.getConfirm(
    //     onPressYesAction,
    //     "mainPageConfirmationDialogText",
    //     "mainPageConfirmationDialogTitle"
    //   );
    // }

    const sPath = (this.getView()?.getBindingContext() as Context).getPath();
    const oCurrentState = (this.getModel() as JSONModel).getProperty(
      sPath
    ) as IQuestionStructure;
    if (!this.isObjectsEqual(oCurrentState, this.oState)) {
      const onPressYesAction = () => {
        (this.getModel() as JSONModel).setProperty(sPath, this.oState);
        this.setChecked();
        this.highlightSwitcher();
        this.getSupportModel().setProperty("/edit", false);
        this.defineAddAnswerBtnDisability();
      };
      this.getConfirm(
        onPressYesAction,
        "mainPageConfirmationDialogText",
        "mainPageConfirmationDialogTitle"
      );
    } else {
      this.getSupportModel().setProperty("/edit", false);
    }
    this.defineAddAnswerBtnDisability();
    this.getSupportModel().setProperty("/change", false);
  }

  private isObjectsEqual(object1: object, object2: object) {
    const props1 = Object.getOwnPropertyNames(object1);
    const props2 = Object.getOwnPropertyNames(object2);

    if (props1.length !== props2.length) {
      return false;
    }

    for (let i = 0; i < props1.length; i += 1) {
      const prop = props1[i];
      const bothAreObjects =
        typeof object1[prop] === "object" && typeof object2[prop] === "object";

      if (
        (!bothAreObjects && object1[prop] !== object2[prop]) ||
        (bothAreObjects && !this.isObjectsEqual(object1[prop], object2[prop]))
      ) {
        return false;
      }
    }

    return true;
  }

  public getConfirm(
    fn: () => void,
    sDialogText: string,
    sDialogTitle: string
  ): void {
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

  // new logic for adding questions
  public onPressAddQuestionBtn(oEvent: Event) {
    const nIndex = (this.byId("qList") as List).getItems().length;
    const newQuestion = models.createQuestion("", ["", ""], [5]);
    const aPath: string[] = (this.getView()?.getBindingContext() as Context)
      .getPath()
      .slice(1)
      .split("/");
      
    const prevState;
    void (this.getModel() as CRUDModel)
      .create(newQuestion, "/" + aPath[1], "/" + aPath[3])
      .then((resp) => {
        const aAddQuestion: object[] =
          this.getSupportModel().getProperty("/addQuestion");
        aAddQuestion.push({ id: resp.name, index: nIndex });
        this.getSupportModel().setProperty("/addQuestion", aAddQuestion);
        this.defineAddAnswerBtnDisability();
        return resp
      })
      .then(resp => {
        // console.log(prevState, this.getModel()?.getProperty(sPath))
      });
  }

  public onPressAddAnswer(oEvent: Event) {
    const oAddAnswerBtn = oEvent.getSource() as Button;
    const sAnswersPath =
      ((oAddAnswerBtn as Control).getBindingContext() as Context).getPath() +
      "/answers";
    const aAnswers: string[] = (this.getModel() as CRUDModel).getProperty(
      sAnswersPath
    );
    aAnswers.push("");
    void (this.getModel() as CRUDModel).setProperty(sAnswersPath, aAnswers);
    this.defineAddAnswerBtnDisability();

    // if (aAnswers.length === 4) {
    //   (oAddAnswerBtn as Button).setEnabled(false);
    // } else {
    //   (oAddAnswerBtn as Button).setEnabled(true);
    // }

    // const oControls: Array<Control> = this.getInputListItem();
    // const aEmptyAnswers: string[] =
    //   (this.byId("answerstable") as Table).getItems().length === 2
    //     ? ["", "", ""]
    //     : ["", "", "", ""];

    // const nIndex: number = oControls.findIndex(
    //   (oControl) => oControl.getProperty("highlight") === "Information"
    // );

    // const aPath: string[] = (this.getView()?.getBindingContext() as Context)
    //   .getPath()
    //   .slice(1)
    //   .split("/");

    // const sId = this.getSupportModel()
    //   .getProperty("/addQuestion")
    //   .filter((elem) => elem.index === nIndex)[0].id;
    // void (this.getModel() as CRUDModel).patch(
    //   sId,
    //   { answers: aEmptyAnswers },
    //   "/" + aPath[1],
    //   "/" + aPath[3]
    // );
  }

  public onPressDeleteAnswer(oEvent: Event) {
    const oAddAnswerBtn = oEvent.getSource() as Button;
    const aAnswerPath: string[] | undefined = oAddAnswerBtn
      .getBindingContext()
      ?.getPath()
      .split("/");
    const sPropertyAnswersPath: string | undefined = oAddAnswerBtn
    .getBindingContext()
    ?.getPath()
    .split("/")
      ?.splice(0, aAnswerPath.length - 1)
      .join("/");
    const aAnswers: string[] | undefined = oAddAnswerBtn
      .getBindingContext()
      ?.getProperty(sPropertyAnswersPath as string);
    const nIndex = aAnswerPath?.slice(-1)[0] as string;

    const aUpdatedAnswers =
      aAnswers?.find((elem: string, index: number, arr: string[]) => {
        if (index === +nIndex) {
          return arr.splice(index, 1);
        }
      }) || aAnswers;

    // void (this.getModel() as CRUDModel).setProperty(
    //   sPropertyAnswersPath as string,
    //   aUpdatedAnswers
    // );

    const sId = (sPropertyAnswersPath as string).split("/").slice(-2, -1)[0];
    void (this.getModel() as CRUDModel).delete(sId, "/" + aAnswerPath[2], "/" + aAnswerPath[4])

    this.defineAddAnswerBtnDisability();
    //   const sAnswersPath = (
    //     (oAddAnswerBtn as Control).getBindingContext() as Context
    //   )
    //     .getPath()
    //     .split("/");
    //   // const aAnswers: string[] = (this.getModel() as CRUDModel).getProperty(sAnswersPath);
    //   const fetchToRemoveAnswer = () => {
    //     void (this.getModel() as CRUDModel).delete(
    //       sAnswersPath[6],
    //       "/" + sAnswersPath[2],
    //       "/" + sAnswersPath[4]
    //     );
    //   };
    //   this.getConfirm(fetchToRemoveAnswer, "test", "test");
  }

  private determineManageTestPageValidity() {
    const sPath = (this.getView()?.getBindingContext() as Context).getPath();
    const oCurrentState = (this.getModel() as JSONModel).getProperty(
      sPath
    ) as IQuestionStructure;
    const aInputListItems = this.getInputListItem();
    const aAllQuestionsAndAnswers = Object.values(oCurrentState.questions);
    const aAllAnswers = aAllQuestionsAndAnswers.map((elem) => elem.answers);
    const aAllQuestions = aAllQuestionsAndAnswers.map((elem) => elem.question);

    // validate questions
    aAllQuestions.forEach((elem, index) => {
      if (!elem) {
        if (aInputListItems[index].getProperty("highlight") === "None") {
          aInputListItems[index].setProperty("highlight", MessageType.Error);
        }
        if (this.getSupportModel().getProperty("/isManageTestPageValid")) {
          this.getSupportModel().setProperty("/isManageTestPageValid", false);
        }
      } else {
        if (aInputListItems[index].getProperty("highlight") === "Error") {
          aInputListItems[index].setProperty("highlight", MessageType.None);
        }
      }
    });
    
    // validate answers
    const aAllAnswersInputs: Input[] = this.getView()
    ?.getControlsByFieldGroupId("allAnswersId")
    .filter(
      (oControl) =>
        oControl.getMetadata().getElementName() === "sap.m.Input"
    ) as Input[];

    aAllAnswersInputs?.forEach(elem => {
      if (!elem.getProperty("value")) {
        elem.setValueState(ValueState.Error)
      } else {
        elem.setValueState(ValueState.None)
      }
    })
    
    const aAllQuestionsInputs: Input[] = this.getView()
    ?.getControlsByFieldGroupId("allQuestionsId")
    .filter(
      (oControl) =>
        oControl.getMetadata().getElementName() === "sap.m.Input"
    ) as Input[];
    aAllQuestionsInputs?.forEach(elem => {
      if (!elem.getProperty("value")) {
        elem.setValueState(ValueState.Error)
      } else {
        elem.setValueState(ValueState.None)
      }
    });
    const aAllCheckBoxes: CheckBox[] = this.getView()
    ?.getControlsByFieldGroupId("checkBoxRightAnswers")
    .filter(
      (oControl) =>
        oControl.getMetadata().getElementName() === "sap.m.CheckBox"
    ) as CheckBox[];
    const bIsRightAnswerSelected = aAllCheckBoxes?.every(elem => !elem.getProperty("selected"))
    aAllCheckBoxes?.forEach(elem => {
      if (bIsRightAnswerSelected) {
        elem.setValueState(ValueState.Error)
      } else {
        elem.setValueState(ValueState.None)
      }
    });
 

    const bQueestionsValidity = aAllQuestions.every((el) => el);
    const bAnswersValidity =
      aAllAnswers.filter((el) => el.every((el) => !el)).length == 0;
    if (bQueestionsValidity && bAnswersValidity) {
      this.getSupportModel().setProperty("/isManageTestPageValid", true);
    }
  }

}

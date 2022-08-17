import JSONModel from "sap/ui/model/json/JSONModel";
import BindingMode from "sap/ui/model/BindingMode";
import * as Device from "sap/ui/Device";
import { IQuestion } from "../interface/Interface";



class Question implements IQuestion {
  question: string;
  answers: string[];
  rightAnswer: number[];
  constructor(question?: string, answers?: string[], rightAnswer?: number[]) {
    this.question = question || "";
    this.answers = answers || ["", "", "", ""];
    this.rightAnswer = rightAnswer || [];
  }
}

export default {
  createDeviceModel: () => {
    const oModel = new JSONModel(Device);
    oModel.setDefaultBindingMode(BindingMode.OneWay);
    return oModel;
  },

  createQuestion: (question?: string, answers?: string[], rightAnswer?: number[]) => {
    return new Question(question, answers, rightAnswer);
  },
};

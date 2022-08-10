import JSONModel from "sap/ui/model/json/JSONModel";
import BindingMode from "sap/ui/model/BindingMode";
import * as Device from "sap/ui/Device";

interface IQuestion {
	question: string
	answers: string[]
	rightAnswer: number[]
}

class Question implements IQuestion {
	question: string
	answers: string[]
	rightAnswer: number[]	
	constructor(question?: string, answers?: string[], rightAnswer?: number[]) {
		this.question = question || ""
		this.answers = answers || [ "", "", "", ""]
		this.rightAnswer = rightAnswer	|| []
	}
}

export default {

	createDeviceModel : () => {
		const oModel = new JSONModel(Device);
		oModel.setDefaultBindingMode(BindingMode.OneWay);
		return oModel;
	},

	createQListModel : () => {
		return new JSONModel({
			questions: [
				new Question("Which type of model in SAP UI5 do you now?", [ "ResourceModel", "JSONModel", "XMLModel", "ODataModel"], [1, 2, 3, 4]),
				new Question("Which binding type do you now?", ["one-way", "two-way", "one-time", "single-time"], [1, 2, 3]),
				new Question("Which view type do you now?", ["XML", "oData", "JS", "HTML"], [1, 2, 3])
			],
			edit: false
		})
	}

};
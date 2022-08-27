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
import FetchDataBase from '../db/FetchDB';
import Context from 'sap/ui/model/Context';
import formatter from '../model/formatter'
import JSONModel from 'sap/ui/model/json/JSONModel';

/**
 * @namespace webapp.typescript.controller
 */
export default class Detail extends BaseController {
	bus: EventBus;
	oSubmitDialog: Dialog;
	formatter = formatter;

	public onInit(): void {
		this.bus = this.getOwnerComponent().getEventBus();
	}	

	public handleDetailPress(oEvent: Event): void {
		MessageToast.show("Loading end column...setDetailDetailPage");
		this.bus.publish("flexible", "setDetailDetailPage", oEvent);
	}

	public onPressAddCategory(): void {		
		if (!this.getModel("supportModel").getProperty("/auth")) this.loadAuthorizationDialog()
		if (this.getModel("supportModel").getProperty("/auth")) {
			if (!this.oSubmitDialog) {
				this.oSubmitDialog = new Dialog({
					type: DialogType.Message,
					title: "Confirm",
					content: [
						new Label({
							text: "Do you want to submit this category?",
							labelFor: "categoryName"
						}),
						new TextArea("categoryName", {
							width: "100%",
							placeholder: "Add category name (required)",
							liveChange: (oEvent: Event): void => {
								const sText: string = (oEvent as unknown as Event).getParameter("value") as string;
								this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
							}
						})
					],
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Submit",
						enabled: false,
						press: () => {
							const sText = (Core.byId("categoryName") as TextArea).getValue();
							MessageToast.show("Note is: " + sText);
							const aPath: string[] = (this.getView()?.getBindingContext() as Context).getPath().split("/")
							const sEmail: string = (this.getModel("supportModel") as JSONModel).getProperty("/auth/email") as string
							void FetchDataBase.createCategory(sEmail, `/${aPath[2]}`, `/${sText}`).then(() => void this.fireBaseRead())
							this.oSubmitDialog.close();
						}
					}),
					endButton: new Button({
						text: "Cancel",
						press: () => {
							this.oSubmitDialog.close();
						}
					})
				});
			}
			this.oSubmitDialog.open();
		}
		
	}
	onRunTest(oEvent: Event) {
		this.bus.publish("navigation", "navToTesting", oEvent);
	
	}
}
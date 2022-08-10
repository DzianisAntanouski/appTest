import BaseController from "./BaseController";
import formatter from "../model/formatter";
import JSONModel from "sap/ui/model/json/JSONModel";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Context from "sap/ui/model/Context";
import models from "../model/models";
import { MessageType } from "sap/ui/core/library";

// const app = initializeApp(firebaseConfig);
/**
 * @namespace webapp.typescript.controller
 */
export default class Main extends BaseController {
	oDialogFunction: any
  private formatter = formatter;

  public onInit(): void {
    const qListModel: JSONModel = models.createQListModel();
    this.setModel(qListModel);
    const oContext: Context = new Context(qListModel, "/questions/0") as Context;
    this.getView().byId("detailDetail").setBindingContext(oContext);
    this.highlightSwitcher();
  }

  private highlightSwitcher(): void {
    const oContext: Context = this.getView().byId("detailDetail").getBindingContext() as Context;
    const sPath: string = oContext.getPath();
    let sIndex: string = sPath.slice(sPath.search(/\/?[0-9]+/) + 1);
    const oControls: Array<Control> = this.getView().getControlsByFieldGroupId();
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
    const aData: Array<Object> = this.getModel().getProperty("/questions");
    if (+sIndex + 1 === aData.length) {
      sIndex = "-1";
    }
    const oNextContext: Context = new Context(qListModel, `/questions/${+sIndex + 1}`) as Context;
    this.getView().byId("detailDetail").setBindingContext(oNextContext);

    this.highlightSwitcher();
  }

  public onPressAddQuestion (oEvent: Event): void {
	var oView = this.getView();
	if (!this.oDialogFunction) {
	  this.oDialogFunction = sap.ui.xmlfragment(
		oView.getId(),
		"webapp.view.Fragments.ProductsByRating",
		this
	  );
	  oView.addDependent(this.oDialogFunction);
	}
	this.oDialogFunction.open();
  }
}

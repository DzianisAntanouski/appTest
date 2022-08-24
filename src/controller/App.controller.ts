import JSONModel from "sap/ui/model/json/JSONModel";
import { ICategory, IQuestion } from "../interface/Interface";
import BaseController from "./BaseController";

/**
 * @namespace webapp.typescript.controller
 */
export default class App extends BaseController {
  public onInit(): void {
    // apply content density mode to root view
    this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
    const that = this
    void this.fireBaseRead().then(() => that.setAllQuestions());

  }
 
}

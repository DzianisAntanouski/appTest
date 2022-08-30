import BaseController from "./BaseController";
import JSONModel from 'sap/ui/model/json/JSONModel';

/**
 * @namespace webapp.typescript.controller
 */
export default class App extends BaseController {
  public onInit(): void {
    // apply content density mode to root view
    this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
    // ?????????????????????????
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    void this.fireBaseRead().then(() => that.setAllQuestions());

    const authorization = localStorage.getItem("auth")
    if (authorization) {
      (this.getModel("supportModel") as JSONModel).setProperty("/auth", JSON.parse(authorization))
    }
  } 
}

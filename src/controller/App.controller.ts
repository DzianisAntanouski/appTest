import BaseController from "./BaseController";

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

    let authorization = localStorage.getItem("auth")
    if (authorization) {
      this.getModel("supportModel").setProperty("/auth", JSON.parse(authorization))
    }
  } 
}

import BaseController from "./BaseController";
import { IAuthObject } from "../interface/Interface";
import CRUDModel from "../model/CRUDModel";

/**
 * @namespace webapp.typescript.controller
 */
export default class App extends BaseController {
  public onInit(): void {
    this.getView()?.addStyleClass(this.getOwnerComponent().getContentDensityClass());
    const setQuestion = this.setAllQuestions.bind(this);
    const oCRUDModel = new CRUDModel()
    this.getView()?.setModel(oCRUDModel);
    void (this.getModel() as CRUDModel).read().then(() => setQuestion())
    void (this.getModel() as CRUDModel).readPost()
    // void this.fireBaseRead().then(() => setQuestion());

    const authorization: string | null = localStorage.getItem("auth");
    if (authorization) {
      const oAuthObject = JSON.parse(authorization) as IAuthObject
      void oCRUDModel.checkUserToken(oAuthObject.email).then((resp) => {
        (resp as IAuthObject).email == oAuthObject.email &&
        (resp as IAuthObject).idToken == oAuthObject.idToken
          ? this.getSupportModel().setProperty("/auth", oAuthObject)
          : this.getSupportModel().setProperty("/auth", null);
      });
    }
  }
}

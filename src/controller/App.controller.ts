import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import FetchDataBase from "../db/FetchDB";
import { IAuthObject } from "../interface/Interface";

/**
 * @namespace webapp.typescript.controller
 */
export default class App extends BaseController {
  public onInit(): void {
    this.getView()?.addStyleClass(this.getOwnerComponent().getContentDensityClass());
    const setQuestion = this.setAllQuestions.bind(this);
    void this.fireBaseRead().then(() => setQuestion());

    const authorization: string | null = localStorage.getItem("auth");
    if (authorization)
      void FetchDataBase.checkUserToken((JSON.parse(authorization) as IAuthObject).email).then((resp) => {
        (resp as IAuthObject).email == (JSON.parse(authorization) as IAuthObject).email &&
        (resp as IAuthObject).idToken == (JSON.parse(authorization) as IAuthObject).idToken
          ? (this.getModel("supportModel") as JSONModel).setProperty("/auth", JSON.parse(authorization))
          : (this.getModel("supportModel") as JSONModel).setProperty("/auth", null);
      });
  }
}

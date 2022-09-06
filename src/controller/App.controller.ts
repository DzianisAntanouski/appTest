import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import FetchDataBase from "../db/FetchDB";
import { IAuthObject } from "../interface/Interface";
import { support } from 'sap/ui/Device';

/**
 * @namespace webapp.typescript.controller
 */
export default class App extends BaseController {
  public onInit(): void {
    this.getView()?.addStyleClass(this.getOwnerComponent().getContentDensityClass());
    const setQuestion = this.setAllQuestions.bind(this);
    void this.fireBaseRead().then(() => setQuestion());

    const authorization: string | null = localStorage.getItem("auth");
    if (authorization) {
      const oAuthObject = JSON.parse(authorization) as IAuthObject
      void FetchDataBase.checkUserToken(oAuthObject.email).then((resp) => {
        (resp as IAuthObject).email == oAuthObject.email &&
        (resp as IAuthObject).idToken == oAuthObject.idToken
          ? this.getSupportModel().setProperty("/auth", oAuthObject)
          : this.getSupportModel().setProperty("/auth", null);
      });
    }
  }
}

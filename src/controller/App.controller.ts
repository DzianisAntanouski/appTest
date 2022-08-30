import BaseController from "./BaseController";
import JSONModel from 'sap/ui/model/json/JSONModel';
import FetchDataBase from "../db/FetchDB";

/**
 * @namespace webapp.typescript.controller
 */
export default class App extends BaseController {
  public async onInit(): Promise<void> {
    // apply content density mode to root view
    this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
    // ?????????????????????????
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    void this.fireBaseRead().then(() => that.setAllQuestions());
    
    const authorization = localStorage.getItem("auth");
    
    void FetchDataBase.checkUserToken(JSON.parse(authorization as string).email).then((resp) => {
      resp.email == JSON.parse(authorization as string).email && resp.idToken == JSON.parse(authorization as string).idToken 
      ? (this.getModel("supportModel") as JSONModel).setProperty("/auth", JSON.parse(authorization as string))
      : (this.getModel("supportModel") as JSONModel).setProperty("/auth", null);
    });
  } 
}

import BaseController from "./BaseController";
import JSONModel from 'sap/ui/model/json/JSONModel';
import Auth from "../db/Auth";


/**
 * @namespace webapp.typescript.controller
 */
export default class Start extends BaseController {
  onInit(): void {
    const authModel = new JSONModel({
      email: "test@test.com",
      password: "123456",
      btnVisible: true
    })
    this.getView().setModel(authModel, "authModel")    
  }

  public onPressAuth(): void {    
    const oAuthModel: JSONModel = this.getModel('authModel') as JSONModel
    oAuthModel.setProperty("/btnVisible", false)
    const email: string = oAuthModel.getProperty("/email") as string
    const password: string = oAuthModel.getProperty("/password") as string
    void Auth.getToken(email, password)
      .then(void oAuthModel.setProperty("/btnVisible", true))
  }

  
}

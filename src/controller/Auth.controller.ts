import BaseController from "./BaseController";
import JSONModel from 'sap/ui/model/json/JSONModel';


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
    void this.getToken(email, password)
      .then(void oAuthModel.setProperty("/btnVisible", true))
  }

  public async getToken (email: string, password: string): Promise<string> {
    interface IToken {
      idToken: string
    }   
    const apiKey = `AIzaSyC-14jeZmSOdG1HPzl5bdZ_aLBBFVEg_-8`
    return await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: "POST",
      body: JSON.stringify({
        email, password,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json() as Promise<string>)
      .then(sToken => (sToken as unknown as IToken).idToken)
  }
}

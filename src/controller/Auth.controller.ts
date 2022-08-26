import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import View from "sap/ui/core/mvc/View";
import { fnTryAuthorization, fnPassUserAsAnonymous } from "../db/Auth";
import { IError, IFulfilled } from '../interface/Interface';

/**
 * @namespace webapp.typescript.controller
 */
export default class Start extends BaseController {
  onInit(): void {
    const authModel = new JSONModel({
      email: "test@test.com",
      password: "123456",
      btnVisible: true,
    });

    if (this.getView()) {
      (this.getView() as View).setModel(authModel, "authModel");
    }
  }
   

  public onPressAuth(): void {
    // const oAuthModel: JSONModel = this.getModel("authModel") as JSONModel;
    // oAuthModel.setProperty("/btnVisible", false);
    // const email: string = oAuthModel.getProperty("/email") as string;
    // const password: string = oAuthModel.getProperty("/password") as string;
    // void Auth.getToken(email, password).then(
    //   void oAuthModel.setProperty("/btnVisible", true)
    // );
  }

  public async onCheckMe(): Promise<void> {
    let oModel: JSONModel = this.getModel("authModel") as JSONModel;
    let email: string = oModel.getProperty("/email") as string;
    let password: string = oModel.getProperty("/password") as string;

    // interface iTest {
    //   kind: string;
    //   localId: string;
    //   email: string;
    //   displayName: string;
    //   idToken: string;
    //   registered: boolean;
    //   refreshToken: string;
    //   expiresIn: string;
    // }



    // const requestResult = await Auth.anonymouslyUser();

    // if (result?.email) {
    //   console.log((this.getModel("supportModel") as JSONModel ).setProperty("/auth", result));
    // } else {
    //   const result2 = await Auth.getToken(email, password);
    //   console.log(result2);
    // }

    // const logInTry = await fnTryAuthorization(email, password);
    // if ((logInTry as unknown as IFulfilled).email) { 
    //   (this.getModel("supportModel") as JSONModel).setProperty("/auth", logInTry)
    // } else {
    //   console.log(logInTry)
    // }
  }
}

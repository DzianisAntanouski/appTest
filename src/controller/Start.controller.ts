import BaseController from "./BaseController";
import formatter from "../model/formatter";

// const app = initializeApp(firebaseConfig);
/**
 * @namespace webapp.typescript.controller
 */
export default class Start extends BaseController {

  public onInit(): void {
    
  }

  public navToMain(): void {
    this.navTo("main")
  }

  public navToTesting(): void {
    this.navTo("test")
  }

}

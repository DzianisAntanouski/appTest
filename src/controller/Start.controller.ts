import BaseController from "./BaseController";

/**
 * @namespace webapp.typescript.controller
 */
export default class Start extends BaseController {
  public navToMain(): void {
    this.navTo("main");
  }

  public navToTesting(): void {
    this.navTo("test");
  }
}

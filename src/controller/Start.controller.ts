import { QuestionTest } from "../db/db";
import BaseController from "./BaseController";

/**
 * @namespace webapp.typescript.controller
 */
export default class Start extends BaseController {
  public onInit() {
    // void this.fireBaseRead();
  }
  public navToMain(): void {
    this.navTo("main");
  }

  public navToTesting(): void {
    this.navTo("test");
  }

  // testing operation
  public test() {
    void new QuestionTest().delete("-N9YC3JmW1njmLqV68o8").then(() => {
      void this.fireBaseRead();
    });
    // const testingPost: object = await (new QuestionTest).create(models.createQuestion("Which type of model in SAP UI5 do you now?", ["ResourceModel", "JSONModel", "XMLModel", "ODataModel"], [1, 2, 3, 4]))
    // const testingPost1: object = await (new QuestionTest).create(models.createQuestion("Which binding type do you now?", ["one-way", "two-way", "one-time", "single-time"], [1, 2, 3]))
    // const testingPost2: object = await (new QuestionTest).create(models.createQuestion("Which view type do you now?", ["XML", "oData", "JS", "HTML"], [1, 3, 4]))
    // const testingGet: object = await (new QuestionTest).read().then(res => res.json()).then(res => res)
    // debugger
    // console.log(testingGet)

    // console.log(testing)
    // const test: QuestionTest = new QuestionTest()
    // test.create(models.createQuestion("how", ["1", "2", "3", "4"], [1,2]))
  }
}

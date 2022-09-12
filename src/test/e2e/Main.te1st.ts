/* eslint-disable @typescript-eslint/await-thenable */
import { wdi5 } from "wdio-ui5-service";
import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types";
import { expect } from "expect";
import Main from "./pageObjects/Main";
import Template from "./pageObjects/Template";
import Button from "sap/m/Button";
import GenericTile from "sap/m/GenericTile";
import Input from "sap/m/Input";
import Start from "./pageObjects/Start";
import Text from "sap/m/Text";

const createTemplate = Template(Main._viewName);
const templateStart = Template(Start._viewName);

describe("test1: Main page", () => {
  before(async () => {
    await Main.open();
  });

  it("should have the right title", async () => {
    const title = await browser.getTitle();
    expect(title).toEqual("UI5 Application typescript");
  });  

  it("should heave authorization and return to manage page", async () => {
    const avatarButton: wdi5Selector = templateStart("avatarBtn");
    await (browser.asControl(avatarButton) as unknown as Button).firePress();

    const dialogEmailInput: wdi5Selector = templateStart("emailInputId");
    await (browser.asControl(dialogEmailInput) as unknown as Input).setValue("team@leverx.by");

    const dialogPassInput: wdi5Selector = templateStart("passwordInputId");
    await (browser.asControl(dialogPassInput) as unknown as Input).setValue("testapp");

    const logInButton: wdi5Selector = templateStart("LogInButton");
    await (browser.asControl(logInButton) as unknown as Button).firePress();

    const url = await browser.getUrl();
    expect(url).toMatch(/.*#$/);
  });

  it("should have edit button press", async () => {
    // await browser.goTo({ sHash: "#/main-Data-FrontEnd-subCategory-CSS" })

    const masterTile: wdi5Selector = await {
      selector: {
        controlType: "sap.m.GenericTile",
        viewName: "webapp.typescript.view.Master",
        bindingPath: {
          path: "/Data/FrontEnd",
          propertyPath: "categoryName",
        },
      },
    };
    await (browser.asControl(masterTile) as unknown as GenericTile).firePress();

    const detailTile: wdi5Selector = await {
      selector: {
        controlType: "sap.m.GenericTile",
        viewName: "webapp.typescript.view.Detail",
        bindingPath: {
          path: "/Data/FrontEnd/subCategory/CSS",
          propertyPath: "name",
        },
      },
    };
    await (browser.asControl(detailTile) as unknown as GenericTile).firePress();

    const endTile: wdi5Selector = await {
      selector: {
        id: "endView--manageTest",
      },
    };
    await (browser.asControl(endTile) as unknown as GenericTile).firePress();

    const editButton: wdi5Selector = await createTemplate("editButtonMain");
    await (browser.asControl(editButton) as unknown as Button).firePress();

    const cancelButton = createTemplate("cancelButton");
    const cancelButtonText = await (browser.asControl(cancelButton) as unknown as Button).getText();
    expect(cancelButtonText).toEqual("Cancel");
  });

  it("should have change input text", async () => {
    const input: wdi5Selector = await {
      selector: {
        controlType: "sap.m.Input",
        viewName: "webapp.typescript.view.Main",
        bindingPath: {
          path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uxyk7BmxtMV5XgyB0/answers/0",
          propertyPath: "",
        },
      },
    };
    await (browser.asControl(input) as unknown as Input).setValue("wdi5-test");

    const saveButton: wdi5Selector = await {
      selector: {
        controlType: "sap.m.Button",
        viewName: "webapp.typescript.view.Main",
        i18NText: {
          propertyName: "text",
          key: "btnSave",
        },
      },
    };
    await (browser.asControl(saveButton) as unknown as Button).firePress();

    const textAnswer: wdi5Selector = await {
      selector: {
        controlType: "sap.m.Text",
        viewName: "webapp.typescript.view.Main",
        bindingPath: {
          path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uxyk7BmxtMV5XgyB0/answers/0",
          propertyPath: "",
        },
      },
    };
    const inputText = await (browser.asControl(textAnswer) as unknown as Text).getText(false);
    expect(inputText).toEqual("wdi5-test");
  });
});

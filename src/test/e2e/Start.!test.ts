/* eslint-disable @typescript-eslint/await-thenable */
import { wdi5 } from "wdio-ui5-service";
import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types";
import { expect } from "expect";
import Start from "./pageObjects/Start";
import Template from "./pageObjects/Template";
import Control from "sap/ui/core/Control";
import Button from "sap/m/Button";
import Page from "sap/m/Page";
import GenericTile from "sap/m/GenericTile";
import Input from "sap/m/Input";
import Icon from "sap/ui/core/Icon";

const createTemplate = Template(Start._viewName);

describe("test1: Start page", () => {
  before(async () => {
    await Start.open();
  });

  it("should have the right title", async () => {
    const title = await browser.getTitle();
    expect(title).toEqual("UI5 Application typescript");
  });

  it("should check non authorization", async () => {
    const emailButton = createTemplate("emailText");
    const emailButtonText = await (browser.asControl(emailButton) as unknown as Button).getText();
    expect(emailButtonText).toEqual("Not auth");
  });

  it("should have press avatar and load auth dialog", async () => {
    // open dialog
    const avatarButton: wdi5Selector = createTemplate("avatarBtn");
    await (browser.asControl(avatarButton) as unknown as Button).firePress();

    const dialogEmailInput: wdi5Selector = createTemplate("emailInputId");
    await (browser.asControl(dialogEmailInput) as unknown as Input).setValue("test@mail.eu");

    const dialogPassInput: wdi5Selector = createTemplate("passwordInputId");
    await (browser.asControl(dialogPassInput) as unknown as Input).setValue("123456");

    const logInButton: wdi5Selector = createTemplate("LogInButton");
    await (browser.asControl(logInButton) as unknown as Button).firePress();
  });

  it("should have list with at least two items", async () => {
    const Page: wdi5Selector = {
      selector: {
        controlType: "sap.m.Page",
        viewName: Start._viewName,
      },
    };
    const pageContent: Control[] = await (browser.asControl(Page) as unknown as Page).getContent();
    expect(pageContent.length).toBeGreaterThanOrEqual(2);
  });

  it("should have press Master Page content", async () => {
    const Tile: wdi5Selector = {
      selector: {
        controlType: "sap.m.GenericTile",
        viewName: "webapp.typescript.view.Master",
        bindingPath: {
          path: "/Data/FrontEnd",
          propertyPath: "categoryName",
        },
      },
    };
    await (browser.asControl(Tile) as unknown as GenericTile).firePress();

    const Page: wdi5Selector = {
      selector: {
        id: "midView--detailPage",
      },
    };
    const pageContent: Control[] = await (browser.asControl(Page) as unknown as Page).getContent();
    expect(pageContent.length).toBeGreaterThanOrEqual(4);
  });

  it("should have press Detail Page content", async () => {
    const Tile: wdi5Selector = {
      selector: {
        controlType: "sap.m.GenericTile",
        viewName: "webapp.typescript.view.Detail",
        bindingPath: {
          path: "/Data/FrontEnd/subCategory/CSS",
          propertyPath: "name",
        },
      },
    };
    await (browser.asControl(Tile) as unknown as GenericTile).firePress();

    const Page: wdi5Selector = {
      selector: {
        id: "endView--detailDetailPage",
      },
    };
    const pageContent: Control[] = await (browser.asControl(Page) as unknown as Page).getContent();
    expect(pageContent.length).toBeGreaterThanOrEqual(2);
  });

  it("should have auth", async () => {
    const emailButton = createTemplate("emailText");
    const emailButtonText = await (browser.asControl(emailButton) as unknown as Button).getText();
    expect(emailButtonText).toEqual("test@mail.eu");
  });

  it("should have logout", async () => {
    const avatarButton: wdi5Selector = createTemplate("avatarBtn");
    await (browser.asControl(avatarButton) as unknown as Button).firePress();

    const logOutButton: wdi5Selector = createTemplate("discardPopoverButtonId");
    await (browser.asControl(logOutButton) as unknown as Button).firePress();

    const emailButton = createTemplate("emailText");
    const emailButtonText = await (browser.asControl(emailButton) as unknown as Button).getText();
    expect(emailButtonText).toEqual("Not auth");
  });

  it("should have try to close and page", async () => {
    const closeEndPageButton: wdi5Selector = {
      selector: {
        id: "endView--closeButton",
      },
    };
    await (browser.asControl(closeEndPageButton) as unknown as Icon).firePress();

    const Tile: wdi5Selector = {
      selector: {
        controlType: "sap.m.GenericTile",
        viewName: "webapp.typescript.view.Detail",
        bindingPath: {
          path: "/Data/FrontEnd/subCategory/HTML",
          propertyPath: "name",
        },
      },
    };
    await (browser.asControl(Tile) as unknown as GenericTile).firePress();

    const subHeader = await browser.asControl({
      selector: {
        id: "endView--manageTest",
      },
    });
    const subHeaderText: string = await (subHeader as unknown as GenericTile).getSubheader();
    expect(subHeaderText).toEqual("Manage HTML test");
  });
});

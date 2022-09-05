/* eslint-disable @typescript-eslint/await-thenable */
import { wdi5 } from "wdio-ui5-service";
import { expect } from "expect";
import Test from "./pageObjects/Test";
import { WDI5Control } from "wdio-ui5-service/dist/lib/wdi5-control";
import Text from "sap/m/Text";
import Title from "sap/m/Title";

const iPressTheFirstAnswer = async () => {
  await (
    browser.asControl({
      selector: {
        controlType: "sap.m.RadioButton",
        viewName: "webapp.typescript.view.Test",
        properties: {
          editable: true,
        },
        ancestor: {
          controlType: "sap.m.ColumnListItem",
          viewName: "webapp.typescript.view.Test",
          bindingPath: {
            path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uwG3vLxqZ0wkp0hH0/answers/0",
          },
          ancestor: {
            controlType: "sap.m.Table",
            viewName: "webapp.typescript.view.Test",
            bindingPath: {
              path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uwG3vLxqZ0wkp0hH0",
              propertyPath: "answers",
            },
          },
        },
      },
    }) as unknown as WDI5Control
  ).press();
};
const iPressTheSecondAnswer = async () => {
  await (
    browser.asControl({
      selector: {
        controlType: "sap.m.RadioButton",
        viewName: "webapp.typescript.view.Test",
        properties: {
          editable: true,
        },
        ancestor: {
          controlType: "sap.m.ColumnListItem",
          viewName: "webapp.typescript.view.Test",
          bindingPath: {
            path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uxyk7BmxtMV5XgyB0/answers/0",
          },
          ancestor: {
            controlType: "sap.m.Table",
            viewName: "webapp.typescript.view.Test",
            bindingPath: {
              path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uxyk7BmxtMV5XgyB0",
              propertyPath: "answers",
            },
          },
        },
      },
    }) as unknown as WDI5Control
  ).press();
};
const iPressTheThirdAnswer = async () => {
  await (
    browser.asControl({
      selector: {
        controlType: "sap.m.RadioButton",
        viewName: "webapp.typescript.view.Test",
        properties: {
          editable: true,
        },
        ancestor: {
          controlType: "sap.m.ColumnListItem",
          viewName: "webapp.typescript.view.Test",
          bindingPath: {
            path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uy6WxLKj_9VED_IME/answers/0",
          },
          ancestor: {
            controlType: "sap.m.Table",
            viewName: "webapp.typescript.view.Test",
            bindingPath: {
              path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uy6WxLKj_9VED_IME",
              propertyPath: "answers",
            },
          },
        },
      },
    }) as unknown as WDI5Control
  ).press();
};
const iPressTheFourthAnswer = async () => {
  await (
    browser.asControl({
      selector: {
        controlType: "sap.m.RadioButton",
        viewName: "webapp.typescript.view.Test",
        properties: {
          editable: true,
        },
        ancestor: {
          controlType: "sap.m.ColumnListItem",
          viewName: "webapp.typescript.view.Test",
          bindingPath: {
            path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uyWzTtv7l3PFx5UsN/answers/0",
          },
          ancestor: {
            controlType: "sap.m.Table",
            viewName: "webapp.typescript.view.Test",
            bindingPath: {
              path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uyWzTtv7l3PFx5UsN",
              propertyPath: "answers",
            },
          },
        },
      },
    }) as unknown as WDI5Control
  ).press();
};
const iPressTheFifthAnswer = async () => {
  await (
    browser.asControl({
      selector: {
        controlType: "sap.m.RadioButton",
        viewName: "webapp.typescript.view.Test",
        properties: {
          editable: true,
        },
        ancestor: {
          controlType: "sap.m.ColumnListItem",
          viewName: "webapp.typescript.view.Test",
          bindingPath: {
            path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uyzMbtKoQzEDnAjH_/answers/0",
          },
          ancestor: {
            controlType: "sap.m.Table",
            viewName: "webapp.typescript.view.Test",
            bindingPath: {
              path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uyzMbtKoQzEDnAjH_",
              propertyPath: "answers",
            },
          },
        },
      },
    }) as unknown as WDI5Control
  ).press();
};
const iPressTheSixthAnswer = async () => {
  await (
    browser.asControl({
      selector: {
        controlType: "sap.m.RadioButton",
        viewName: "webapp.typescript.view.Test",
        properties: {
          editable: true,
        },
        ancestor: {
          controlType: "sap.m.ColumnListItem",
          viewName: "webapp.typescript.view.Test",
          bindingPath: {
            path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uzAqgqVnZIm_feMvv/answers/0",
          },
          ancestor: {
            controlType: "sap.m.Table",
            viewName: "webapp.typescript.view.Test",
            bindingPath: {
              path: "/Data/FrontEnd/subCategory/CSS/questions/-N9uzAqgqVnZIm_feMvv",
              propertyPath: "answers",
            },
          },
        },
      },
    }) as unknown as WDI5Control
  ).press();
};
const iPressTheSeventhAnswer = async () => {
  await (
    browser.asControl({
      selector: {
        controlType: "sap.m.RadioButton",
        viewName: "webapp.typescript.view.Test",
        properties: {
          editable: true,
        },
        ancestor: {
          controlType: "sap.m.ColumnListItem",
          viewName: "webapp.typescript.view.Test",
          bindingPath: {
            path: "/Data/FrontEnd/subCategory/CSS/questions/undefined/answers/0",
          },
          ancestor: {
            controlType: "sap.m.Table",
            viewName: "webapp.typescript.view.Test",
            bindingPath: {
              path: "/Data/FrontEnd/subCategory/CSS/questions/undefined",
              propertyPath: "answers",
            },
          },
        },
      },
    }) as unknown as WDI5Control
  ).press();
};

const iPressSubmitButton = async () => {
  await (
    browser.asControl({
      selector: {
        id: "submitBtn",
        viewName: "webapp.typescript.view.Test",
      },
    }) as unknown as WDI5Control
  ).press();
};

describe("test3: Test page", () => {
  before(async () => {
    await Test.open();
  });

  it("should have the right title", async () => {
    const title = await browser.getTitle();
    expect(title).toEqual("UI5 Application typescript");
  });

  it("should select all first items", async () => {
    await iPressTheFirstAnswer();
    await iPressTheSecondAnswer();
    await iPressTheThirdAnswer();
    await iPressTheFourthAnswer();
    await iPressTheFifthAnswer();
    await iPressTheSixthAnswer();
    await iPressTheSeventhAnswer();
    await iPressSubmitButton();
    const rightAnswer = await (
      browser.asControl({
        selector: {
          controlType: "sap.m.Text",
          viewName: "webapp.typescript.view.Test",
          bindingPath: {
            path: "/resultsByQuestions/5",
            propertyPath: "points",
            modelName: "supportModel",
          },
        },
      }) as unknown as Text
    ).getText(false);
    expect(rightAnswer).toEqual("1");
  });

  it("should have right point result (28.6)", async () => {
    const text = await (
      browser.asControl({
        selector: {
          id: "idFooterText",
          viewName: "webapp.typescript.view.Test",
        },
      }) as unknown as Text
    ).getText(false);
    expect(text).toEqual("Your results: 28.6");
  });

  it("should have save result and check statistics dialog title", async () => {
    await (
      browser.asControl({
        selector: {
          controlType: "sap.m.Button",
          viewName: "webapp.typescript.view.Test",
          i18NText: {
            propertyName: "text",
            key: "saveResults",
          },
        },
      }) as unknown as WDI5Control
    ).press();

    await (
      browser.asControl({
        selector: {
          controlType: "sap.m.Button",
          properties: {
            text: "Statistic",
          },
        },
      }) as unknown as WDI5Control
    ).press();

    const text = await (
      browser.asControl({
        selector: {
          controlType: "sap.m.Title",
          viewName: "webapp.typescript.view.Test",
          properties: {
            text: "Statistic ",
          },
        },
      }) as unknown as Title
    ).getText();
    expect(text).toEqual("Statistic ");
  });

  it("check my result", async () => {
    const text = await (
      browser.asControl({
        selector: {
          controlType: "sap.m.Text",
          viewName: "webapp.typescript.view.Test",
          bindingPath: {
            path: "/results/5",
            propertyPath: "points",
            modelName: "supportModel",
          },
        },
      }) as unknown as Text
    ).getText(false);
    expect(text).toEqual("90");
  });
});

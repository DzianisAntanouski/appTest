/* eslint-disable @typescript-eslint/no-unsafe-call */
import Page from "sap/m/Page";
import Text from "sap/m/Text";
import Control from "sap/ui/core/Control";
import Table from "sap/m/Table";
import { wdi5 } from "wdio-ui5-service";
import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types";
import Template from "./pageObjects/Tempalte";
import Test from "./pageObjects/Test";
import ListBase from "sap/m/ListBase";
import { WDI5Control } from "wdio-ui5-service/dist/lib/wdi5-control";
import ManagedObject from "sap/ui/base/ManagedObject";

const createTemplate = Template(Test._viewName);

describe("test1: Start page", () => {
    before(async () => {
        await Test.open();
    });

    it("should have the right title", async () => {
        const page = await browser.asControl({
            selector: {
                controlType: "sap.m.Title",
                properties: {
                    text: "Questions"
                }
            }
        });
        const text = await page.getProperty('text') as Text;
        expect(text).toEqual("Questions");
    });
    it('should open information dialog', async () => {

        // const page: Control[] = (await browser.asControl({
        //     selector: {
        //         id: "pageTest",
        //         viewName: "webapp.typescript.view.Test"
        //     }
        // }) as unknown as Page).getAggregation('content')
        const Page: wdi5Selector = {
            selector: {
                controlType: "sap.m.Page",
                viewName: "webapp.typescript.view.Test",
                i18NText: {
                    propertyName: "title",
                    key: "question"
                }
            }
        }
        const page = await browser.asControl(Page) as unknown as Page;

        await (await browser.asControl({
            selector: {
                controlType: "sap.m.Button",
                viewName: "webapp.typescript.view.Test",
                i18NText: {
                    propertyName: "text",
                    key: "btnSubmit"
                },
            }
        })).press();

        const dialog = await browser.asControl({
            selector: {
                controlType: "sap.m.Title",
                properties: {
                    text: "Information"
                },
                searchOpenDialogs: true,
                interaction: {
                    idSuffix: "inner"
                }
            }
        });

        const text = await dialog.getProperty('text') as Text;
        await browser.asControl({
            selector: {
                controlType: "sap.m.Button",
                properties: {
                    text: "OK"
                },
                searchOpenDialogs: true,
                interaction: {
                    idSuffix: "inner"
                }
            }
        }).press();
        await browser.asControl({
            selector: {
                controlType: "sap.m.Button",
                properties: {
                    text: "OK"
                },
                searchOpenDialogs: true,
                interaction: {
                    idSuffix: "inner"
                }
            }
        }).press();

        const content = page.getAggregation('content') as ManagedObject[]
        const path = content.map((elem) => {
            const table = elem as Table;
            return table.getBindingContext()?.getPath();
        })
        async function a(): Promise<void> {
            await browser.asControl({
                selector: {
                    controlType: "sap.m.RadioButton",
                    viewName: "webapp.typescript.view.Test",
                    properties: {
                        editable: true
                    },
                    ancestor: {
                        controlType: "sap.m.ColumnListItem",
                        viewName: "webapp.typescript.view.Test",
                        bindingPath: {
                            path: "/Data/FrontEnd/subCategory/JavaScript/questions/-N9v2e8IKgTeZwcCGYvq/answers/2"
                        },
                        ancestor: {
                            controlType: "sap.m.Table",
                            viewName: "webapp.typescript.view.Test",
                            bindingPath: {
                                path: "/Data/FrontEnd/subCategory/JavaScript/questions/-N9v2e8IKgTeZwcCGYvq",
                                propertyPath: "answers"
                            }
                        }
                    }
                }
            }).press();
        }
        a().catch((er) => console.log(er))
        // await (a as unknown as WDI5Control | Control).press()
        // void path.forEach(() => a.then((contr: WDI5Control & Control) => contr.press())
        // )

        // expect(text).toEqual("Information");
    });
    // it("should select answers", async () => {
    //  })
    //  await browser.asControl({
    //     selector: {
    //         controlType: "sap.m.Button",
    //         viewName: "webapp.typescript.view.Test",
    //         i18NText: {
    //             propertyName: "text",
    //             key: "btnSubmit"
    //         },
    //     }
    // }).press();
    // const dialog = await browser.asControl({
    //     selector: {
    //         controlType: "sap.m.Title",
    //         properties: {
    //             text: "Information"
    //         },
    //         searchOpenDialogs: true,
    //         interaction: {
    //             idSuffix: "inner"
    //         }
    //     }
    // });
    // const text = await dialog.getProperty('text') as Text;
    // expect(text).toEqual("Information");

});





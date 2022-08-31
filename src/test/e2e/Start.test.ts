/* eslint-disable @typescript-eslint/no-unsafe-call */
import { wdi5 } from "wdio-ui5-service";
import Start from "./pageObjects/Start";
import Template from "./pageObjects/Tempalte";
import Control from 'sap/ui/core/Control';
import Button from "sap/m/Button";
import Page from "sap/m/Page";
import GenericTile from "sap/m/GenericTile"
import Dialog from "sap/m/Dialog";
import Input from "sap/m/Input";

const createTemplate = Template(Start._viewName);

describe("test1: Start page", () => {
    before(async () => {
        await Start.open();
    });

    it("should have the right title", async () => {
        const title = await browser.getTitle();
        expect(title).toEqual("UI5 Application typescript");
    });

    it("should have press avatar and load auth dialog", async () => {
        // open dialog        
        await (browser.asControl({
            selector: {
                id: "avatarBtn",
                viewName: "webapp.typescript.view.Start"
            }
        }) as unknown as Button).press();        

        const dialogEmailInput: Input =  await browser.asControl({
            selector: {
                id: "emailInputId",
                viewName: "webapp.typescript.view.Start",
        }});
        dialogEmailInput.setValue("test@mail.eu")

        const dialogPassInput: Input = await browser.asControl({
            selector: {
                id: "passwordInputId",
                viewName: "webapp.typescript.view.Start"
        }});
        dialogPassInput.setValue("123456")

        await browser.asControl({
            selector: {
                id: "LogInButton",
                viewName: "webapp.typescript.view.Start",
                searchOpenDialogs: true,
                interaction: {
                        idSuffix: "BDI-content"
                }
        }}).press();

        const button: Control = await browser.asControl({
            selector: {
                id: "emailText",
                viewName: "webapp.typescript.view.Start"                
        }});
    });

    it("should have Avatar button with right text", async () => {
        const button: Control = await browser.asControl(createTemplate("emailText"));
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const buttonText: string = await (button as Button).getText();
        expect(buttonText).toEqual("Not auth" || /.+@.+\..+/i);
    });

    it("should have list with at least two items", async () => {
        const Page: Control = await browser.asControl({
            selector: {
                controlType: "sap.m.Page",
                viewName: Start._viewName,
            },
        });
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const pageContent: Control[] = await (Page as Page).getContent();
        expect(pageContent.length).toBeGreaterThanOrEqual(2);
    });

    it("should have press Master Page content", async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await (browser.asControl({
            selector: {
                controlType: "sap.m.GenericTile",
                viewName: "webapp.typescript.view.Master",
                bindingPath: {
                    path: "/Data/FrontEnd",
                    propertyPath: "categoryName"
                }
            }
        }) as unknown as GenericTile).press();
        const Page: Control = await browser.asControl({
            selector: {
                id: "midView--detailPage"
            },
        });
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const pageContent: Control[] = await (Page as Page).getContent();
        expect(pageContent.length).toBeGreaterThanOrEqual(4);
    });

    it("should have press Detail Page content", async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await (browser.asControl({
            selector: {
                controlType: "sap.m.GenericTile",
                viewName: "webapp.typescript.view.Master",
                bindingPath: {
                    path: "/Data/FrontEnd",
                    propertyPath: "categoryName"
                }
            }
        }) as unknown as GenericTile).press();
        
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await (browser.asControl({
            selector: {                
                controlType: "sap.m.GenericTile",
                viewName: "webapp.typescript.view.Detail",
                bindingPath: {
                        path: "/Data/FrontEnd/subCategory/CSS",
                        propertyPath: "name"
                    }
                }
        }) as unknown as GenericTile).press();

        const Page: Control = await browser.asControl({
            selector: {
                id: "endView--detailDetailPage"
            },
        });
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const pageContent: Control[] = await (Page as Page).getContent();
        expect(pageContent.length).toBeGreaterThanOrEqual(2);
    }); 

    it("should have the navigation", async () => {
        await browser.asControl({
            selector: {
                controlType: "sap.m.TileContent",
                viewId: "endView",
                ancestor: {
                        controlType: "sap.m.GenericTile",
                        viewId: "endView",
                        i18NText: {
                                propertyName: "header",
                                key: "manageTest"
                        }
                }
        }}).press();        
        const url = await browser.getUrl();
        expect(url).toMatch(/.*#\/main-Data-FrontEnd-subCategory-CSS$/);
    });
});
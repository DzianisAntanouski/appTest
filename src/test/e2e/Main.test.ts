/* eslint-disable @typescript-eslint/await-thenable */
import { wdi5 } from "wdio-ui5-service";
import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types"
import { expect } from "expect"
import Main from "./pageObjects/Main";
import Template from "./pageObjects/Tempalte";
import Control from 'sap/ui/core/Control';
import Button from "sap/m/Button";
import Page from "sap/m/Page";
import GenericTile from "sap/m/GenericTile"
import Input from "sap/m/Input";
import Icon from "sap/ui/core/Icon";
import Start from "./pageObjects/Start";

const createTemplate = Template(Main._viewName);
const templateStart = Template(Start._viewName)


describe("test1: Start page", () => {
    before(async () => {
        await Main.open();
    });

    it("should have the right title", async () => {
        const title = await browser.getTitle();
        expect(title).toEqual("UI5 Application typescript");
    });

    it("should have control that opens Create page", async () => {        
        const url = await browser.getUrl();
        expect(url).toMatch(/.*#\/main-Data-FrontEnd-subCategory-CSS$/);
    });    

    it("should heave authorization and return to manage page", async () => {
        const avatarButton: wdi5Selector = templateStart("avatarBtn");
        await (browser.asControl(avatarButton) as unknown as Button).firePress();           

        const dialogEmailInput: wdi5Selector = templateStart("emailInputId");
        await (browser.asControl(dialogEmailInput) as unknown as Input).setValue("test@mail.eu");
        
        const dialogPassInput: wdi5Selector = templateStart("passwordInputId");
        await (browser.asControl(dialogPassInput) as unknown as Input).setValue("123456");

        const logInButton: wdi5Selector = templateStart("LogInButton");
        await (browser.asControl(logInButton) as unknown as Button).firePress();         
        
        const url = await browser.getUrl();
        expect(url).toMatch(/.*#$/);
    })

    it("should have edit button press", async () => { 
        // await browser.goTo({ sHash: "#/main-Data-FrontEnd-subCategory-CSS" })

        const masterTile: wdi5Selector = await {
            selector: {
                controlType: "sap.m.GenericTile",
                        viewName: "webapp.typescript.view.Master",
                        bindingPath: {
                                path: "/Data/FrontEnd",
                                propertyPath: "categoryName"
                        }
        }}
        await (browser.asControl(masterTile) as unknown as GenericTile).firePress();

        const detailTile: wdi5Selector = await {
            selector: {
                controlType: "sap.m.GenericTile",
                viewName: "webapp.typescript.view.Detail",
                bindingPath: {
                        path: "/Data/FrontEnd/subCategory/CSS",
                        propertyPath: "name"
                }
        }}
        await (browser.asControl(detailTile) as unknown as GenericTile).firePress();

        const endTile: wdi5Selector = await {
            selector: {
                id: "endView--manageTest"
        }}
        await (browser.asControl(endTile) as unknown as GenericTile).firePress();

        
        const editButton: wdi5Selector = await createTemplate("editButtonMain");
        await (browser.asControl(editButton) as unknown as Button).firePress();           

        const cancelButton = createTemplate("cancelButton");
        const cancelButtonText =  await (browser.asControl(cancelButton) as unknown as Button).getText();
        expect(cancelButtonText).toEqual("Cancel");

    });
});
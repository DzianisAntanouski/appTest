// import MessageBox from "sap/m/MessageBox";
// import BaseController from "src/controller/BaseController";
// import formatter from "src/model/formatter";
// import Event from "sap/ui/base/Event";
// import Control from "sap/ui/core/Control";
// import Context from "sap/ui/model/Context";
// import models from "src/model/models";
// import { MessageType } from "sap/ui/core/library";
// import JSONModel from "sap/ui/model/json/JSONModel";
// import BindingMode from "sap/ui/model/BindingMode";
// import * as Device from "sap/ui/Device";
// import Controller from "sap/ui/core/mvc/Controller";
// import UIComponent from "sap/ui/core/UIComponent";
// import AppComponent from "src/Component";
// import Model from "sap/ui/model/Model";
// import ResourceModel from "sap/ui/model/resource/ResourceModel";
// import ResourceBundle from "sap/base/i18n/ResourceBundle";
// import Router from "sap/ui/core/routing/Router";
// import History from "sap/ui/core/routing/History";

// const allImport = {
//     MessageBox: MessageBox,
//     BaseController: BaseController,
//     formatter: formatter,
//     Event: Event,
//     Control: Control,
//     Context: Context,
//     models: models,
//     MessageType: MessageType,
//     JSONModel: JSONModel,
//     BindingMode: BindingMode,
//     Device: Device,
//     Controller: Controller,
//     UIComponent: UIComponent,
//     AppComponent: AppComponent,
//     Model: Model,
//     ResourceModel: ResourceModel,
//     ResourceBundle: ResourceBundle,
//     Router: Router,
//     History: History
// }

// export default abstract class GetImport {
//     public getO ( s: string ): any {
//         return this.allImport[s]
//     }
// }
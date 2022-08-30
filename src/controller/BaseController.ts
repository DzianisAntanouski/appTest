import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import AppComponent from "../Component";
import Model from "sap/ui/model/Model";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Router from "sap/ui/core/routing/Router";
import History from "sap/ui/core/routing/History";
import JSONModel from "sap/ui/model/json/JSONModel";
import FetchDataBase from "../db/FetchDB";
import { FetchData, ICategory, IQuestion, ISubCategory } from "../interface/Interface";
import Auth from "../db/Auth";
import Fragment from "sap/ui/core/Fragment";
import Dialog from 'sap/m/Dialog';
import Control from "sap/ui/core/Control";
import EventBus from "sap/ui/core/EventBus";
import Context from 'sap/ui/model/Context';

/**
 * @namespace webapp.typescript.controller
 */
export default abstract class BaseController extends Controller {
  oFragment: Promise<void | Dialog | Control | Control[]>
  oAuthorizationDialog: Control | Control[];
  bus: EventBus;
  onPressAddCategory: () => void;
  onPressAvatar: () => void;

  public async tryAuthorization(
    email: string,
    password: string
  ): Promise<void> {
    interface IResponse {
      email: string
      error: {
        message: string
      }
    }
    let response: IResponse = await Auth.fnRegisterNewUser(email, password) as IResponse;
    if (!response?.email) {
      response = await Auth.fnAuthoriseUser(email, password) as IResponse;
      if (!response?.email) {
        alert(response.error.message)
      }
    }
    (this.getModel("supportModel") as JSONModel).setProperty("/auth", response)
    localStorage.setItem("auth", JSON.stringify(response))
  }

  public loadAuthorizationDialog() {
    const oView = this.getView();
    this.oFragment = Fragment.load({
      id: oView?.getId(),
      name: "webapp.typescript.view.fragments.authorizationDialog",
      controller: this,
    }).then((oFragment) => {
      this.oAuthorizationDialog = oFragment;
      oView?.addDependent(oFragment as Dialog);
      (oFragment as Dialog).open();
    });
  }

  public async onLogInButtonPress(): Promise<void>{
    this.bus = this.getOwnerComponent().getEventBus();
    const email: string = this.getModel("supportModel")?.getProperty("/email") as string;
    const password = this.getModel("supportModel")?.getProperty("/password") as string;
    await this.tryAuthorization(email, password);
    (this.oAuthorizationDialog as Dialog).close();

    if (this.onPressAddCategory) {
      this.onPressAddCategory()
    } else {
      try {
        const sPath: string = (this.getView()?.getBindingContext() as Context)?.getPath()
        this.bus.publish("navigation", "navToMain", { sPath, event: false })
    } finally {}
    }

  }

  public onCancelButtonPress(): void{
    (this.oAuthorizationDialog as Dialog).close()
  }

  public onAfterCloseAuthDialog(): void{
    (this.oAuthorizationDialog as Dialog).destroy()
  }

  /**
   * Convenience method for accessing the component of the controller's view.
   * @returns The component of the controller's view
   */
  public getOwnerComponent(): AppComponent {
    return super.getOwnerComponent() as AppComponent;
  }

  /**
   * Convenience method to get the components' router instance.
   * @returns The router instance
   */
  public getRouter(): Router {
    return UIComponent.getRouterFor(this);
  }

  public async fireBaseRead(categoryName = "", subCategory = ""): Promise<void> {
    const qListModel: JSONModel = this.getOwnerComponent().getModel() as JSONModel;
    const fetchData: FetchData = (await FetchDataBase.read(categoryName, subCategory)) as FetchData;

    const modelStructureToBinding: ISubCategory = {};
    void Object.keys(fetchData).forEach((elem: string) => {
      modelStructureToBinding[elem] = {
        categoryName: elem,
        subCategory: fetchData[elem] as unknown as FetchData,
      };
      Object.keys(fetchData[elem]).forEach((el) => {
        modelStructureToBinding[elem]["subCategory"][el].name = el;
      });

      return fetchData[elem];
    });

    qListModel.setProperty("/Data", modelStructureToBinding);
    qListModel.setProperty("/edit", false);
  }
  setAllQuestions(): void {
    const model = this.getModel() as JSONModel;
    const data = (model.getData() as { Data: ICategory }).Data
    const arrayData = Object.values(data);
    arrayData.forEach(((elem: ICategory) => {
      const questionsCategory = Object.values(elem.subCategory).map((el) => el.questions as IQuestion)
      const questionsAll = Object.assign({}, ...questionsCategory) as IQuestion;
      model.setProperty(`/Data/${elem.categoryName}/questionsAll`, { questions: questionsAll })
    }))
  }
  /**
   * Convenience method for getting the i18n resource bundle of the component.
   * @returns The i18n resource bundle of the component
   */
  public getResourceBundle(): ResourceBundle | Promise<ResourceBundle> {
    const oModel = this.getOwnerComponent().getModel("i18n") as ResourceModel;
    return oModel.getResourceBundle();
  }

  /**
   * Convenience method for getting the view model by name in every controller of the application.
   * @param [sName] The model name
   * @returns The model instance
   */
  public getModel(sName?: string): Model | undefined {
    return this.getView()?.getModel(sName);
  }

  /**
   * Convenience method for setting the view model in every controller of the application.
   * @param oModel The model instance
   * @param [sName] The model name
   * @returns The current base controller instance
   */
  public setModel(oModel: Model, sName?: string): BaseController {
    this.getView()?.setModel(oModel, sName);
    return this;
  }

  /**
   * Convenience method for triggering the navigation to a specific target.
   * @public
   * @param sName Target name
   * @param [oParameters] Navigation parameters
   * @param [bReplace] Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
   */
  public navTo(sName: string, oParameters?: object, bReplace?: boolean): void {
    this.getRouter().navTo(sName, oParameters, undefined, bReplace);
  }

  /**
   * Convenience event handler for navigating back.
   * It there is a history entry we go one step back in the browser history
   * If not, it will replace the current entry of the browser history with the main route.
   */
  public onNavBack(): void {
    const sPreviousHash = History.getInstance().getPreviousHash();
    if (sPreviousHash !== undefined) {
      window.history.go(-1);
    } else {
      this.getRouter().navTo("start", {}, undefined, true);
    }
  }
}

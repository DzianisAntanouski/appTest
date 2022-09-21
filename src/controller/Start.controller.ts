/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import BaseController from "./BaseController";
import { LayoutType as LayoutType } from "sap/f/library";
import EventBus from "sap/ui/core/EventBus";
import XMLView from "sap/ui/core/mvc/XMLView";
import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Context from "sap/ui/model/Context";
import { IAuthObject, IData, IDocs, IEvent, IOption, IParent, ISnapshot } from "../interface/Interface";
import Fragment from "sap/ui/core/Fragment";
import Popover from "sap/m/Popover";
import CRUDModel from "../model/CRUDModel";
import Component from "../Component";
import Button from "sap/m/Button";
import JSONModel from "sap/ui/model/json/JSONModel";
import StandardListItem from "sap/m/StandardListItem";
import NavContainer from "sap/m/NavContainer";
import Page from "sap/m/Page";
import List from "sap/m/List";
import Input from "sap/m/Input";

/**
 * @namespace webapp.typescript.controller
 */
export default class Start extends BaseController {
  oFlexibleColumnLayout: FlexibleColumnLayout;
  oEventBus: EventBus;
  mViews: Promise<XMLView> | undefined;
  oDiscardFragment: Popover;
  private _pPopover: any;

  public onInit(): void {
    this.oEventBus = (this.getOwnerComponent() as Component).getEventBus();
    this.oEventBus.subscribe("flexible", "setDetailPage", this.setDetailPage.bind(this), this);
    this.oEventBus.subscribe("flexible", "setDetailDetailPage", this.setDetailDetailPage.bind(this), this);
    this.oEventBus.subscribe("navigation", "navToMain", this.navToMain.bind(this), this);
    this.oEventBus.subscribe("navigation", "navToTesting", this.navToTesting.bind(this), this);

    this.oFlexibleColumnLayout = this.byId("fcl") as FlexibleColumnLayout;

    const oUsers = {
      users: [],
    };
    const userModel = new JSONModel(oUsers);
    this.getView()?.setModel(userModel, "userModel");

    const oChats = {
      chats: [],
    };
    const chatModel = new JSONModel(oChats);
    this.getView()?.setModel(chatModel, "chatModel");
  }
  
  public onExit(): void {
    this.oEventBus.unsubscribe("flexible", "setDetailPage", this.setDetailPage.bind(this), this);
    this.oEventBus.unsubscribe("flexible", "setDetailDetailPage", this.setDetailDetailPage.bind(this), this);
    this.oEventBus.unsubscribe("navigation", "navToMain", this.navToMain.bind(this), this);
    this.oEventBus.unsubscribe("navigation", "navToTesting", this.navToTesting.bind(this), this);
  }

  public setDetailPage(a: string, b: string, oEvent: Event): void {
    const oContext: Context | null = Object.values(oEvent).length ? ((oEvent.getSource() as Control).getBindingContext() as Context) : null;
    void this.loadView({
      id: "midView",
      viewName: "webapp.typescript.view.Detail",
    })
      .then((oDetailView) => {
        this.oFlexibleColumnLayout.addMidColumnPage(oDetailView);
        this.oFlexibleColumnLayout.setLayout(LayoutType.TwoColumnsBeginExpanded);
        return oDetailView;
      })
      .then((oDetailView) => {
        if (oContext) oDetailView.setBindingContext(oContext);
      });
  }

  public setDetailDetailPage(a: string, b: string, oEvent: Event) {
    const sPath = ((oEvent.getSource() as Control).getBindingContext() as Context).getPath().replace("Data", "Posts").replace("/subCategory", "");
    const oContext: Context = (this.getModel() as CRUDModel).createBindingContext(sPath) as Context;
    void this.loadView({
      id: "endView",
      viewName: "webapp.typescript.view.DetailDetail",
    })
      .then((oDetailDetailView) => {
        this.oFlexibleColumnLayout.addEndColumnPage(oDetailDetailView);
        this.oFlexibleColumnLayout.setLayout(LayoutType.ThreeColumnsMidExpanded);
        return oDetailDetailView;
      })
      .then((oDetailDetailView) => {
        oDetailDetailView.setBindingContext(oContext);
      });
  }

  public loadView(options: IOption): Promise<XMLView> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment
    const mViews: Promise<XMLView> | any = (this.mViews = this.mViews || Object.create(null));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!mViews[options.id]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      mViews[options.id] = (this.getOwnerComponent() as Component).runAsOwner(() => {
        return XMLView.create(options);
      }) as Promise<XMLView>;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return mViews[options.id] as unknown as Promise<XMLView>;
  }

  public navToMain(a: string, b: string, oEvent: Event | object): void {
    const sPath: string = (oEvent as IEvent)?.sPath
      ? (oEvent as IEvent).sPath
      : (((oEvent as Event).getSource() as Control).getBindingContext() as Context)?.getPath();
    this.navTo("main", { sPath: sPath.replace(/\//g, "-") }, true);
  }

  public navToTesting(a: string, b: string, oEvent: Event): void {
    const sPath: string = ((oEvent.getSource() as Control).getBindingContext() as Context).getPath();
    this.navTo("test", { sPath: sPath.replace(/\//g, "-") }, true);
  }

  public onPressAvatar(oEvent: Event) {
    if (!this.getSupportModel().getProperty("/auth")) this.loadAuthorizationDialog(oEvent.getSource() as Control);
    else {
      const oButton = oEvent.getSource();
      const oView = this.getView();
      this.oFragment = Fragment.load({
        id: oView?.getId(),
        name: "webapp.typescript.view.fragments.LogOutPopover",
        controller: this,
      }).then((oPopover) => {
        this.oDiscardFragment = oPopover as Popover;
        oView?.addDependent(oPopover as Popover);
        (oPopover as Popover).openBy(oButton, false);
      });
    }
  }

  public handleDiscardPopover() {
    const sEmail = (JSON.parse(localStorage.getItem("auth") as string) as IAuthObject).email;
    void (this.getView()?.getModel() as CRUDModel).saveUser(sEmail, "");
    localStorage.clear();
    this.setOffLineUser();
    this.getSupportModel().setProperty("/auth", null);
    this.oDiscardFragment.close();
  }

  public onAfterPopoverClose(oEvent: Event) {
    this.findPopover(oEvent.getSource() as IParent);
  }

  public findPopover(oControl: IParent): void {
    oControl.getMetadata().getElementName() !== "sap.m.Popover"
      ? this.findPopover(oControl.oParent as IParent)
      : (oControl as unknown as Popover).destroy();
  }

  // user status logic
  public getRealTimeUsers(collRefUsers: any) {
    collRefUsers.onSnapshot((snapshot: ISnapshot) => {
      const userModel = this.getModel("userModel") as JSONModel;
      const userData = userModel.getData();

      snapshot.docChanges().forEach((change) => {
        const oUser = change.doc.data();
        oUser.id = change.doc.id;

        if (change.type === "added") {
          userData.users.push(oUser);
        } else if (change.type === "modified") {
          const index = userData.users.map((user: { [key: string]: any }) => user.id as string).indexOf(oUser.id);
          userData.users[index] = oUser;
        } else if (change.type === "removed") {
          const index = userData.users.map((user: { id: string }) => user.id).indexOf(oUser.id);
          userData.users.splice(index, 1);
        }
      });

      this.getView()?.getModel("userModel").refresh(true);
      (this.byId("list") as List).getBinding("items").refresh();
    });
  }

  public getRealTimeChats(collRefChats: any) {
    collRefChats.onSnapshot((snapshot: ISnapshot) => {
      const chatModel = this.getModel("chatModel") as JSONModel;
      const chatData = chatModel.getData();

      snapshot.docChanges().forEach((change) => {
        const oChat = change.doc.data();
        oChat.id = change.doc.id;
        if (change.type === "added") {
          chatData.chats.push(oChat);
        } else if (change.type === "modified") {
          const index = chatData.chats.map((chat: { [key: string]: any }) => chat.id as string).indexOf(oChat.id);
          chatData.chats[index] = oChat;
        } else if (change.type === "removed") {
          const index = chatData.chats.map((chat: { id: string }) => chat.id).indexOf(oChat.id);
          chatData.chats.splice(index, 1);
        }
      });

      this.getView()?.getModel("chatModel").refresh(true);
      (this.byId("chatList") as List).getBinding("items").refresh();
    });
  }

  public onOpenPopover(oEvent: Event) {
    const oButton = oEvent.getSource() as Button;
    // create popover
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!this._pPopover) {
      this._pPopover = Fragment.load({
        id: this.getView()?.getId(),
        name: "webapp.typescript.view.fragments.Popover",
        controller: this,
      })
        .then((oPopover) => {
          this.getView()?.addDependent(oPopover as Popover);
          return oPopover;
        })
        .then((oPopover) => {
          const firebaseModel = (this.getOwnerComponent() as Component).getModel("firebase") as JSONModel;
          const firestore = firebaseModel.getData().firestore;
          const collRefUsers = firestore.collection("userStatus") as { get: () => Promise<{ docs: { data: () => [] }[] }> };
          this.getRealTimeUsers(collRefUsers);
          return oPopover;
        });
    }
    void this._pPopover.then((oPopover: Popover) => {
      oPopover.openBy(oButton, true);
    });
  }

  public onUpdateFinished(oEvent: Event) {
    if ((oEvent.getSource() as List).getItems().length) {
      (oEvent.getSource() as List).getItems().forEach((elem) => {
        (elem as StandardListItem).getTitle() == this.getSupportModel().getProperty("/auth").email ? elem.setVisible(false) : null;
      });
    }
  }

  public async onNavToChat(oEvent: Event) {
    const sChatId = [this.getSupportModel().getProperty("/auth").email, (oEvent.getSource() as StandardListItem).getTitle()].sort().join("&");
    const firebaseModel = (this.getOwnerComponent() as Component).getModel("firebase") as JSONModel;
    const firestore = firebaseModel.getData().firestore;

    const collRefChats = firestore.collection("Chats") as { get: () => Promise<{ docs: IDocs[] }> };
    this.getRealTimeChats(collRefChats);

    const oChatData: IData[] = await firestore
      .collection("Chats")
      .get()
      .then((data: { docs: IDocs[] }) => {
        return data.docs.map((elem) => {
          return {
            messages: elem.data().messages,
            id: elem.id,
          };
        });
      });
    const nIndex: number = oChatData.findIndex((elem: { id: string }) => elem.id === sChatId);

    const oContext: Context =
      nIndex === -1
        ? await firestore
            .collection("Chats")
            .doc(sChatId)
            .set({ messages: [] })
            .then(() => (this.getModel("chatModel") as JSONModel).createBindingContext(`/chats/${oChatData.length}/messages`) as Context)
        : ((this.getModel("chatModel") as JSONModel).createBindingContext(`/chats/${nIndex}/messages`) as Context);

    const oNavCon = this.byId("navCon") as NavContainer;
    const oDetailPage = this.byId("detail") as Page;
    oNavCon.to(oDetailPage);
    (this.byId("chatList") as List).setBindingContext(oContext, "chatModel");
    // oDetailPage.
    (this.byId("myPopover") as Popover).focus();
  }

  public onNavBackToUser() {
    const oNavCon = this.byId("navCon") as NavContainer;
    oNavCon.back();
    (this.byId("myPopover") as Popover).focus();
  }

  public onPost() {
    const sText = (this.byId("posttext") as Input).getValue();
    void (this.byId("posttext") as Input).setValue("");
    const sAuthor = this.getSupportModel().getProperty("/auth").email as string;
    const sPath = ((this.byId("chatList") as List).getBindingContext("chatModel") as Context).getPath().replace("/messages", "");
    const sChatId = (this.getModel("chatModel") as JSONModel).getProperty(sPath).id as string;
    const firebaseModel = (this.getOwnerComponent() as Component).getModel("firebase") as JSONModel;
    const firestore = firebaseModel.getData().firestore;
    const collRefChats = (
      firestore.collection("Chats") as { get: () => Promise<{ docs: IDocs[] }>; doc: (chatId: string) => { update: (messages: any) => void } }
    ).doc(sChatId);
    const aMessages: { text: string; author: string; date: Date }[] = (this.getModel("chatModel") as JSONModel).getProperty(sPath).messages;
    aMessages.push({
      text: sText,
      author: sAuthor,
      date: new Date(),
    });
    collRefChats.update({ messages: aMessages });
  }

  public async chatListFinishedUpdate(oEvent: Event) {
    if ((oEvent.getSource() as List).getItems().length) {
      const nIndex = (oEvent.getSource() as List).getItems().length - 1;
      await (oEvent.getSource() as List).scrollToIndex(nIndex);
      setTimeout(() => {
        (this.byId("posttext") as Input).focus()
      }, 750);
      
    }
  }

  /* public scrollChat () {
    const nIndex = (this.byId('chatList') as List).getItems()
    (this.byId('chatList') as List).scrollToIndex(nIndex)
  } */
}

/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import Page from "sap/m/Page";
import Button from "sap/m/Button";
import Event from "sap/ui/base/Event";
import Fragment from "sap/ui/core/Fragment";
import List from "sap/m/List";
import { IData, IDocs, ISnapshot } from "../interface/Interface";
import NavContainer from "sap/m/NavContainer";
import Popover from "sap/m/Popover";
import Context from "sap/ui/model/Context";
import Control from 'sap/ui/core/Control';
import FeedInput from "sap/m/FeedInput";
import StandardListItem from "sap/m/StandardListItem";
import Component from '../Component';

/**
 * @namespace webapp.typescript.controller
 */
export default class App extends BaseController {
  oData: Promise<{ [key: string]: object }[]>;
  _pPopover: Promise<Popover | Control[] | Control>;

  public onInit(): void {
    const firebaseModel = (this.getOwnerComponent() as Component).getModel("firebase") as JSONModel;
    const firestore = firebaseModel.getData().firestore;

    const oMessages = {
      messages: [],
    };
    const messageModel = new JSONModel(oMessages);
    this.getView()?.setModel(messageModel);    
    const collRefMessages = firestore.collection("Messages") as { get: () => Promise<{ docs: { data: () => [] }[] }> };
    this.getRealTimeMessages(collRefMessages);

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
    // const collRefUsers = firestore.collection("userStatus") as { get: () => Promise<{ docs: { data: () => [] }[] }> };
    // this.getRealTimeUsers(collRefUsers);
  }

  // dynamic load collection on we have a some changes
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

  // static load collection --->
  /* public getMessages(collRefMessages: { get: () => Promise<{ docs: { data: () => [] }[] }> }) {
    void collRefMessages.get().then((resp: { docs: { data: () => [] }[] }) => {
      const messageModel = this.getView()?.getModel() as JSONModel;
      const messageModelData = messageModel.getData();
      const messages = resp.docs.map((el) => el.data());
      messageModelData.messages = messages;
    });
  } */

  // dynamic load collection on we have a some changes
  public getRealTimeMessages(collRefMessages: any) {
    collRefMessages.onSnapshot((snapshot: ISnapshot) => {
      const messModel = this.getModel() as JSONModel;
      const messData = messModel.getData();

      snapshot.docChanges().forEach((change) => {
        const oMessage = change.doc.data();
        oMessage.id = change.doc.id;

        if (change.type === "added") {
          messData.messages.push(oMessage);
        } else if (change.type === "modified") {
          const index = messData.messages.map((message: { id: string }) => message.id).indexOf(oMessage.id);
          messData.messages[index] = oMessage;
        } else if (change.type === "removed") {
          const index = messData.messages.map((message: { id: string }) => message.id).indexOf(oMessage.id);
          messData.messages.splice(index, 1);
        }
      });

      this.getView()?.getModel().refresh(true);
      (this.byId("mPage") as Page).getBinding("content").refresh();
    });
  }

  // training function
  /* public onPressPost() {
    const firebaseModel = this.getOwnerComponent().getModel("firebase") as JSONModel;
    const firestore = firebaseModel.getData().firestore;
    const oChat = firestore.collection("Chats").doc();
    debugger;
    const collRefChats = (firestore.collection("Chats") as { get: () => Promise<{ docs: { data: () => [] }[] }> }).doc(
      "anya@gmail.com&team@leverx.by"
    );
    // Add a new document in collection "cities"
    const objectToPush = {
      messages: [
        {
          author: "anya@gmail.com",
          text: "Hello try test",
          date: new Date(),
        },
        {
          author: "team@leverx.by",
          text: "Hi",
          date: new Date(),
        },
      ],
    };
    const sCompairEmail = "anya@gmail.com&test@maildd.ru"
    
    firestore
      .collection("Chats")
      .get()
      .then((data) => {
        let bResult = false
        data.docs.forEach((el) => {            
            if (el.id === sCompairEmail) {
                bResult = true
            }
          })
          return bResult
      })
      .then(resp => {
        if (resp) {                    
            collRefChats.update(objectToPush);
        } else {
            firestore.collection("Chats").doc(sCompairEmail).set(objectToPush)
        }
      });

    // collRefMessages.doc('mQEKS7y32MG2BNyd8Jx9').set(objectToPush).then(elem => {console.log(elem)}) // pots with custom id
    // collRefMessages.doc('mQEKS7y32MG2BNyd8Jx9').update(objectToPush).then(elem => {console.log(elem)}) // update if id now
    // collRefMessages.add(objectToPush).then(elem => {console.log(elem)}) // post
    // collRefMessages.doc('mQEKS7y32MG2BNyd8Jx9').delete() //remove
  } */

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
    void this._pPopover.then((oPopover) => {
      (oPopover as Popover).openBy(oButton, true);
    });
  }

  public async onNavToChat(oEvent: Event) {
    debugger
    const sChatId = [this.getSupportModel().getProperty("/auth").email, (oEvent.getSource() as StandardListItem).getTitle()].sort().join("&")
    const firebaseModel = (this.getOwnerComponent() as Component).getModel("firebase") as JSONModel;
    const firestore = firebaseModel.getData().firestore;
    
    const collRefChats = firestore.collection("Chats") as { get: () => Promise<{ docs: IDocs[] }> };
    this.getRealTimeChats(collRefChats);
    
    const oChatData: IData[] = await firestore.collection("Chats").get().then((data: { docs: IDocs[] }) => {
        return data.docs.map((elem) => {
            return {
                messages: elem.data().messages ,
                id: elem.id
            }
        })
    })
    const nIndex: number = oChatData.findIndex((elem: {id: string}) => elem.id === sChatId)
    
    const oContext: Context = nIndex === -1 
        ? await firestore.collection("Chats").doc(sChatId).set({messages: []}).then(() => (this.getModel('chatModel') as JSONModel).createBindingContext(`/chats/${oChatData.length}/messages`) as Context) 
        : (this.getModel('chatModel') as JSONModel).createBindingContext(`/chats/${nIndex}/messages`) as Context
    
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

  public onPost(oEvent: Event) {
    const sText = (oEvent.getSource() as FeedInput).getValue()
    const sAuthor = this.getSupportModel().getProperty("/auth").email as string
    const sPath = ((this.byId('chatList') as List).getBindingContext('chatModel') as Context).getPath().replace("/messages", "");
    const sChatId = (this.getModel("chatModel") as JSONModel).getProperty(sPath).id as string;
    const firebaseModel = (this.getOwnerComponent() as Component).getModel("firebase") as JSONModel;
    const firestore = firebaseModel.getData().firestore;
    const collRefChats = (firestore.collection("Chats") as { get: () => Promise<{ docs: IDocs[] }>, doc: (chatId: string) => {update: (messages: any) => void} }).doc(sChatId);
    const aMessages: {text: string, author: string, date: Date}[] = (this.getModel("chatModel") as JSONModel).getProperty(sPath).messages
    aMessages.push({
        text: sText,
        author: sAuthor,
        date: new Date()
    })
    collRefChats.update({ messages: aMessages })    
  }
}

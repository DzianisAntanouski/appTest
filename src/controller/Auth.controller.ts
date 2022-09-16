/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import Page from "sap/m/Page";
import Button from "sap/m/Button";
import Event from "sap/ui/base/Event";
import Dialog from "sap/m/Dialog";
import Fragment from "sap/ui/core/Fragment";
import List from "sap/m/List";
// import { doc, setDoc } from "../firestore";

/**
 * @namespace webapp.typescript.controller
 */
export default class App extends BaseController {
  oData: Promise<{ [key: string]: object }[]>;
  _pPopover: Promise<Dialog>;

  public onInit(): void {
    const oMessages = {
      messages: [],
    };
    
    const messageModel = new JSONModel(oMessages);
    this.getView()?.setModel(messageModel);
    const firebaseModel = this.getOwnerComponent().getModel("firebase") as JSONModel;

    const firestore = firebaseModel.getData().firestore;
    const collRefMessages = firestore.collection("Messages") as { get: () => Promise<{ docs: { data: () => [] }[] }> };
    this.getRealTimeMessages(collRefMessages);

    const oUsers = {
        users: []
    }
    const userModel = new JSONModel(oUsers)
    this.getView()?.setModel(userModel, "userModel");
    // const collRefUsers = firestore.collection("userStatus") as { get: () => Promise<{ docs: { data: () => [] }[] }> };
    // this.getRealTimeUsers(collRefUsers);

  }

  // dynamic load collection on we have a some changes
  public getRealTimeUsers(collRefUsers: any) {    
    collRefUsers.onSnapshot((snapshot) => {
        const userModel = this.getModel("userModel") as JSONModel;
        const userData = userModel.getData();

      snapshot.docChanges().forEach((change) => {
        
        const oUser = change.doc.data();
        oUser.id = change.doc.id;

        if (change.type === "added") {
          userData.users.push(oUser);
        } else if (change.type === "modified") {
          const index = userData.users.map((user) => user.id).indexOf(oUser.id);
          userData.users[index] = oUser;
        } else if (change.type === "removed") {
          const index = userData.users.map((user) => user.id).indexOf(oUser.id);
          userData.users.splice(index, 1);
        }
      });

      this.getView()?.getModel("userModel").refresh(true);
      (this.byId("list") as List).getBinding("items").refresh();
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
    collRefMessages.onSnapshot((snapshot) => {
      const messModel = this.getModel() as JSONModel;
      const messData = messModel.getData();

      snapshot.docChanges().forEach((change) => {        
        const oMessage = change.doc.data();
        oMessage.id = change.doc.id;

        if (change.type === "added") {
          messData.messages.push(oMessage);
        } else if (change.type === "modified") {
          const index = messData.messages.map((message) => message.id).indexOf(oMessage.id);
          messData.messages[index] = oMessage;
        } else if (change.type === "removed") {
          const index = messData.messages.map((message) => message.id).indexOf(oMessage.id);
          messData.messages.splice(index, 1);
        }
      });

      this.getView()?.getModel().refresh(true);
      (this.byId("mPage") as Page).getBinding("content").refresh();
    });
  }

  public onPressPost() {
    const firebaseModel = this.getOwnerComponent().getModel("firebase") as JSONModel;
    const firestore = firebaseModel.getData().firestore;
    const collRefMessages = firestore.collection("Messages") as { get: () => Promise<{ docs: { data: () => [] }[] }> };
    // Add a new document in collection "cities"
    const objectToPush = {
      email: {
        mess: {
          author: "denis@mail.by",
          date: new Date(),
          text: "change try 2",
        },
      },
    };
    // collRefMessages.doc('mQEKS7y32MG2BNyd8Jx9').set(objectToPush).then(elem => {console.log(elem)}) // patch
    // collRefMessages.add(objectToPush).then(elem => {console.log(elem)}) // post
    // collRefMessages.doc('mQEKS7y32MG2BNyd8Jx9').delete() //remove
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
      }).then((oPopover) => {
        this.getView()?.addDependent(oPopover);
        return oPopover;
      }).then(oPopover => {
        const firebaseModel = this.getOwnerComponent().getModel("firebase") as JSONModel;
        const firestore = firebaseModel.getData().firestore;
        
        const collRefUsers = firestore.collection("userStatus") as { get: () => Promise<{ docs: { data: () => [] }[] }> };
        this.getRealTimeUsers(collRefUsers);
        // const collRefUsers = firestore.collection("userStatus") as { get: () => Promise<{ docs: { data: () => [] }[] }> };
        // this.getRealTimeUsers(collRefUsers);
        return oPopover
      });
    }

    void this._pPopover.then((oPopover) => {
      oPopover.openBy(oButton);
    });    
  } 
  
  public onPressShowOffLine(oEvent: Event) {
    debugger
  }
}

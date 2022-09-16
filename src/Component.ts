import UIComponent from "sap/ui/core/UIComponent";
import { support } from "sap/ui/Device";
import JSONModel from "sap/ui/model/json/JSONModel";
// import models2 from "./model/models";
// import models from "sap/firebase/SAP-Firebase-Connect/model/models";
import Firebase from './Firebase';
import { IAuthObject } from "./interface/Interface";

/**
 * @namespace webapp.typescript
 */
export default class Component extends UIComponent {
  public static metadata = {
    manifest: "json",
  };

  private contentDensityClass: string;

  public init(): void {
    // call the base component's init function
    super.init();

    // this.setModel(models2.createDeviceModel(), "device");

    // create the views based on the url/hash
    this.getRouter().initialize();
    const fbModel = new Firebase().initializeFirebase()
    // Import Firebase in the sap.ui.define
			// set the firebase model by calling the initializeFirebase function in the Firebase.js file
		this.setModel(fbModel, "firebase")
  }

  /**
   * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
   * design mode class should be set, which influences the size appearance of some controls.
   *
   * @public
   * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
   */
  public getContentDensityClass(): string {
    if (this.contentDensityClass === undefined) {
      // check whether FLP has already set the content density class; do nothing in this case
      if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
        this.contentDensityClass = "";
      } else if (!support.touch) {
        // apply "compact" mode if touch is not supported
        this.contentDensityClass = "sapUiSizeCompact";
      } else {
        // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
        this.contentDensityClass = "sapUiSizeCozy";
      }
    }
    return this.contentDensityClass;
  }
  
  public onWindowBeforeUnload(): void {
    const firebaseModel = this.getModel("firebase") as JSONModel;
    const userCollection = firebaseModel.getData().firestore.collection("userStatus");
    if (this.getModel('supportModel').getProperty('/auth')) {
      userCollection.doc(`${(this.getModel('supportModel').getProperty("/auth") as IAuthObject).email}`).set({
        email: `${(this.getModel('supportModel').getProperty("/auth") as IAuthObject).email}`,
        online: false 
      });
    }
  }
}

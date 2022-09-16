/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import JSONModel from "sap/ui/model/json/JSONModel";

export default class Firebase extends JSONModel {
	
	// Your web app's Firebase configuration
    private getConfig () {		
		const firebaseConfig = {
			apiKey: "AIzaSyC-14jeZmSOdG1HPzl5bdZ_aLBBFVEg_-8",
			authDomain: "apptest-firebase-b0b0c.firebaseapp.com",
			databaseURL: "https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "apptest-firebase-b0b0c",
			storageBucket: "apptest-firebase-b0b0c.appspot.com",
			messagingSenderId: "277814075409",
			appId: "1:277814075409:web:c7fb5eba21a8a7f6aa91b0"
		}
		return firebaseConfig
	}
	
	public initializeFirebase() {
		// Initialize Firebase with the Firebase-config
		firebase.initializeApp(this.getConfig());
		
		// Create a Firestore reference
		const firestore = firebase.firestore();
		
		// Firebase services object
		const oFirebase = {
			firestore: firestore
		};
		
		// Create a Firebase model out of the oFirebase service object which contains all required Firebase services
		const fbModel = new JSONModel(oFirebase) ;
		
		// Return the Firebase Model
		return fbModel;
	}
	
}
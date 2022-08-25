import HBox from "sap/m/HBox";
import InputListItem from "sap/m/InputListItem";
import NavContainer from "sap/m/NavContainer";
import SplitContainer from "sap/m/SplitContainer";
import Control from "sap/ui/core/Control";

// -------------MainController--------------------------
export interface IData {
  [key: string]: string | [] | object;
  questions: object;
}

export interface IArguments {
  sPath: string
}
export interface ITest extends SplitContainer {
  _oMasterNav: NavContainer;
}
export interface IResult extends IData {
  id: string;
  body: IData;
}
export interface IListItem extends Control {
  oParent: IHBox;
}
export interface IHBox extends HBox {
  oParent: InputListItem;
}

// -------------BaseController-------------------------
export interface FetchData {
  [key: string]: {
    name: string;
    id: string;
  };
}

export interface ICategory {
  categoryName: string;
  subCategory: FetchData;
}

export interface ISubCategory {
  [key: string]: ICategory;
}
// -------------models-------------------------
export interface IQuestion {
  question: string;
  answers: string[];
  rightAnswer: number[];
}

// -------------StartController-------------------------
export interface IOption {
  id: string;
  viewName: string;
}

// -------------StartController------------------------
export interface IToken {
  idToken: string
}  

// -------------AuthController------------------------
export interface IError {
  error: {
    message: string
  }
}

export interface IFulfilled {
  email: string
}
import HBox from "sap/m/HBox";
import InputListItem from "sap/m/InputListItem";
import NavContainer from "sap/m/NavContainer";
import SplitContainer from "sap/m/SplitContainer";
import Control from "sap/ui/core/Control";

export interface ITemplate {
  selector: {
    id: string;
    viewName: string;
  };
}

export interface IPost {
  author: string
  text: string
  date: string
}

export interface ITestResults {
  [key: string]: {
    category: string;
    email: string;
    points: string;
    subcategory: string;
  };
}
// -------------AppController--------------------------

export interface IAuthObject {
  email: string;
  idToken: string;
}
// -------------MainController--------------------------
export interface IData {
  [key: string]: string | [] | object;
  questions: object;
}

export interface IArguments {
  sPath: string;
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

export interface IParent extends Control {
  oParent: Control;
}

export interface IQuestionStructure {
  name: string;
  questions: {
    [key: string]: IQuestion;
  };
}
// -------------BaseController-------------------------
export interface FetchData {
  [key: string]: {
    questions?: IQuestion;
    name: string;
    id: string;
  };
}

export interface IResponse {
  email: string;
  error: {
    message: string;
  };
  idToken: string;
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
export interface IEvent {
  event: boolean;
  sPath: string;
}

// -------------StartController------------------------
export interface IToken {
  idToken: string;
}

// -------------DetailDetailController------------------------
export interface IOwner {
  createdBy: {
    [key: string]: string;
  };
}

// -------------TestController------------------------
export interface IResultQuestion {
  rightAnswersWord: string[][];
  clientAnswersWord: { word: string; isTrueAnswers: boolean }[];
  questionWord: string;
  points: number;
}

export interface IResults {
  email: string;
  category: string;
  subcategory: string;
  points: number;
}

// -------------AuthController------------------------
export interface IError {
  error: {
    message: string;
  };
}

export interface IFulfilled {
  email: string;
}

// firebase
export interface ISnapshot {
  docChanges: () => {doc: {data: () => {id: string}, id: string}, type: string}[]
}

export interface IDocs {
  data: () => {
    messages?: {text: string, author: string, date: Date}[]
    email?: string
  }, 
  id: string
}

export interface IData {
  messages: {
      text: string;
      author: string;
      date: Date;
  }[], id: string
}
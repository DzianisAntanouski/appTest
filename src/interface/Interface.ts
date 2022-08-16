// -------------MainController--------------------------
export interface IData {
    [key: string]: string | [] | object
    questions: object
}
export interface IResult extends IData {
    id: string
    body: IData
}

// -------------BaseController-------------------------
export interface FetchData {
    [key: string]: { id: string };
  }

// -------------models-------------------------
export interface IQuestion {
    question: string;
    answers: string[];
    rightAnswer: number[];
}



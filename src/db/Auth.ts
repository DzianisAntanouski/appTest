import { IError, IFulfilled, IToken } from "../interface/Interface";

export default class Auth {

  static async  fnAuthoriseUser(
    email: string,
    password: string
  ): Promise<any> {
    const apiKey = `AIzaSyC-14jeZmSOdG1HPzl5bdZ_aLBBFVEg_-8`;
    return await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json() as Promise<any>);
    // .then(sToken => (sToken as unknown as IToken).idToken)
  }
  
  static async  fnRegisterNewUser(
    email: string,
    password: string
  ): Promise<any> {
    const apiKey = `AIzaSyC-14jeZmSOdG1HPzl5bdZ_aLBBFVEg_-8`;
    return await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json() as Promise<any>);
    // .then(sToken => (sToken as unknown as IToken)?.idToken)
  }
  
  static async  fnPassUserAsAnonymous(): Promise<string> {
    const apiKey = `AIzaSyC-14jeZmSOdG1HPzl5bdZ_aLBBFVEg_-8`;
    return await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: "POST",
        body: JSON.stringify({
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json() as Promise<string>);
    // .then(sToken => (sToken as unknown as IToken)?.idToken)
  }

}



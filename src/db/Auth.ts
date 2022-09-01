export default class Auth {
  static async fnAuthoriseUser(email: string, password: string): Promise<object> {
    const apiKey = `AIzaSyC-14jeZmSOdG1HPzl5bdZ_aLBBFVEg_-8`;
    return await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json() as Promise<object>);
  }

  static async fnRegisterNewUser(email: string, password: string): Promise<object> {
    const apiKey = `AIzaSyC-14jeZmSOdG1HPzl5bdZ_aLBBFVEg_-8`;
    return await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json() as Promise<object>);
  }

  static async fnPassUserAsAnonymous(): Promise<object> {
    const apiKey = `AIzaSyC-14jeZmSOdG1HPzl5bdZ_aLBBFVEg_-8`;
    return await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
      method: "POST",
      body: JSON.stringify({
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json() as Promise<object>);
  }
}

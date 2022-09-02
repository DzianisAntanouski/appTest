import { IResults } from "../interface/Interface";
export default class FetchDataBase {
  static async create(question: object, categoryName = "", subCategory = "", questions = "/questions") {
    return (await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data${categoryName}${subCategory}${questions}.json`,
      {
        method: "POST",
        body: JSON.stringify(question),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => response as object)) as Response;
  }

  static async read(categoryName = "", subCategory = "", questions = "") {
    return await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data${categoryName}${subCategory}${questions}.json`,
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((res) => res as object);
  }

  static async delete(id: string, categoryName = "", subCategory = "", questions = "/questions") {
    return await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data${categoryName}${subCategory}${questions}/${id}.json`,
      { method: "DELETE" }
    );
  }

  static async deleteCategory(categoryName: string, subCategory: string) {
    return await fetch(`https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data/${categoryName}/${subCategory}/.json`, {
      method: "DELETE",
    });
  }

  static async patch(id: string, question: object, categoryName = "", subCategory = "", questions = "/questions") {
    return await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data${categoryName}${subCategory}${questions}/${id}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(question),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  
  static async createCategory(email: string, categoryName = "", subCategory = "") {
    return (await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data${categoryName}${subCategory}/createdBy.json`,
      {
        method: "POST",
        body: JSON.stringify(email),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => response as Promise<object>)) as Response;
  }

  static async saveUser(email: string, idToken: string) {
    return await fetch(`https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/userAuth/${email.replace(".", "+")}.json`, {
      method: "PATCH",
      body: JSON.stringify({
        idToken,
        email,
      }),
    });
  }

  static async checkUserToken(email: string) {
    return await fetch(`https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/userAuth/${email.replace(".", "+")}.json`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => res as object);
  }

  static async postResults(results: IResults, date: string, categoryName = "", subCategory = "") {
    return (await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/results/${categoryName}/${subCategory}/${date}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(results),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => response as Promise<object>)) as Response;
  }

  static async postAllResults(results: IResults, data: string) {
    return (await fetch(`https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/allResults/${data}.json`, {
      method: "PATCH",
      body: JSON.stringify(results),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => response as Promise<object>)) as Response;
  }

  static async getResults(categoryName = "", subCategory = "", email = "") {
    return await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/results${categoryName}${subCategory}${email}.json`,
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((res) => res as object);
  }

  static async getAllResults() {
    return await fetch(`https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/allResults.json`, { method: "GET" })
      .then((res) => res.json())
      .then((res) => res as object);
  }
}

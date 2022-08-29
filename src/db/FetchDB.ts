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
    return await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data/${categoryName}/${subCategory}/.json`,
      { method: "DELETE" }
    );
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
    return await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/userAuth/${email}.json`,
      {
        method: "PATCH",
        body: JSON.stringify({
          idToken
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export class QuestionTest {
  public async create(question: object, categoryName = "", subCategory = "", questions = "/questions") {
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
  public async read(categoryName = "", subCategory = "", questions = "") {
    return await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data${categoryName}${subCategory}${questions}.json`,
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((res) => res as object);
  }
  public async delete(id: string, categoryName = "", subCategory = "", questions = "/questions") {
    return await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data${categoryName}${subCategory}${questions}/${id}.json`,
      { method: "DELETE" }
    );
  }
  public async patch(id: string, question: object, categoryName = "", subCategory = "", questions = "/questions") {
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
  public async createCategory(categoryName = "", subCategory = "") {
    return (await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data${categoryName}${subCategory}/createdBy.json`,
      {
        method: "POST",
        body: JSON.stringify("test@mail.eu"),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => response as Promise<object>)) as Response;
  }
}

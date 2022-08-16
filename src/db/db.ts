export class QuestionTest {
  public async create(question: object) {
    return (await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/questions.json`,
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
  public async read() {
    return await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/questions.json`,
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((res) => res as object);
  }
  public async delete(id: string) {
    return await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/questions/${id}.json`,
      { method: "DELETE" }
    );
  }
  public async patch(id: string, question: object) {
    return await fetch(
      `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/questions/${id}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(question),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

import JSONModel from "sap/ui/model/json/JSONModel";
import { FetchData, IResults, ISubCategory, ITestResults } from "../interface/Interface";
interface IoParam {
    success?: () => void, 
    error?: () => void
}
export default class CRUDModel extends JSONModel {    
    public async read(categoryName = "", subCategory = "", questions = "", oParam?: IoParam) {
        return await fetch(
          `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data${categoryName}${subCategory}${questions}.json`,
          { method: "GET" }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res) {
                this.transformData(res as FetchData)
                if (oParam?.success) oParam.success()               
            } else {
                if (oParam?.error) oParam.error()            
            }
            return res as object
          })
      }
    private transformData(res: FetchData) {
      const modelStructureToBinding: ISubCategory = {};
      void Object.keys(res).forEach((elem: string) => {
        modelStructureToBinding[elem] = {
          categoryName: elem,
          subCategory: res[elem] as unknown as FetchData,
        };
        Object.keys(res[elem]).forEach((el) => {
          modelStructureToBinding[elem]["subCategory"][el].name = el;
        });
        return res[elem];
      });
      this.setProperty("/Data", modelStructureToBinding);      
    }

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
        .then((response) => {
          void this.read()
          return response as object
        })) as Response;
    }

    public async delete(id: string, categoryName = "", subCategory = "", questions = "/questions") {
      return await fetch(
        `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data${categoryName}${subCategory}${questions}/${id}.json`,
        { method: "DELETE" }
      ).then(() => void this.read());
    }

    public async deleteCategory(categoryName: string, subCategory: string) {
      return await fetch(`https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/Data/${categoryName}/${subCategory}/.json`, {
        method: "DELETE",
      }).then(() => void this.read());
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
      ).then(() => void this.read());
    }

    public async createCategory(email: string, categoryName = "", subCategory = "") {
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
        .then((response) => {
          void this.read()
          return response as Promise<object>
        })) as Response;
    }
  
    public async saveUser(email: string, idToken: string) {
      return await fetch(`https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/userAuth/${email.replace(".", "+")}.json`, {
        method: "PATCH",
        body: JSON.stringify({
          idToken,
          email,
        }),
      });
    }
  
    public async checkUserToken(email: string) {
      return await fetch(`https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/userAuth/${email.replace(".", "+")}.json`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => res as object);
    }
  
    public async postResults(results: IResults, date: string, categoryName = "", subCategory = "") {
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
        .then((response) => {
          void this.read()
          response as Promise<object>
        })) as Response;
    }
  
    public async postAllResults(results: IResults, data: string) {
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
  
    public async getResults(categoryName = "", subCategory = "", email = "") {
      return await fetch(
        `https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/results${categoryName}${subCategory}${email}.json`,
        { method: "GET" }
      )
        .then((res) => res.json())
        .then((res) => res as object);
    }
  
    public async getAllResults() {
      return await fetch(`https://apptest-firebase-b0b0c-default-rtdb.europe-west1.firebasedatabase.app/allResults.json`, { method: "GET" })
        .then((res) => res.json())
        .then((res) => res as ITestResults);
    }
}
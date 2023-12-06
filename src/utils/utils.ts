import { QuestionDefault, QuestionType } from "../types/types";


function shuffleQuestions(array: any[]) {
    const newArr = [...array];
    newArr.sort(() => Math.random() - 0.5);
    return newArr;
  }

  function addUniqueId(jsonData: QuestionDefault[]) {
    let index = 0;
    const newData: QuestionType[] = [];
    for (const key in jsonData) {
        newData.push({...jsonData[key], id: index++});
    }
    return newData;
 }

  export {
    shuffleQuestions,
    addUniqueId
  }
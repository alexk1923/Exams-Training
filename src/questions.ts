import initialQuestions from "./questions.json"

export type ChoiceType = {
    str: string,
    isCorrect: boolean;
}

type QuestionDefault = {
    quest: string;
    choices: ChoiceType[]

}

export type QuestionType = QuestionDefault & {
    id: number;
}


// Function to add unique ID to JSON object
function addUniqueId(jsonData: QuestionDefault[]) {
    let index = 0;
    let newData: QuestionType[] = [];
    for (let key in jsonData) {
        newData.push({...jsonData[key], id: index++});
    }
    return newData;
 }

const questions: QuestionType[] = addUniqueId(initialQuestions);

export default questions;


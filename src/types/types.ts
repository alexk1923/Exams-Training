export type ChoiceType = {
    str: string,
    isCorrect?: boolean;
}

export type QuestionDefault = {
    quest: string;
    choices: ChoiceType[]

}

export type QuestionType = QuestionDefault & {
    id: number;
}

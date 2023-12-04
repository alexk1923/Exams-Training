import { useEffect, useState } from "react";
import { QuestionType, ChoiceType } from "./types/types";

enum AnsweredQuestionState {
	CORRECT = "CORRECT",
	WRONG = "WRONG",
}

type AnsweredQuestion = {
	id: number;
	state: AnsweredQuestionState;
};

type QuestionProps = {
	question: QuestionType;
	setScrollId: React.Dispatch<React.SetStateAction<number>>;
	originalId: number;
	randomIdx: number;
};

export default function Question(props: QuestionProps) {
	const { question, setScrollId, originalId, randomIdx } = props;
	const [selectedAnswers, setSelectedAnswers] = useState<AnsweredQuestion[]>(
		[]
	);

	const getQuestionStateStyle = (
		questionId: number,
		questionChoice: ChoiceType
	) => {
		const answeredQuestion = selectedAnswers.find(
			(ansQuestion) => ansQuestion.id == questionId
		);

		if (answeredQuestion) {
			if (questionChoice.isCorrect) {
				return "green";
			}

			if (answeredQuestion.state === AnsweredQuestionState.WRONG) {
				if (questionChoice.isCorrect === undefined) {
					return "red";
				}
			}
		}
	};

	const handleAnswerClick = (choice: ChoiceType, questionId: number) => {
		setSelectedAnswers((prevAns) => {
			const state = choice.isCorrect
				? AnsweredQuestionState.CORRECT
				: AnsweredQuestionState.WRONG;
			return [...prevAns, { id: questionId, state }];
		});
	};

	useEffect(() => {
		// Use useEffect to perform the state update after the rendering is complete
		if (selectedAnswers.length > 0) {
			// const lastAnsweredQuestion = selectedAnswers[selectedAnswers.length - 1];
			setScrollId(randomIdx + 1);
		}
	}, [selectedAnswers, setScrollId, randomIdx]);

	return (
		<div className='question-container'>
			<h4>
				{originalId + 1}. {question.quest}
			</h4>
			{question.choices.map((questionChoice) => (
				<div
					className={
						`question ` + getQuestionStateStyle(question.id, questionChoice)
					}
					onClick={() => handleAnswerClick(questionChoice, question.id)}
				>
					{questionChoice.str}
				</div>
			))}
		</div>
	);
}

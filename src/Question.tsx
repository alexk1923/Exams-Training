import { useEffect, useState } from "react";
import { ChoiceType, QuestionType } from "./questions";

enum AnsweredQuestionState {
	CORRECT = "CORRECT",
	WRONG = "WRONG",
}

type AnsweredQuestion = {
	id: number;
	state: AnsweredQuestionState;
};

export default function Question(props: {
	question: QuestionType;
	setScrollId: React.Dispatch<React.SetStateAction<number>>;
}) {
	const { question, setScrollId } = props;
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
				if (!questionChoice.isCorrect) {
					return "red";
				}
			}
		}
	};

	const handleAnswerClick = (choice: ChoiceType, questionId: number) => {
		console.log(choice);
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
			const lastAnsweredQuestion = selectedAnswers[selectedAnswers.length - 1];
			setScrollId(lastAnsweredQuestion.id + 1);
		}
	}, [selectedAnswers, setScrollId]);

	return (
		<div className='question-container'>
			<h3>{question.quest}</h3>
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

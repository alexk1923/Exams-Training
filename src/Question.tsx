import { useEffect, useState } from "react";
import { QuestionType, ChoiceType } from "./types/types";
import { shuffleQuestions } from "./utils/utils";

enum AnsweredQuestionState {
	CORRECT = "CORRECT",
	WRONG = "WRONG",
}

type AnsweredQuestion = {
	state: AnsweredQuestionState | null;
};

type QuestionProps = {
	question: QuestionType;
	setScrollId: React.Dispatch<React.SetStateAction<number>>;
	originalId: number;
	randomIdx: number;
	rerenderQuestions: boolean;
};

export default function Question(props: QuestionProps) {
	const { question, setScrollId, originalId, randomIdx, rerenderQuestions } =
		props;
	const [selectedAnswer, setSelectedAnswer] = useState<AnsweredQuestion>({
		state: null,
	});

	const getQuestionStateStyle = (questionChoice: ChoiceType) => {
		if (selectedAnswer.state) {
			if (questionChoice.isCorrect) {
				return "green";
			}

			if (selectedAnswer.state === AnsweredQuestionState.WRONG) {
				if (questionChoice.isCorrect === undefined) {
					return "red";
				}
			}
		}
	};

	const handleAnswerClick = (choice: ChoiceType) => {
		setSelectedAnswer((prevSelectedAnswer) => {
			const state = choice.isCorrect
				? AnsweredQuestionState.CORRECT
				: AnsweredQuestionState.WRONG;
			return { ...prevSelectedAnswer, state };
		});
	};

	useEffect(() => {
		if (selectedAnswer.state) {
			setScrollId(randomIdx + 1);
		}
	}, [selectedAnswer, setScrollId, randomIdx]);

	useEffect(() => {
		setScrollId(0);
		setSelectedAnswer({ state: null });
	}, [rerenderQuestions, setScrollId]);

	useEffect(() => {
		question.choices = shuffleQuestions(question.choices) as ChoiceType[];
	}, [question, rerenderQuestions]);

	return (
		<div className='question-container'>
			<h4>
				{originalId + 1}. {question.quest}
			</h4>
			{question.choices.map((questionChoice, idx) => (
				<div
					className={`question ` + getQuestionStateStyle(questionChoice)}
					onClick={() => handleAnswerClick(questionChoice)}
					key={idx}
				>
					{questionChoice.str}
				</div>
			))}
		</div>
	);
}

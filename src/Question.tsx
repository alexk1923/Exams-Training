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
	multipleAnswers: boolean;
};

export default function Question(props: QuestionProps) {
	const { question, setScrollId, originalId, randomIdx, rerenderQuestions } =
		props;
	const [selectedAnswer, setSelectedAnswer] = useState<AnsweredQuestion>({
		state: null,
	});
	const [selectedChoices, setSelectedChoices] = useState<ChoiceType[]>([]);
	const [revealAnswers, setRevealAnswers] = useState(false);
	const { multipleAnswers } = props;

	const getQuestionStateStyle = (questionChoice: ChoiceType) => {
		// Answers are not revealed yet
		if (!revealAnswers && selectedChoices.includes(questionChoice)) {
			return "selected-question";
		}

		// Answers are revealed
		if (selectedAnswer.state) {
			if (questionChoice.isCorrect) {
				return "green";
			}

			// Mark it as red only if the answer was wrong, else do not add any background
			if (selectedAnswer.state === AnsweredQuestionState.WRONG) {
				if (questionChoice.isCorrect === undefined) {
					return "red";
				}
			}
		}

		return "";
	};

	const handleAnswerClick = (choice: ChoiceType) => {
		console.log("answer click");

		if (!multipleAnswers) {
			setSelectedAnswer((prevSelectedAnswer) => {
				const state = choice.isCorrect
					? AnsweredQuestionState.CORRECT
					: AnsweredQuestionState.WRONG;
				return { ...prevSelectedAnswer, state };
			});
			setRevealAnswers(true);
		} else {
			// Already selected, then deselect
			if (selectedChoices.includes(choice)) {
				const newChoices = selectedChoices.filter(
					(selectedChoice) => selectedChoice != choice
				);
				setSelectedChoices(newChoices);
			} else {
				setSelectedChoices((prevChoices) => [...prevChoices, choice]);
			}
		}
	};

	const correctAnswer = () => {
		if (!multipleAnswers) {
		}

		let numberOfCorrectChoice = question.choices.reduce(
			(acc: number, currentElem) => {
				if (currentElem.isCorrect) {
					return acc + 1;
				} else {
					return acc;
				}
			},
			0
		);

		let allSelectedAreCorrect = true;

		for (let choice of selectedChoices) {
			if (!choice.isCorrect) {
				allSelectedAreCorrect = false;
			}
		}

		if (
			allSelectedAreCorrect &&
			selectedChoices.length === numberOfCorrectChoice
		) {
			return true;
		}

		return false;
	};

	const handleSubmitAnswer = () => {
		let state = AnsweredQuestionState.CORRECT;
		if (!correctAnswer()) {
			state = AnsweredQuestionState.WRONG;
		}
		console.log(state);

		setSelectedAnswer({ state });
		setRevealAnswers(true);
	};

	useEffect(() => {
		if (selectedAnswer.state) {
			setScrollId(randomIdx + 1);
		}
	}, [selectedAnswer, setScrollId, randomIdx]);

	useEffect(() => {
		setScrollId(0);
		setSelectedAnswer({ state: null });
		setRevealAnswers(false);
		setSelectedChoices([]);
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
			{multipleAnswers && <button onClick={handleSubmitAnswer}>Answer</button>}
			<p>
				Your answer was:{" "}
				<span
					style={{
						fontWeight: "bold",
						color:
							selectedAnswer.state === AnsweredQuestionState.CORRECT
								? "green"
								: "red",
					}}
				>
					{selectedAnswer.state}
				</span>
			</p>
		</div>
	);
}

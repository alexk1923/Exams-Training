import { useEffect, useRef, useState } from "react";
import "./App.css";
import Question from "./Question";
import React from "react";
import { addUniqueId, shuffleQuestions } from "./utils/utils";
import { QuestionType } from "./types/types";

const SECTION_SIZE = 20;

function App() {
	const refs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);
	const [scrollId, setScrollId] = useState<number>(-1);
	const [questions, setQuestions] = useState<QuestionType[]>(
		[] as QuestionType[]
	);
	const [numberOfSections, setNumberOfSections] = useState<number>(0);
	const [currentSection, setCurrentSection] = useState<number>(1);
	const [filteredQuestions, setFilteredQuestions] = useState<QuestionType[]>(
		[]
	);

	useEffect(() => {
		if (scrollId >= 0 && scrollId < questions.length) {
			refs.current[scrollId].current?.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [scrollId, questions.length]);

	useEffect(() => {
		const start = SECTION_SIZE * (currentSection - 1);
		const end = SECTION_SIZE * currentSection;

		setFilteredQuestions(shuffleQuestions(questions.slice(start, end)));
	}, [questions, currentSection]);

	useEffect(() => {
		refs.current = questions.map(() => React.createRef());
	}, [questions]);

	const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fileReader = new FileReader();

		if (!e.target.files) return;

		fileReader.readAsText(e.target.files[0], "UTF-8");
		fileReader.onload = (e) => {
			// setFiles(e.target.result);
			setQuestions(addUniqueId(JSON.parse(e.target?.result as string)));
		};
	};

	const handleChangeSection = (e: React.MouseEvent<HTMLButtonElement>) => {
		const sectionClicked = Number((e.target as HTMLButtonElement).value);

		if (currentSection === sectionClicked) {
			setFilteredQuestions((filteredQuestions) =>
				shuffleQuestions(filteredQuestions)
			);
		} else {
			setCurrentSection(sectionClicked);
		}
	};

	useEffect(() => {
		setNumberOfSections(Math.floor(questions.length / SECTION_SIZE) + 1);
	}, [questions]);
	return (
		<>
			<div className='container'>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: "1rem",
					}}
				>
					<button
						onClick={() => {
							window.location.reload();
						}}
					>
						Reset all
					</button>
					<label htmlFor='avatar'>
						Choose a JSON file containig questions:
					</label>
					<input
						type='file'
						id='avatar'
						name='avatar'
						accept='application/JSON'
						onChange={handleUploadFile}
					/>
				</div>

				<div style={{ display: "flex", flexWrap: "wrap" }}>
					{Array.from({ length: numberOfSections }, (_, index) => (
						<button onClick={handleChangeSection} key={index} value={index + 1}>
							{index * SECTION_SIZE +
								1 +
								"-" +
								Math.min(questions.length, (index + 1) * SECTION_SIZE)}
						</button>
					))}
				</div>

				{filteredQuestions.map((question, index) => (
					<div ref={refs.current[index]} key={question.id}>
						<Question
							question={question}
							key={question.id}
							setScrollId={setScrollId}
							originalId={question.id}
							randomIdx={index}
						/>
					</div>
				))}
			</div>
		</>
	);
}

export default App;

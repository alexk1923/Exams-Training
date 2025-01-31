import { useEffect, useRef, useState } from "react";
import "./App.css";
import Question from "./Question";
import React from "react";
import { addUniqueId, shuffleQuestions } from "./utils/utils";
import { QuestionType } from "./types/types";
import { FormLabel, Switch } from "@mui/material";

const SECTION_SIZE = 20;

function App() {
	const refs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);
	const [scrollId, setScrollId] = useState<number>(-1);
	const [questions, setQuestions] = useState<QuestionType[]>(
		[] as QuestionType[]
	);
	const [numberOfSections, setNumberOfSections] = useState<number>(0);
	const [currentSection, setCurrentSection] = useState<number>(0);
	const [filteredQuestions, setFilteredQuestions] = useState<QuestionType[]>(
		[]
	);
	const [allMode, setAllMode] = useState(true);
	const [searchQuestion, setSearchQuestion] = useState<string>("");
	const [rerenderQuestions, setRerenderQuestions] = useState<boolean>(false);
	const [multipleAnswers, setMultipleAnswers] = useState(false);

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

		console.log(questions.length);

		setFilteredQuestions(
			shuffleQuestions(questions.slice(start, end)) as QuestionType[]
		);
	}, [questions, currentSection, allMode]);

	useEffect(() => {
		setFilteredQuestions(
			shuffleQuestions(questions.slice(0, questions.length)) as QuestionType[]
		);
	}, [allMode, questions]);

	useEffect(() => {
		refs.current = questions.map(() => React.createRef());
	}, [questions]);

	const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fileReader = new FileReader();

		if (!e.target.files) return;

		fileReader.readAsText(e.target.files[0], "UTF-8");
		fileReader.onload = (e) => {
			setQuestions(addUniqueId(JSON.parse(e.target?.result as string)));
		};
	};

	const handleChangeSection = (sectionClicked: number) => {
		if (currentSection === sectionClicked) {
			setAllMode(false);
			const arr = [...filteredQuestions];
			setFilteredQuestions(shuffleQuestions(arr) as QuestionType[]);
			setRerenderQuestions((prevRerenderQuestions) => !prevRerenderQuestions);
		} else {
			setAllMode(false);
			setCurrentSection(sectionClicked);
		}
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuestion(e.target.value);
	};

	useEffect(() => {
		setNumberOfSections(Math.ceil(questions.length / SECTION_SIZE));
	}, [questions]);

	const handleChooseDefault = async (fileName: string) => {
		// Remove .json ending
		fileName = fileName.split(".").slice(0, -1).join(".");
		try {
			const jsonModule = await import(`./questions/${fileName}.json`);
			const jsonData = jsonModule.default;
			setQuestions(addUniqueId(jsonData));
		} catch (err) {
			alert(err);
			return;
		}
	};

	const defaultFiles = [
		"ubdquestions.json",
		"ubd-exam.json",
		"isi-exam.json",
		"idp-exam.json",
		"ecomm-exam.json",
		"cloud-exam.json",
		"egov-exam.json",
	];

	return (
		<div style={{ width: "100vw", display: "" }}>
			<div className='container'>
				<div className='default-questions-container'>
					<h2>Choose from default questions</h2>
					{defaultFiles.map((defaultFile) => (
						<div
							className='default-question-item'
							onClick={() => handleChooseDefault(defaultFile)}
						>
							{defaultFile}
						</div>
					))}
					<FormLabel>Multiple answers</FormLabel>
					<Switch
						aria-label='multiple answer switch'
						checked={multipleAnswers}
						onChange={() => setMultipleAnswers((prev) => !prev)}
					/>
				</div>

				<div className='selection-container'>
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

				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: "1rem",
						maxWidth: "100%",
					}}
				>
					<button
						onClick={() => {
							window.location.reload();
						}}
					>
						Reset all
					</button>
				</div>

				<div style={{ display: "flex", flexWrap: "wrap" }}>
					{Array.from({ length: numberOfSections }, (_, index) => (
						<button
							onClick={() => handleChangeSection(index + 1)}
							key={index}
							value={index + 1}
						>
							{index * SECTION_SIZE +
								1 +
								"-" +
								Math.min(questions.length, (index + 1) * SECTION_SIZE)}
						</button>
					))}
					<button
						onClick={() => {
							setAllMode((oldMode) => !oldMode);
						}}
					>
						All
					</button>
				</div>

				<div className='search-bar'>
					<input
						type='search'
						placeholder='Search for a question'
						value={searchQuestion}
						onChange={handleSearchChange}
					/>
				</div>

				{searchQuestion.length > 0
					? questions
							.filter((question) =>
								question.quest
									.toLowerCase()
									.includes(searchQuestion.toLowerCase())
							)
							.map((question) => (
								<div className='question'>
									<Question
										question={question}
										key={question.id}
										setScrollId={setScrollId}
										originalId={question.id}
										randomIdx={question.id}
										rerenderQuestions={rerenderQuestions}
										multipleAnswers={multipleAnswers}
										currentSection={currentSection}
									/>
								</div>
							))
					: filteredQuestions.map((question, index) => (
							<div ref={refs.current[index]} key={question.id}>
								<Question
									question={question}
									setScrollId={setScrollId}
									originalId={question.id}
									randomIdx={index}
									rerenderQuestions={rerenderQuestions}
									multipleAnswers={multipleAnswers}
								/>
							</div>
					  ))}
			</div>
		</div>
	);
}

export default App;

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import questions from "./questions";
import Question from "./Question";
import React from "react";

function App() {
	const refs = useRef<Array<React.RefObject<HTMLDivElement>>>(
		questions.map(() => React.createRef())
	);
	const [scrollId, setScrollId] = useState<number>(0);

	useEffect(() => {
		if (scrollId < questions.length) {
			refs.current[scrollId].current?.scrollIntoView({
				behavior: "smooth",
			});
		}
	}, [scrollId]);

	return (
		<div className='container'>
			<button
				onClick={() => {
					window.location.reload();
				}}
			>
				Reset all
			</button>
			{questions.map((question) => (
				<div ref={refs.current[question.id]} key={question.id}>
					<Question
						question={question}
						key={question.id}
						setScrollId={setScrollId}
					/>
				</div>
			))}
		</div>
	);
}

export default App;

import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

import GameLogo from "../GameLogo/GameLogo";

import "./TitleCard.css";

function TitleCard({title}) {
	const fadeRef = useRef(null);
	const fullRef = useRef(null);
	const [showTitle, setShowTitle] = useState(true);
	const [fadeOut, setFadeOut] = useState(true);
	const [doneRendering, setDoneRendering] = useState(false);

	useEffect(() => {
		const fadeTimeout = setTimeout(() => { setFadeOut(false); }, 5000);
		const titleTimeout = setTimeout(() => { setShowTitle(false); }, 9000);
		const renderTimeout = setTimeout(() => { setDoneRendering(true); }, 10000);

		return () => {
			clearTimeout(fadeTimeout);
			clearTimeout(titleTimeout);
			clearTimeout(renderTimeout);
		}
	}, []);

	if (doneRendering) {
		return <></>;
	}

	return (
		<CSSTransition
			classNames="fade"
			in={showTitle}
			nodeRef={fullRef}
			timeout={1000}
		>
			<div id="titleCard" ref={fullRef}>
				<CSSTransition
					appear={true}
					classNames="fade"
					in={fadeOut}
					nodeRef={fadeRef}
					timeout={1000}
				>
					<div ref={fadeRef}></div>
				</CSSTransition>
					<div>
						<GameLogo />
						<h1>{title}</h1>
					</div>
			</div>
		</CSSTransition>
	);
}

export default TitleCard;
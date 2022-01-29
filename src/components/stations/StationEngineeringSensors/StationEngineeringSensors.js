import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useStoreContext } from "../../../utils/GlobalState";
import { assignToStation } from "../../../utils/firebase";

import { MODAL_VIEW_LOBBY } from "../../../utils/actions";

import BridgeSet from "../../BridgeSet/BridgeSet";
import ConsoleEngineering from "../../consoles/ConsoleEngineering/ConsoleEngineering";
import ConsoleSensors from "../../consoles/ConsoleSensors/ConsoleSensors";

import "./StationEngineeringSensors.css";

function StationEngineeringSensors() {
	const [state, ] = useStoreContext();
	const mainRef = useRef(null);
	const [viewing, setViewing] = useState("");
	const [viewTarget, setViewTarget] = useState("console");

	const curStation = ((state.lobby.engineering === state.user) ? "engineering" : (state.lobby.sensors === state.user) ? "sensors" : "error");
	const showMovementControls = (!state.modal);

	useEffect(() => {
		// TODO - Janky!  Switching to these stations via the lobby popup creates strange effects...
		if (state.modal?.type === MODAL_VIEW_LOBBY) {
			setViewing("console");
			setViewTarget("console");
		} else if (!viewing) {
			const setMe = setTimeout(() => { setViewing(viewTarget); }, 9000);
			return () => { clearTimeout(setMe); };
		}
	}, [ state.modal, viewing, viewTarget ]);

	const goToConsole = () => {
		setViewing("");
		setViewTarget("console");

		setTimeout(() => { setViewing("console"); }, 1000);
	}

	const goToScreen = () => {
		setViewing("");
		setViewTarget("screen");

		setTimeout(() => { setViewing("screen"); }, 1000);
	}

	const switchToSensorsStation = () => {
		assignToStation(state.lobby, state.user, "sensors");
	}

	const switchToEngineeringStation = () => {
		assignToStation(state.lobby, state.user, "engineering");
	}

	return (
		<CSSTransition
			classNames="sensorsStation"
			in={curStation === "sensors"}
			nodeRef={mainRef}
			timeout={1000}
		>
			<CSSTransition
				classNames="viewScreen"
				in={viewTarget === "screen"}
				nodeRef={mainRef}
				timeout={1000}
			>
				<div id="stationEngineeringSensors" className={curStation} ref={mainRef}>
					<BridgeSet />
					<ConsoleEngineering />
					<ConsoleSensors />
					{((showMovementControls) && (viewing === "screen")) ? <div className="stationTransitionDown" onClick={goToConsole}></div> : <></>}
					{((showMovementControls) && (viewing === "console")) ? <div className="stationTransitionUp" onClick={goToScreen}></div> : <></>}
					{((showMovementControls) && (viewing ==="console") && (curStation === "engineering") && (!state.lobby.sensors)) ? <div className="stationTransitionRight" onClick={switchToSensorsStation}></div> : <></>}
					{((showMovementControls) && (viewing ==="console") && (curStation === "sensors") && (!state.lobby.engineering)) ? <div className="stationTransitionLeft" onClick={switchToEngineeringStation}></div> : <></>}
				</div>
			</CSSTransition>
		</CSSTransition>
	);
}

export default StationEngineeringSensors;
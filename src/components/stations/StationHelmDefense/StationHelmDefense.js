import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useStoreContext } from "../../../utils/GlobalState";
import { assignToStation } from "../../../utils/firebase";

import { MODAL_VIEW_LOBBY } from "../../../utils/actions";

import BridgeSet from "../../BridgeSet/BridgeSet";
import ConsoleHelm from "../../consoles/ConsoleHelm/ConsoleHelm";
import ConsoleDefense from "../../consoles/ConsoleDefense/ConsoleDefense";

import "./StationHelmDefense.css";

function StationHelmDefense() {
	const [state, ] = useStoreContext();
	const mainRef = useRef(null);
	const [viewing, setViewing] = useState("");
	const [viewTarget, setViewTarget] = useState("console");

	const curStation = ((state.lobby.helm === state.user) ? "helm" : (state.lobby.defense === state.user) ? "defense" : "error");
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

	const switchToDefenseStation = () => {
		assignToStation(state.lobby, state.user, "defense");
	}

	const switchToHelmStation = () => {
		assignToStation(state.lobby, state.user, "helm");
	}

	return (
		<CSSTransition
			classNames="defenseStation"
			in={curStation === "defense"}
			nodeRef={mainRef}
			timeout={1000}
		>
			<CSSTransition
				classNames="viewScreen"
				in={viewTarget === "screen"}
				nodeRef={mainRef}
				timeout={1000}
			>
				<div id="stationHelmDefense" className={curStation} ref={mainRef}>
					<BridgeSet />
					<ConsoleHelm />
					<ConsoleDefense />
					{((showMovementControls) && (viewing === "screen")) ? <div className="stationTransitionDown" onClick={goToConsole}></div> : <></>}
					{((showMovementControls) && (viewing === "console")) ? <div className="stationTransitionUp" onClick={goToScreen}></div> : <></>}
					{((showMovementControls) && (viewing ==="console") && (curStation === "helm") && (!state.lobby.defense)) ? <div className="stationTransitionRight" onClick={switchToDefenseStation}></div> : <></>}
					{((showMovementControls) && (viewing ==="console") && (curStation === "defense") && (!state.lobby.helm)) ? <div className="stationTransitionLeft" onClick={switchToHelmStation}></div> : <></>}
				</div>
			</CSSTransition>
		</CSSTransition>
	);
}

export default StationHelmDefense;
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useStoreContext } from "../../utils/GlobalState";
import { assignToStation } from "../../utils/firebase";

import { MODAL_VIEW_LOBBY } from "../../utils/actions";

import BridgeSet from "../BridgeSet/BridgeSet";
import ConsoleHelm from "../ConsoleHelm/ConsoleHelm";
import ConsoleWeapons from "../ConsoleWeapons/ConsoleWeapons";

import "./StationHelmWeapons.css";

function StationHelmWeapons() {
	const [state, ] = useStoreContext();
	const mainRef = useRef(null);
	const [viewing, setViewing] = useState("");
	const [viewTarget, setViewTarget] = useState("console");

	const curStation = ((state.lobby.helm === state.user) ? "helm" : (state.lobby.weapons === state.user) ? "weapons" : "error");
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

	const switchToWeaponsStation = () => {
		assignToStation(state.lobby, state.user, "weapons");
	}

	const switchToHelmStation = () => {
		assignToStation(state.lobby, state.user, "helm");
	}

	return (
		<CSSTransition
			classNames="weaponStation"
			in={curStation === "weapons"}
			nodeRef={mainRef}
			timeout={1000}
		>
			<CSSTransition
				classNames="viewScreen"
				in={viewTarget === "screen"}
				nodeRef={mainRef}
				timeout={1000}
			>
				<div id="stationHelmWeapons" className={curStation} ref={mainRef}>
					<BridgeSet />
					<ConsoleHelm />
					<ConsoleWeapons />
					{((showMovementControls) && (viewing === "screen")) ? <div className="stationTransitionDown" onClick={goToConsole}></div> : <></>}
					{((showMovementControls) && (viewing === "console")) ? <div className="stationTransitionUp" onClick={goToScreen}></div> : <></>}
					{((showMovementControls) && (viewing ==="console") && (curStation === "helm") && (!state.lobby.weapons)) ? <div className="stationTransitionRight" onClick={switchToWeaponsStation}></div> : <></>}
					{((showMovementControls) && (viewing ==="console") && (curStation === "weapons") && (!state.lobby.helm)) ? <div className="stationTransitionLeft" onClick={switchToHelmStation}></div> : <></>}
				</div>
			</CSSTransition>
		</CSSTransition>
	);
}

export default StationHelmWeapons;
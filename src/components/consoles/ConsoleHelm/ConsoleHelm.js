import { useEffect, useState } from "react";
import { useStoreContext } from "../../../utils/GlobalState";
import { postGameStateUpdate } from "../../../utils/firebase";

import { localizeKey } from "../../../localization/localization";

import "./ConsoleHelm.css";

const MODE_STANDARD = 0;
const MODE_JUMP_DRIVE = 1;
const MODE_SHUTTLE_BAY = 2;

function ConsoleHelm() {
	const [state, ] = useStoreContext();
	const [mode, setMode] = useState(MODE_STANDARD);
	const [turning, setTurning] = useState(state.gameData?.ship?.helmControls.turn || 0);
	const [throttle, setThrottle] = useState(state.gameData?.ship?.helmControls.throttle || 0);
	const [lastUpdate, setLastUpdate] = useState(Date.now());

	const onTurning = (value) => {
		setTurning(value);
	}

	const onThrottle = (value) => {
		setThrottle(value);
	}

	useEffect(() => {
		const checkControls = () => {
			if ((state.gameData?.ship) && (Date.now() - lastUpdate > 500)) {
				if ((state.gameData.ship.helmControls.turn !== turning) || (state.gameData.ship.helmControls.throttle !== throttle)) {
					const sendData = { ship: { helmControls: { turn: Number(turning), throttle: Number(throttle) } } };
					postGameStateUpdate(state.lobby.host, [ "ship/helmControls" ], sendData);
				}
				setLastUpdate(Date.now());
			}
		};

		const changeListener = setInterval(checkControls, 500);
		checkControls();

		return () => { clearInterval(changeListener); };
	}, [ state.lobby.host, state.gameData, lastUpdate, throttle, turning ]);

	return (
		<div id="consoleHelm" className="techPanel">
			<h2>{localizeKey("STATION_HELM", state)}</h2>
			<div className="techScreen console">
				<div>
					<h2>{localizeKey("STATION_HELM", state)}</h2>
					{(state.missionInfo?.ship?.status?.alert) ? <div className="alert">{localizeKey("COMMON_LABEL_ALERT", state)}</div> : <></>}
				</div>
				<div>
					<div>
						<div id="modeSelection">
							<button className={(mode === MODE_JUMP_DRIVE) ? "selected" : ""} type="button" onClick={() => setMode((mode === MODE_JUMP_DRIVE) ? MODE_STANDARD : MODE_JUMP_DRIVE)}>{localizeKey("SUBSYSTEM_JUMP_DRIVE", state)}</button>
							<button className={(mode === MODE_SHUTTLE_BAY) ? "selected" : ""} type="button" onClick={() => setMode((mode === MODE_SHUTTLE_BAY) ? MODE_STANDARD : MODE_SHUTTLE_BAY)}>{localizeKey("SUBSYSTEM_SHUTTLE_BAY", state)}</button>
						</div>
						<div id="movementControls">
							<div>Ship Controls</div>
							<button name="resetTurning" type="button" onClick={() => onTurning(0)}>{localizeKey((turning > 0) ? "HELM_LABEL_TURNING_RIGHT" : (turning < 0) ? "HELM_LABEL_TURNING_LEFT" : "HELM_LABEL_TURNING_NEUTRAL", state).replace("<TURNING>", Math.abs(turning))}</button>
							<input type="range" min="-100" max="100" step="5" value={turning} onChange={e => onTurning(e.target.value)}></input>
							<input className="vertical" type="range" min="-25" max="100" step="5" value={throttle} onChange={e => onThrottle(e.target.value)}></input>
							<button name="resetThrottle" type="button" onClick={() => onThrottle(0)}>{localizeKey("HELM_LABEL_THROTTLE", state).replace("<THROTTLE>", throttle)}</button>
						</div>
					</div>
					<div>
						TODO!
					</div>
				</div>
			</div>
		</div>
	);
}

export default ConsoleHelm;
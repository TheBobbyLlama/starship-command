import { useEffect, useState } from "react";
import { useStoreContext } from "../../../utils/GlobalState";
import { postGameStateUpdate } from "../../../utils/firebase";
import Vector2D from "../../../utils/vector2d";

import { localizeKey } from "../../../localization/localization";

import MapHelm from "../../MapHelm/MapHelm";

import "./ConsoleHelm.css";

const MODE_STANDARD = 0;
const MODE_JUMP_DRIVE = 1;
const MODE_SHUTTLE_BAY = 2;

function ConsoleHelm() {
	const [state, ] = useStoreContext();
	const [mode, setMode] = useState(MODE_STANDARD);
	const [turning, setTurning] = useState(state.gameData?.ship?.helmControls.turn || 0);
	const [throttle, setThrottle] = useState(state.gameData?.ship?.helmControls.throttle || 0);
	const [targetPoint, setTargetPoint] = useState(null);
	const [lastUpdate, setLastUpdate] = useState(Date.now());

	const onTurning = (value) => {
		setTurning(value);
		setTargetPoint(null);
	}

	const onThrottle = (value) => {
		setThrottle(value);
	}

	const onMapDblClick = (x, y) => {
		setTargetPoint([x, y]);
	}

	useEffect(() => {
		const checkControls = () => {
			if ((state.gameData?.ship) && (Date.now() - lastUpdate > 250)) {
				if (targetPoint) {
					const forward = Vector2D.fromRadians(state.gameData.ship.movement.heading);
					const right = Vector2D.getRightVector(forward);
					const diffVector = Vector2D.subtract(targetPoint, state.gameData.ship.movement.position);
					const diffLength = Vector2D.normalize(diffVector);
					let newTurning = 0;
					
					if (diffLength > state.gameData.ship.movement.speed) {
						newTurning = Math.min(5 * Math.floor((1 - Vector2D.dotProduct(forward, diffVector)) * 400), 100);

						if (Vector2D.dotProduct(right, diffVector) < 0) {
							newTurning *= -1;
						}
					} else {
						setThrottle(0);
					}

					setTurning(newTurning);

					if (!newTurning) {
						setTargetPoint(null);
					}
				}

				if ((state.gameData.ship.helmControls.turn !== turning) || (state.gameData.ship.helmControls.throttle !== throttle)) {
					const sendData = { ship: { helmControls: { turn: Number(turning), throttle: Number(throttle) } } };
					postGameStateUpdate(state.lobby.host, [ "ship/helmControls" ], sendData);
				}
				setLastUpdate(Date.now());
			}
		};

		const changeListener = setInterval(checkControls, 250);
		checkControls();

		return () => { clearInterval(changeListener); };
	}, [ state.lobby.host, state.gameData, lastUpdate, throttle, turning, targetPoint ]);

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
							<input type="range" min="-100" max="100" step="5" value={turning} onChange={e => onTurning(e.target.value)} onMouseUp={() => onTurning(0)}></input>
							<input className="vertical" type="range" min="-25" max="100" step="5" value={throttle} onChange={e => onThrottle(e.target.value)}></input>
							<button name="resetThrottle" type="button" onClick={() => onThrottle(0)}>{localizeKey("HELM_LABEL_THROTTLE", state).replace("<THROTTLE>", throttle)}</button>
						</div>
					</div>
					<div id="helmReadout">
						<MapHelm dblClickFunc={onMapDblClick} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default ConsoleHelm;
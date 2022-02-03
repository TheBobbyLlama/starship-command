import { useState, useEffect } from "react";
import { useStoreContext } from "../../utils/GlobalState";

import Sound from "react-sound";


function GameSoundManager() {
	const [state, ] = useStoreContext();

	window.soundManager.setup({ debugMode: false, ignoreMobileRestrictions: true }); // Get rid of the godawful console spam in development mode, and also try to allow multiple sounds on mobile devices.

	var volTarget = 0.375 * Math.max(0.25 * Math.abs(state.gameData?.ship?.movement?.controls?.turn || 0), Math.abs(state.gameData?.ship?.movement?.controls?.throttle || 0));

	if (volTarget > 0) volTarget += 12.5;

	const [engineVol, setEngineVol] = useState(volTarget);
	const [lastVolUpdate, setLastVolUpdate ] = useState(Date.now());

	useEffect(() => {
		const checkEngine = () => {
			if ((volTarget !== engineVol) && (Date.now() - lastVolUpdate > 100)) {
				if (volTarget > engineVol) {
					setEngineVol(Math.min(engineVol + 5, volTarget));
				} else {
					setEngineVol(Math.max(engineVol - 5, volTarget));
				}

				setLastVolUpdate(Date.now());
			}
		};

		const changeListener = setInterval(checkEngine, 100);
		checkEngine();

		return () => { clearInterval(changeListener); };
	}, [ engineVol, lastVolUpdate, volTarget ]);

	var engineSound = "./audio/engine.mp3";
	var shipEngine = state.gameData?.ship?.subsystems.find(sub => sub.key === "SUBSYSTEM_ENGINES");

	if (shipEngine) {
		var health = shipEngine.health[0] / shipEngine.health[1];

		if (health < 0.25) {
			engineSound = "./audio/engine25.mp3";
		} else if (health < 0.5) {
			engineSound = "./audio/engine50.mp3";
		} else if (health < 0.75) {
			engineSound = "./audio/engine75.mp3";
		}
	}

	return (
		<>
			{(engineVol)? <Sound
							url={engineSound}
							playStatus={Sound.status.PLAYING}
							volume={engineVol}
							playbackRate={1 + engineVol / 100}
							loop={true}
							autoLoad={true}
						/> : <></>}
		</>
	);
}

export default GameSoundManager;
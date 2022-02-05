import { useState, useEffect } from "react";
import { createListener, killListener, createEventListener, getGameData } from "../../utils/firebase";
import { useStoreContext } from "../../utils/GlobalState";

import { UPDATE_GAME_DATA } from "../../utils/actions";

function GameListener() {
	const [state, dispatch] = useStoreContext();
	const [startTime,] = useState(Date.now());

	const loadGameData = async () => {
		const result = await getGameData(state.lobby.host);

		if (result.status) {
			dispatch({ type: UPDATE_GAME_DATA, data: result.gameData });
		} else {
			// TODO - Error modal?
		}
	}

	if (!state.gameData) {
		loadGameData();
	}

	useEffect(() => {
		const gameStateUpdate = async (data) => {
			dispatch({ type: UPDATE_GAME_DATA, data });
		}
	
		const processGameEvent = (event) => {
			// Only process if it's new!
			if (event.timestamp > startTime) {
				// TODO!
			}
		}

		if (state.lobby?.host) {
			createListener("/game/", state.lobby.host, gameStateUpdate);
			createEventListener("/game_event/", state.lobby.host, processGameEvent)
		}

		return () => {
			killListener("/game/");
			killListener("/game_event/");
		}
	}, [ state.lobby?.host, dispatch, startTime ]);

	return (
		<>
		</>
	);
}

export default GameListener;
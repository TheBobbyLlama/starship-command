import { useState, useEffect } from "react";
import { createListener, killListener, createEventListener } from "../../utils/firebase";
import { useStoreContext } from "../../utils/GlobalState";

import { UPDATE_GAME_DATA } from "../../utils/actions";

var Sound = require("react-sound").default;


function GameListener() {
	const [state, dispatch] = useStoreContext();
	const [startTime,] = useState(Date.now());

	useEffect(() => {
		const lobbyUpdate = async (data) => {
			dispatch({ type: UPDATE_GAME_DATA, data });
		}
	
		const processLobbyEvent = (event) => {
			// Only process if it's new!
			if (event.timestamp > startTime) {
				// TODO!
			}
		}

		if (state.lobby?.host) {
			createListener("/game/", state.lobby.host, lobbyUpdate);
			createEventListener("/game_event/", state.lobby.host, processLobbyEvent)
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
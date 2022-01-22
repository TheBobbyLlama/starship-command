import { useEffect } from "react";
import { keepGameLobbyAlive, leaveGameLobby, createListener, killListener, createEventListener } from "../../utils/firebase";
import { useStoreContext } from "../../utils/GlobalState";

import { UPDATE_LOBBY } from "../../utils/actions";

function LobbyListener() {
	const [state, dispatch] = useStoreContext();

	useEffect(() => {
		if (state.user !== state.lobby.host) {
			const ejectSelf = () => {
				leaveGameLobby(state.lobby, state.user);
			}

			window.addEventListener("beforeunload", ejectSelf);

			return () => {
				window.removeEventListener("beforeunload", ejectSelf);
			}
		} else {
			const interval = setInterval(() => {
				keepGameLobbyAlive(state.user);
			}, 10000);
	  
			return () => {
				clearInterval(interval);
			};
		}
	}, [ state.user, state.lobby ]);

	useEffect(() => {
		const lobbyUpdate = (data) => {
			dispatch({ type: UPDATE_LOBBY, data });
		}
	
		const processLobbyEvent = (event) => {
			console.log(event);
		}

		if (state.lobby?.host) {
			createListener("/lobby/", state.lobby.host, lobbyUpdate);
			createEventListener("/lobby_events/", state.lobby.host, processLobbyEvent)
		}

		return () => {
			killListener("/lobby/");
			killListener("/lobby_events/");
		}
	}, [ state.lobby?.host, dispatch ]);

	return (
		<></>
	);
}

export default LobbyListener;
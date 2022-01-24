import { useState, useEffect } from "react";
import { keepGameLobbyAlive, leaveGameLobby, getMissionSummary, createListener, killListener, createEventListener } from "../../utils/firebase";
import { useStoreContext } from "../../utils/GlobalState";

import { UPDATE_LOBBY, ADD_NOTIFICATION } from "../../utils/actions";
import { LOBBY_PLAYER_JOIN, LOBBY_PLAYER_LEAVE } from "../../utils/events";
import { localizeKey } from "../../localization/localization";

import Notifications from "../Notifications/Notifications";

function LobbyListener() {
	const [state, dispatch] = useStoreContext();
	const [startTime,] = useState(Date.now());

	// Prepare these ahead of time so they can be used in a useEffect without a destructive 'state' dependency!
	const joinString = localizeKey("LOBBY_EVENT_JOIN", state);
	const leaveString = localizeKey("LOBBY_EVENT_LEAVE", state);

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
		const lobbyUpdate = async (data) => {
			var missionInfo;

			if ((data?.mission) && (data.mission !== state.lobby.mission)) {
				const result = await getMissionSummary(data.mission);

				if (result.status) {
					missionInfo = result.summary;
				}
			}

			dispatch({ type: UPDATE_LOBBY, data, missionInfo });
		}
	
		const processLobbyEvent = (event) => {
			// Only process if it's new!
			if (event.timestamp > startTime) {
				const notification = { type: ADD_NOTIFICATION };

				switch (event.type) {
					case LOBBY_PLAYER_JOIN:
						notification.message = joinString.replace("<PLAYER>", event.data);
						break;
					case LOBBY_PLAYER_LEAVE:
						notification.message = leaveString.replace("<PLAYER>", event.data);
						break;
					default:
						notification.message = "";
				}
				dispatch(notification);
			}
		}

		if (state.lobby?.host) {
			createListener("/lobby/", state.lobby.host, lobbyUpdate);
			createEventListener("/lobby_event/", state.lobby.host, processLobbyEvent)
		}

		return () => {
			killListener("/lobby/");
			killListener("/lobby_event/");
		}
	}, [ state.lobby?.host, state.lobby?.mission, dispatch, startTime, joinString, leaveString ]);

	return (
		<Notifications />
	);
}

export default LobbyListener;
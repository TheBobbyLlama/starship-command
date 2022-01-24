import { closeGameLobby, leaveGameLobby, setLobbyReadyStatus, compactKey } from "../../utils/firebase";
import { useStoreContext } from "../../utils/GlobalState";

import { localizeKey } from "../../localization/localization";
import { bridgeStations } from "../../utils/globals";
import { SET_GAME_STATE, UPDATE_LOBBY, SHOW_MODAL, MODAL_GENERIC, MODAL_MISSION_SELECTOR, MODAL_MISSION_VIEWER, GAME_STATE_MAIN_MENU } from "../../utils/actions";

import LobbyStations from "../../components/LobbyStations/LobbyStations";
import LobbyPlayers from "../../components/LobbyPlayers/LobbyPlayers";

import "./LobbyView.css";

function LobbyView() {
	const [state, dispatch] = useStoreContext();

	const isHost = (state.user === state.lobby.host);
	const assignedStation = bridgeStations.find(station => state.lobby[station] === state.user);

	const playerReady = (state.lobby.ready || {})[compactKey(state.user)];
	// TODO - Test setting!
	const readyToStart =  true;//((assignedStation) && (state.lobby.players.length >= 3) && (state.lobby.ready) && (Object.entries(state.lobby.ready).length >= state.lobby.players.length - 1));

	const closeLobby = () => {
		if (isHost) {
			closeGameLobby(state.user);
			dispatch({ type: SET_GAME_STATE, gameState: GAME_STATE_MAIN_MENU });
		}
	}

	const promptCloseLobby = () => {
		if (isHost) {
			dispatch({
				type: SHOW_MODAL,
				modal: {
					type: MODAL_GENERIC,
					title: localizeKey("COMMON_TITLE_CONFIRM", state),
					text: localizeKey("LOBBY_CONFIRM_CLOSE", state),
					buttons: {
						[localizeKey("COMMON_BUTTON_OK", state)]: closeLobby,
						[localizeKey("COMMON_BUTTON_CANCEL", state)]: () => { dispatch({ type: SHOW_MODAL }); }
					}
				}
			});
		}
	}

	const leaveLobby = async () => {
		const result = await leaveGameLobby(state.lobby, state.user);

		if (result.status) {
			dispatch({ type: UPDATE_LOBBY, data: null });
		} else {
			dispatch({
				type: SHOW_MODAL,
				modal: {
					type: MODAL_GENERIC,
					title: localizeKey("COMMON_TITLE_ERROR", state),
					text: localizeKey(result.message || "COMMON_ERROR_GENERIC", state),
					buttons: {
						[localizeKey("COMMON_BUTTON_OK", state)]: () => { dispatch({ type: SHOW_MODAL }); }
					}
				}
			});
		}
	}

	const promptLeaveLobby = () => {
		dispatch({
			type: SHOW_MODAL,
			modal: {
				type: MODAL_GENERIC,
				title: localizeKey("COMMON_TITLE_CONFIRM", state),
				text: localizeKey("LOBBY_CONFIRM_LEAVE", state),
				buttons: {
					[localizeKey("COMMON_BUTTON_YES", state)]: leaveLobby,
					[localizeKey("COMMON_BUTTON_NO", state)]: () => { dispatch({ type: SHOW_MODAL }); }
				}
			}
		});
	}

	const showMissionInfo = () => {
		dispatch({ type: SHOW_MODAL, modal: { type: ((isHost) ? MODAL_MISSION_SELECTOR : MODAL_MISSION_VIEWER) } });
	}

	return (
		<div id="lobbyView" className="techPanel">
			<div className="techScreen">
				<div>
					<h1>{state.lobby.mission || localizeKey("LOBBY_GENERIC_TITLE", state).replace("<HOST>", state.lobby.host)}</h1>
					{(state.lobby.started) ? <></> : <button type="button" disabled={((!isHost) && (!state.lobby.mission))} onClick={showMissionInfo}>{localizeKey((isHost) ? "LOBBY_SET_MISSION" : "LOBBY_MISSION_INFO", state)}</button>}
				</div>
				<div id="lobbyHolder">
					<LobbyStations />
					<div>
						<LobbyPlayers />
						<div>
							{(isHost) ?
								<>
									<button type="button" disabled={!readyToStart}>{localizeKey("LOBBY_LAUNCH", state)}</button>
									<button type="button" onClick={promptCloseLobby}>{localizeKey("LOBBY_CLOSE", state)}</button>
								</>
								:
								<>
									<button type="button" disabled={!assignedStation} onClick={() => { setLobbyReadyStatus(state.lobby.host, state.user, !playerReady); }}>{localizeKey((playerReady) ? "LOBBY_WAIT" : "LOBBY_READY", state)}</button>
									<button type="button" onClick={promptLeaveLobby}>{localizeKey("LOBBY_LEAVE", state)}</button>
								</>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LobbyView;
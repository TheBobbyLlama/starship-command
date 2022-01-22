import { useState } from "react";
import { closeGameLobby, leaveGameLobby } from "../../utils/firebase";
import { useStoreContext } from "../../utils/GlobalState";

import LobbyStations from "../../components/LobbyStations/LobbyStations";
import LobbyPlayers from "../../components/LobbyPlayers/LobbyPlayers";

import { SET_GAME_STATE, UPDATE_LOBBY, SHOW_MODAL, MODAL_GENERIC, GAME_STATE_MAIN_MENU } from "../../utils/actions";

import "./LobbyView.css";

function LobbyView() {
	const [state, dispatch] = useStoreContext();
	const [ready, setReady] = useState(false);

	const isHost = (state.user === state.lobby.host);
	const readyToStart = false;

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
					title: "Close Lobby?",
					text: "This will eject all players.",
					buttons: {
						Yes: closeLobby,
						No: () => { dispatch({ type: SHOW_MODAL }); }
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
					title: "Error",
					text: result.message || "An error occurred.",
					buttons: {
						Ok: () => { dispatch({ type: SHOW_MODAL }); }
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
				title: "Confirm",
				text: "Are you sure you want to leave?",
				buttons: {
					Yes: leaveLobby,
					No: () => { dispatch({ type: SHOW_MODAL }); }
				}
			}
		});
	}

	return (
		<div id="lobbyView" className="techPanel">
			<div className="techScreen">
				<div>
					<h1>{state.lobby.host}'s Lobby</h1>
					<button type="button">{(isHost) ? "Set Mission" : "View Mission"}</button>
				</div>
				<div id="lobbyHolder">
					<LobbyStations />
					<div>
						<LobbyPlayers />
						<div>
							{(isHost) ?
								<>
									<button type="button" disabled={!readyToStart}>Launch!</button>
									<button type="button" onClick={promptCloseLobby}>Close</button>
								</>
								:
								<>
									<button type="button" disabled={!readyToStart}>Ready!</button>
									<button type="button" onClick={promptLeaveLobby}>Leave</button>
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
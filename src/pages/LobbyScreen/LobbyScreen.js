import { closeGameLobby } from "../../utils/firebase";
import { useStoreContext } from "../../utils/GlobalState";

import LobbyStations from "../../components/LobbyStations/LobbyStations";
import LobbyPlayers from "../../components/LobbyPlayers/LobbyPlayers";

import { SET_GAME_STATE, SHOW_MODAL, MODAL_GENERIC, GAME_STATE_MAIN_MENU } from "../../utils/actions";

import "./LobbyScreen.css";

function LobbyScreen() {
	const [state, dispatch] = useStoreContext();

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
			})
		}
	}

	return (
		<div id="lobbyScreen">
			<div className="techPanel">
				<div className="techScreen">
					<h1>{state.lobby.host}'s Lobby</h1>
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
										<button type="button">Leave</button>
									</>
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LobbyScreen;
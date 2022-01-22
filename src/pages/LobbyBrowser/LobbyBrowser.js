import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { searchGameLobbies, queryGameLobby, joinGameLobby } from "../../utils/firebase";
import { SET_GAME_STATE, UPDATE_LOBBY, SHOW_MODAL, GAME_STATE_MAIN_MENU, MODAL_GENERIC } from "../../utils/actions";

import LobbyInfo from "../../components/LobbyInfo/LobbyInfo";

import "./LobbyBrowser.css";

function LobbyBrowser() {
	const [state, dispatch] = useStoreContext();
	const [lobbyList, setLobbyList] = useState();
	const [selectedLobby, setSelectedLobby] = useState(null);

	const doLobbySearch = async () => {
		const result = await searchGameLobbies(state.user, {});

		if (result.status) {
			setLobbyList(result.lobbyList);
		}

		setSelectedLobby(null);
	}

	// Get up to date info for a lobby when it's selected.
	const selectLobby = async (lobby) => {
		const result = await queryGameLobby(lobby.host);

		if (result.status) {
			if (result.lobby) {
				lobbyList[lobbyList.findIndex(item => item.host === result.lobby.host)] = result.lobby;
			} else {
				lobbyList.splice(lobbyList.indexOf(lobby), 1);
			}

			setSelectedLobby(result.lobby);
		} else {
			setSelectedLobby(lobby); // In case of error, just use the cached version.
		}
	}

	const showLobbySummary = (lobby) => {
		const selected = lobby === selectedLobby;
		return (
			<div key={lobby.host} className={"lobbySummary" + ((selected) ? " selected" : "")} onClick={() => { if (!selected) { selectLobby(lobby); }}}>
				<label>{lobby.mission || lobby.host + "'s Lobby"}</label>
				<div>
					<div>{lobby.host}</div>
					<div>{lobby.players.length}/5 Players</div>
				</div>
			</div>
		);
	}

	const joinSelectedLobby = async () => {
		const result = await joinGameLobby(selectedLobby.host, state.user);

		if (result.status) {
			dispatch({ type: UPDATE_LOBBY, data: result.lobby });
		} else {
			dispatch({
				type: SHOW_MODAL,
				modal: {
					type: MODAL_GENERIC,
					title: "Failed Joining Lobby",
					text: result.message || "The lobby could not be joined.",
					buttons: {
						Ok: () => { doLobbySearch(); dispatch({ type: SHOW_MODAL }); }
					}
				}
			});
		}
	}

	const backToMenu = () => {
		dispatch({ type: SET_GAME_STATE, gameState: GAME_STATE_MAIN_MENU });
	}

	if (lobbyList === undefined) {
		setLobbyList(null);
		doLobbySearch();
	}

	const tmpList = lobbyList || [];

	return (
		<div id="lobbyBrowser">
			<div id="lobbyView" className="techPanel">
				<div className="techScreen">
					<h1>Search for Games</h1>
					<div id="browserHolder">
						<div>
							<div>
								<div>Filters</div>
								<button type="button" onClick={doLobbySearch}>Refresh</button>
							</div>
							<div id="lobbyList">
								{(tmpList?.length) ?
								tmpList.map(showLobbySummary) :
								<label>No results :(</label>}
							</div>
							<button type="button" onClick={backToMenu}>Back</button>
						</div>
						<div>
							<LobbyInfo lobby={selectedLobby} />
							<button type="button" disabled={!selectedLobby} onClick={joinSelectedLobby}>Join</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LobbyBrowser;
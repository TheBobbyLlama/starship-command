import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { searchGameLobbies, queryGameLobby, joinGameLobby } from "../../utils/firebase";

import { localizeKey } from "../../localization/localization";
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
				<label>{lobby.mission || localizeKey("LOBBY_GENERIC_TITLE", state).replace("<HOST>", lobby.host)}</label>
				<div>
					<div>{lobby.host}</div>
					<div>{lobby.players.length}/5 {localizeKey("COMMON_LABEL_PLAYERS", state)}</div>
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
					title: localizeKey("COMMON_TITLE_ERROR"),
					text: localizeKey(result.message || "SEARCH_JOIN_FAILURE", state),
					buttons: {
						[localizeKey("COMMON_BUTTON_OK", state)]: () => { doLobbySearch(); dispatch({ type: SHOW_MODAL }); }
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
					<h1>{localizeKey("SEARCH_TITLE", state)}</h1>
					<div id="browserHolder">
						<div>
							<div>
								<div>{localizeKey("COMMON_LABEL_FILTERS", state)}</div>
								<button type="button" onClick={doLobbySearch}>{localizeKey("COMMON_BUTTON_REFRESH", state)}</button>
							</div>
							<div id="lobbyList">
								{(tmpList?.length) ?
								tmpList.map(showLobbySummary) :
								<label>{localizeKey("SEARCH_NO_RESULTS", state)}</label>}
							</div>
							<button type="button" onClick={backToMenu}>{localizeKey("COMMON_BUTTON_BACK", state)}</button>
						</div>
						<div>
							<LobbyInfo lobby={selectedLobby} />
							<button type="button" disabled={!selectedLobby} onClick={joinSelectedLobby}>{localizeKey("SEARCH_BUTTON_JOIN", state)}</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LobbyBrowser;
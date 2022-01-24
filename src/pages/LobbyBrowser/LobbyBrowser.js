import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { searchGameLobbies, queryGameLobby, joinGameLobby } from "../../utils/firebase";

import { languageOptions, localizeKey } from "../../localization/localization";
import { SET_GAME_STATE, UPDATE_LOBBY, SHOW_MODAL, GAME_STATE_MAIN_MENU, MODAL_GENERIC } from "../../utils/actions";

import CheckboxWidget from "../../components/CheckboxWidget/CheckboxWidget";
import LobbyInfo from "../../components/LobbyInfo/LobbyInfo";

import "./LobbyBrowser.css";

function LobbyBrowser() {
	const [state, dispatch] = useStoreContext();
	const [filterLanguage, setFilterLanguage] = useState(true);
	const [filterStarted, setFilterStarted] = useState(false);
	const [lobbyList, setLobbyList] = useState();
	const [selectedLobby, setSelectedLobby] = useState(null);
	const [postLobbySearch, setPostLobbySearch] = useState(true);

	const toggleLanguageFilter = async () => {
		setFilterLanguage(!filterLanguage);
		setPostLobbySearch(true);
	}

	const toggleStartedFilter = async () => {
		setFilterStarted(!filterStarted);
		setPostLobbySearch(true);
	}

	const doLobbySearch = async () => {
		const filters = {};

		if (filterLanguage) {
			filters.language = state.language;
		}

		if (filterStarted) {
			filters.allowStarted = true;
		}

		const result = await searchGameLobbies(state.user, filters);

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
			dispatch({ type: UPDATE_LOBBY, data: result.lobby, missionInfo: result.missionInfo });
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

	if (postLobbySearch) {
		setLobbyList(null);
		doLobbySearch();
		setPostLobbySearch(false);
	}

	return (
		<div id="lobbyBrowser">
			<div id="lobbyView" className="techPanel">
				<div className="techScreen">
					<h1>{localizeKey("SEARCH_TITLE", state)}</h1>
					<div id="browserHolder">
						<div>
							<div>
								<div>{localizeKey("COMMON_LABEL_FILTERS", state)}</div>
								<div>
									<CheckboxWidget checked={filterLanguage} label={localizeKey("COMMON_FILTER_LANGUAGE", state).replace("<LANGUAGE>", languageOptions.find(langOpt => langOpt.key === state.language).label)} clickHandler={toggleLanguageFilter} />
									<CheckboxWidget checked={filterStarted} label={localizeKey("SEARCH_FILTER_STARTED", state)} clickHandler={toggleStartedFilter} />
								</div>
								<button type="button" onClick={doLobbySearch}>{localizeKey("COMMON_BUTTON_REFRESH", state)}</button>
							</div>
							<div id="lobbyList">
								{(lobbyList) ? (lobbyList.length) ?
								lobbyList.map(showLobbySummary) :
								<label>{localizeKey("SEARCH_NO_RESULTS", state)}</label> : <></>}
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
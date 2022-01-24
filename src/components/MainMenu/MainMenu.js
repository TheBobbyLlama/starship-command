import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { logout, createGameLobby } from "../../utils/firebase";

import { localizeKey } from "../../localization/localization";
import { GAME_STATE_LOBBY, GAME_STATE_LOBBY_SEARCH, SET_GAME_STATE } from "../../utils/actions";

import PlayerAvatar from "../PlayerAvatar/PlayerAvatar";

import "./MainMenu.css";

function MainMenu() {
	const [state, dispatch] = useStoreContext();
	const [ errorMessage, setErrorMessage ] = useState("");

	const launchLobby = async () => {
		var result = await createGameLobby(state.user, state.language);

		if (result.status) {
			dispatch({ type: SET_GAME_STATE, gameState: GAME_STATE_LOBBY, lobby: result.lobby });
		} else {
			setErrorMessage(localizeKey("MAINMENU_NEW_LOBBY_FAILURE", state));
		}
	}

	const goToLobbySearch = async () => {
		dispatch({ type: SET_GAME_STATE, gameState: GAME_STATE_LOBBY_SEARCH });
	}

	return (
		<div id="mainMenu">
			<h2>{localizeKey("MAINMENU_MAIN_MENU", state)}</h2>
			<div className="playerWidget">
				<PlayerAvatar player={state.user} />
				<div>
					<div>{state.user}</div>
					<div></div>
				</div>
			</div>
			<div>
				<button type="button" onClick={launchLobby}>{localizeKey("MAINMENU_HOST_GAME", state)}</button>
			</div>
			<div>
				<button type="button" onClick={goToLobbySearch}>{localizeKey("MAINMENU_JOIN_GAME", state)}</button>
			</div>
			<div>
				<button type="button" onClick={logout}>{localizeKey("MAINMENU_LOGOUT", state)}</button>
			</div>
			{(errorMessage) ? <div className="error">{errorMessage}</div> : <></>}
		</div>
	);
}

export default MainMenu;
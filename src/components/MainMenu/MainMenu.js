import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";

import { logout, createGameLobby } from "../../utils/firebase";
import { GAME_STATE_LOBBY, GAME_STATE_LOBBY_SEARCH, SET_GAME_STATE } from "../../utils/actions";

import PlayerAvatar from "../PlayerAvatar/PlayerAvatar";

import "./MainMenu.css";

function MainMenu() {
	const [state, dispatch] = useStoreContext();
	const [ errorMessage, setErrorMessage ] = useState("");

	const launchLobby = async () => {
		var result = await createGameLobby(state.user);

		if (result.status) {
			dispatch({ type: SET_GAME_STATE, gameState: GAME_STATE_LOBBY, lobby: result.lobby });
		} else {
			setErrorMessage("Unable to create a new lobby!");
		}
	}

	const goToLobbySearch = async () => {
		dispatch({ type: SET_GAME_STATE, gameState: GAME_STATE_LOBBY_SEARCH });
	}

	return (
		<div id="mainMenu">
			<h2>Main Menu</h2>
			<div className="playerWidget">
				<PlayerAvatar player={state.user} />
				<div>
					<div>{state.user}</div>
					<div></div>
				</div>
			</div>
			<div>
				<button type="button" onClick={launchLobby}>Host Game</button>
			</div>
			<div>
				<button type="button" onClick={goToLobbySearch}>Join Game</button>
			</div>
			<div>
				<button type="button" onClick={logout}>Logout</button>
			</div>
			{(errorMessage) ? <div className="error">{errorMessage}</div> : <></>}
		</div>
	);
}

export default MainMenu;
import LobbyView from "../../components/LobbyView/LobbyView";

import GameLogo from "../../components/GameLogo/GameLogo";

import "./LobbyScreen.css";

function LobbyScreen() {

	return (
		<div id="lobbyScreen">
			<GameLogo />
			<LobbyView />
		</div>
	);
}

export default LobbyScreen;
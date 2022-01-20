import { useStoreContext } from "../../utils/GlobalState";

import "./LobbyPlayers.css";

function LobbyPlayers() {
	const [state, dispatch] = useStoreContext();

	return (
		<div id="lobbyPlayers">
			<h2>Players</h2>
		</div>
	);
}

export default LobbyPlayers;
import { useStoreContext } from "../../utils/GlobalState";

import "./LobbyStations.css";

function LobbyStations({ host }) {
	const [state, dispatch] = useStoreContext();

	return (
		<div id="lobbyStations">
			<h2>Stations</h2>
		</div>
	);
}

export default LobbyStations;
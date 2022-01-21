import { useStoreContext } from "../../utils/GlobalState";

import LobbyStationWidget from "../LobbyStationWidget/LobbyStationWidget";

import "./LobbyStations.css";

function LobbyStations() {
	const [state, dispatch] = useStoreContext();

	return (
		<div id="lobbyStations">
			<h2>Stations</h2>
			<div>
				<div>
					<LobbyStationWidget label="Helm" />
					<LobbyStationWidget label="Weapons" />
				</div>
				<div>
					<LobbyStationWidget label="Captain" />
				</div>
				<div>
					<LobbyStationWidget label="Sensors" />
					<LobbyStationWidget label="Engineering" />
				</div>
			</div>
		</div>
	);
}

export default LobbyStations;
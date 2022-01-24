import { useStoreContext } from "../../utils/GlobalState";

import { localizeKey } from "../../localization/localization";

import LobbyStationWidget from "../LobbyStationWidget/LobbyStationWidget";

import "./LobbyStations.css";

function LobbyStations() {
	const [state, ] = useStoreContext();

	return (
		<div id="lobbyStations">
			<h2>{localizeKey("COMMON_LABEL_STATIONS", state)}</h2>
			<div>
				<div>
					<LobbyStationWidget stationKey="helm" />
					<LobbyStationWidget stationKey="weapons" />
				</div>
				<div>
					<LobbyStationWidget stationKey="captain" />
				</div>
				<div>
					<LobbyStationWidget stationKey="sensors" />
					<LobbyStationWidget stationKey="engineering" />
				</div>
			</div>
		</div>
	);
}

export default LobbyStations;
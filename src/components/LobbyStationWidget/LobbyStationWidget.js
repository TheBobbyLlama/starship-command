import { useStoreContext } from "../../utils/GlobalState";
import { assignToStation } from "../../utils/firebase";

import "./LobbyStationWidget.css";
import { localizeKey } from "../../localization/localization";

function LobbyStationWidget({ stationKey }) {
	const [state, ] = useStoreContext();
	const empty = !state.lobby[stationKey];
	const clickable = ((!state.lobby[stationKey]) || (state.lobby[stationKey] === state.user));

	const doAssignment = async () => {
		if (!!clickable) {
			var result = await assignToStation(state.lobby, state.user, stationKey);

			if (!result.status) {
				console.log("Failed to assign station!");
			}
		}
	}

	return (
		<div className={"station " + stationKey + ((empty) ? " empty" : ((clickable) ? "" : " noClick"))} onClick={doAssignment}>
			<label>{localizeKey("COMMON_STATION_" + stationKey.toUpperCase(), state)}</label>
			<div>{state.lobby[stationKey] || "Empty"}</div>
		</div>
	);
}

export default LobbyStationWidget;
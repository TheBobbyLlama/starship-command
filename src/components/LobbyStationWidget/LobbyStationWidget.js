import { useStoreContext } from "../../utils/GlobalState";
import { compactKey, assignToStation } from "../../utils/firebase";

import "./LobbyStationWidget.css";

function LobbyStationWidget({ label }) {
	const [state, ] = useStoreContext();
	const key = compactKey(label);
	const empty = !state.lobby[key];
	const clickable = ((!state.lobby[key]) || (state.lobby[key] === state.user));

	const doAssignment = async () => {
		if (!!clickable) {
			var result = await assignToStation(state.lobby, state.user, key);

			if (!result.status) {
				console.log("Failed to assign station!");
			}
		}
	}

	return (
		<div className={"station " + key + ((empty) ? " empty" : ((clickable) ? "" : " noClick"))} onClick={doAssignment}>
			<label>{label}</label>
			<div>{state.lobby[key] || "Empty"}</div>
		</div>
	);
}

export default LobbyStationWidget;
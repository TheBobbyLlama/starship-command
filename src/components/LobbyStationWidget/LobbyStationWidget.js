import { useStoreContext } from "../../utils/GlobalState";
import { compactKey } from "../../utils/firebase";

import "./LobbyStationWidget.css";

function LobbyStationWidget({ user, label }) {
	const [state, ] = useStoreContext();
	const key = compactKey(label);
	const filled = state.lobby[key];

	return (
		<div className={"station " + key + ((filled) ? ((filled !== user) ? "" : " noClick") : " empty")}>
			<label>{label}</label>
			<div>{filled || "Empty"}</div>
		</div>
	);
}

export default LobbyStationWidget;
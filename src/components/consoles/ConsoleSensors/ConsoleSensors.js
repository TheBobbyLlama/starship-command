import { useStoreContext } from "../../../utils/GlobalState";

import { localizeKey } from "../../../localization/localization";

import "./ConsoleSensors.css";

function ConsoleSensors() {
	const [state, ] = useStoreContext();

	return (
		<div id="consoleSensors" className="techPanel">
			<h2>{localizeKey("STATION_SENSORS", state)}</h2>
			<div className="techScreen">
				<h2>{localizeKey("STATION_SENSORS", state)}</h2>
				<p>TODO - Put stuff here!</p>
			</div>
		</div>
	);
}

export default ConsoleSensors;
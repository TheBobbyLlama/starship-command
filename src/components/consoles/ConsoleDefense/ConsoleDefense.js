import { useStoreContext } from "../../../utils/GlobalState";

import { localizeKey } from "../../../localization/localization";

import "./ConsoleDefense.css";

function ConsoleDefense() {
	const [state, ] = useStoreContext();
	
	return (
		<div id="consoleDefense" className="techPanel">
			<h2>{localizeKey("STATION_DEFENSE", state)}</h2>
			<div className="techScreen">
				<h2>{localizeKey("STATION_DEFENSE", state)}</h2>
				<p>TODO - Put stuff here!</p>
			</div>
		</div>
	);
}

export default ConsoleDefense;
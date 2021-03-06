import { useStoreContext } from "../../../utils/GlobalState";

import { localizeKey } from "../../../localization/localization";

import "./ConsoleEngineering.css";

function ConsoleEngineering() {
	const [state, ] = useStoreContext();

	return (
		<div id="consoleEngineering" className="techPanel">
			<h2>{localizeKey("STATION_ENGINEERING", state)}</h2>
			<div className="techScreen">
				<h2>{localizeKey("STATION_ENGINEERING", state)}</h2>
				<p>TODO - Put stuff here!</p>
			</div>
		</div>
	);
}

export default ConsoleEngineering;
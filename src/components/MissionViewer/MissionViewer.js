import { useStoreContext } from "../../utils/GlobalState";

import { localizeKey } from "../../localization/localization";
import { SHOW_MODAL } from "../../utils/actions";

import "./MissionViewer.css";

function MissionViewer() {
	const [state, dispatch] = useStoreContext();

	const clearModal = () => {
		dispatch({ type: SHOW_MODAL });
	}

	return (
		<div id="missionViewer" className="techPanel">
			<div className="techScreen">
				<h2>{state.lobby.mission}</h2>
				<div className="infoLine">
					<div>{localizeKey("MISSION_AUTHOR", state)}</div>
					<div>{state.missionInfo?.author || localizeKey("COMMON_LABEL_LOADING", state)}</div>
				</div>
				<div className="infoLine">
					<div>{localizeKey("MISSION_LENGTH", state)}</div>
					<div>{localizeKey(state.missionInfo?.length || "COMMON_LABEL_LOADING", state)}</div>
				</div>
				<div>{localizeKey("MISSION_DESCRIPTION", state)}</div>
				<div className="infoDescription">{state.missionInfo?.description || localizeKey("COMMON_LABEL_LOADING", state)}</div>
				<div><button type="button" onClick={clearModal}>{localizeKey("COMMON_BUTTON_OK", state)}</button></div>
			</div>
		</div>
	);
}

export default MissionViewer;
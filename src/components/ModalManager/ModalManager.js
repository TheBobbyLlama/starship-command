import { useStoreContext } from "../../utils/GlobalState";

import { MODAL_GENERIC, MODAL_MISSION_SELECTOR, MODAL_MISSION_VIEWER } from "../../utils/actions";

import ModalGeneric from "../ModalGeneric/ModalGeneric";
import MissionSelector from "../MissionSelector/MissionSelector";
import MissionViewer from "../MissionViewer/MissionViewer";

import "./ModalManager.css";

function ModalManager() {
	const [state, ] = useStoreContext();

	return (
		<div id="modalBG">
			{(state.modal.type === MODAL_GENERIC) ? <ModalGeneric /> : <></>}
			{(state.modal.type === MODAL_MISSION_SELECTOR) ? <MissionSelector /> : <></>}
			{(state.modal.type === MODAL_MISSION_VIEWER) ? <MissionViewer /> : <></>}
		</div>
	);
}

export default ModalManager;
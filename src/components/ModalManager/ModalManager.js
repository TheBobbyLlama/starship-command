import { useStoreContext } from "../../utils/GlobalState";

import { MODAL_GENERIC, MODAL_MISSION_SELECTOR, MODAL_MISSION_VIEWER, MODAL_VIEW_LOBBY } from "../../utils/actions";

import ModalGeneric from "../ModalGeneric/ModalGeneric";
import MissionSelector from "../MissionSelector/MissionSelector";
import MissionViewer from "../MissionViewer/MissionViewer";
import LobbyView from "../LobbyView/LobbyView";

import "./ModalManager.css";

function ModalManager() {
	const [state, ] = useStoreContext();

	return (
		<div id="modalBG">
			{(state.modal.type === MODAL_GENERIC) ? <ModalGeneric /> : <></>}
			{(state.modal.type === MODAL_MISSION_SELECTOR) ? <MissionSelector /> : <></>}
			{(state.modal.type === MODAL_MISSION_VIEWER) ? <MissionViewer /> : <></>}
			{(state.modal.type === MODAL_VIEW_LOBBY) ? <LobbyView /> : <></>}
		</div>
	);
}

export default ModalManager;
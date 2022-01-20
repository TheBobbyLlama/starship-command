import { useStoreContext } from "../../utils/GlobalState";

import { MODAL_GENERIC } from "../../utils/actions";

import ModalGeneric from "../ModalGeneric/ModalGeneric";

import "./ModalManager.css";

function ModalManager() {
	const [state, ] = useStoreContext();

	return (
		<div id="modalBG">
			{(state.modal.type === MODAL_GENERIC) ? <ModalGeneric /> : <></>}
		</div>
	);
}

export default ModalManager;
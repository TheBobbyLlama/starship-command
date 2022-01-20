import { useStoreContext } from "../../utils/GlobalState";

import "./ModalGeneric.css";

function ModalGeneric() {
	const [state, ] = useStoreContext();

	return (
		<div className="modal">
			<h2>{state.modal.title}</h2>
			{state.modal.text.split("\n").map(item => { return (<p key={item}>{item}</p>);})}
			<div>
				{Object.entries(state.modal.buttons).map(item => {
					return (<button key={item[0]} type="button" onClick={item[1]}>{item[0]}</button>);
				})}
			</div>
		</div>
	);
}

export default ModalGeneric;
import { useStoreContext } from "../../utils/GlobalState";

import "./GameScreen.css";

function GameScreen() {
	const [state, ] = useStoreContext();

	console.log(state);

	return (
		<div id="gameScreen">
			<h1>To Space and Beyond!</h1>
		</div>
	);
};

export default GameScreen;
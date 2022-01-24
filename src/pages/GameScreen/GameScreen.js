import { useStoreContext } from "../../utils/GlobalState";

import TitleCard from "../../components/TitleCard/TitleCard";
import StationCaptain from "../../components/StationCaptain/StationCaptain";

import "./GameScreen.css";

function GameScreen() {
	const [state, ] = useStoreContext();

	return (
		<div id="gameScreen">
			<TitleCard title={state.lobby.mission} />
			{(state.lobby.captain === state.user) ? <StationCaptain /> : <></>}
		</div>
	);
};

export default GameScreen;
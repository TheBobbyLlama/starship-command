import { useStoreContext } from "../../utils/GlobalState";

import { SHOW_MODAL, MODAL_VIEW_LOBBY } from "../../utils/actions";

import TitleCard from "../../components/TitleCard/TitleCard";
import StationCaptain from "../../components/StationCaptain/StationCaptain";
import StationHelmWeapons from "../../components/StationHelmWeapons/StationHelmWeapons";

import "./GameScreen.css";

function GameScreen() {
	const [state, dispatch] = useStoreContext();

	const showLobbyScreen = () => {
		dispatch({ type: SHOW_MODAL, modal: { type: MODAL_VIEW_LOBBY } });
	}

	return (
		<div id="gameScreen">
			<TitleCard title={state.lobby.mission} />
			<div id="viewLobby" onClick={showLobbyScreen}>-</div>
			{(state.lobby.captain === state.user) ? <StationCaptain /> : <></>}
			{((state.lobby.helm === state.user) || (state.lobby.weapons === state.user)) ? <StationHelmWeapons /> : <></>}
		</div>
	);
};

export default GameScreen;
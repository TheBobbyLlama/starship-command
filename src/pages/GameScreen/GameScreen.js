import { useStoreContext } from "../../utils/GlobalState";

import { SHOW_MODAL, MODAL_VIEW_LOBBY } from "../../utils/actions";

import GameListener from "../../components/GameListener/GameListener";
import GameSoundManager from "../../components/GameSoundManager/GameSoundManager";


import TitleCard from "../../components/TitleCard/TitleCard";
import StationCaptain from "../../components/stations/StationCaptain/StationCaptain";
import StationHelmWeapons from "../../components/stations/StationHelmWeapons/StationHelmWeapons";
import StationEngineeringSensors from "../../components/stations/StationEngineeringSensors/StationEngineeringSensors";

import "./GameScreen.css";

function GameScreen() {
	const [state, dispatch] = useStoreContext();

	const showLobbyScreen = () => {
		dispatch({ type: SHOW_MODAL, modal: { type: MODAL_VIEW_LOBBY } });
	}

	return (
		<>
		<GameListener />
		<GameSoundManager />
		<div id="gameScreen">
			<TitleCard title={state.lobby.mission} />
			<div id="viewLobby" onClick={showLobbyScreen}>-</div>
			{(state.lobby.captain === state.user) ? <StationCaptain /> : <></>}
			{((state.lobby.helm === state.user) || (state.lobby.weapons === state.user)) ? <StationHelmWeapons /> : <></>}
			{((state.lobby.engineering === state.user) || (state.lobby.sensors === state.user)) ? <StationEngineeringSensors /> : <></>}
		</div>
		</>
	);
};

export default GameScreen;
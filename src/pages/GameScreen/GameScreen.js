import { useEffect, useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";

import { SHOW_MODAL, MODAL_VIEW_LOBBY } from "../../utils/actions";
import { thinkSpeed, gameThink } from "../../utils/globals";
import { postGameStateUpdate } from "../../utils/firebase";

import GameListener from "../../components/GameListener/GameListener";
import GameSoundManager from "../../components/GameSoundManager/GameSoundManager";


import TitleCard from "../../components/TitleCard/TitleCard";
import StationCaptain from "../../components/stations/StationCaptain/StationCaptain";
import StationHelmDefense from "../../components/stations/StationHelmDefense/StationHelmDefense";
import StationEngineeringSensors from "../../components/stations/StationEngineeringSensors/StationEngineeringSensors";

import "./GameScreen.css";

function GameScreen() {
	const [state, dispatch] = useStoreContext();
	const [lastThink, setLastThink ] = useState(0);

	useEffect(() => {
		const doGameThink = () => {
			if (Date.now() > lastThink + thinkSpeed) {
				const thinkResult = gameThink(state.gameData, state.missionData);
				postGameStateUpdate(state.lobby.host, thinkResult.dataUpdates, state.gameData);

				setLastThink(Date.now());
			}
		}

		var thinkMe;
		
		if (state.user === state.lobby.host) {
			thinkMe = setInterval(doGameThink, thinkSpeed);
			doGameThink();
		}

		return () => clearInterval(thinkMe);
	}, [ lastThink, state.user, state.lobby.host, state.gameData, state.missionData]);

	const showLobbyScreen = () => {
		dispatch({ type: SHOW_MODAL, modal: { type: MODAL_VIEW_LOBBY } });
	}

	// If we still need to query game state, only instantiate the listener to get it.
	if (!state.gameData) {
		return <>
			<GameListener />
		</>;
	}

	return (
		<>
		<GameListener />
		<GameSoundManager />
		<div id="gameScreen">
			<TitleCard title={state.lobby.mission} />
			<div id="viewLobby" onClick={showLobbyScreen}>-</div>
			{(state.lobby.captain === state.user) ? <StationCaptain /> : <></>}
			{((state.lobby.helm === state.user) || (state.lobby.defense === state.user)) ? <StationHelmDefense /> : <></>}
			{((state.lobby.engineering === state.user) || (state.lobby.sensors === state.user)) ? <StationEngineeringSensors /> : <></>}
		</div>
		</>
	);
};

export default GameScreen;
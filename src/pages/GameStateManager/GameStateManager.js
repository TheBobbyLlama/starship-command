import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import { useStoreContext } from "../../utils/GlobalState";
import { GAME_STATE_MAIN_MENU, GAME_STATE_LOBBY, GAME_STATE_LOBBY_SEARCH, GAME_STATE_MISSION, SET_GAME_STATE, SET_CURRENT_USER } from "../../utils/actions";

import TitleScreen from "../TitleScreen/TitleScreen";
import LobbyScreen from "../LobbyScreen/LobbyScreen";
import LobbyBrowser from "../LobbyBrowser/LobbyBrowser";

import LobbyListener from "../../components/LobbyListener/LobbyListener";
import ModalManager from "../../components/ModalManager/ModalManager";

function GameStateManager() {
	const [user, authLoading, ] = useAuthState(auth);
	const [state, dispatch] = useStoreContext();

	useEffect(() => {
		dispatch({ type: SET_CURRENT_USER, username: user?.displayName });
	}, [ user ]);

	if ((state.gameState !== GAME_STATE_MAIN_MENU) && (!authLoading) && (!user)) {
		dispatch({ type: SET_GAME_STATE, gameState: GAME_STATE_MAIN_MENU });
		return <></>;
	}

	return (
		<>
			{(state.gameState === GAME_STATE_MAIN_MENU) ? <TitleScreen /> : <></>}
			{(state.gameState === GAME_STATE_LOBBY) ? <LobbyScreen /> : <></>}
			{(state.gameState === GAME_STATE_LOBBY_SEARCH) ? <LobbyBrowser /> : <></>}
			{(!!state.modal) ? <ModalManager /> : <></>}
			{(!!state.lobby) ? <LobbyListener /> : <></>}
		</>
	);
}

export default GameStateManager;
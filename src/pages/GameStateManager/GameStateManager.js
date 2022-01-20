import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import { useStoreContext } from "../../utils/GlobalState";
import { GAME_STATE_MAIN_MENU, GAME_STATE_LOBBY, GAME_STATE_LOBBY_SEARCH, GAME_STATE_MISSION, SET_GAME_STATE } from "../../utils/actions";

import TitleScreen from "../TitleScreen/TitleScreen";

function GameStateManager() {
	const [user, authLoading, ] = useAuthState(auth);
	const [state, dispatch] = useStoreContext();

	if ((state.gameState !== GAME_STATE_MAIN_MENU) && (!user)) {
		dispatch({ type: SET_GAME_STATE, gameState: GAME_STATE_MAIN_MENU });
	}

	return (
		<>
			{(state.gameState === GAME_STATE_MAIN_MENU) ? <TitleScreen /> : <></>}
		</>
	);
}

export default GameStateManager;
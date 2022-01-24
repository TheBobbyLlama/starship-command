import React, { createContext, useContext } from "react";
import { GAME_STATE_MAIN_MENU } from "./actions";
import { useGameReducer } from "./reducers";

const StoreContext = createContext();
const { Provider } = StoreContext;

const StoreProvider = ({ value = [], ...props }) => {
	// Set default state here.
	const [state, dispatch] = useGameReducer({
		gameState: GAME_STATE_MAIN_MENU,
		avatars: {},
		notifications: []
	});
	return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
	return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
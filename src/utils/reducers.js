import { useReducer } from "react";

import {
	SET_GAME_STATE
} from "./actions";

export const reducer = (state, action) => {
	let newState;

	switch (action.type) {
		case SET_GAME_STATE:
			newState = { ...state };
			newState.gameState = action.gameState;
			return newState;
		default:
			return state;
	}
}

export function useGameReducer(initialState) {
	return useReducer(reducer, initialState);
}
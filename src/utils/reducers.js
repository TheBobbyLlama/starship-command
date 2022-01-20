import { useReducer } from "react";

import {
	SET_GAME_STATE,
	SHOW_MODAL,
	GAME_STATE_LOBBY
} from "./actions";

export const reducer = (state, action) => {
	let newState;

	switch (action.type) {
		case SET_GAME_STATE:
			newState = { ...state };
			newState.oldGameState = newState.gameState;
			newState.gameState = action.gameState;
			delete newState.modal;

			switch (action.gameState) {
				case GAME_STATE_LOBBY:
					newState.lobby = action.lobby;
					break;
				default:
					break;
			}
			return newState;
		case SHOW_MODAL:
			newState = { ...state };

			if (action.modal) {
				newState.modal = action.modal;
			} else {
				delete newState.modal;
			}

			return newState;
		default:
			return state;
	}
}

export function useGameReducer(initialState) {
	return useReducer(reducer, initialState);
}
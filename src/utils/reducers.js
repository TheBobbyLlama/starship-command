import { useReducer } from "react";

import {
	SET_GAME_STATE,
	SET_CURRENT_USER,
	UPDATE_LOBBY,
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
		case SET_CURRENT_USER:
			newState = { ...state };
			newState.user = action.username;
			return newState;
		case UPDATE_LOBBY:
			newState = { ...state };

			if (action.path) {
				newState.lobby = { ...newState.lobby };
				let pathComponents = action.path.split("/");
				let curPath = newState.lobby;

				for (let i = 0; i < pathComponents.length; i++) {
					curPath = curPath[pathComponents[i]];
				}

				curPath = action.data;
			} else {
				newState.lobby = action.data;
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
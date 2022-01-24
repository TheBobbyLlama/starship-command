import { useReducer } from "react";

import {
	SET_LOCALIZATION,
	SET_GAME_STATE,
	SET_CURRENT_USER,
	UPDATE_LOBBY,
	ADD_NOTIFICATION,
	SHOW_MODAL,
	GAME_STATE_MAIN_MENU,
	GAME_STATE_LOBBY,
	GAME_STATE_LOBBY_SEARCH,
	GAME_STATE_MISSION
} from "./actions";

export const reducer = (state, action) => {
	let newState;

	switch (action.type) {
		case SET_LOCALIZATION: {
			newState = { ...state };
			newState.language = action.language;
			newState.localization = action.data;
			return newState;
		}
		case SET_GAME_STATE:
			newState = { ...state };
			newState.oldGameState = newState.gameState;
			newState.gameState = action.gameState;
			delete newState.modal;

			switch (action.gameState) {
				case GAME_STATE_LOBBY:
					newState.lobby = action.lobby;
					newState.missionInfo = action.missionInfo;
					delete newState.missionData;
					newState.notifications = [];
					break;
				case GAME_STATE_MISSION:
					// TODO - Set game and mission data!
					break;
				default:
					delete newState.missionInfo;
					delete newState.missionData;
					newState.notifications = [];
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

			if ((!action.path) && (!action.data)) {
				newState.gameState = GAME_STATE_MAIN_MENU;
				delete newState.modal;
			} else if (newState.gameState === GAME_STATE_LOBBY_SEARCH) {
				newState.gameState = GAME_STATE_LOBBY;
			}

			if (action.missionInfo) {
				newState.missionInfo = action.missionInfo;
			}

			return newState;
		case ADD_NOTIFICATION:
			newState = { ...state };

			newState.notifications = [...state.notifications];
			newState.notifications.push({ message: action.message, expires: (Date.now() + 5000) });

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
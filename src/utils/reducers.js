import { useReducer } from "react";

import {

} from "./actions";

export const reducer = (state, action) => {
	let newState;

	switch (action.type) {
		default:
			return state;
	}
}

export function useGameReducer(initialState) {
	return useReducer(reducer, initialState);
}
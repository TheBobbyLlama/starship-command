import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, update, push, remove, runTransaction, off, onChildAdded, onDisconnect, onValue, serverTimestamp } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, updateProfile } from "firebase/auth";

import { bridgeStations, generateGameState } from "./globals";

import { LOBBY_PLAYER_JOIN, LOBBY_PLAYER_LEAVE } from "./events";

const tmpKey  = "A5TCtThImOd343zoEnbBcaQXrs9YSnXfEijyUML";

const assembleKey = function(input) {
	var buildKey = "";

	for (var i = 0; i < tmpKey.length; i++) {
		buildKey += input[(7 * i) % input.length];
	}

	return buildKey;
}

export const compactKey = (key) => {
	return key.replace(/\W/g, "").toLowerCase();
}

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: assembleKey(tmpKey),
	authDomain: "bobs-bridge-simulator.firebaseapp.com",
	databaseURL: "https://bobs-bridge-simulator-default-rtdb.firebaseio.com",
	projectId: "bobs-bridge-simulator",
	storageBucket: "bobs-bridge-simulator.appspot.com",
	messagingSenderId: "883896101132",
	appId: "1:883896101132:web:dab4542042ee38cf2e8129",
	measurementId: "G-S0K88ZWE7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const listeners = {};
const disconnectHandlers = {};
export const auth = getAuth(app);
export const db = getDatabase(app);

// -------------------------------------------------------
// SHARED FUNCTIONALITY
// -------------------------------------------------------

export const createListener = async (path, host, callback) => {
	try {
		var hostKey = compactKey(host);
		var keyPath = compactKey(path);
		var fullPath = path + hostKey;

		if (listeners[keyPath]) {
			// No need to keep going if we already have the correct listener.
			console.log(listeners[keyPath].path.pieces[1], hostKey);
			if (listeners[keyPath].path.pieces[1] === hostKey) {
				return;
			} else {
				await killListener(keyPath);
			}
		}

		listeners[keyPath] = ref(db, fullPath);

		await onValue(listeners[keyPath], (data) => callback(data?.val()));
	} catch {
		console.log("Error: Couldn't retrieve '" + path + "' listener!");
	}
}

export const createEventListener = async (path, host, callback) => {
	try {
		var hostKey = compactKey(host);
		var keyPath = compactKey(path);
		var fullPath = path + compactKey(host);

		if (listeners[keyPath]) {
			// No need to keep going if we already have the correct listener.
			console.log(listeners[keyPath].path.pieces[1], hostKey);
			if (listeners[keyPath].path.pieces[1] === hostKey) {
				return;
			} else {
				await killListener(keyPath);
			}
		}

		listeners[keyPath] = ref(db, fullPath);

		await onChildAdded(listeners[keyPath], (data) => callback(data?.val()));
	} catch {
		console.log("Error: Couldn't retrieve '" + path + "' event listener!");
	}
}

export const killListener = async (path) => {
	var keyPath = compactKey(path);

	if (listeners[keyPath]) {
		off(listeners[keyPath]);
		delete listeners[keyPath];
	}
}

// -------------------------------------------------------
// AUTHENTICATION
// -------------------------------------------------------

export const logInWithEmailAndPassword = async (email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		return { status: true };
	} catch (err) {
		return { status: false };
	}
};

export const registerWithEmailAndPassword = async (username, email, password) => {
	try {
		const pathRef = ref(db, "/users/" + compactKey(username));
		const existing = await get(pathRef);

		if (existing.val()) {
			return { status: false, message: "AUTH_REGISTRATION_EXISTS" };
		}

		const res = await createUserWithEmailAndPassword(auth, email, password);
		const user = res.user;

		await updateProfile(user, { displayName: username });

		await set(pathRef, {
			uid: user.uid,
			display: username
		});
		return { status: true };
	} catch (err) {
		return { status: false };
	}
};

export const sendPasswordReset = async (email) => {
	try {
		await sendPasswordResetEmail(auth, email);
		return { status: true };
	} catch (err) {
		return { status: false };
	}
};

export const logout = () => {
	signOut(auth);
};

// -------------------------------------------------------
// LOBBY
// -------------------------------------------------------

export const createGameLobby = async (username, language) => {
	try {
		var lobbyPath = "/lobby/" + compactKey(username);
		var newLobby = { captain: username, host: username, language, lastPulse: serverTimestamp(), players: [ username ] };

		var testMe = await get(ref(db, lobbyPath));
		testMe = testMe.val();

		// If we disconnected and came back within a minute, keep our last lobby alive.
		if ((testMe?.host) && (Date.now() - testMe.lastPulse < 60000)) {
			newLobby = testMe;
			newLobby.lastPulse = Date.now();
			await set(ref(db, lobbyPath + "/lastPulse"), newLobby.lastPulse);
		} else {
			const updates = {};
			updates[lobbyPath] = newLobby;
			updates["/lobby_event/" + compactKey(username)] = null;

			await update(ref(db), updates);
		}

		disconnectHandlers.lobby = onDisconnect(ref(db, lobbyPath + "/lastPulse"));
		disconnectHandlers.lobby.set(serverTimestamp());

		return { status: true, lobby: newLobby };
	} catch (err) {
		console.log(err);
		return { status: false };
	}
}

export const closeGameLobby = async (username) => {
	try {
		var hostKey = compactKey(username);
		var lobbyPath = "/lobby/" + hostKey;
		var lobbyEventPath = "/lobby_event/" + hostKey;
		var gamePath = "/game/" + hostKey;
		var gameEventPath = "/game_event/" + hostKey;

		disconnectHandlers.lobby?.cancel();
		delete disconnectHandlers.lobby;

		const updates = {};
		updates[lobbyPath] = null;
		updates[lobbyEventPath] = null;
		updates[gamePath] = null;
		updates[gameEventPath] = null;

		await update(ref(db), updates);

		return { status: true };
	} catch (err) {
		return { status: false };
	}
}

export const keepGameLobbyAlive = async (username) => {
	try {
		await set(ref(db, "/lobby/" + compactKey(username) + "/lastPulse"), serverTimestamp());
	} catch {
		console.log("Error sending lobby tick!");
	}
}

export const queryGameLobby = async (host) => {
	try {
		const hostKey = compactKey(host);
		const lobbyPath = "/lobby/" + hostKey;
		const lobbyRef = ref(db, lobbyPath);

		const lobby = (await get(lobbyRef)).val();

		return { status: true, lobby };
	} catch (err) {
		return { status: false };
	}
}

export const joinGameLobby = async (host, username) => {
	try {
		const hostKey = compactKey(host);
		const lobbyPath = "/lobby/" + hostKey;
		const eventPath = "/lobby_event/" + hostKey;

		const lobbyRef = ref(db, lobbyPath);
		const eventRef = ref(db, eventPath);

		const lobby = (await get(lobbyRef)).val();

		if (lobby.players >= 5) {
			throw new RangeError("SEARCH_LOBBY_FULL");
		}

		await runTransaction(ref(db, lobbyPath + "/players"), (players) => {
			if ((players) && (players.indexOf(username) < 0)) {
				players.push(username);
				players.sort();
			}
			return players;
		});

		await push(eventRef, { type: LOBBY_PLAYER_JOIN, data: username, timestamp: Date.now() });

		const missionInfo = ((lobby.mission) ? (await get(ref(db, "/mission_summary/" + compactKey(lobby.mission)))).val() : undefined);

		// TODO - How to handle disconnects???

		return { status: true, lobby, missionInfo };
	} catch (err) {
		return { status: false, message: err.message };
	}
}

export const leaveGameLobby = async (lobby, username) => {
	try {
		const hostKey = compactKey(lobby.host);
		const lobbyPath = "/lobby/" + hostKey;

		await runTransaction(ref(db, lobbyPath), (lobby) => {
			if (lobby) {
				lobby.players = lobby.players.filter(name => name !== username);

				bridgeStations.forEach(slot => {
					if (lobby[slot] === username) {
						delete lobby[slot];
					}
				});

				if (lobby.ready) {
					delete lobby.ready[compactKey(username)];
				}
			}
			
			return lobby;
		});

		await push(ref(db, "/lobby_event/" + hostKey), { type: LOBBY_PLAYER_LEAVE, data: username, timestamp: Date.now() });

		disconnectHandlers.lobby?.cancel();
		delete disconnectHandlers.lobby;

		return { status: true };
	} catch (err) {
		console.log(err);
		return { status: false };
	}
}

// TODO - Could these collide if players try for the same station simultaneously?
export const assignToStation = async (lobby, username, station) => {
	try {
		const hostKey = compactKey(lobby.host);
		const updates = {};

		if (lobby[station] !== username) {
			updates[station] = username;
		}

		bridgeStations.forEach(oldStation => {
			if (lobby[oldStation] === username) {
				updates[oldStation] = null;
			}
		});

		updates["ready/" + compactKey(username)] = null;

		await update(ref(db, "/lobby/" + hostKey), updates);

		return { status: true };
	} catch {
		return { status: false };
	}
}

export const setLobbyReadyStatus = async (host, username, status) => {
	try
	{
		const pathRef = ref(db, "/lobby/" + compactKey(host) + "/ready/" + compactKey(username));

		if (status) {
			await set(pathRef, true);
		} else {
			await remove(pathRef);
		}

		return { status: true };
	} catch (err) {
		console.log(err);
		return {status: false }
	}
}

export const searchGameLobbies = async (username, filters) => {
	try {
		const tmpList = (await get(ref(db, "/lobby"))).val();
		const lobbyList = Object.entries(tmpList).map(item => item[1]).filter(item => {
			if (Date.now() - item.lastPulse > 60000) {
				return false;
			} else if (item.players.indexOf(username) >= 0) {
				return true; // Special case!  Any lobby that we disconnected from is okay!
			} else if (item.players.length >= 5) {
				return false;
			} else if ((filters.language) && (item.language !== filters.language)) {
				return false;
			} else if ((!filters.allowStarted) && (item.missionStarted)) {
				return false;
			}

			return true;
		});

		lobbyList.sort((a, b) => {
			if (a.players.indexOf(username) >= 0) {
				return -1;
			} else if (b.players.indexOf(username) >= 0) {
				return 1;
			} else {
				return b.players.length - a.players.length;
			}
		});

		return { status: true, lobbyList };
	} catch (err) {
		return { status: false };
	}
}

export const getMissionSummary = async (name) => {
	try {
		const summary = (await (get(ref(db, "/mission_summary/" + compactKey(name))))).val();

		return { status: true, summary };
	} catch (err) {
		return { status: false };
	}
}

export const searchMissions = async (filters) => {
	try {
		const tmpList = (await get(ref(db, "/mission_summary"))).val();
		const missionList = Object.entries(tmpList).map(item => item[1]).filter(item => {
			if ((filters.language) && (item.language !== filters.language)) {
				return false;
			}

			return true;
		});

		return { status: true, missionList };
	} catch (err) {
		return { status: false };
	}
}

export const setLobbyMission = async (host, missionTitle) => {
	try {
		const hostKey = compactKey(host);
		const updates = {};

		updates["mission"] = missionTitle;
		updates["ready"] = null;

		await update(ref(db, "/lobby/" + hostKey), updates);

		return { status: true };
	} catch (err) {
		console.log(err);
		return { status: false };
	}
}

export const launchGame = async (lobby) => {
	try {
		const hostKey = compactKey(lobby.host);
		const updates = {};

		updates["/lobby/" + hostKey + "/missionStarted"] = true;
		updates["/game/" + hostKey] = await generateGameState("SHIP_CLASS_LIGHT_CRUISER");

		await update(ref(db), updates);

		return { status: true };
	} catch (err) {
		console.log(err);
		return { status: false, message: err.message };
	}
}

export const getGameData = async (host) => {
	try {
		const hostKey = compactKey(host);

		const gameData = await get(ref(db, "/game/" + hostKey));

		return { status: true, gameData: gameData.val() };
	} catch (err) {
		console.log(err);
		return { status: false, message: err.message };
	}
}

export const sendGameEvent = async(host, event) => {
	try {
		const hostKey = compactKey(host);
		event.timestamp = Date.now();
		await push(ref(db, "/game_event/" + hostKey), event);
	} catch (err) {
		console.log(err);
	}
}

// -------------------------------------------------------
// GAMEPLAY
// -------------------------------------------------------

export const postGameStateUpdate = async (host, updateList, gameData) => {
	if (!updateList.length) return;

	try {
		var gamePath = "/game/" + compactKey(host);
		const updates = {};

		updateList.forEach(path => {
			var findPath = gameData;
			path.split("/").forEach(subPath => findPath = findPath[subPath]);
			updates[path] = findPath;
		});

		await update(ref(db, gamePath), updates);
	} catch (err) {
		console.log(err);
	}
}

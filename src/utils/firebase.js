import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, update, remove, onDisconnect, serverTimestamp } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, updateProfile } from "firebase/auth";

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
const disconnectHandlers = {};
export const auth = getAuth(app);
export const db = getDatabase(app);

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
			return { status: false, message: "Username already exists!" };
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

export const createGameLobby = async (username) => {
	try {
		var lobbyPath = "/lobby/" + compactKey(username);
		var newLobby = { captain: username, host: username, lastPulse: serverTimestamp(), players: [ username ] };

		var testMe = await get(ref(db, lobbyPath));
		testMe = testMe.val();

		// If we disconnected and came back within a minute, keep our last lobby alive.
		if ((testMe) && (Date.now() - testMe.lastPulse < 60000)) {
			newLobby = testMe;
			newLobby.lastPulse = Date.now();
			await set(ref(db, lobbyPath + "/lastPulse"), newLobby.lastPulse);
		} else {
			const updates = {};
			updates[lobbyPath] = newLobby;
			updates["/lobby_events/" + compactKey(username)] = null;

			await update(ref(db), updates);
		}

		disconnectHandlers.lobby = onDisconnect(ref(db, lobbyPath + "/lastPulse"));
		disconnectHandlers.lobby.set(serverTimestamp());

		return { status: true, lobby: newLobby };
	} catch (err) {
		return { status: false };
	}
}

export const closeGameLobby = async (username) => {
	try {
		var lobbyPath = "/lobby/" + compactKey(username);

		disconnectHandlers.lobby?.cancel();
		delete disconnectHandlers.lobby;

		await remove(ref(db, lobbyPath));

		return { status: true };
	} catch (err) {
		return { status: false };
	}
}

export const keepLobbyAlive = async (username) => {
	try {
		await set(ref(db, "/lobby/" + compactKey(username) + "/lastPulse"), serverTimestamp());
	} catch {
		console.log("Error sending lobby tick!");
	}
}
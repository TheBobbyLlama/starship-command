import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, update } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, updateProfile } from "firebase/auth";

const tmpKey  = "A5TCtThImOd343zoEnbBcaQXrs9YSnXfEijyUML";

const assembleKey = function(input) {
	var buildKey = "";

	for (var i = 0; i < tmpKey.length; i++) {
		buildKey += input[(7 * i) % input.length];
	}

	return buildKey;
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
const auth = getAuth(app);
const db = getDatabase(app);

const logInWithEmailAndPassword = async (email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		return { status: true };
	} catch (err) {
		return { status: false };
	}
};

const registerWithEmailAndPassword = async (username, email, password) => {
	try {
		const userPath = "users/" + compactKey(username);
		const pathRef = ref(db, "users/" + compactKey(username))
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

const sendPasswordReset = async (email) => {
	try {
		await sendPasswordResetEmail(auth, email);
		return { status: true };
	} catch (err) {
		return { status: false };
	}
};

const logout = () => {
	signOut(auth);
};

const compactKey = (key) => {
	return key.replace(/\W/g, "").toLowerCase();
}

export { db, auth, logInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, logout, compactKey };
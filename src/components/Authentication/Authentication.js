import { useState } from "react";
import { logInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset } from "../../utils/firebase";
import { useStoreContext } from "../../utils/GlobalState";

import { localizeKey } from "../../localization/localization";
import { detectProfanity } from "../../utils/utils";

import "./Authentication.css";

function Authentication() {
	const [state, ] = useStoreContext();

	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ username, setUsername ] = useState("");

	const [ canLogin, setCanLogin ] = useState(false);
	const [ canReset, setCanReset ] = useState(false);
	const [ canRegister, setCanRegister ] = useState(false);
	const [ statusMessage, setStatusMessage ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");

	const enableButtons = () => {
		var newStatus = "";
		var newError = "";
		const emailValid = !!email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x21\x23-\x5b\x5d-\x7f]|\\[\x20-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x21-\x5a\x53-\x7f]|\\[\x20-\x7f])+)\])/);
		const passwordValid = !!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
		const usernameProfane = detectProfanity(username);
		const usernameValid = ((!usernameProfane) && (username.match(/^[A-Za-z].{1,18}\S$/)));

		if (usernameProfane) {
			newError = localizeKey("COMMON_MESSAGE_PROFANITY", state);
		}

		setCanLogin(((emailValid) && (passwordValid)));
		setCanReset(!!emailValid);
		setCanRegister(((emailValid) && (passwordValid) && (usernameValid)));
		setStatusMessage(newStatus);
		setErrorMessage(newError);
	}

	const tryLogin = async () => {
		const result = await logInWithEmailAndPassword(email, password);

		if (!result.status) {
			setErrorMessage(localizeKey(result.message || "AUTH_LOGIN_FAILURE", state));
		}
	}

	const tryReset = async () => {
		const result = await sendPasswordReset(email);

		if (result.status) {
			setStatusMessage(localizeKey("AUTH_PASSWORD_RESET_SUCCESS", state));
		} else {
			setErrorMessage(localizeKey(result.message || "AUTH_PASSWORD_RESET_FAILURE", state));
		}
	}

	const tryRegister = async () => {
		const result = await registerWithEmailAndPassword(username, email, password);

		if (!result.status) {
			setErrorMessage(localizeKey(result.message || "AUTH_REGISTRATION_FAILED", state));
		}
	}

	return (
		<div id="auth">
			<h2>{localizeKey("AUTH_SIGNIN", state)}</h2>
			<div>
				<label htmlFor="email">{localizeKey("AUTH_EMAIL", state)}</label>
				<input type="text" name="email" value={email} onBlur={enableButtons} onChange={e => { setEmail(e.target.value); enableButtons(); }}></input>
			</div>
			<div>
				<label htmlFor="password">{localizeKey("AUTH_PASSWORD", state)}</label>
				<input type="password" name="password" value={password} onBlur={enableButtons} onChange={e => { setPassword(e.target.value); enableButtons(); }}></input>
			</div>
			<div>
				<div>
					<button type="button" disabled={!canLogin} onClick={tryLogin}>{localizeKey("AUTH_LOGIN", state)}</button>
					<button type="button" disabled={!canReset} onClick={tryReset}>{localizeKey("AUTH_RESET", state)}</button>
				</div>
			</div>
			<div>
				<label htmlFor="username">{localizeKey("AUTH_USERNAME", state)}</label>
				<input type="text" name="username" maxLength={20} value={username} onBlur={enableButtons} onChange={e => { setUsername(e.target.value); enableButtons(); }}></input>
			</div>
			<div>
				<div>
					<button type="button" disabled={!canRegister} onClick={tryRegister}>{localizeKey("AUTH_SIGNUP", state)}</button>
				</div>
			</div>
			{(statusMessage) ? <div className="status">{statusMessage}</div> : <></>}
			{(errorMessage) ? <div className="authError">{errorMessage}</div> : <></>}
		</div>
	);
}

export default Authentication;
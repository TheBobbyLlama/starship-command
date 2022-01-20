import { useState } from "react";
import { logInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, logout, compactKey } from "../../utils/firebase";

import "./Authentication.css";

function Authentication() {
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ username, setUsername ] = useState("");

	const [ canLogin, setCanLogin ] = useState(false);
	const [ canReset, setCanReset ] = useState(false);
	const [ canRegister, setCanRegister ] = useState(false);
	const [ statusMessage, setStatusMessage ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");

	const enableButtons = () => {
		const emailValid = !!email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);
		const passwordValid = !!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
		const usernameValid = (username.length > 2);

		setCanLogin(((emailValid) && (passwordValid)));
		setCanReset(!!emailValid);
		setCanRegister(((emailValid) && (passwordValid) && (usernameValid)));
		setStatusMessage("");
		setErrorMessage("");
	}

	const tryLogin = async () => {
		const result = await logInWithEmailAndPassword(email, password);

		if (!result.status) {
			setErrorMessage(result.message || "Login failed.  Please check your username and password.");
		}
	}

	const tryReset = async () => {
		const result = await sendPasswordReset(email);

		if (result.status) {
			setStatusMessage("Password reset sent!  Please check your email for further instructions.");
		} else {
			setErrorMessage(result.message || "Invalid email.");
		}
	}

	const tryRegister = async () => {
		const result = await registerWithEmailAndPassword(username, email, password);

		if (!result.status) {
			setErrorMessage(result.message || "Account creation failed.");
		}
	}

	return (
		<div id="auth">
			<h2>Sign In</h2>
			<div>
				<label htmlFor="email">Email Address</label>
				<input type="text" name="email" value={email} onBlur={enableButtons} onChange={e => { setEmail(e.target.value); enableButtons(); }}></input>
			</div>
			<div>
				<label htmlFor="password">Password</label>
				<input type="password" name="password" value={password} onBlur={enableButtons} onChange={e => { setPassword(e.target.value); enableButtons(); }}></input>
			</div>
			<div>
				<div>
					<button type="button" disabled={!canLogin} onClick={tryLogin}>Login</button>
					<button type="button" disabled={!canReset} onClick={tryReset}>Reset Password</button>
				</div>
			</div>
			<div>
				<label htmlFor="username">Username</label>
				<input type="text" name="username" value={username} onBlur={enableButtons} onChange={e => { setUsername(e.target.value); enableButtons(); }}></input>
			</div>
			<div>
				<div>
					<button type="button" disabled={!canRegister} onClick={tryRegister}>Register</button>
				</div>
			</div>
			{(statusMessage) ? <div className="status">{statusMessage}</div> : <></>}
			{(errorMessage) ? <div className="authError">{errorMessage}</div> : <></>}
		</div>
	);
}

export default Authentication;
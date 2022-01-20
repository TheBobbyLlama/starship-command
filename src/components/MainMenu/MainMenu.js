import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, logout } from "../../utils/firebase";

import "./MainMenu.css";

function MainMenu() {
	const [user, , ] = useAuthState(auth);

	return (
		<div id="mainMenu">
			<h2>Main Menu</h2>
			<div id="userInfo">
				<div> </div>
				<div>{user.displayName}</div>
			</div>
			<div>
				<button type="button">Host Game</button>
			</div>
			<div>
				<button type="button">Join Game</button>
			</div>
			<div>
				<button type="button" onClick={logout}>Logout</button>
			</div>
		</div>
	);
}

export default MainMenu;
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";

import Authentication from "../../components/Authentication/Authentication";
import MainMenu from "../../components/MainMenu/MainMenu";

import "./TitleScreen.css";

function TitleScreen() {
	const [user, authLoading, ] = useAuthState(auth);

	return (
		<div id="titleScreen">
			<div className="techPanel">
				<div id="menuHolder" className="techScreen">
					<div>
						<h1>Welcome to Bob's Bridge Simulator!</h1>
						<p>
							This is a cooperative multiplayer game where players take control of different consoles on a starship and work together to finish their mission!
						</p>
					</div>
					{ (authLoading) ? 
						<div><h2>Loading...</h2></div>
						: (user) ?
							<MainMenu />
							: <Authentication />}
				</div>
			</div>
		</div>
	);
}

export default TitleScreen;
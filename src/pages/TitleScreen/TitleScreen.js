import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import { useStoreContext } from "../../utils/GlobalState";

import { localizeKey } from "../../localization/localization";
import Authentication from "../../components/Authentication/Authentication";
import MainMenu from "../../components/MainMenu/MainMenu";

import "./TitleScreen.css";

function TitleScreen() {
	const [user, authLoading, ] = useAuthState(auth);
	const [state, ] = useStoreContext();

	return (
		<div id="titleScreen">
			<div className="techPanel">
				<div id="menuHolder" className="techScreen">
					<div>
						<h1>{localizeKey("GAME_WELCOME", state)}</h1>
						<p>{localizeKey("GAME_DESCRIPTION", state)}</p>
					</div>
					{ (authLoading) ? 
						<div><h2>{localizeKey("COMMON_LOADING", state)}</h2></div>
						: (user) ?
							<MainMenu />
							: <Authentication />}
				</div>
			</div>
		</div>
	);
}

export default TitleScreen;
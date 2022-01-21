import { useStoreContext } from "../../utils/GlobalState";

import PlayerAvatar from "../PlayerAvatar/PlayerAvatar";

import "./LobbyPlayers.css";

function LobbyPlayers() {
	const [state, ] = useStoreContext();
	const playerList = state.lobby?.players || [];

	return (
		<div id="lobbyPlayers">
			<h2>Players</h2>
			<div>
				{playerList.map(player => {
					return (
						<div key={player} className="playerWidget">
							<PlayerAvatar player={player} />
							<div>
								<div>{player}</div>
								<div></div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default LobbyPlayers;
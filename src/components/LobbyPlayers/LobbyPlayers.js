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
					const isHost = state.lobby?.host === player;

					return (
						<div key={player} className="playerWidget">
							<PlayerAvatar player={player} />
							<div>
								<div className={(isHost) ? "host" : ""}>{player}</div>
								{(isHost) ?
								(<div className="hostLabel">Host</div>) :
								(<div></div>)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default LobbyPlayers;
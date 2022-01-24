import { useStoreContext } from "../../utils/GlobalState";
import { compactKey } from "../../utils/firebase";

import { localizeKey } from "../../localization/localization";
import { bridgeStations } from "../../utils/globals";

import PlayerAvatar from "../PlayerAvatar/PlayerAvatar";

import "./LobbyPlayers.css";

function LobbyPlayers() {
	const [state, ] = useStoreContext();
	const playerList = state.lobby?.players || [];

	return (
		<div id="lobbyPlayers">
			<h2>{localizeKey("COMMON_LABEL_PLAYERS", state)}</h2>
			<div>
				{playerList.map(player => {
					const isHost = state.lobby?.host === player;
					const assignedStation = bridgeStations.find(station => state.lobby[station] === player) || "";

					return (
						<div key={player} className="playerWidget">
							<PlayerAvatar player={player} />
							<div>
								<div className={assignedStation}>{player}</div>
								{(isHost) ?
								(<div className="hostLabel">{localizeKey("COMMON_LABEL_HOST", state)}</div>) :
								(<div className="readyLabel">{localizeKey(((state.lobby.ready || {})[compactKey(player)]) ? "LOBBY_READY" : "", state)}</div>)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default LobbyPlayers;
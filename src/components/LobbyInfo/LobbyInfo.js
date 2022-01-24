import { useStoreContext } from "../../utils/GlobalState";

import { localizeKey } from "../../localization/localization";
import { bridgeStations } from "../../utils/globals";

import PlayerAvatar from "../PlayerAvatar/PlayerAvatar";

import "./LobbyInfo.css";

function LobbyInfo({lobby}) {
	const [state, ] = useStoreContext();

	if (!lobby?.host) {
		return <div></div>;
	}

	const playerData = lobby.players.map(player => { return { name: player }; });

	for (var i = 0; i < playerData.length; i++) {
		for (var x = 0; x < bridgeStations.length; x++) {
			if (lobby[bridgeStations[x]] === playerData[i].name) {
				playerData[i].station = bridgeStations[x];
			}
		}
	}

	return (
		<div id="lobbyInfo">
			<h2>{lobby.mission || localizeKey("SEARCH_NO_MISSION", state)}</h2>
			<div className="playerWidget">
				<PlayerAvatar player={lobby.host} />
				<div>
					<div className={playerData.find(player => player.name === lobby.host)?.station || ""}>{lobby.host}</div>
					<div></div>
				</div>
			</div>
			<div>
				<label>{localizeKey("COMMON_LABEL_PLAYERS", state)}</label>
				{playerData.filter(data => (data.name !== lobby.host)).map(data => {
					return (<div key={data.name} className={data.station || ""}>{data.name}</div>);
				})}
			</div>
		</div>
	);
}

export default LobbyInfo;
import PlayerAvatar from "../PlayerAvatar/PlayerAvatar";

import "./LobbyInfo.css";

function LobbyInfo({lobby}) {
	if (!lobby?.host) {
		return <div></div>;
	}

	const lobbySlots = [ "captain", "engineering", "helm", "sensors", "weapons" ];
	const playerData = lobby.players.map(player => { return { name: player }; });

	for (var i = 0; i < playerData.length; i++) {
		for (var x = 0; x < lobbySlots.length; x++) {
			if (lobby[lobbySlots[x]] === playerData[i].name) {
				playerData[i].station = lobbySlots[x];
			}
		}
	}

	return (
		<div id="lobbyInfo">
			<h2>{lobby.mission || "No Mission Selected"}</h2>
			<div className="playerWidget">
				<PlayerAvatar player={lobby.host} />
				<div>
					<div className={playerData.find(player => player.name === lobby.host)?.station || ""}>{lobby.host}</div>
					<div></div>
				</div>
			</div>
			<div>
				<label>Players</label>
				{playerData.filter(data => (data.name !== lobby.host)).map(data => {
					return (<div key={data.name} className={data.station || ""}>{data.name}</div>);
				})}
			</div>
		</div>
	);
}

export default LobbyInfo;
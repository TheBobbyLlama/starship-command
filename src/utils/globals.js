const shipSpecifications = require("../assets/data/shipSpecifications.json");

export const bridgeStations = [ "captain", "engineering", "helm", "sensors", "weapons" ];

export const generateGameState = async (shipClass) => {
	const gameState = {};
	const shipData = shipSpecifications.find(ship => ship.class === shipClass) || shipSpecifications[0];

	gameState.ship = await JSON.parse(JSON.stringify(shipData)); // Deep copy!

	return gameState;
}
const shipSpecifications = require("../assets/data/shipSpecifications.json");

export const bridgeStations = [ "captain", "engineering", "helm", "sensors", "weapons" ];

export const generateGameState = async (shipClass) => {
	const gameState = {};
	const shipData = shipSpecifications.find(ship => ship.class === shipClass) || shipSpecifications[0];

	gameState.ship = await JSON.parse(JSON.stringify(shipData)); // Deep copy!
	const jumpSystem = gameState.ship.subsystems.find(sub => sub.key === "SUBSYSTEM_JUMP_DRIVE");

	// Players start with the jump drive fully powered!
	if (jumpSystem) {
		jumpSystem.power[0] = jumpSystem.power[1];
	}

	return gameState;
}
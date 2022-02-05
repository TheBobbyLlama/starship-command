import Vector2D from "./vector2d";

const shipSpecifications = require("../assets/data/shipSpecifications.json");

const DEGREE = 0.0174533;  // 1 degree, in radians.
const PI_2 = Math.PI * 2;

export const bridgeStations = [ "captain", "engineering", "helm", "sensors", "weapons" ];

export const createShip = async (shipClass, played=false) => {
	const ship = {};
	const shipData = shipSpecifications.find(ship => ship.class === shipClass) || shipSpecifications[0];

	Object.entries(shipData).forEach(item => {
		switch (item[0]) {
			case "movement":
				ship.movement = {};
				ship.movement.heading = 0;
				ship.movement.position = [ 0, 0 ];
				ship.movement.velocity = [ 0, 0 ];
				ship.movement.turnrate = [ 0, item[1].turnrate ];
				ship.movement.speed = item[1].speed;
				ship.movement.inertia = item[1].inertia;
				break;
			case "subsystems":
				ship.subsystems = [];

				item[1].forEach(subsys => {
					const newSub = {};

					newSub.key = subsys.key;

					if (subsys.health) newSub.health = [ subsys.health, subsys.health ];

					if (subsys.key === "SUBSYSTEM_JUMP_DRIVE") {
						newSub.power = [ (played) ? subsys.power : 0, subsys.power ];
						newSub.priority = -100;
					} else if (subsys.power) {
						newSub.power = [ subsys.power, subsys.power ];
					}

					if (subsys.output) newSub.output = subsys.output; // Reactors
					if (subsys.external) newSub.external = true;

					ship.subsystems.push(newSub);
				});

				break;
			default:
				ship[item[0]] = JSON.parse(JSON.stringify(item[1]));
				break;
		}
	});

	if (played) {
		ship.helmControls = { turn: 0, throttle: 0 };
	}

	return ship;
}

export const generateGameState = async (shipClass) => {
	const gameState = {};

	gameState.ship = await createShip(shipClass, true);

	return gameState;
}

export const thinkSpeed = 250;

export const gameThink = (gameData, missionData) => {
	const result = { dataUpdates: [], events: [] };

	if (gameData) {
		if ((gameData.ship.helmControls.throttle) || (gameData.ship.helmControls.turn) || (gameData.ship.movement.turnrate[0]) || (gameData.ship.movement.velocity[0])|| (gameData.ship.movement.velocity[1])) {
			result.dataUpdates.push("ship/movement");
			doShipMovement(gameData);
		}
	}

	return result;
}

const doShipMovement = (gameData) => {
	// Set turn rate from helm controls.
	const targetRate = gameData.ship.helmControls.turn * gameData.ship.movement.turnrate[1] / 100;

	if (targetRate > gameData.ship.movement.turnrate[0]) {
		gameData.ship.movement.turnrate[0] = Math.min(gameData.ship.movement.turnrate[0] + 1 / gameData.ship.movement.inertia, targetRate);
	} else if (targetRate < gameData.ship.movement.turnrate[0]) {
		gameData.ship.movement.turnrate[0] = Math.max(gameData.ship.movement.turnrate[0] - 1 / gameData.ship.movement.inertia, targetRate);
	}

	gameData.ship.movement.heading = (gameData.ship.movement.heading + DEGREE * gameData.ship.movement.turnrate[0]) % PI_2;

	if (gameData.ship.movement.heading < 0) gameData.ship.movement.heading += PI_2;

	// Set velocity from helm controls.
	// TODO - This calculation gives the same time to desired speed regardless of throttle setting, need to figure out a better way for throttle to affect it.
	const headingVector = Vector2D.fromRadians(gameData.ship.movement.heading);
	const targetSpeed = gameData.ship.movement.speed * gameData.ship.helmControls.throttle / 100;
	const targetVector = Vector2D.scaleCopy(headingVector, targetSpeed);

	gameData.ship.movement.velocity = [ gameData.ship.movement.inertia * gameData.ship.movement.velocity[0] + (1 - gameData.ship.movement.inertia) * targetVector[0], gameData.ship.movement.inertia * gameData.ship.movement.velocity[1] + (1 - gameData.ship.movement.inertia) * targetVector[1]];

	if (Vector2D.length(gameData.ship.movement.velocity) < 0.1) {
		gameData.ship.movement.velocity = [ 0, 0 ];
	}

	// TODO - Collisions!

	// Apply velocity to ship position.
	gameData.ship.movement.position = [ gameData.ship.movement.position[0] + gameData.ship.movement.velocity[0], gameData.ship.movement.position[0] + gameData.ship.movement.velocity[1] ];
}
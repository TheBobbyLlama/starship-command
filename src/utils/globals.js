export const bridgeStations = [ "captain", "engineering", "helm", "sensors", "weapons" ];

export const defaultGameState = {
	ship: undefined
}

export const createShip = (shipClass) => {
	const ship = { class: shipClass };

	ship.moveData = { x: 0, y: 0, heading: 0, speed: 0, turnRate: 0 };

	return ship;
}
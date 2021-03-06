import { useRef, useEffect, useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { initializeContext, drawGrid, drawMapMarker } from "../../utils/mapFuncs";
import { loadImageData } from "../../utils/spriteUtils";
import Vector2D from "../../utils/vector2d";

import "./MapHelm.css";

//import shipMarkerPlayer from "../../assets/images/map/ship_player.png";

//const shipMarkerPlayer = loadImageData("map/ship_player.png");

function MapHelm({ clickFunc, dblClickFunc }) {
	const [state,] = useStoreContext();
	const [shipMarkerPlayer, setShipMarkerPlayer] = useState(null);

	const canvasRef = useRef(null);


	// Load images.
	if (!shipMarkerPlayer) {
		loadImageData("map/ship_player.png", setShipMarkerPlayer);
	}

	const dispatchClick = (e, func) => {
		if (func) {
			const mapOrigin = [ state.gameData.ship.movement.position[0] + 5 * state.gameData.ship.movement.velocity[0], state.gameData.ship.movement.position[1] + 5 * state.gameData.ship.movement.velocity[1]];
			const mapScale = 0.1 / (1.0 + Math.abs(Vector2D.length(state.gameData.ship.movement.velocity) / 400.0));
			const canvas = canvasRef.current;
			const vertical = Vector2D.fromRadians(state.gameData.ship.movement.heading);
			const horizontal = Vector2D.getRightVector(vertical);
			const diffVector = [canvas.width / 2 - e.nativeEvent.offsetX, canvas.height / 2 - e.nativeEvent.offsetY];
			const diffLength = Vector2D.normalize(diffVector);

			const x = - diffLength * Vector2D.dotProduct(horizontal, diffVector) / mapScale + mapOrigin[0];
			const y = diffLength * Vector2D.dotProduct(vertical, diffVector) / mapScale + mapOrigin[1];

			func(x, y, null);
		}
	}

	const handleClick = (e) => {
		dispatchClick(e, clickFunc);
	}

	const handleDblClick = (e) => {
		dispatchClick(e, dblClickFunc);
	}

	// Draw to map canvas.
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const mapOrigin = [ state.gameData.ship.movement.position[0] + 5 * state.gameData.ship.movement.velocity[0], state.gameData.ship.movement.position[1] + 5 * state.gameData.ship.movement.velocity[1]];
		const mapScale = 0.1 / (1.0 + Math.abs(Vector2D.length(state.gameData.ship.movement.velocity) / 400.0));
		
		initializeContext(ctx, canvas.width, canvas.height);
		let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		drawGrid(imgData.data, canvas.width, canvas.height,
			mapOrigin,
			state.gameData.ship.movement.heading,
			mapScale);
		ctx.putImageData(imgData, 0, 0);
		// Player ship marker.
		drawMapMarker(ctx, canvas.width, canvas.height, mapOrigin, state.gameData.ship.movement.heading, mapScale,
			shipMarkerPlayer,
			state.gameData.ship.movement.position, // marker position
			state.gameData.ship.movement.heading, // marker heading
			Vector2D.scaleCopy(state.gameData.ship.size, 2)); // marker scale
	}, [ state, shipMarkerPlayer ]);

	// NOTE - Canvas height and width need to be explicitly stated to be properly recognized in other code.
	return <div id="helmMap">
		<canvas ref={canvasRef} height={327} width={303} onClick={handleClick} onDoubleClick={handleDblClick}></canvas>
	</div>;
}

export default MapHelm;
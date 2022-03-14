import { useResizeDetector } from "react-resize-detector";
import { StoreProvider } from "./utils/GlobalState";

import GameStateManager from "./pages/GameStateManager/GameStateManager";

import "./App.css";

function App() {
	const { width, height, ref } = useResizeDetector();
	var scaleFactor = width / 640 || 1;

	if (scaleFactor * 480 > height) {
		scaleFactor = height / 480 || 1;
	}

	return (
		<div id="screenContainer" ref={ref}>
			<div id="viewport" style={{transform: "scale(" + scaleFactor +")"}} data-scale={scaleFactor}>
				<StoreProvider>
					<GameStateManager />
				</StoreProvider>
			</div>
		</div>
	);
}

export default App;

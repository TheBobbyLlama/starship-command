import { useResizeDetector } from 'react-resize-detector';
import { StoreProvider } from "./utils/GlobalState";

import MainMenu from "./pages/MainMenu/MainMenu";

import "./App.css";

function App() {
	const { width, height, ref } = useResizeDetector();
	var scaleFactor = width / 640 || 1;

	if (scaleFactor * 480 > height) {
		scaleFactor = height / 480 || 1;
	}

	return (
		<div id="screenContainer" ref={ref}>
			<div id="viewport" style={{transform: "scale(" + scaleFactor +")"}}>
				<StoreProvider>
					<MainMenu />
				</StoreProvider>
			</div>
		</div>
	);
}

export default App;

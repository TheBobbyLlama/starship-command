import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useStoreContext } from "../../utils/GlobalState";

import BridgeSet from "../BridgeSet/BridgeSet";

import "./StationCaptain.css";

function StationCaptain() {
	const [state, ] = useStoreContext();

	return (
		<div id="stationCaptain">
			<BridgeSet />
		</div>
	);
}

export default StationCaptain;
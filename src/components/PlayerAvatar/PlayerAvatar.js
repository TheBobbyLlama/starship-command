import { useStoreContext } from "../../utils/GlobalState";
import { compactKey } from "../../utils/firebase";

import "./PlayerAvatar.css";

function PlayerAvatar({ player }) {
	const [state, dispatch] = useStoreContext();
	const key = compactKey(player || "");

	return (
		<div>
		</div>
	);
}

export default PlayerAvatar;
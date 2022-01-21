import { useEffect } from "react";
import { keepLobbyAlive } from "../../utils/firebase";
import { useStoreContext } from "../../utils/GlobalState";

function LobbyListener() {
	const [state, dispatch] = useStoreContext();

	useEffect(() => {
		if (state.user !== state.lobby.captain) {
			return;
		}

		const interval = setInterval(() => {
			keepLobbyAlive(state.user);
		}, 30000);
	  
		return () => {
			clearInterval(interval);
		};
	  }, [ state.user ]);

	return (
		<></>
	);
}

export default LobbyListener;
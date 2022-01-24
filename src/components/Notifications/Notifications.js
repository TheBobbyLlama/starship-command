import { useEffect , useState} from "react";
import { useStoreContext } from "../../utils/GlobalState";

import "./Notifications.css";

function Notifications() {
	const [state, ] = useStoreContext();
	const [notificationList, setNotificationList] = useState(state.notifications.filter(item => item.expires < Date.now()));

	useEffect(() => {
		const setList = () => {
			setNotificationList(state.notifications.filter(item => item.expires > Date.now()));
		}

		const interval = setInterval(setList, 1000);

		setList();

		return () => {
			clearInterval(interval);
		};
	}, [ state.notifications ]);

	return (
		<div id="notifications">
			{notificationList.map(item => {
				return (<div key={item.expires}>{item.message}</div>);
			})}
		</div>
	);
}

export default Notifications;
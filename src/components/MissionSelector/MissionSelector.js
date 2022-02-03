import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { searchMissions, getMissionSummary, setLobbyMission } from "../../utils/firebase";

import { languageOptions, localizeKey } from "../../localization/localization";
import { SHOW_MODAL } from "../../utils/actions";

import CheckboxWidget from "../CheckboxWidget/CheckboxWidget";

import "./MissionSelector.css";

function MissionSelector() {
	const [state, dispatch] = useStoreContext();
	const [filterLanguage, setFilterLanguage] = useState(true);
	const [missionList, setMissionList] = useState();
	const [selectedMission, setSelectedMission] = useState(null);
	const [postMissionSearch, setPostMissionSearch] = useState(true);

	const toggleLanguageFilter = () => {
		setFilterLanguage(!filterLanguage);
		setPostMissionSearch(true);
	}

	const doMissionSearch = async () => {
		const filters = {};

		if (filterLanguage) {
			filters.language = state.language;
		}

		const result = await searchMissions(filters);

		if (result.status) {
			setMissionList(result.missionList);
		}

		setSelectedMission(result.missionList?.find(mission => mission.title === state.lobby.mission));
	}

	// Get up to date info for a mission when it's selected.
	const selectMission = async (mission) => {
		const result = await getMissionSummary(mission.title);

		if (result.status) {
			if (result.summary) {
				missionList[missionList.findIndex(item => item.title === result.summary.title)] = result.summary;
			} else {
				missionList.splice(missionList.indexOf(mission), 1);
			}

			setSelectedMission(result.summary);
		} else {
			setSelectedMission(mission); // In case of error, just use the cached version.
		}
	}

	const showMissionSummary = (mission) => {
		const selected = mission?.title === selectedMission?.title;

		return (
			<div key={mission.title} className={"missionSummary" + ((selected) ? " selected" : "")} onClick={() => { if (!selected) { selectMission(mission); }}}>
				<label>{mission.title}</label>
				<div>
					<div>{mission.author}</div>
					<div>{localizeKey(mission.length, state)}</div>
				</div>
			</div>
		);
	}

	const showSelectedMissionInfo = () => {
		if (selectedMission) {
			return (<>
				<label>{selectedMission.title}</label>
				<div className="infoLine">
					<div>{localizeKey("MISSION_AUTHOR", state)}</div>
					<div>{selectedMission.author}</div>
				</div>
				<div className="infoLine">
					<div>{localizeKey("MISSION_LENGTH", state)}</div>
					<div>{localizeKey(selectedMission.length, state)}</div>
				</div>
				<div>Description</div>
				<div className="infoDescription">{selectedMission.description}</div>
			</>);
		} else {
			return <div className="nullFiller"></div>;
		}
	}

	const acceptSelectedMission = () => {
		if ((selectedMission.title) && (state.user === state.lobby.host)) {
			setLobbyMission(state.user, selectedMission.title);
		}
		dispatch({ type: SHOW_MODAL });
	}

	const clearModal = () => {
		dispatch({ type: SHOW_MODAL });
	}

	if (postMissionSearch) {
		setMissionList(null);
		doMissionSearch();
		setPostMissionSearch(false);
	}

	return (
		<div id="missionSelector" className="techPanel">
			<div className="techScreen">
				<h2>{localizeKey("LOBBY_SET_MISSION", state)}</h2>
				<div>
					<div>
						<div>
							<div>Filters</div>
							<div>
								<CheckboxWidget checked={filterLanguage} label={localizeKey("COMMON_FILTER_LANGUAGE", state).replace("<LANGUAGE>", languageOptions.find(langOpt => langOpt.key === state.language).label)} clickHandler={toggleLanguageFilter} />
							</div>
							<button type="button" onClick={doMissionSearch}>{localizeKey("COMMON_BUTTON_REFRESH", state)}</button>
						</div>
						<div id="missionList">
							{(missionList) ? (missionList.length) ?
							missionList.map(showMissionSummary) :
							<label>{localizeKey("SEARCH_NO_RESULTS", state)}</label> : <></>}
						</div>
					</div>
					<div id="missionInfo">
						{showSelectedMissionInfo()}
						<div>
							<button type="button" disabled={!selectedMission} onClick={acceptSelectedMission}>{localizeKey("MISSION_SELECT", state)}</button>
							<button type="button" onClick={clearModal}>{localizeKey("COMMON_BUTTON_CANCEL", state)}</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MissionSelector;
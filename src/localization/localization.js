export const languageOptions = [
	{
		label: "English",
		key: "EN-US"
	}
]

export const setLocalizationLanguage = async (language) => {
	const localization = await require("./" + language + ".json");

	return localization;
}

export const localizeKey = (key, state) => {
	var result = state.localization[key] || key;
	var nestedKeys = result.match(/\[\[.+?\]\]/g);
	nestedKeys?.forEach(item => result = result.replaceAll(item, localizeKey(item.substring(2, item.length - 2), state)));
	return result;
}
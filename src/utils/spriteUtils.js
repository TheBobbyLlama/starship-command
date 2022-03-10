export const loadImageData = async (url, callback) => {
	if (callback) {
		callback(true); // Set a dummy value so this function won't get called repeatedly.
	}

	const dataUrl = require("../assets/images/" + url);
	const tmpImg = new Image();
	tmpImg.src = dataUrl;
	let result = await tmpImg.decode().then(() => { return createImageBitmap(tmpImg) }).catch(() => { return { }; });

	if (callback) {
		callback(result);
	}

	return result;
}
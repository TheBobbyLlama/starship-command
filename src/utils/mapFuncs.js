const gridColor = [ 8, 8, 32, 255];

// Clears the canvas "frame buffer"
export const initializeContext = (ctx, width, height) => {
	ctx.imageSmoothingEnabled = false;
	ctx.resetTransform();
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);
}

// Colors a pixel, if it has a valid position on the canvas.
const setPoint = (imgData, width, height, x, y, color) => {
	if ((x >= 0) && (x < width) && (y >= 0) && (y < height)) {
		const idx = 4 * ((width * y) + x);

		imgData[idx] = color[0];
		imgData[idx + 1] = color[1];
		imgData[idx + 2] = color[2];
		imgData[idx + 3] = color[3];
	}
}

// Draws a line to the canvas.
// Uses a simple digital difference analyzer algorithm - optimize to Bresenham's line algorithm some day?
// https://en.wikipedia.org/wiki/Line_drawing_algorithm
const rasterizeLine = (imgData, width, height, x, y, slope, color) => {
	// Clamp the x/y to canvas size.
	if (y < 0) {
		if (slope > 0) {
			let diff = Math.round(x - y / slope);
			x += diff;
			y += diff * slope;
		} else {
			return;
		}
	} else if (y >= height) {
		if (slope < 0) {
			let diff = Math.round(x + (height - 1 - y) / slope);
			x += diff;
			y += diff * slope;
		} else {
			return;
		}
	} else if (x > 0) {
		if (slope > 0) {
			let diff = y / slope;

			if (diff > x) {
				y -= x * slope;
				x = 0;
			} else {
				x -= diff;
				y = 0;
			}
		} else if (slope < 0) {
			let diff = (y - height + 1) / slope; // y must be smaller than height, so diff will be positive.

			if (diff > x) {
				y -= x * slope;
				x = 0;
			} else {
				x -= diff;
				y = height - 1;
			}
		} else {
			x = 0;
		}
	}

	let step;

	if (slope > 1) {
		step = 1 / slope;
	} else if (slope < -1) {
		step = -1 / slope;
	} else {
		step = 1;
	}

	while ((x < width) && (y >= 0) && (y < height)) {
		setPoint(imgData, width, height, Math.floor(x), Math.floor(y), color);

		x += step;
		y += slope * step;
	}
}

// Draws gridlines to a map canvas.
export const drawGrid = (imgData, width, height, origin, orientation, scale) => {
	const cos = Math.cos(-orientation);
	const sin = Math.sin(-orientation);
	const refX = (width / 2) - scale * (cos * (origin[0] % 1000) + sin * (origin[1] % 1000));
	const refY = (height / 2) + scale * (cos * (origin[1] % 1000) - sin * (origin[0] % 1000));

	const slopeXlines = -cos / ((sin === 0) ? 0.00001 : sin);
	const slopeYlines = sin / ((cos === 0) ? 0.00001 : cos);
	const gridLimit = Math.ceil(Math.SQRT2 * Math.max(width, height) / scale / 200) * 2;

	// Y-axis gridlines.
	let gridX = refX - gridLimit * 500 * sin * scale;
	let gridY = refY + gridLimit * 500 * cos * scale;

	for (let i = 0; i < gridLimit; i++) {
		rasterizeLine(imgData, width, height, gridX, gridY, slopeYlines, gridColor);

		gridX += 1000 * sin * scale;
		gridY -= 1000 * cos * scale;
	}

	// X-axis gridlines.
	gridX = refX - gridLimit * 500 * cos * scale;
	gridY = refY - gridLimit * 500 * sin * scale;

	for (let i = 0; i < gridLimit; i++) {
		rasterizeLine(imgData, width, height, gridX, gridY, slopeXlines, gridColor);

		gridX += 1000 * cos * scale;
		gridY += 1000 * sin * scale;
	}

	//setPoint(imgData, width, height, Math.round(refX), Math.round(refY), [255, 0, 0, 255]); // TODO - This is for testing purposes!
}

export const drawMapMarker = (ctx, width, height, origin, orientation, scale, marker, position, heading, size) => {
	if (!marker?.width) return;

	ctx.resetTransform();
	ctx.translate(width / 2, height / 2);
	ctx.scale(scale, scale);
	ctx.rotate(orientation);
	ctx.translate((origin[0] - position[0]) - size[0] / 4, (origin[1] - position[1]) - size[1]); // Why does size[0] need to be reduced???
	ctx.rotate(-heading);
	ctx.drawImage(marker, 0, 0, size[1], size[0]);
}
const Vector2D = {
	// Calculates a unit vector to represent the radian input.
	fromRadians(radians) {
		return [ Math.sin(radians), Math.cos(radians)]
	},

	// Calculates the difference between two radian values, normalized between +/- pi.
	diffRadians(a, b) {
		let result = a - b;

		while (result > Math.PI){
			result -= 2 * Math.PI;
		}

		while (result < -Math.PI) {
			result += 2 * Math.PI;
		}

		return result;
	},

	// Adds two vectors together and returns the result.
	add(a, b) {
		return [ a[0] + b[0], a[1] + b[1] ];
	},

	// Scales a vector by the given scalar.
	scale(vector, scalar) {
		vector[0] *= scalar;
		vector[1] *= scalar;
	},

	// Returns a new vector, which is the input vector scaled by the given scalar.
	scaleCopy(vector, scalar) {
		return [ scalar * vector[0], scalar * vector[1] ];
	},

	// Calculates the length of a vector.
	length(vector) {
		return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
	},

	// Converts a vector into a unit vector, returning the initial length.
	normalize(vector) {
		const myLen = this.length(vector);

		if (myLen) {
			vector[0] = vector[0] / myLen;
			vector[1] = vector[1] / myLen;
		}

		return myLen;
	},

	// Creates a new unit vector from the input vector.
	normalizeCopy(vector) {
		const result = [ ...vector ];
		this.normalize(result);
		return result;
	},

	// Calculates the dot product of two vectors. (For unit vectors this is the cosine of the angle between them)
	dotProduct(a, b) {
		return a[0] * b[0] + a[1] * b[1];
	},

	// Calculates the dot product of two vectors as though they were unit vectors, which is also the cosine of the angle between them.
	dotProductUnit(a, b) {
		const a2 = this.normalizeCopy(a);
		const b2 = this.normalizeCopy(b);

		return this.dotProduct(a2, b2);
	}
}

Object.freeze(Vector2D);

export default Vector2D;
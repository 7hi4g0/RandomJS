/*export RANDOM*/

var RANDOM = {};

(function () {
	/*jslint bitwise: true*/
	RANDOM.RC4 = function (seed) {
		var seedString,
			byteSize,
			byteMask,
			key,
			keyLength,
			msbMask,
			throwAway,
			swap,
			// Internal State
			i,
			j,
			s;

		if (!(this instanceof RANDOM.RC4)) {
			return new RANDOM.RC4(seed);
		}

		byteMask = (byteSize = 256) - 1;
		msbMask = 0x7F;
		throwAway = 256;

		switch (typeof seed) {
		case "string":
			seedString = seed;
			seed = 0;
			key = [];

			for (i = 0; i < seedString; i += 1) {
				key[i & byteMask] ^= seedString.charCodeAt(i) & byteMask;
			}

			keyLength = key.length;
			break;
		case "object":
			key = Array.prototype.slice.apply(new Uint8Array(seed));
			keyLength = key.length;
			break;
		case "number":
			key = [];
			keyLength = 0;

			while (seed > 0) {
				key.unshift(seed & byteMask);
				keyLength += 1;

				seed >>>= 8;
			}
			break;
		default:
			throw new Error("Too few arguments!");
		}

		s = [];

		// Key-scheduling Algorithm
		for (i = 0; i < byteSize; i += 1) {
			s[i] = i;
		}

		j = 0;

		for (i = 0; i < byteSize; i += 1) {
			j = (j + s[i] + key[i % keyLength]) & byteMask;
			swap = s[j];
			s[j] = s[i];
			s[i] = swap;
		}

		i = j = 0;

		this.nextByte = function () {
			i = (i + 1) & byteMask;
			j = (j + s[i]) & byteMask;
			swap = s[j];
			s[j] = s[i];
			s[i] = swap;
			return s[(s[i] + s[j]) & byteMask];
		};

		this.random = function () {
			var result,
				bytes;

			result = this.nextByte() & msbMask;
			bytes = 3;

			while (bytes > 0) {
				result *= byteSize;
				result += this.nextByte();

				bytes -= 1;
			}

			return result;
		};

		while (throwAway > 0) {
			this.nextByte();
			throwAway -= 1;
		}
	};
}());
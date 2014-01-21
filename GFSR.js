var RANDOM;

RANDOM = {};

(function () {
	"use strict";

	RANDOM.GFSR = function (p, q, size, delay) {
		var m,
			n,
			j,
			self;

		if (!(this instanceof RANDOM.GFSR)) {
			return new RANDOM.GFSR(p, q, size);
		}

		function setr() {
			var one,
				i,
				k,
				kount,
				itemp,
				ret;

			ret = p + 1;			
			one = Math.pow(2, size - 1);

			for (i = 0; i < p; i++) {
				m[i] = one;
			}

			for (k = 1; k <= size; k++) {
				for (i = 0; i < delay; i++) {
					self.random();
				}

				kount = 0;

				for (i = 0; i < p; i++) {
					itemp = one / Math.pow(2, k - 1);
					itemp = (m[i] - m[i] / one * one) / itemp;

					if (itemp === 1) kount += 1;
					if (k === size) continue;

					m[i] = m[i] / 2 + one;
				}

				if (kount === p) setr = k;
			}

			for (i = 0; i < 5000; i++) {
				for (k = 0; k < p; k++) {
					self.random();
				}
			}
		}

		self = this;

		n = (Math.pow(2, size - 1) - 1) * 2 + 1;
		j = 0;
		m = [];

		self.random = function () {
			var k,
				b;

			j = (j + 1) % p;
			k = (j + q) % p;

			b = m[j] ^ m[k];

			m[j] = b;

			return b / n;
		};

		setr();
	}
}());

exports.RANDOM = RANDOM;

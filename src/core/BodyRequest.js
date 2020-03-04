const axios = require('../axios');

class BodyRequest {
	constructor(url, start, end, options = {}) {
		this.url = url;
		this.method = options.method || "get";
		this.startByte = start;
		this.endByte = end;
		this.headers = Object.assign({}, options.headers || {}, {range: `bytes=${start}-${end}`});
	}

	async exec() {
		if (this.startByte >= this.endByte) {
			return Promise.resolve();
		}

		return axios({
			url: this.url,
			method: this.method,
			headers: this.headers,
			responseType: 'stream',
		});
	}
}

module.exports = BodyRequest;
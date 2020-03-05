const axios = require('../axios');

class BodyRequest {
	constructor(url, start, end, cancelToken, options = {}) {
		this.url = url;
		this.method = options.method || "get";
		this.startByte = start;
		this.endByte = end;
		this.cancelToken = cancelToken,
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
			cancelToken: this.cancelToken,
			responseType: 'stream',
		});
	}
}

module.exports = BodyRequest;
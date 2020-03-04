const axios = require('../axios');
const e = require('../Exceptions');

class HeadRequest {
	constructor(uri, options = {}) {
		this.uri = uri;
		this.options = options;
	}

	async exec() {
		const requestOptions = {
			url: this.uri,
			method: 'head',
		};

		return axios(requestOptions).then(res => {
			const fileSize = Number(res.headers['content-length'] || this.options.fileSize);

			if (isNaN(fileSize)) {
				return Promise.reject(e(1008, this.uri));
			}

			return Promise.resolve({fileSize, headers: res.headers});
		}).catch(err => {
			const fileSize = Number(this.options.fileSize);
			if (fileSize) {
				// in case head request not supported and use know the size to download
				return Promise.resolve({fileSize});
			}

			return Promise.reject(e(1004, this.uri));
		});
	}
}

module.exports = HeadRequest;
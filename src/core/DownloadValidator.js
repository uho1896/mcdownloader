const e = require('../Exceptions');

class DownloadValidator {
	constructor(threads) {
		this.threads = threads;
	}

	async exec() {
		const notCompleted = this.threads.find(thd => thd.position < thd.end);
		if (notCompleted) {
			return Promise.reject(e(1013));
		}

		return Promise.resolve();
	}
}

module.exports = DownloadValidator;
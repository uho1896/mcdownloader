class ThreadsDestroyer {
	constructor(threads) {
		this.threads = threads;
	}

	async exec() {
		return Promise.all(this.threads.map(thd => {
			const wasComplete = (thd.connection == 'failed' || thd.connection == 'closed') ? true : false;
			if (!wasComplete && thd.destroy) {
				thd.destroy();
			}
		}));
	}
}

module.exports = ThreadsDestroyer;
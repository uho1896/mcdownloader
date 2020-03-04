const DownloadWriter = require('./DownloadWriter');
const BodyRequest = require('./BodyRequest');
const MetaDataBuilder = require('./MetaDataBuilder');
const ThreadsDestroyer = require('./ThreadsDestroyer');
const Progress = require('./Progress');

class ExecutorGenerator {
	constructor(fd, threads, downloadSize, downloadStart, url, options = {}) {
		this.fd = fd;
		this.threads = threads;
		this.downloadSize = downloadSize;
		this.downloadStart = downloadStart;
		this.url = url;
		this.options = options;
	}

	async exec() {
		let executor = {};

		executor.threadsDestroyer = new ThreadsDestroyer(this.threads);
		executor.writer = new DownloadWriter(this.fd);
		executor.metaBuilder = new MetaDataBuilder(this.threads,
			this.downloadSize, this.downloadStart, this.url, this.options);
		executor.progress = new Progress(this.threads, this.downloadSize, this.options);

		this.threads.forEach(thd => {
			thd.bodyRequest = new BodyRequest(this.url, thd.position, thd.end, this.options);
		});
		executor.threads = this.threads;
		return Promise.resolve(executor);
	}
}

module.exports = ExecutorGenerator;
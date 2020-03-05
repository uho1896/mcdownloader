const axios = require('../axios');
const DownloadWriter = require('./DownloadWriter');
const BodyRequest = require('./BodyRequest');
const MetaDataBuilder = require('./MetaDataBuilder');
const RequestCanceller = require('./RequestCanceller');
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

		executor.writer = new DownloadWriter(this.fd);
		executor.metaBuilder = new MetaDataBuilder(this.threads,
			this.downloadSize, this.downloadStart, this.url, this.options);
		executor.progress = new Progress(this.threads, this.downloadSize, this.options);

		let srcList = [];
		this.threads.forEach(thd => {
			const src = axios.CancelToken.source();
			srcList.push(src);
			thd.bodyRequest = new BodyRequest(this.url, thd.position, thd.end, src.token, this.options);
		});
		executor.threads = this.threads;
		executor.requestCanceller = new RequestCanceller(srcList);

		return Promise.resolve(executor);
	}
}

module.exports = ExecutorGenerator;
const e = require('../Exceptions');

class DataRequest {
	constructor(writer, threads, metaBuilder, progress, downloadStart = 0) {
		this.writer = writer;
		this.threads = threads;
		this.metaBuilder = metaBuilder;
		this.progress = progress;
		this.downloadStart = downloadStart;
	}

	async exec() {
		const self = this;
		self.progress.exec();
		return Promise.all(this.threads.map((thd, idx) => {
			return thd.bodyRequest.exec().then(res => {
				return new Promise((resolve, reject) => {
					if (!res) {
						return resolve();
					}

					res.data.on('data', chunk => {
						thd.destroy = res.destroy;
						thd.connection = 'open';
						self.writer.exec(chunk, thd.position - self.downloadStart).catch(() => {
							return reject(e(1011));
						});
						self.metaBuilder.exec().then(meta => {
							return self.writer.exec(meta.data, meta.position).catch(() => {
								return reject(e(1011));
							});
						});
						thd.position += chunk.length;
						self.progress.exec();
					});
					res.data.on('end', () => {
						thd.connection = 'closed';
						self.progress.exec();
						if (thd.position < thd.end) {
							thd.connection = 'failed';
							return reject(e(1013));
						}

						return resolve();
					});
					res.data.on('error', (err) => {
						thd.connection = 'failed';
						self.progress.exec();
						thd.destroy && thd.destroy();
						return reject(e(1013));
					});
				});
			});
		}));
	}
}

module.exports = DataRequest;
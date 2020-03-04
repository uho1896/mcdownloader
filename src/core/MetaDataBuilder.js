class MetaDataBuilder {
	constructor(threads, downloadSize, downloadStart, url, options = {}) {
		this.data = {
			threads,
			downloadSize,
			downloadStart,
			url,
		};
		this.block = options.block || 1024 * 10;
	}

	async exec() {
		const buffer = Buffer.alloc(this.block, ' ');
		const dataString = JSON.stringify(this.data);
		buffer.write(dataString);

		const result = {
			data: buffer,
			position: this.data.downloadSize
		};

		return Promise.resolve(result);
	}
}

module.exports = MetaDataBuilder;
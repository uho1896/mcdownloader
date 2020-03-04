class MetaDataUpdator {
	constructor(meta) {
		this.meta = meta;
	}

	async exec() {
		this.meta.threads.forEach(thd => {
			thd.connection = 'idle';
		})

		return Promise.resolve(this.meta);
	}
}

module.exports = MetaDataUpdator;
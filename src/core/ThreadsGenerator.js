function rangeCalculator(fileSize, range, count) {
	const s = range.split('-');
	const start = Math.ceil(s[0] * fileSize / 100);
	const end = Math.ceil(s[1] * fileSize / 100);
	const blockSize = Math.ceil((end - start) / count);
	return {
		start: start,
		end: end,
		block: blockSize
	};
};

class ThreadsGenerator {
	constructor(fileSize, options = {}) {
		this.fileSize = fileSize;
		this.count = options.count || 2;
		this.range = options.range || '0-100';
	}

	async exec() {
		const rangeInSize = rangeCalculator(this.fileSize, this.range, this.count);
		let startRange = rangeInSize.start;
		let endRange = rangeInSize.start + rangeInSize.block;

		let i = 0;
		let threads = [];
		do {
			threads.push({
				position: startRange,
				start: startRange,
				end: endRange,
				connection: 'idle'
			});
			i++;
			startRange = endRange + 1;
			endRange = startRange + rangeInSize.block;
		} while (i < this.count);

		threads[threads.length - 1].end = rangeInSize.end;
		this.threads = threads;
		return Promise.resolve({threads: this.threads,
			downloadSize: rangeInSize.end - rangeInSize.start,
			downloadStart: rangeInSize.start,
		});
	}
}

module.exports = ThreadsGenerator;
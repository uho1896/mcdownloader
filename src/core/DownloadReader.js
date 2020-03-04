const fs = require('fs');
const e = require('../Exceptions');

function getFileSize(fd) {
	return new Promise((resolve, reject) => {
		fs.fstat(fd, (err, stats) => {
			if (err) {
				return reject(e(1012));
			}

			return resolve(stats.size);
		});
	});
};

function read(fd, fileSize, block) {
	const position = fileSize - block;
	const length = block;
	const buffer = Buffer.alloc(length, ' ');

	return new Promise((resolve, reject) => {
		fs.read(fd, buffer, 0, buffer.length, position, (err, bytesRead, buf) => {
			if (err) {
				return reject(e(1012));
			}

			try {
				const data = JSON.parse(buf.toString());
				return resolve(data);
			} catch (err2) {
				return reject(e(1012));
			}
		});
	});
};

class DownloadReader {
	constructor(fd, options) {
		this.fd = fd;
		this.block = options.block || 1024 * 10;
	}

	async exec() {
		return getFileSize(this.fd).then(fileSize => {
			return read(this.fd, fileSize, this.block);
		});
	}
}

module.exports = DownloadReader;
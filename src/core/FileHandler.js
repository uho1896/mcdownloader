const fs = require('fs');
const path = require('path');
const e = require('../Exceptions');

class FileHandleGenerator {
	constructor(fileName, truncate = false) {
		this.file = fileName;
		this.truncate = truncate;
	}

	async exec() {
		const mode = this.truncate ? 'w+' : 'r+';
		return new Promise((resolve) => {
			fs.mkdir(path.dirname(this.file), {recursive: true}, resolve);
		}).then(() => {
			return new Promise((resolve, reject) => {
				fs.open(this.file, mode, (err, fd) => {
					if (err) {
						// open file error
						return reject(e(1007, this.file));
					}

					this.fd = fd;
					return resolve(fd);
				});
			});
		});
	}
}

module.exports = FileHandleGenerator;
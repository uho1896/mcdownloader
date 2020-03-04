const e = require('../Exceptions');
const fs = require('fs');

class DownloadWriter {
	constructor(fd) {
		this.fd = fd;
	}

	async exec(data, position) {
		return new Promise((resolve, reject) => {
			fs.write(this.fd, data, 0, data.length, position, (err) => {
				if (err) {
					return reject(e(1011));
				} else {
					return resolve({
						dataLength: data.length,
						writePostion: position
					});
				};
			});
		});
	}
}

module.exports = DownloadWriter;
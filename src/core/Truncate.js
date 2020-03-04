const fs = require('fs');

const truncate = async function(fd, downloadSize) {
	return new Promise((resolve, reject) => {
		fs.ftruncate(fd, downloadSize, (err) => {
			if (err) {
				return reject(err);
			}

			return resolve();
		});
	});
};

module.exports = truncate;
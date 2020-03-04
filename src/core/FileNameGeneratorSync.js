class FileNameGenerator {
	constructor(fileName) {
		this.fileName = fileName
	}

	async exec() {
		const fileName = this.fileName;
		let result;
		if (fileName.match(/\.mcd$/)) {
			result = {
				downloadFile: fileName,
				originalFile: fileName.replace(/\.mcd$/, '')
			};
		} else {
			result = {
				downloadFile: fileName + '.mcd',
				originalFile: fileName
			};
		}

		return Promise.resolve(result);
	}
}

module.exports = FileNameGenerator;
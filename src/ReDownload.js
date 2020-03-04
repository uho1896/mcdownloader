//HTTP
const DataRequest = require('./core/DataRequestTask');

//FILE
const FileHandler = require('./core/FileHandler');
const truncate = require('./core/Truncate');
const FileNameGenerator = require('./core/FileNameGeneratorSync');
const rename = require('./core/Rename');

//READ WRITE
const DownloadReader = require('./core/DownloadReader');

//META DATA
const MetaDataUpdator = require('./core/MetaDataUpdator');

//EXECUTOR
const ExecutorGenerator = require('./core/ExecutorGenerator');

//VALIDATOR
const DownloadValidator = require('./core/DownloadValidator');

class Redownload {
	constructor(options) {
		this.options = options;
	}

	async exec() {
		const options = this.options;

		try {
			const fileName = await new FileNameGenerator(options.output).exec();
			const fileHandle = await new FileHandler(fileName.downloadFile, false).exec();
			const originMetaData = await new DownloadReader(fileHandle, options).exec();
			const metaData = await new MetaDataUpdator(originMetaData).exec();
			const execGenerator = await new ExecutorGenerator(fileHandle, metaData.threads,
				metaData.downloadSize, metaData.downloadStart, metaData.url, options).exec();

			// start download
			await new DataRequest(
				execGenerator.writer,
				execGenerator.threads,
				execGenerator.metaBuilder,
				execGenerator.threadsDestroyer,
				execGenerator.progress,
				metaData.downloadStart
			).exec();

			await new DownloadValidator(execGenerator.threads).exec();
			await truncate(fileHandle, metaData.downloadSize);
			await rename(fileName.downloadFile, fileName.originalFile, fileHandle);

			return Promise.resolve();
		} catch(e) {
			return Promise.reject(e);
		}
	}
}

module.exports = Redownload;
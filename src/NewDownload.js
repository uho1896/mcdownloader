//HTTP
const HeadRequest = require('./core/HeadRequest');
const DataRequest = require('./core/DataRequestTask');

//FILE
const FileHandler = require('./core/FileHandler');
const truncate = require('./core/Truncate');
const FileNameGenerator = require('./core/FileNameGeneratorSync');
const rename = require('./core/Rename');

//Threads
const ThreadsGenerator = require('./core/ThreadsGenerator');

//META DATA
const MetaDataBuilder = require('./core/MetaDataBuilder');

//READ WRITE
const DownloadWriter = require('./core/DownloadWriter');

//EXECUTOR
const ExecutorGenerator = require('./core/ExecutorGenerator');

//VALIDATOR
const DownloadValidator = require('./core/DownloadValidator');

class NewDownload {
	constructor(options) {
		this.options = options;
	}

	async exec() {
		const options = this.options;

		try {
			const fileName = await new FileNameGenerator(options.output).exec();
			const fileHandle = await new FileHandler(fileName.downloadFile, true).exec();
			const httpHead = await new HeadRequest(options.url, options).exec();
			const threadInfo = await new ThreadsGenerator(httpHead.fileSize, options).exec();
			const metaData = await new MetaDataBuilder(threadInfo.threads,
				threadInfo.downloadSize, threadInfo.downloadStart, options.url, options).exec();
			await new DownloadWriter(fileHandle).exec(metaData.data, metaData.position);

			const execGenerator = await new ExecutorGenerator(fileHandle, threadInfo.threads,
				threadInfo.downloadSize, threadInfo.downloadStart, options.url, options).exec();

			// start download
			await new DataRequest(
				execGenerator.writer,
				execGenerator.threads,
				execGenerator.metaBuilder,
				execGenerator.threadsDestroyer,
				execGenerator.progress,
				threadInfo.downloadStart
			).exec();

			await new DownloadValidator(execGenerator.threads).exec();
			await truncate(fileHandle, threadInfo.downloadSize);
			await rename(fileName.downloadFile, fileName.originalFile, fileHandle);

			return Promise.resolve();
		} catch(e) {
			return Promise.reject(e);
		}
	}
}

module.exports = NewDownload;
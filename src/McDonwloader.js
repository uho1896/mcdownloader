const NewDownload = require('./NewDownload');
const ReDownload = require('./ReDownload');

const defalutOptions = {
	url: null, // file url to download
	output: null, // downloaded file name
	count: 2, // connections count
	range: '0-100', // file range to download, from 0% to 100% by default
	onProgress: console.log, // progress callback
	headers: {}, // http request headers
	downloadType: 'download', // new download
};

class McDownloader {
	constructor(options) {
		this.options = Object.assign({}, defalutOptions, options);
		this.canceled = false;
		this.executor = null;
	}

	async exec() {
		if (!this.options.url && !this.options.output) {
			throw Promise.reject('you should specify url or output');
		}

		if (/redownload/i.test(this.options.downloadType) || /.*\.mcd$/.test(this.options.output)) {
			this.executor = new ReDownload(this.options);
		} else {
			this.executor = new NewDownload(this.options);
		}

		return this.executor.exec();
	}

	cancel() {
		this.canceled = true;
		this.executor && this.executor.cancel();
	}
}

module.exports = McDownloader;
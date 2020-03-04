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
	}

	async exec() {
		if (!this.options.url && !this.options.output) {
			throw Promise.reject('you should specify url or output');
		}

		if (/redownload/i.test(this.options.downloadType) || /.*\.mcd$/.test(this.options.output)) {
			const rd = new ReDownload(this.options);
			return rd.exec();
		} else {
			const nd = new NewDownload(this.options);
			return nd.exec();
		}
	}
}

module.exports = McDownloader;
NOTE: This is an opinionated rework of the original [mt-files-downloader](https://github.com/FaisalUmair/mt-files-downloader) code.

This codebase enhances upon the original work with the following:

##Features
1. **HTTP & HTTPS downloads work:** Working download for both protocols.  Refer to code examples below.

2. **Properly Downloads Redirecting URLs:** Sometimes URLs will redirect to another URL, for N times.  This library will follow redirects until it finds the source.

3. **Windows Support:** Add official support for Windows 10 x64 and Windows Server 2012 R2 (32 + 64 bit) operating systems.

4. **Multi connection downloads:** In a conventional single connection download you might experience poor performance due to network lags etc. With multi connections will speed up it.

5. **Stop and start from the last downloaded byte:**. You don't have to worry about internet getting disconnected or your computer shutting down while downloading. You can quite easily start from the last byte that was downloaded.


##.mcd file
Once the download starts the library will create a file with a **.mcd** extension. This file contains some meta information related to the download and is a little bigger *(around 10kb)* than the original download size. The **.mcd** file can be used later to restart downloads from where the last byte that was downloaded. After the download is completed the downloader will truncate the file to remove that meta data.

##New-Downloads
When you want to start a new download you just need to provide a download url and a download path and call the ```start()``` method.

```javascript
const MCD = require('./mcdownloader');

const options = {
  url: 'https://nodejs.org/dist/v12.16.1/node-v12.16.1-x64.msi',
  output: './node-v12.16.1-x64.msi',
  count: 2,
  range: '0-100',
  onProgress: console.log,
};
const nd = new MCD(options);
nd.exec().then(() => {
  console.log('done successfully');
}).catch(e => {
  console.log(e);
});
```

##Re-Downloads
If you want to restart a download from where it left off. You just need to provide the path of the **.mcd** file.

```javascript
const MCD = require('./mcdownloader');

const options = {
  output: './node-v12.16.1-x64.msi.mcd',
};
const nd = new MCD(options);
nd.exec().then(() => {
  console.log('done successfully');
}).catch(e => {
  console.log(e);
});
```

##Download Options
A set of custom options can be sent to control the way a download is performed.

```javascript
const options = {
	url: null, // file url to download
	output: null, // downloaded file name
	count: 2, // connections count
	range: '0-100', // file range to download, from 0% to 100% by default
	onProgress: console.log, // progress callback
	headers: {}, // http request headers
	downloadType: 'download', // new download
};
```

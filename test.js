const MCD = require('./index');

const options = {
  url: 'https://nodejs.org/dist/v12.16.1/node-v12.16.1-x64.msi',
  output: './node-v12.16.1-x64.msi',
  count: 2,
  range: '0-100',
  onProgress: console.log,
};
const nd = new MCD(options);
nd.exec().then((msg) => {
  console.log(msg || 'done successfully');
}).catch(e => {
  console.log(e);
});

setTimeout(() => {
  nd.cancel();
  console.log('cancelling');
}, 5000);
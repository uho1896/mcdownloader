const axios = require('axios');

const threshold = 3;
const retries = new Map();

function errorRetry(error) {
  const originalRequest = error && error.config;
  if (!originalRequest) {
    return Promise.reject(error);
  }

  const uri = originalRequest.url;
  let retry = retries.get(uri) || 1;
  if (retry <= threshold) {
    retries.set(uri, ++retry);
    return axios(originalRequest);
  } else {
    retries.delete(uri);
    return Promise.reject(error);
  }
}

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  return config;
}, errorRetry);

axios.interceptors.response.use(function (response) {
  return response;
}, errorRetry);

module.exports = axios;
const fs = require('fs');

const rename = async function(oldName, newName, fd) {
	return new Promise((resolve, reject) => {
    fs.close(fd, (err) => {
      if (err) {
        // skip close error
        console.log("Error closing file handle.");
      }

      fs.rename(oldName, newName, (err2) => {
        if (err2) {
          return reject(err2);
        }

        return resolve();
      });
    })
  });
};

module.exports = rename;
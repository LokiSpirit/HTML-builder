const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFile, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      fs.stat(path.join(pathToFile, file), (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stats.isFile()) {
          const arr = file.split('.');
          const result = `${arr[0]} - ${arr[1]} - ${stats.size / 1000}kb`;
          console.log(result);
        }
      });
    })
  }
})
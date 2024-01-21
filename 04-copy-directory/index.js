const path = require('path');
const fsPromise = require('fs/promises');
const fs = require('fs');
const pathCopyFrom = path.join(__dirname, 'files');
const pathToCopy = path.join(__dirname, 'files-copy');
//Create copyDir function
async function copyDir() {
  try {
    await fsPromise.mkdir(pathToCopy, { recursive: true });
    const files = await fsPromise.readdir(pathToCopy);
    files.forEach((file) => {
      fs.unlink(path.join(pathToCopy, file), (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });
    const filesRead = await fsPromise.readdir(pathCopyFrom);
    filesRead.forEach((file) => {
      fs.copyFile(
        path.join(pathCopyFrom, file),
        path.join(pathToCopy, file),
        (err) => {
          if (err) {
            console.log('Error was found: ', err);
          }
        });
    });
  } catch (e) {
    console.log(e);
  }
}
copyDir();
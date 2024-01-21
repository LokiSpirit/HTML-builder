const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;
const pathToStyles = path.join(__dirname, 'styles');
const distFile = path.join(__dirname, 'project-dist', 'bundle.css')
const writeStream = fs.createWriteStream(distFile, {
  encoding: 'utf-8',
});

async function mergeStyles() {
  try {
    const fullText = [];
    const styles = await fsPromise.readdir(pathToStyles);
    for (let item = 0; item < styles.length; item += 1) {
      let stat = await fsPromise.lstat(path.join(pathToStyles, styles[item]));
      if (stat.isFile() && path.extname(styles[item]) === '.css') {
        await readFile(styles[item], fullText);
      }
    }
    await fillBundle(fullText);
    /* await fsPromise.writeFile(distFile, fullText[0], {
      encoding: 'utf-8',
    });
    for (let i = 1; i < fullText.length; i += 1) {
      await fsPromise.appendFile(distFile, fullText[i], {
        encoding: 'utf-8',
      });
    } */
  } catch (e) {
    console.log(e);
  } finally {
    writeStream.end();
  }
}

async function readFile(file, arr) {
  const arrOfStyles = arr;
  const css = await fsPromise.readFile(path.join(pathToStyles, file), {
    encoding: 'utf-8',
  });
  arrOfStyles.push(css);
}

async function fillBundle(arr){
  const source = arr;
  if (source.length > 0) {
    for (let i = 0; i < source.length; i += 1) {
      writeStream.write(source[i], (err) => {
        if (err) {
          throw err;
        }
      });
    }
  }
}
mergeStyles();
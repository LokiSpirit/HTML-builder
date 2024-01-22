const { error } = require('console');
const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');
const pathToDistFolder = path.join(__dirname, 'project-dist');
const pathToComponents = path.join(__dirname, 'components');

async function createFolder(pathToFolder) {
  await fsPromise.mkdir(pathToFolder, { recursive: true });
}

function readComponentsFileNames() {
  return new Promise((resolve, reject) => {
    const contentOfComponents = {};
    fs.readdir(pathToComponents, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      files.forEach((file) => {
        const readStream = fs.createReadStream(
          path.join(pathToComponents, file),
          {
            encoding: 'utf-8',
          });
        let fullText = '';
        readStream.on('data', (data) => (fullText += data));
        readStream.on('end', () => {
          contentOfComponents[file.split('.')[0]] = fullText;
          readStream.close((e) => reject(e));
        });
        readStream.on('error', (e) => reject(error));
      });
      resolve(contentOfComponents);
    })
  })
}

function substitudeTemplate(text, components) {
  const componentsArray = Object.entries(components);
  let textOfTemplate = text;
  for (let i = 0; i < componentsArray.length; i += 1) {
    textOfTemplate = textOfTemplate.replaceAll(
      `{{${componentsArray[i][0]}}}`,
      componentsArray[i][1],
    );
  }
  return textOfTemplate;
}
/* Merge styles */
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

/* Create index.html */
createFolder(pathToDistFolder)
  .then(() => {
    return readComponentsFileNames();
  })
  .then(async (components) => {
    let textOfTemplate = await fsPromise.readFile(
      path.join(__dirname, 'template.html'),
      'utf8',
    );
    return [textOfTemplate, components];
  })
  .then((arr) => {
    const [textOfTemplate, components] = arr;
    return substitudeTemplate(textOfTemplate, components);
  })
  .then(async (text) => {
    await fsPromise.writeFile(path.join(pathToDistFolder, 'index.html'), text, {
      encoding: 'utf-8',
    });
    /* const writeStream = fs.createWriteStream(
      path.join(pathToDistFolder, 'index.html'),{
        encoding: 'utf-8',
      });
    writeStream.write(text);
    writeStream.end();
    writeStream.on('finish', () => writeStream.close()); */
  }).catch((err) => console.log(`You have got an error: ${err.message}`))
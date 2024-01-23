const path = require('path');
const fs = require('fs');
const process = require('process');
const readline = require('readline');
const pathJoined = path.join(__dirname, 'text.txt');
const streamWrite = fs.createWriteStream(pathJoined, {
  encoding: 'utf-8',
});

const endProgram = async () => {
  streamWrite.end();
/*   streamWrite.on('finish', () => {
    console.log(`\nCheck the text in the ${pathJoined}`);
  }); */
  process.exit(0);
}
streamWrite.on('error', (e) => {
  console.log(`Something goes wrong: ${e.message}`);
});
const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Input some text here or type `exit` / press `Ctrl + c` to finish: ',
});
//Invoke prompt
cli.prompt();
cli.setPrompt('Enter more text or type `exit` / press `Ctrl + c` to finish: ');
cli
  .on('line', (line) => {
    const lineTrimmed = line.trim();
    switch (lineTrimmed) {
      case 'exit':
        /* console.log(`\nCheck the text in the ${pathJoined}`); */
        cli.close();
        break;
      default:
        streamWrite.write(lineTrimmed + '\n');
        cli.prompt();
        break;
    }
  })
  .on('close', () => {
    console.log(`\nCheck the text in the ${pathJoined}`);
    endProgram()
  });

/* process.on('SIGINT', () => {
  endProgram();
});
 */
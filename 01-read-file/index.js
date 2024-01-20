const path = require('path');
const fs = require('fs');
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), {
  encoding: 'utf-8',
});
let fullText = '';
stream.on('data', (data) => (fullText += data));
stream.on('end', () => console.log(fullText));
stream.on('error', (e) => console.log(`You have got an error: ${e.message}`));

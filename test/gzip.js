const zlib = require('zlib');
const fs = require('fs');

var compress = zlib.createGzip();
var input = fs.createReadStream('input.txt');
var output = fs.createWriteStream('input.txt.gz');

input.pipe(compress).pipe(output);


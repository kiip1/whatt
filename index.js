const fs = require('fs');
const path = require('path');
const minify = require('minify');

var bundle = '';

for (const file of fs.readdirSync('./src')) bundle += fs.readFileSync(path.join(__dirname, `/src/${file}`)) + '\n\n';

fs.mkdir(path.join(__dirname, '/build/'), () => fs.writeFile(path.join(__dirname, '/build/whatt.js'), bundle, () => minify('./build/whatt.js').then((bundle_min) => fs.writeFileSync(path.join(__dirname, '/build/whatt.min.js'), bundle_min))));
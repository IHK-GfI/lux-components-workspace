const fse = require('fs-extra');

console.log('> Script "move-de-files.js" started...');

if (fse.pathExistsSync('dist/browser/de')) {
  console.log('> Move files (locale "de")...');
  fse.copySync('dist/browser/de', 'dist/', { overwrite: true });
  fse.removeSync('dist/browser/de');
  console.log('> Success!');
} else {
  console.log('> No folder "de" found. Nothing is to do.');
}

if (fse.pathExistsSync('dist/browser/en')) {
  console.log('> Move files (locale "en")...');
  fse.copySync('dist/browser/en', 'dist/en', { overwrite: true });
  fse.removeSync('dist/browser/en');
  console.log('> Success!');
} else {
  console.log('> No folder "en" found. Nothing is to do.');
}

if (fse.pathExistsSync('dist/browser')) {
  fse.removeSync('dist/browser');
}

console.log('> Script "move-de-files.js" finished.');

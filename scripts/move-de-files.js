const fse = require('fs-extra');

console.log('> Script "move-de-files.js" started...');

if (fse.pathExistsSync('dist/demo-app/browser/de')) {
  console.log('> Move files (locale "de")...');
  fse.copySync('dist/demo-app/browser/de', 'dist/demo-app/', { overwrite: true });
  fse.removeSync('dist/demo-app/browser/de');
  console.log('> Success!');
} else {
  console.log('> No folder "de" found. Nothing is to do.');
}

if (fse.pathExistsSync('dist/demo-app/browser/en')) {
  console.log('> Move files (locale "en")...');
  fse.copySync('dist/demo-app/browser/en', 'dist/demo-app/en', { overwrite: true });
  fse.removeSync('dist/demo-app/browser/en');
  console.log('> Success!');
} else {
  console.log('> No folder "en" found. Nothing is to do.');
}

if (fse.pathExistsSync('dist/demo-app/browser')) {
  fse.removeSync('dist/demo-app/browser');
}

console.log('> Script "move-de-files.js" finished.');

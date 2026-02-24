const fse = require('fs-extra');

console.log('> Script "move-files.js" started...');

if (fse.pathExistsSync('dist/browser')) {
  console.log('> Move files...');
  fse.copySync('dist/browser', 'dist/', { overwrite: true });
  fse.removeSync('dist/browser');
  console.log('> Success!');
} else {
  console.log('> No folder "browser" found. Nothing is to do.');
}

console.log('> Script "move-de-files.js" finished.');

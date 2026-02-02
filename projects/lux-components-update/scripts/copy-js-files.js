const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

async function copyJsFiles() {
  try {
    const sourceBase = path.resolve(__dirname, '../../../dist/updater/src');
    const targetBase = path.resolve(__dirname, '../../../node_modules/@ihk-gfi/lux-components-update');

    // Find all .js files in source
    const pattern = '**/*.js';
    const files = glob.sync(pattern, { 
      cwd: sourceBase,
      nodir: true 
    });

    console.log(`Found ${files.length} JavaScript files to copy`);

    // Copy each file
    for (const file of files) {
      const sourcePath = path.join(sourceBase, file);
      const targetPath = path.join(targetBase, file);
      
      await fs.copy(sourcePath, targetPath);
      console.log(`Copied ${file}`);
    }

    console.log('JavaScript files copied successfully');
  } catch (err) {
    console.error('Error copying JavaScript files:', err);
    process.exit(1);
  }
}

copyJsFiles();

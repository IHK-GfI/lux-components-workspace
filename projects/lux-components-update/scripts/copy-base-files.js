const fs = require('fs-extra');
const path = require('path');

async function copyBaseFiles() {
  try {
    const sourceDir = path.resolve(__dirname, '..');
    const targetDir = path.resolve(__dirname, '../../../dist/updater');

    // Ensure target directory exists
    await fs.ensureDir(targetDir);

    // Copy individual files
    const files = ['collection.json', 'package.json', 'README.md'];
    for (const file of files) {
      await fs.copy(
        path.join(sourceDir, file),
        path.join(targetDir, file)
      );
      console.log(`Copied ${file}`);
    }

    // Copy LICENSE from root
    await fs.copy(
      path.resolve(__dirname, '../../../LICENSE'),
      path.join(targetDir, 'LICENSE')
    );
    console.log('Copied LICENSE');

    console.log('Base files copied successfully');
  } catch (err) {
    console.error('Error copying base files:', err);
    process.exit(1);
  }
}

copyBaseFiles();

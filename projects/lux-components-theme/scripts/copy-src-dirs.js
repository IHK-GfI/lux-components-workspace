const fs = require('fs-extra');
const path = require('path');

async function copySrcDirs() {
  try {
    const sourceDir = path.resolve(__dirname, '../src');
    const targetDir = path.resolve(__dirname, '../../../dist/theme/src');

    // Copy entire src directory
    await fs.copy(sourceDir, targetDir);
    console.log('Source directories copied successfully');

  } catch (err) {
    console.error('Error copying source directories:', err);
    process.exit(1);
  }
}

copySrcDirs();

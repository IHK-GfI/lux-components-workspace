const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

async function copyTemplateDirs() {
  try {
    const sourceBase = path.resolve(__dirname, '../src');
    const targetBase = path.resolve(__dirname, '../../../dist/updater');

    // Find all files matching the pattern
    const pattern = '**/files/**';
    const files = glob.sync(pattern, { 
      cwd: sourceBase,
      nodir: true 
    });

    console.log(`Found ${files.length} template files to copy`);

    // Copy each file
    for (const file of files) {
      const sourcePath = path.join(sourceBase, file);
      const targetPath = path.join(targetBase, 'src', file);
      
      await fs.copy(sourcePath, targetPath);
      console.log(`Copied ${file}`);
    }

    console.log('Template directories copied successfully');
  } catch (err) {
    console.error('Error copying template directories:', err);
    process.exit(1);
  }
}

copyTemplateDirs();

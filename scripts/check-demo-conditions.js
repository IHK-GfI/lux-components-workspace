const fs = require('fs');
const chalk = require('chalk');
const { execSync } = require('child_process');

// Prüfen, ob das Theme bereits gebaut wurde.
// Falls nicht, wird das Theme gebaut.
const pathTheme = './dist/theme';
if (!fs.existsSync(pathTheme)) {
  console.log(`Das Theme wurde noch nicht gebaut.`);
  console.log(`Es wird das Script ${chalk.yellowBright('npm run pack:theme')} gestartet...\n`);
  execSync('npm run pack:theme', { stdio: 'inherit' });
} 

// Prüfen, ob die LUX-Components-Lib bereits gebaut wurde.
// Falls nicht, wird die LUX-Components-Lib gebaut.
const pathLib = './dist/lux-components-lib';
if (!fs.existsSync(pathLib)) {
  console.log(`Die LUX-Components-Lib wurde noch nicht gebaut.`);
  console.log(`Es wird das Script ${chalk.yellowBright('npm run pack:components')} gestartet...\n`);
  execSync('npm run pack:components', { stdio: 'inherit' });
}
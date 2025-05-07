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

//Prüfen ob relative Imports in der Demo sind
const glob = require("glob");

const files = glob.sync("./projects/demo-app/src/app/components-overview/**/*.ts");

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    if (line.includes("import")) {
      const importLib = line.match(/lux-components-lib/);
      if (importLib) {
        console.error("Check Demo Imports");
        console.error(`  ${file} Line ${index + 1}: relativen lib Import gefunden!`);
        console.error(`  `);
        console.warn(`  Keine relativen Imports in der Demo-App verwenden! Alle Componenten müssen aus @ihk-gfi/lux-components importiert werden.`);
        console.error(`  `);

        process.exit(1);
      }
    }
  });
});
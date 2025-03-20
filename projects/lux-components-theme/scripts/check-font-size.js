// Prüfe, dass keine SCSS-Datei eine font-size in Pixel (px) enthält.
// Wenn doch, wird eine Warnung ausgegeben und das Skript beendet.

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const files = glob.sync("./src/**/*.scss");

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    if (line.includes("font-size")) {
      const fontSize = line.match(/font-size: (\d+)px/);
      if (fontSize) {
        console.error("Check font-size");
        console.error(`  ${file} Line ${index + 1}: font-size in px gefunden!`);
        console.error(`  `);
        console.warn(`  Bitte "rem" anstatt "px" verwenden (z.B. font-size: 16px; -> font-size: 1rem;).`);
        console.error(`  `);
        console.info(`  | Pixel (px) | Rem (rem) |       | Pixel (px) | Rem (rem) |       | Pixel (px) | Rem (rem) |`);
        console.info(`  |------------|-----------|       |------------|-----------|       |------------|-----------|`);
        console.info(`  | 1px        | 0.0625rem |       | 10px       | 0.625rem  |       | 19px       | 1.1875rem |`);
        console.info(`  | 2px        | 0.125rem  |       | 11px       | 0.6875rem |       | 20px       | 1.25rem   |`);
        console.info(`  | 3px        | 0.1875rem |       | 12px       | 0.75rem   |       | 21px       | 1.3125rem |`);
        console.info(`  | 4px        | 0.25rem   |       | 13px       | 0.8125rem |       | 22px       | 1.375rem  |`);
        console.info(`  | 5px        | 0.3125rem |       | 14px       | 0.875rem  |       | 23px       | 1.4375rem |`);
        console.info(`  | 6px        | 0.375rem  |       | 15px       | 0.9375rem |       | 24px       | 1.5rem    |`);
        console.info(`  | 7px        | 0.4375rem |       | 16px       | 1rem      |       | 25px       | 1.5625rem |`);
        console.info(`  | 8px        | 0.5rem    |       | 17px       | 1.0625rem |       | 26px       | 1.625rem  |`);
        console.info(`  | 9px        | 0.5625rem |       | 18px       | 1.125rem  |       | ...        | ...       |`);
        console.info(`  `);

        process.exit(1);
      }
    }
  });
});

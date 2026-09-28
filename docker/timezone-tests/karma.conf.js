// Karma-Konfiguration für den Zeitzonen-Container (siehe Dockerfile).
// Übernimmt die Konfiguration der lux-components-lib und startet Chromium ohne Sandbox,
// da der Container als root läuft.
const base = require('/work/projects/lux-components-lib/karma.conf.js');

module.exports = function (config) {
  base(config);
  config.set({
    // Die Pfade der Basis-Konfiguration (z.B. dist/theme) sind relativ zu deren Verzeichnis
    basePath: '/work/projects/lux-components-lib',
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-dev-shm-usage']
      }
    },
    reporters: ['progress']
  });
};

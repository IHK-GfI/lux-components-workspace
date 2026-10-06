// Startet die Visual Regression Tests (e2e/) im offiziellen Playwright-Container.
// Die Baselines sind plattformabhängig (Schriftrendering) und werden deshalb
// immer im selben Linux-Image erzeugt und verglichen – lokal wie in CI.
//
// Aufruf:  npm run vrt [-- <playwright-Argumente>]
//          npm run vrt:update
// Engine:  VRT_CONTAINER_ENGINE=docker npm run vrt   (Standard: podman)
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const workspace = path.resolve(__dirname, '..');
const playwrightVersion = require('../e2e/package.json').devDependencies['@playwright/test'];
const image = `mcr.microsoft.com/playwright:v${playwrightVersion}-noble`;
const engine = process.env.VRT_CONTAINER_ENGINE || 'podman';

if (!fs.existsSync(path.join(workspace, 'dist/demo-app/browser/index.html'))) {
  console.error('Kein Demo-Build gefunden (dist/demo-app/browser). Bitte zuerst "npm run vrt:build" ausführen.');
  process.exit(1);
}

const quote = (arg) => `'${arg.replace(/'/g, `'\\''`)}'`;
const playwrightArgs = process.argv.slice(2).map(quote).join(' ');
const command = `npm install --no-audit --no-fund --loglevel=error && npx playwright test ${playwrightArgs}`;

const result = spawnSync(
  engine,
  [
    'run',
    '--rm',
    '--ipc=host',
    '-v',
    `${workspace}:/work`,
    // Eigenes Volume für die Linux-node_modules, damit sie nicht mit denen des Hosts kollidieren.
    '-v',
    'lux-vrt-node-modules:/work/e2e/node_modules',
    '-w',
    '/work/e2e',
    image,
    'sh',
    '-c',
    command
  ],
  { stdio: 'inherit' }
);

if (result.error) {
  console.error(`"${engine}" konnte nicht gestartet werden: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);

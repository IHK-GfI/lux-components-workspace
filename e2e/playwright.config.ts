import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const port = Number(process.env.VRT_PORT ?? 4300);
const baseURL = `http://localhost:${port}`;

export const STORAGE_STATE = path.join(__dirname, '.auth/state.json');
export const STORAGE_STATE_GREEN = path.join(__dirname, '.auth/state-green.json');

const desktop = {
  ...devices['Desktop Chrome'],
  viewport: { width: 1440, height: 900 },
  storageState: STORAGE_STATE
};

/**
 * Playwright-Tests für die Demo-App:
 * - visual: Visual Regression Tests (Screenshots), je Theme ein Projekt (authentic, green)
 * - form:   Verhaltenstests der Form-Controls
 *
 * Die Baselines werden ausschließlich im offiziellen Playwright-Container erzeugt
 * (lokal per podman über "npm run vrt", in CI als Job-Container). Deshalb enthält
 * der Snapshot-Pfad bewusst kein Plattform-Suffix.
 */
export default defineConfig({
  outputDir: './test-results',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 4,
  // In der CI laufen die Tests aufgeteilt (--shard). Jeder Shard schreibt einen Blob-Report,
  // der Workflow führt sie anschließend zu einem HTML-Report zusammen.
  reporter: process.env.CI ? [['list'], ['blob']] : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      // Die Screenshots entstehen immer im selben Container, sind aber nicht ganz byte-identisch.
      // Gemessenes Rauschen zwischen zwei Läufen (2026-11-26):
      // - Schatten/Overlays (z. B. Popup): bis 37 Pixel, je genau eine RGB-Stufe (Farbabstand ~0.0037)
      // - Kantenglättung an Text und Icons: bis 6 Pixel, Farbabstand bis ~0.054
      //
      // Farbtoleranz je Pixel: blendet nur Abweichungen um eine RGB-Stufe aus, ab zwei Stufen zählt
      // jedes Pixel. Der Standardwert 0.2 war zu großzügig und ließ echte Farbänderungen durch
      // (z. B. #ad000f -> #c00013 an der Progressbar: 0.11, Schließen-Button der Messagebox: 0.145).
      threshold: 0.005,
      // Absolute statt relativer Toleranz (maxDiffPixelRatio hätte bei großen Karten ganze geänderte
      // Ziffern oder Wörter durchgelassen). Deckt die Kantenglättung mit Reserve ab. Echte Änderungen
      // betreffen fast immer deutlich mehr Pixel (ein geänderter Rahmen schon den ganzen Umfang).
      maxDiffPixels: 10
    }
  },
  use: {
    baseURL,
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'setup',
      testDir: './setup',
      testMatch: /.*\.setup\.ts/
    },
    {
      name: 'chromium-authentic',
      testDir: './visual',
      testMatch: /.*\.spec\.ts/,
      dependencies: ['setup'],
      use: desktop
    },
    // Dieselben Screenshot-Tests im Theme "green". Eigener Ablageort der Referenzbilder, weil die
    // globale Vorlage keinen Projektnamen enthält und die Authentic-Bilder sonst überschrieben würden.
    {
      name: 'chromium-green',
      testDir: './visual',
      testMatch: /.*\.spec\.ts/,
      snapshotPathTemplate: '{testDir}/__screenshots__-green/{testFilePath}/{arg}{ext}',
      dependencies: ['setup'],
      use: { ...desktop, storageState: STORAGE_STATE_GREEN }
    },
    {
      name: 'form',
      testDir: './form',
      testMatch: /.*\.spec\.ts/,
      dependencies: ['setup'],
      use: desktop
    },
    // Datums- und Zeittests zusätzlich in extremen Zeitzonen (UTC-12 und UTC+14). Playwright emuliert
    // die Zeitzone im Browser – das funktioniert auch unter Windows, anders als TZ bei Karma.
    ...['Etc/GMT+12', 'Pacific/Kiritimati'].map((timezoneId) => ({
      name: `form-tz-${timezoneId.replace(/\W+/g, '-')}`,
      testDir: './form',
      testMatch: /(datepicker|timepicker)\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...desktop, timezoneId }
    }))
  ],
  webServer: {
    command: 'node serve-demo.mjs',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});

import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const port = Number(process.env.VRT_PORT ?? 4300);
const baseURL = `http://localhost:${port}`;

export const STORAGE_STATE = path.join(__dirname, '.auth/state.json');

const desktop = {
  ...devices['Desktop Chrome'],
  viewport: { width: 1440, height: 900 },
  storageState: STORAGE_STATE
};

/**
 * Playwright-Tests für die Demo-App:
 * - visual: Visual Regression Tests (Screenshots)
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
      // Keine Toleranz: Die Screenshots entstehen immer im selben Container und sind byte-identisch
      // reproduzierbar. Eine relative Toleranz (maxDiffPixelRatio) hätte bei großen Karten
      // ganze geänderte Ziffern oder Wörter durchgelassen.
      maxDiffPixels: 0
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
      testMatch: /(datepicker-ac|datetimepicker-ac|timepicker)\.spec\.ts/,
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

import { expect, Page, test } from '@playwright/test';
import { FormExamplePage } from '../form/support/form-example';
import { openStable, pauseClock, screenshotSoft, screenshotWithGlobalProgressSoft } from './vrt-helper';

/**
 * Zustände der Leave-Guard-Demo (luxLeaveGuard + LuxLoadingService, Pattern "Global Blocking State").
 * Die Route der Demo ist selbst mit dem Guard geschützt, die Dialoge erscheinen beim Wegnavigieren
 * über "Weiter" in der Komponentenliste.
 */

const ROUTE = '/components-overview/example/leave-guard';

/** Die Uhrzeiten im Protokoll hängen von der Laufzeit ab und werden deshalb ausgeblendet. */
const HIDE_LOG_TIME = '.example-log-time { display: none; }';

/** Dauer des simulierten Speicherns (SAVE_DURATION_MS) und Eingabepause des Filters (FILTER_DEBOUNCE_MS) in der Demo. */
const SAVE_DURATION_MS = 5000;
const FILTER_DEBOUNCE_MS = 600;

/** LuxComponentsConfigService.DEFAULT_CONFIG.buttonConfiguration.throttleTimeMs */
const BUTTON_THROTTLE_MS = 600;

async function openLeaveGuard(page: Page) {
  await openStable(page, ROUTE, page.locator('app-leave-guard-example'), HIDE_LOG_TIME);
}

function exampleCard(page: Page) {
  return page.locator('lux-card.example-base-container');
}

function nameInput(page: Page) {
  return page.locator('example-base-content').getByRole('textbox', { name: 'Name', exact: true });
}

function saveButton(page: Page) {
  return page.locator('example-base-content').getByRole('button', { name: 'Speichern', exact: true });
}

/** Navigiert über "Weiter" zur nächsten Komponente und löst damit den Guard aus. */
async function navigateAway(page: Page) {
  await page.getByRole('navigation', { name: 'Komponentenbeispiele' }).getByRole('button', { name: 'Weiter', exact: true }).click();
}

async function enterName(page: Page) {
  await nameInput(page).fill('Erika Mustermann');
  await expect(saveButton(page)).toBeEnabled();
}

/**
 * Startet das Speichern bei angehaltener Uhr, damit der blockierende Zustand bis zum Screenshot bestehen bleibt.
 * Die Change Detection der Demo braucht selbst Timer, deshalb nach dem Klick kurz vorspulen.
 */
async function startSaving(page: Page) {
  await enterName(page);
  await pauseClock(page);
  await saveButton(page).click();
  await page.clock.runFor(100);
  await expect(nameInput(page)).toBeDisabled();
}

test('leave-guard-states/ungespeichert', async ({ page }) => {
  await openLeaveGuard(page);
  await enterName(page);

  await screenshotSoft(page, exampleCard(page), 'leave-guard-ungespeichert.png');
});

test('leave-guard-states/speichern-laeuft', async ({ page }) => {
  await openLeaveGuard(page);
  await startSaving(page);
  await expect(page.getByRole('progressbar', { name: 'Verarbeitung läuft.' })).toBeVisible();

  await screenshotWithGlobalProgressSoft(page, exampleCard(page), 'leave-guard-speichern-laeuft.png');

  await page.clock.runFor(SAVE_DURATION_MS);
  await expect(nameInput(page)).toBeEnabled();
  await expect(saveButton(page)).toBeDisabled();
  await screenshotSoft(page, exampleCard(page), 'leave-guard-gespeichert.png');
});

test('leave-guard-states/filtern-laeuft', async ({ page }) => {
  await openLeaveGuard(page);
  await pauseClock(page);
  await page.locator('example-base-content').getByRole('textbox', { name: 'Filterbegriff', exact: true }).fill('Antrag');
  await page.clock.runFor(FILTER_DEBOUNCE_MS);
  await expect(page.getByRole('progressbar', { name: 'Verarbeitung läuft.' })).toBeVisible();
  // Anzeigend: die Seite bleibt bedienbar.
  await expect(nameInput(page)).toBeEnabled();

  await screenshotWithGlobalProgressSoft(page, exampleCard(page), 'leave-guard-filtern-laeuft.png');
});

test('leave-guard-states/dauerhaft-blockiert', async ({ page }) => {
  await openLeaveGuard(page);
  await FormExamplePage.forPage(page).options.setSwitch('Seite dauerhaft blockieren');
  await expect(nameInput(page)).toBeDisabled();

  await screenshotWithGlobalProgressSoft(page, exampleCard(page), 'leave-guard-dauerhaft-blockiert.png');
});

test('leave-guard-states/dialog-ungespeichert', async ({ page }) => {
  await openLeaveGuard(page);
  await enterName(page);

  await navigateAway(page);
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Ungespeicherte Änderungen');
  await screenshotSoft(page, dialog, 'leave-guard-dialog-ungespeichert.png');

  // Abbrechen: die Seite bleibt geöffnet.
  await dialog.getByRole('button', { name: 'Abbrechen', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`${ROUTE}$`));

  // Verwerfen und fortfahren: die Navigation wird zugelassen.
  // "Weiter" ist dieselbe lux-button-Instanz wie beim ersten Klick und ignoriert Klicks innerhalb von
  // buttonConfiguration.throttleTimeMs. Die Uhr deshalb vorspulen, sonst wird der Klick je nach Laufzeit verschluckt.
  await page.clock.runFor(BUTTON_THROTTLE_MS);
  await navigateAway(page);
  await dialog.getByRole('button', { name: 'Verwerfen und fortfahren', exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page).not.toHaveURL(new RegExp(`${ROUTE}$`));
});

test('leave-guard-states/dialog-verarbeitung', async ({ page }) => {
  await openLeaveGuard(page);
  await startSaving(page);

  await navigateAway(page);
  await page.clock.runFor(100);
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Aktion wird verarbeitet');
  await screenshotSoft(page, dialog, 'leave-guard-dialog-verarbeitung.png');

  // Schließen: die Navigation wird abgelehnt, das Speichern läuft weiter.
  await dialog.getByRole('button', { name: 'Schließen', exact: true }).click();
  await page.clock.runFor(100);
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`${ROUTE}$`));
  await expect(nameInput(page)).toBeDisabled();
});

import { expect, Locator, Page, test } from '@playwright/test';
import { openStable, screenshotSoft } from './vrt-helper';

const BUTTON_THROTTLE_WAIT_MS = 650;

/**
 * Zustände des Master-Detail-Beispiels (/components-overview/master-detail-ac).
 * Jeder Test startet auf einer frisch geladenen Seite und nimmt die komplette
 * Master-Detail-Komponente auf.
 */

/**
 * Öffnet das Beispiel und wartet, bis es zur Ruhe gekommen ist: Die Demo lädt per
 * Infinite-Scrolling nach 1,5 s fünf weitere Einträge nach (10 -> 15) und selektiert
 * nach 2 s "Eintrag #2". Die Uhr wird deshalb vorgespult.
 */
async function openMasterDetail(page: Page) {
  const masterDetail = page.locator('lux-master-detail-ac');
  await openStable(page, '/components-overview/master-detail-ac', masterDetail);
  await page.clock.runFor(2000);

  await expect(masterDetail.locator('lux-list-item')).toHaveCount(15);
  await expect(masterDetail.locator('.lux-master-progress-container')).toHaveClass(/lux-spinner-hidden/);
  await expect(row(masterDetail, 2)).toHaveAttribute('aria-selected', 'true');
  return masterDetail;
}

/**
 * Zeile der Masterliste; das Leerzeichen grenzt z. B. "Eintrag #2" von "Eintrag #20" ab.
 * includeHidden, weil die Liste mobil ausgeblendet ist, solange das Detail angezeigt wird.
 */
function row(masterDetail: Locator, nr: number) {
  return masterDetail.getByRole('row', { name: new RegExp(`^Eintrag #${nr} `), includeHidden: true });
}

/** Selektiert einen Eintrag per Klick. Geklickt wird auf den Inhalt, nicht auf das Eingabefeld im Header. */
async function selectEntry(masterDetail: Locator, nr: number) {
  await row(masterDetail, nr)
    .getByText(/^\s*Fällig/)
    .click();
  await expect(row(masterDetail, nr)).toHaveAttribute('aria-selected', 'true');
  await expect(
    masterDetail.locator('.lux-detail-view-container').getByRole('heading', { name: `Eintrag #${nr}`, exact: true })
  ).toBeVisible();
}

/** Führt einen Eintrag des Menüs im Master-Footer aus. */
async function footerMenu(page: Page, masterDetail: Locator, item: string) {
  // lux-menu rendert neben dem sichtbaren Default-Trigger ein leeres div mit role="button" und gleichem Namen.
  await masterDetail.locator('lux-master-footer-ac .lux-menu-trigger-default').getByRole('button', { name: 'Menü', exact: true }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.getByRole('menuitem', { name: item, exact: true }).click();
  await expect(page.getByRole('menu')).toBeHidden();
  await page.clock.runFor(BUTTON_THROTTLE_WAIT_MS);
}

async function toggleMaster(page: Page, masterDetail: Locator, action: 'zuklappen' | 'aufklappen') {
  await masterDetail.getByRole('button', { name: `Masterliste ${action}`, exact: true }).click();
  const other = action === 'zuklappen' ? 'aufklappen' : 'zuklappen';
  await expect(masterDetail.getByRole('button', { name: `Masterliste ${other}`, exact: true })).toBeVisible();
  await page.clock.runFor(BUTTON_THROTTLE_WAIT_MS);
}

function screenshot(page: Page, masterDetail: Locator, name: string) {
  return screenshotSoft(page, masterDetail, `master-detail-${name}.png`);
}

test.describe('Desktop', () => {
  test('master-detail/start', async ({ page }) => {
    const masterDetail = await openMasterDetail(page);

    await screenshot(page, masterDetail, 'start');
  });

  test('master-detail/detail-selektieren', async ({ page }) => {
    const masterDetail = await openMasterDetail(page);
    await selectEntry(masterDetail, 4);

    await screenshot(page, masterDetail, 'detail-selektiert');
  });

  test('master-detail/liste-leeren-fuellen', async ({ page }) => {
    const masterDetail = await openMasterDetail(page);

    await footerMenu(page, masterDetail, 'Liste leeren');
    await expect(masterDetail.locator('lux-list-item')).toHaveCount(0);
    await expect(masterDetail.locator('.lux-detail-empty-container')).toBeVisible();
    await screenshot(page, masterDetail, 'liste-leer');

    await footerMenu(page, masterDetail, 'Liste füllen');
    await expect(masterDetail.locator('lux-list-item')).toHaveCount(20);
    await screenshot(page, masterDetail, 'liste-gefuellt');
  });

  test('master-detail/liste-zu-aufklappen', async ({ page }) => {
    const masterDetail = await openMasterDetail(page);

    await toggleMaster(page, masterDetail, 'zuklappen');
    await expect(masterDetail.getByRole('grid')).toBeHidden();
    await screenshot(page, masterDetail, 'liste-zugeklappt');

    await toggleMaster(page, masterDetail, 'aufklappen');
    await expect(masterDetail.getByRole('grid')).toBeVisible();
    await screenshot(page, masterDetail, 'liste-aufgeklappt');
  });

  test('master-detail/filter', async ({ page }) => {
    const masterDetail = await openMasterDetail(page);

    await masterDetail.getByRole('combobox', { name: 'Fälligkeit' }).click();
    await page.getByRole('option', { name: 'Nächste 3 Tage', exact: true }).click();
    await expect(masterDetail.locator('lux-list-item')).toHaveCount(3);

    await screenshot(page, masterDetail, 'filter');
  });

  test('master-detail/custom-detail-header', async ({ page }) => {
    const masterDetail = await openMasterDetail(page);

    const toggle = masterDetail.getByRole('switch', { name: 'Custom Detail-Header anzeigen', exact: true });
    await toggle.click();
    await expect(toggle).toBeChecked();
    // Der Klick auf den Schalter hat den Detailbereich nach unten gescrollt, der Header steht aber oben.
    await masterDetail.locator('.lux-detail-ac-container').evaluate((element) => element.scrollTo(0, 0));
    await expect(masterDetail.getByRole('heading', { name: 'My Custom Detail Header!' })).toBeInViewport();

    await screenshot(page, masterDetail, 'custom-detail-header');
  });
});

test.describe('Mobil', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('master-detail/mobil', async ({ page }) => {
    // Mobil zeigt die Komponente entweder die Liste oder das Detail. Durch die automatische
    // Selektion der Demo ist nach dem Laden das Detail von "Eintrag #2" zu sehen.
    const masterDetail = await openMasterDetail(page);
    await expect(masterDetail.getByRole('grid')).toBeHidden();
    await screenshot(page, masterDetail, 'mobil-detail');

    // Der Zurück-Button hat keinen zugänglichen Namen, deshalb per Klasse.
    await masterDetail.locator('.back-to-master-button button').click();
    await expect(masterDetail.getByRole('grid')).toBeVisible();
    await screenshot(page, masterDetail, 'mobil-liste');

    await selectEntry(masterDetail, 4);
    await expect(masterDetail.getByRole('grid')).toBeHidden();
    await screenshot(page, masterDetail, 'mobil-detail-selektiert');
  });
});

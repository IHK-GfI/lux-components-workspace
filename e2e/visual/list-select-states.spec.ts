import { expect, Locator, Page, test } from '@playwright/test';
import { ExampleOptions, FormExamplePage } from '../form/support/form-example';
import { openExample, pauseClock, screenshotSoft } from './vrt-helper';

/**
 * Auswahl, Suche, Paginierung und weitere Konfigurationen von lux-list-select.
 * Die Beispielliste enthält 11 Adressen, davon ist "Markus Fischer" deaktiviert.
 */

function listSelect(page: Page) {
  return page.locator('example-base-content lux-list-select');
}

async function check(list: Locator, name: string) {
  const checkbox = list.getByRole('checkbox', { name, exact: true });
  await checkbox.click();
  await expect(checkbox).toBeChecked();
}

type StateFn = (options: ExampleOptions, list: Locator, page: Page) => Promise<void>;

const STATES: Record<string, StateFn> = {
  auswahl: async (_options, list) => {
    await check(list, 'Anna Müller');
    await check(list, 'Laura Weber');
    await expect(list).toContainText('2 von 11 ausgewählt');
  },
  'alle-ausgewaehlt': async (_options, list) => {
    await check(list, 'Alle Adressen');
    await expect(list.getByRole('checkbox', { name: 'Markus Fischer' })).not.toBeChecked();
  },
  single: async (options, list) => {
    await options.select('luxMode', 'single');
    const radio = list.getByRole('radio', { name: 'Thomas Schmidt', exact: true });
    await radio.click();
    await expect(radio).toBeChecked();
  },
  suche: async (options, list, page) => {
    await options.setSwitch('luxShowSearch');
    await list.getByRole('textbox', { name: 'Suche' }).fill('München');
    // luxSearchDelay (Standard 300 ms)
    await page.clock.runFor(300);
    await expect(list.getByRole('row')).toHaveCount(1);
  },
  'seite-2': async (options, list) => {
    await options.setSwitch('luxShowPagination');
    await list.getByRole('button', { name: 'Nächste Seite' }).click();
    await expect(list.getByRole('status')).toHaveText('6 - 10 von 11');
  },
  'liste-leer': async (_options, _list, page) => {
    await page.getByRole('button', { name: 'Liste leeren', exact: true }).click();
    await expect(listSelect(page).getByRole('row')).toHaveCount(0);
  },
  'langer-eintrag': async (_options, list, page) => {
    await page.getByRole('button', { name: 'Liste leeren', exact: true }).click();
    await page.getByRole('button', { name: 'Langen Eintrag hinzufügen', exact: true }).click();
    await expect(list.getByRole('row')).toHaveCount(1);
  },
  disabled: (options) => options.setSwitch('luxDisabled'),
  fehler: (options) => options.setText('luxErrorMessage', 'Bitte wählen Sie mindestens eine Adresse aus.'),
  'aktion-button': (options) => options.select('Aktions-Template (luxListSelectAction)', 'Icon-Button'),
  'aktion-menue-links': async (options) => {
    await options.select('Aktions-Template (luxListSelectAction)', 'Menü (lux-menu)');
    await options.select('luxActionPosition', 'left');
  },
  'size-small': (options) => options.select('luxSize', 'small'),
  'size-xsmall': (options) => options.select('luxSize', 'xsmall')
};

for (const [state, apply] of Object.entries(STATES)) {
  test(`list-select-states/${state}`, async ({ page }) => {
    await openExample(page, 'list-select');
    await apply(FormExamplePage.forPage(page).options, listSelect(page), page);

    await screenshotSoft(page, listSelect(page), `list-select-${state}.png`);
  });
}

test('list-select-states/http-dao', async ({ page }) => {
  await openExample(page, 'list-select');
  const list = listSelect(page);
  // Die Server-Simulation antwortet nach 1 s. Ohne angehaltene Uhr wäre der Ladezustand
  // beim Screenshot je nach Laufzeit schon vorbei. Die 100 ms braucht der Toggle selbst.
  await pauseClock(page);
  const toggle = FormExamplePage.forPage(page).options.switch('luxHttpDao (Server-Simulation)');
  await toggle.click();
  await page.clock.runFor(100);
  await expect(toggle).toBeChecked();

  await expect(list.getByRole('progressbar')).toBeVisible();
  await screenshotSoft(page, list, 'list-select-http-dao-laden.png');

  await page.clock.runFor(900);
  await expect(list.getByRole('progressbar')).toBeHidden();
  await expect(list).toContainText('0 von 11 ausgewählt');
  await screenshotSoft(page, list, 'list-select-http-dao-geladen.png');
});

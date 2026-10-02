import { expect, Locator, Page } from '@playwright/test';

/** Fester Zeitpunkt für Date.now()/new Date(), damit Datums- und Timestamp-Beispiele stabil bleiben. */
export const FIXED_TIME = new Date('2026-01-15T10:00:00+01:00');

/**
 * Öffnet eine Seite der Demo-App mit eingefrorener Uhr und wartet, bis
 * Inhalt, Webfonts und Netzwerk zur Ruhe gekommen sind.
 *
 * @param extraStyles optionales CSS, das vor dem Anpassen des Viewports eingefügt wird
 */
export async function openStable(page: Page, url: string, ready: Locator, extraStyles?: string) {
  // Startzeit festlegen, die Uhr läuft danach normal weiter. setFixedTime() würde die Zeit
  // komplett einfrieren – damit bleiben z. B. Tab-Wechsel in lux-tabs hängen.
  await page.clock.install({ time: FIXED_TIME });
  await page.goto(url);
  await expect(ready).toBeVisible();
  // Die Komponentenliste links ist im Desktop-Layout so hoch wie alle Einträge zusammen und
  // streckt per Flexbox den Beispielbereich mit. Ohne Begrenzung würde jedes neue Beispiel
  // in der Liste die Höhe aller Screenshots ändern.
  await page.addStyleTag({ content: '.example-base-components-list { max-height: 720px; }' });
  if (extraStyles) {
    await page.addStyleTag({ content: extraStyles });
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  await fitViewportToContent(page);
}

/** Tabs der Baseline-Seite und die jeweils darin gerenderte Komponente. */
export const BASELINE_TABS = [
  { title: 'Baseline', component: 'lux-baseline' },
  { title: 'Card', component: 'lux-baseline-card' },
  { title: 'Accordion', component: 'lux-baseline-accordion' }
] as const;

export type BaselineTab = (typeof BASELINE_TABS)[number]['title'];

/**
 * Öffnet die Baseline-Seite mit dem gewünschten Tab. Der Tab-Header wechselt sofort,
 * der (lazy) Inhalt erst danach – deshalb warten, bis ausschließlich die Komponente
 * des gewählten Tabs sichtbar ist.
 */
export async function openBaselineTab(page: Page, title: BaselineTab) {
  await openStable(page, '/baseline', page.locator('lux-baseline'));

  const tab = BASELINE_TABS.find((t) => t.title === title)!;
  await page.getByRole('tab', { name: title, exact: true }).click();
  for (const other of BASELINE_TABS.filter((t) => t !== tab)) {
    await expect(page.locator(other.component)).toBeHidden();
  }
  const content = page.locator(tab.component);
  await expect(content).toBeVisible();
  await page.waitForLoadState('networkidle');
  await fitViewportToContent(page);
  return content;
}

/**
 * lux-app-content ist ein eigener Scroll-Container. Damit Screenshots nicht
 * am unteren Viewport-Rand abgeschnitten werden, wird der Viewport so weit
 * vergrößert, dass der komplette Inhalt ohne Scrollen sichtbar ist.
 */
export async function fitViewportToContent(page: Page) {
  const viewport = page.viewportSize();
  if (!viewport) {
    return;
  }
  const overflow = await page.locator('lux-app-content').evaluate((element) => Math.max(0, element.scrollHeight - element.clientHeight));
  if (overflow > 0) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height + overflow });
  }
}

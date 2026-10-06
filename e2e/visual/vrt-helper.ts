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
  // Großzügiges Timeout: Bei voller Auslastung (4 Worker im Container) kam der Lazy-Chunk
  // einer Beispielseite schon erst nach über 6 s an.
  await expect(ready).toBeVisible({ timeout: 15_000 });
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

/**
 * Hält die von openStable installierte Uhr an. Danach vergeht Zeit nur noch über page.clock.runFor() –
 * nötig, um Ladezustände aufzunehmen, die sonst je nach Laufzeit schon vorbei wären.
 * pauseAt() kann nur vorspulen und die Uhr läuft bis zum Aufruf weiter, deshalb 1 s Puffer.
 * Vor der aufzunehmenden Aktion aufrufen, damit deren Timer nicht in den Puffer fallen.
 */
export async function pauseClock(page: Page) {
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
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
 * Bereitet einen Screenshot nach vorherigen Interaktionen vor: Fokus und Maus werden entfernt,
 * damit kein Hover-/Fokuszustand im Bild landet, und der Viewport wird an den Inhalt angepasst.
 */
export async function prepareScreenshot(page: Page) {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.mouse.move(0, 0);
  await page.waitForLoadState('networkidle');
  await fitViewportToContent(page);
}

/**
 * Screenshot eines Elements nach vorherigen Interaktionen. Soft, damit Tests mit mehreren
 * Zuständen in einem Lauf alle Abweichungen zeigen; schlägt eine Interaktion fehl, bricht der Test trotzdem ab.
 */
export async function screenshotSoft(page: Page, target: Locator, name: string) {
  await prepareScreenshot(page);
  await expect.soft(target).toHaveScreenshot(name);
}

/** Öffnet eine Beispielseite unter /components-overview/example/* und wartet auf die Beispielkomponente. */
export async function openExample(page: Page, route: string) {
  await openStable(page, `/components-overview/example/${route}`, page.locator('.example-base-content > router-outlet + *'));
}

/** Screenshot der Beispielkarte einer Seite unter /components-overview/example/*. */
export async function screenshotExampleCard(page: Page, name: string) {
  await prepareScreenshot(page);
  await expect(page.locator('lux-card.example-base-container')).toHaveScreenshot(name);
}

/**
 * lux-app-content ist ein eigener Scroll-Container. Damit Screenshots nicht
 * am unteren Viewport-Rand abgeschnitten werden, wird der Viewport so weit
 * vergrößert, dass der komplette Inhalt ohne Scrollen sichtbar ist.
 *
 * Vorher wird gewartet, bis sich die Inhaltshöhe nicht mehr ändert. Sonst misst eine noch
 * laufende Aufklapp-Animation zu wenig und der Screenshot wird unten abgeschnitten.
 */
export async function fitViewportToContent(page: Page) {
  const viewport = page.viewportSize();
  if (!viewport) {
    return;
  }
  const content = page.locator('lux-app-content');
  let previousHeight = -1;
  await expect
    .poll(
      async () => {
        const height = await content.evaluate((element) => element.scrollHeight);
        const stable = height === previousHeight;
        previousHeight = height;
        return stable;
      },
      { intervals: [100], message: 'Inhaltshöhe von lux-app-content kommt nicht zur Ruhe' }
    )
    .toBe(true);
  const overflow = await content.evaluate((element) => Math.max(0, element.scrollHeight - element.clientHeight));
  if (overflow > 0) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height + overflow });
  }
}

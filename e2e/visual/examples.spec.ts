import { expect, Locator, Page, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { openStable } from './vrt-helper';

/**
 * Screenshot-Test für jede Beispielseite unter /components-overview/example/*.
 *
 * Die Routen werden direkt aus components-overview.routes.ts gelesen,
 * damit neue Beispiele automatisch abgedeckt sind.
 */
const ROUTES_FILE = path.resolve(__dirname, '../../projects/demo-app/src/app/components-overview/components-overview.routes.ts');

/** Seiten, die sich nicht stabil abbilden lassen – jeweils mit Begründung. */
const SKIP: Record<string, string> = {};

/** Pro Seite zu maskierende Bereiche (z. B. dynamische Inhalte). */
const MASKS: Record<string, (page: Page) => Locator[]> = {
  // Session-Ende des Session-Timers als Zeitstempel ("jetzt" + Laufzeit) – ändert sich bei jedem Aufruf.
  storage: (page) => [page.locator('example-base-content').getByText(/^\s*\d{13}\s*$/)]
};

/**
 * Pro Seite eingefügtes CSS. Listen mit max-height in vh würden mitwachsen, wenn der Test
 * den Viewport auf die Inhaltshöhe vergrößert (fitViewportToContent) – die Höhe hinge dann
 * vom Ladezeitpunkt ab. Deshalb wird der Wert fixiert, der sich beim Standard-Viewport ergibt.
 */
const STYLES: Record<string, string> = {
  list: '.custom-list { max-height: 550px !important; }',
  'infinite-scrolling': '.infinite-list { max-height: 550px !important; }'
};

/**
 * Pro Seite das Element, auf das vor dem Screenshot gewartet wird. Standard ist die
 * Beispielkomponente selbst; Seiten, die ihre Daten verzögert laden, warten auf den geladenen Inhalt.
 */
const READY: Record<string, (exampleArea: Locator) => Locator> = {
  // Die Liste wird per setTimeout (2 s) gefüllt, vorher steht dort "Lade Daten...".
  list: (exampleArea) => exampleArea.locator('lux-list-item').first(),
  'table-server': (exampleArea) => exampleArea.locator('lux-table .lux-row').first(),
  // Der Quill-Editor entsteht erst nach dem ersten Rendern (afterNextRender).
  quill: (exampleArea) => exampleArea.locator('lux-quill .ql-editor').first()
};

function readExampleRoutes(): string[] {
  const source = readFileSync(ROUTES_FILE, 'utf8');
  const start = source.indexOf("path: 'example'");
  if (start < 0) {
    throw new Error(`Route "example" nicht gefunden in ${ROUTES_FILE}`);
  }
  const routes = [...source.slice(start).matchAll(/path:\s*'([^']+)'/g)].map((match) => match[1]).filter((route) => route !== 'example');
  if (routes.length === 0) {
    throw new Error(`Keine Beispielrouten gefunden in ${ROUTES_FILE}`);
  }
  return routes;
}

for (const route of readExampleRoutes()) {
  test(`example/${route}`, async ({ page }) => {
    test.skip(!!SKIP[route], SKIP[route]);

    // Die per Router geladene Beispielkomponente steht direkt hinter dem router-outlet.
    const exampleArea = page.locator('.example-base-content');
    const ready = READY[route]?.(exampleArea) ?? exampleArea.locator(':scope > router-outlet + *');
    await openStable(page, `/components-overview/example/${route}`, ready, STYLES[route]);

    // Bevorzugt nur die Beispielkarte ohne Konfiguration. Seiten ohne Beispielkarte
    // (nur Optionen oder eigenes Layout) werden komplett aufgenommen.
    const exampleCard = exampleArea.locator('lux-card.example-base-container');
    const target = (await exampleCard.count()) > 0 ? exampleCard : exampleArea;

    await expect(target).toHaveScreenshot(`${route}.png`, { mask: MASKS[route]?.(page) ?? [] });
  });
}

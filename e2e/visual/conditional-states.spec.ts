import { expect, test } from '@playwright/test';
import { openStable, screenshotSoft } from './vrt-helper';

/**
 * Nimmt die Beispielseite von *luxConditional mit eingeblendeten Bereichen auf. Der Seiten-Screenshot
 * in examples.spec.ts zeigt nur den Ausgangszustand, in dem alle bedingten Bereiche ausgeblendet sind.
 */
test('conditional-states', async ({ page }) => {
  const card = page.locator('lux-card.example-base-container');
  await openStable(page, '/components-overview/example/conditional', card);

  /** Wartet, bis genau die erwarteten Bereiche eingeblendet sind und keine Enter-Animation mehr läuft. */
  async function expectPanels(labels: string[]) {
    const panels = card.locator('.lux-conditional__panel');
    await expect(panels).toHaveCount(labels.length);
    await expect(card.locator('.lux-conditional__panel--enter')).toHaveCount(0);
    for (const label of labels) {
      await expect(panels.filter({ hasText: label })).toHaveCount(1);
    }
  }

  await card.getByRole('radio', { name: 'Angestellt' }).check();
  await expectPanels(['Arbeitgeber', 'Eintrittsdatum']);
  await screenshotSoft(page, card, 'conditional-angestellt.png');

  await card.getByRole('radio', { name: 'Selbstständig' }).check();
  await expectPanels(['Tätigkeit']);
  await screenshotSoft(page, card, 'conditional-selbststaendig.png');

  await card.getByRole('checkbox', { name: 'Abweichende Rechnungsadresse' }).check();
  await expectPanels(['Tätigkeit', 'Rechnungsadresse']);
  await screenshotSoft(page, card, 'conditional-rechnungsadresse.png');
});

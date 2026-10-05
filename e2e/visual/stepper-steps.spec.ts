import { expect, Locator, Page, test } from '@playwright/test';
import { openStable, screenshotSoft } from './vrt-helper';

/**
 * Durchläuft die Stepper der Demo-App über die Navigations-Buttons und nimmt jeden Schritt
 * einzeln auf. So fällt neben Darstellungsfehlern auch auf, wenn die Navigation hängen bleibt.
 */

test.describe('lux-stepper', () => {
  /*
   * Je nach luxHorizontalStepAnimationActive liegt der Inhalt der Schritte im tabpanel von Material
   * oder in eigenen Sections daneben. Die Inhalte der inaktiven Schritte sind in beiden Fällen
   * ausgeblendet, deshalb reicht die Suche per Rolle im gesamten Stepper.
   */

  /** Füllt die Pflichtfelder der Formular-Schritte, damit der lineare Stepper weiterschaltet. */
  async function fillForm(stepper: Locator) {
    await stepper.getByRole('textbox', { name: 'Lorem ipsum' }).fill('Lorem');
    // Validator minLength(5)
    await stepper.getByRole('textbox', { name: 'Dolor sit' }).fill('Dolor sit amet');
  }

  async function walkSteps(page: Page, stepper: Locator, steps: { header: string; fill?: (stepper: Locator) => Promise<void> }[], prefix: string) {
    for (const [index, step] of steps.entries()) {
      await expect(stepper.getByRole('tab', { name: step.header })).toHaveAttribute('aria-selected', 'true');
      await step.fill?.(stepper);

      await screenshotSoft(page, stepper, `${prefix}-${index + 1}.png`);

      if (index < steps.length - 1) {
        const next = stepper.getByRole('button', { name: 'Weiter', exact: true });
        await expect(next).toBeEnabled();
        await next.click();
      }
    }
  }

  test('stepper-steps/stepper', async ({ page }) => {
    await openStable(page, '/components-overview/example/stepper', page.locator('lux-stepper').first());

    await walkSteps(
      page,
      page.locator('lux-stepper').first(),
      [
        { header: 'Step #0', fill: fillForm },
        { header: 'Step #1', fill: fillForm },
        { header: 'Fin' }
      ],
      'stepper'
    );
  });

  test('stepper-steps/stepper-ausgelagerter-step', async ({ page }) => {
    await openStable(page, '/components-overview/example/stepper', page.locator('lux-stepper').nth(1));

    await walkSteps(page, page.locator('lux-stepper').nth(1), [{ header: 'Person' }, { header: 'Zusammenfassung' }], 'stepper-ausgelagert');
  });
});

test.describe('lux-stepper-large', () => {
  /** LuxComponentsConfigService.DEFAULT_CONFIG.buttonConfiguration.throttleTimeMs */
  const BUTTON_THROTTLE_MS = 600;

  /**
   * Schritte in Navigationsreihenfolge. Die Füllschritte 1 und 2 sind in der Demo deaktiviert
   * und werden vom Weiter-Button übersprungen.
   */
  const STEPS: { nr: number; title: string; before?: (page: Page, stepper: Locator) => Promise<void> }[] = [
    {
      nr: 1,
      title: 'Allgemein',
      before: async (_page, stepper) => {
        const consent = stepper.getByRole('switch', { name: 'Ich habe verstanden und möchte fortfahren' });
        await consent.click();
        await expect(consent).toBeChecked();
      }
    },
    { nr: 2, title: 'Konfiguration: Zurück-Button' },
    { nr: 3, title: 'Konfiguration: Weiter-Button' },
    { nr: 4, title: 'Konfiguration: Abschließen-Button' },
    { nr: 5, title: 'Veto-Schritt' },
    { nr: 8, title: 'Füllschritt 3 - Ut wisi enim ad, iriure dolor in hendrerit' },
    { nr: 9, title: 'Füllschritt 4 - Nam liber tempor' },
    { nr: 10, title: 'Füllschritt 5 - Duis autem vel' },
    { nr: 11, title: 'Zusammenfassung' }
  ];

  test('stepper-steps/stepper-large', async ({ page }) => {
    const stepper = page.locator('lux-stepper-large');
    await openStable(page, '/components-overview/example/stepper-large', stepper);

    for (const [index, step] of STEPS.entries()) {
      await expect(stepper.locator('.lux-stepper-large-nav-item.lux-active')).toContainText(step.title);
      await step.before?.(page, stepper);

      await screenshotSoft(page, stepper, `stepper-large-${String(step.nr).padStart(2, '0')}.png`);

      if (index < STEPS.length - 1) {
        const next = stepper.locator('.lux-stepper-large-button-next').getByRole('button');
        await expect(next).toBeEnabled();
        // Der Weiter-Button bleibt über alle Schritte dieselbe lux-button-Instanz und ignoriert
        // Klicks innerhalb von buttonConfiguration.throttleTimeMs (Standard 600 ms) nach dem letzten
        // Klick. Die Uhr deshalb vorspulen, sonst hängt die Navigation, wenn ein Schritt schnell aufgenommen ist.
        await page.clock.runFor(BUTTON_THROTTLE_MS);
        await next.click();
        if (step.title === 'Veto-Schritt') {
          // Die Veto-Funktion fragt per Dialog nach, ob weiternavigiert werden darf.
          const dialog = page.getByRole('dialog');
          await dialog.getByRole('button', { name: 'Fortfahren', exact: true }).click();
          await expect(dialog).toBeHidden();
        }
      }
    }
  });
});

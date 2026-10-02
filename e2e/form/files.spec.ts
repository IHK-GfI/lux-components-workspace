import { expect, Locator, Page, test } from '@playwright/test';
import { clickAtCenter } from './support/form-controls';
import { FormExamplePage } from './support/form-example';
import { luxMessage, luxMessagePattern } from './support/lux-messages';

/**
 * Datei-Komponenten (lux-file-input-ac, lux-file-list, lux-file-upload).
 * Die Demo lädt nichts hoch (luxUploadUrl ist leer), die Dateien werden nur im Browser eingelesen.
 */
interface FileComponentSpec {
  id: string;
  route: string;
  tag: string;
  headings: [string, string];
  /** Das sichtbare Element, über das der Benutzer die Dateiauswahl öffnet. */
  uploadTrigger: (control: Locator) => Locator;
  /** Prüft, dass die Datei `name` als ausgewählt angezeigt wird. */
  expectSelected: (control: Locator, name: string) => Promise<void>;
  maxSizeMessage: (fileName: string) => string | RegExp;
  notAcceptedMessage: (fileName: string) => string | RegExp;
}

const listShows = async (control: Locator, name: string) => {
  await expect(control).toContainText(name);
};

const FILE_COMPONENTS: FileComponentSpec[] = [
  {
    id: 'file-input-ac',
    route: 'file-input-ac',
    tag: 'lux-file-input-ac',
    headings: ['Ohne ReactiveForm', 'Mit ReactiveForm'],
    uploadTrigger: (control) => control.getByRole('button', { name: 'Hochladen', exact: true }),
    expectSelected: async (control, name) => {
      await expect(control.getByRole('textbox')).toHaveValue(name);
    },
    maxSizeMessage: (fileName) => luxMessage('form-file-base.error_message.max_file_size', { fileName, fileSizeInMB: 2, maxSizeMB: 1 }),
    notAcceptedMessage: (fileName) => luxMessage('form-file-base.error_message.not_accepted', { fileName })
  },
  {
    id: 'file-list',
    route: 'file-list',
    tag: 'lux-file-list',
    headings: ['Beispiel ohne Reactive-Form', 'Beispiel in Reactive-Form'],
    uploadTrigger: (control) => control.getByRole('button', { name: 'Neue Dateien hochladen', exact: true }),
    expectSelected: listShows,
    maxSizeMessage: (fileName) => luxMessage('form-file-base.error_message.max_file_size', { fileName, fileSizeInMB: 2, maxSizeMB: 1 }),
    notAcceptedMessage: (fileName) => luxMessage('form-file-base.error_message.not_accepted', { fileName })
  },
  {
    id: 'file-upload',
    route: 'file-upload',
    tag: 'lux-file-upload',
    headings: ['Beispiel ohne Reactive-Form', 'Beispiel in Reactive-Form'],
    // Die Ablagefläche ist ein div mit Klick-Handler (ohne Rolle).
    uploadTrigger: (control) => control.locator('.lux-file-upload-drop-container'),
    expectSelected: listShows,
    maxSizeMessage: (fileName) => luxMessage('file.upload.error_message.max_file_size', { fileName, maxSizeMB: 1 }),
    notAcceptedMessage: (fileName) => luxMessagePattern('file.upload.error_message.not_accepted', { fileName })
  }
];

const textFile = (name: string, bytes = 16) => ({ name, mimeType: 'text/plain', buffer: Buffer.alloc(bytes, 'a') });

async function chooseFile(page: Page, control: Locator, file: ReturnType<typeof textFile>) {
  await control.locator('input[type="file"]').first().setInputFiles(file);
  await expect(page.getByRole('progressbar')).toHaveCount(0);
}

for (const spec of FILE_COMPONENTS) {
  test.describe(spec.id, () => {
    let example: FormExamplePage;

    test.beforeEach(async ({ page }) => {
      example = await FormExamplePage.open(page, spec.route);
    });

    for (const heading of spec.headings) {
      test(`${heading}: Datei auswählen`, async ({ page }) => {
        const control = example.section(heading, spec.tag).control;

        await chooseFile(page, control, textFile('notiz.txt'));

        await spec.expectSelected(control, 'notiz.txt');
      });

      test(`${heading}: luxMaxSizeMB weist zu große Dateien ab`, async ({ page }) => {
        await example.options.setText('luxMaxSizeMB', '1');
        const control = example.section(heading, spec.tag).control;

        await chooseFile(page, control, textFile('gross.txt', 2 * 1024 * 1024));

        await expect(control).toContainText(spec.maxSizeMessage('gross.txt'));
      });

      test(`${heading}: luxAccept weist andere Dateitypen ab`, async ({ page }) => {
        await example.options.setText('luxAccept', '.pdf');
        const control = example.section(heading, spec.tag).control;

        await chooseFile(page, control, textFile('notiz.txt'));

        await expect(control).toContainText(spec.notAcceptedMessage('notiz.txt'));
      });

      test(`${heading}: Upload-Auslöser öffnet die Dateiauswahl`, async ({ page }) => {
        const control = example.section(heading, spec.tag).control;

        const [chooser] = await Promise.all([page.waitForEvent('filechooser'), spec.uploadTrigger(control).click()]);
        await chooser.setFiles(textFile('notiz.txt'));
        await expect(page.getByRole('progressbar')).toHaveCount(0);

        await spec.expectSelected(control, 'notiz.txt');
      });

      for (const [state, option] of [
        ['Disabled', 'luxDisabled'],
        ['Readonly', 'luxReadonly']
      ]) {
        test(`${heading}: ${state} verhindert die Dateiauswahl`, async ({ page }) => {
          const control = example.section(heading, spec.tag).control;
          await example.options.setSwitch(option, true);

          let opened = false;
          page.on('filechooser', () => (opened = true));
          // Echter Mausklick (ohne Playwrights Klickbarkeitsprüfung), wie ihn auch ein Benutzer ausführt.
          const trigger = spec.uploadTrigger(control);
          if (await trigger.isVisible()) {
            await clickAtCenter(trigger);
            await page.waitForTimeout(500);
          }

          expect(opened).toBe(false);
        });
      }
    }
  });
}

import { callRule, HostTree, Tree } from '@angular-devkit/schematics';
import { lastValueFrom } from 'rxjs';
import { checkDateValues, findDateValueUsages } from './date-values-check';

describe('date-values-check', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = new HostTree();
  });

  it('Sollte lux-datetimepicker in Templates und Inline-Templates melden', () => {
    tree.create('/projects/app/src/app/termin.component.html', '<div>\n  <lux-datetimepicker luxLabel="Termin" />\n</div>');
    tree.create(
      '/projects/app/src/app/inline.component.ts',
      "template: `<lux-datetimepicker-ac luxLabel='Termin'></lux-datetimepicker-ac>`"
    );

    const findings = findDateValueUsages(tree, '/projects/app');

    expect(findings).toContainEqual({
      filePath: '/projects/app/src/app/termin.component.html',
      line: 2,
      hint: expect.stringContaining('lux-datetimepicker entfällt')
    });
    expect(
      findings.some((finding) => finding.filePath.endsWith('inline.component.ts') && finding.hint.includes('lux-datetimepicker entfällt'))
    ).toBe(true);
  });

  it('Sollte entfallene Klassen und LuxUtil-Funktionen melden', () => {
    tree.create(
      '/projects/app/src/app/util.ts',
      [
        "import { LuxDatetimepickerComponent, LuxDatepickerAdapter, LuxUtil } from '@ihk-gfi/lux-components';",
        'const heute = LuxUtil.newDateWithoutTime().toISOString();',
        'const datum = LuxUtil.parseISO8601AsUTC(wert);'
      ].join('\n')
    );

    const hints = findDateValueUsages(tree, '/projects/app').map((finding) => `${finding.line}: ${finding.hint}`);

    expect(hints).toContain('1: Die Klassen des Datetimepickers entfallen.');
    expect(hints).toContain('1: Die DateAdapter von Datepicker und Timepicker werden nicht mehr exportiert.');
    expect(hints.filter((hint) => hint.includes('Die Funktion entfällt'))).toEqual([
      expect.stringMatching(/^2: /),
      expect.stringMatching(/^3: /)
    ]);
  });

  it('Sollte Datepicker, Timepicker und ihre Datums-Inputs melden', () => {
    tree.create(
      '/projects/app/src/app/form.component.html',
      [
        '<lux-datepicker luxLabel="Datum" luxMinDate="01.01.2000" [luxCustomFilter]="filter" />',
        '<lux-timepicker luxLabel="Zeit" luxMinTime="08:00" />',
        '<lux-input luxLabel="Name" />'
      ].join('\n')
    );

    const findings = findDateValueUsages(tree, '/projects/app');

    expect(findings.filter((finding) => finding.line === 1).map((finding) => finding.hint)).toEqual([
      expect.stringContaining('luxCustomFilter'),
      'Der Wert muss "yyyy-MM-dd" sein.',
      expect.stringContaining('ohne Zeitzone')
    ]);
    expect(findings.filter((finding) => finding.line === 2).map((finding) => finding.hint)).toEqual([
      'Der Wert muss "HH:mm" sein.',
      expect.stringContaining('ohne Zeitzone')
    ]);
    expect(findings.filter((finding) => finding.line === 3)).toEqual([]);
  });

  it('Sollte nichts melden, wenn es keine Datums- oder Zeitwerte gibt', () => {
    tree.create('/projects/app/src/app/app.component.html', '<lux-input luxLabel="Name" />');

    expect(findDateValueUsages(tree, '/projects/app')).toEqual([]);
  });

  it('Sollte die Dateien nicht verändern', async () => {
    const content = '<lux-datetimepicker luxLabel="Termin" />';
    tree.create('/projects/app/src/app/termin.component.html', content);

    const result = await lastValueFrom(
      callRule(checkDateValues({ project: 'app', path: '/projects/app', verbose: false }), tree, {} as any)
    );

    expect(result.readText('/projects/app/src/app/termin.component.html')).toEqual(content);
  });
});

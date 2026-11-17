import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { findDateValueUsages, findUsages, LuxUsagePattern } from '../../utility/date-values-check';
import { logInfo, logSuccess, logWarn } from '../../utility/logging';
import { Options } from '../../utility/types';

export const REPORT_FILE = 'lux-update-22-bericht.md';
export const PROMPT_FILE = '.github/prompts/lux-update-22.prompt.md';
export const UPDATE_GUIDE_URL = 'https://github.com/IHK-GfI/lux-components-workspace/wiki/Update-Guide-v22';

/**
 * Die Kategorien des Berichts in der Reihenfolge der Ausgabe. Der Anker verweist auf den Abschnitt im Update-Guide v22.
 */
export const CATEGORIES = {
  config: { title: 'Konfiguration', anchor: 'konfiguration' },
  signals: { title: 'Signal-Inputs und -Outputs', anchor: 'signal-inputs-und--outputs' },
  forms: { title: 'Formulare und Signal Forms', anchor: 'formulare-und-signal-forms' },
  dates: { title: 'Datums- und Zeitwerte ohne Zeitzone', anchor: 'datums--und-zeitwerte-ohne-zeitzone' },
  animations: { title: 'Animationen', anchor: 'animationen' },
  options: { title: 'Entfernte Optionen', anchor: 'entfernte-optionen' },
  styling: { title: 'Styling', anchor: 'styling' },
  tests: { title: 'Test-Utilities', anchor: 'test-utilities' },
  ac: { title: 'Komponenten ohne "-ac" (optional)', anchor: 'komponenten-ohne--ac' }
} as const;

export type LuxV22Category = keyof typeof CATEGORIES;

export interface LuxV22Pattern extends LuxUsagePattern {
  category: LuxV22Category;
  /** Nur die erste Fundstelle pro Datei melden (z.B. bei Klassennamen, die auch im Import stehen). */
  oncePerFile?: boolean;
}

export interface LuxV22Finding {
  category: LuxV22Category;
  filePath: string;
  line: number;
  hint: string;
}

/** Die Selektoren mit "-ac", die ab Version 22 deprecated sind (lux-app-header-ac, lux-tile-ac und lux-lang-select-ac bleiben). */
const DEPRECATED_AC_SELECTORS = [
  'autocomplete-ac',
  'checkbox-ac',
  'checkbox-container-ac',
  'chip-ac',
  'chip-ac-group',
  'chips-ac',
  'datepicker-ac',
  'datepicker-ac-custom-header',
  'detail-header-ac',
  'detail-view-ac',
  'detail-wrapper-ac',
  'file-input-ac',
  'input-ac',
  'input-ac-prefix',
  'input-ac-suffix',
  'lookup-autocomplete-ac',
  'lookup-combobox-ac',
  'master-detail-ac',
  'master-footer-ac',
  'master-header-ac',
  'master-header-content-ac',
  'master-list-ac',
  'radio-ac',
  'select-ac',
  'slider-ac',
  'textarea-ac',
  'toggle-ac'
];

/** Die Klassennamen mit "Ac", die ab Version 22 nur noch als deprecated Alias exportiert werden. */
const DEPRECATED_AC_CLASSES = [
  'LuxAutocompleteAcComponent',
  'LuxCheckboxAcComponent',
  'LuxCheckboxContainerAcComponent',
  'LuxChipAcComponent',
  'LuxChipAcGroupComponent',
  'LuxChipsAcComponent',
  'LuxChipsAcOrientation',
  'LuxDatepickerAcComponent',
  'LuxDatepickerAcCustomHeaderComponent',
  'LuxDateFilterAcFn',
  'LuxStartAcView',
  'LuxDetailHeaderAcComponent',
  'LuxDetailViewAcComponent',
  'LuxDetailWrapperAcComponent',
  'LuxFileInputAcComponent',
  'LuxInputAcComponent',
  'LuxInputAcPrefixComponent',
  'LuxInputAcSuffixComponent',
  'LuxLookupAutocompleteAcComponent',
  'LuxLookupComboboxAcComponent',
  'LuxAutocompleteErrorStateMatcherAc',
  'LuxMasterDetailAcComponent',
  'LuxMasterFooterAcComponent',
  'LuxMasterHeaderAcComponent',
  'LuxMasterHeaderContentAcComponent',
  'LuxMasterListAcComponent',
  'LuxRadioAcComponent',
  'LuxSelectAcComponent',
  'LuxSliderAcComponent',
  'LuxSliderAcColor',
  'LuxSliderAcTickInterval',
  'LuxDisplayWithAcFnType',
  'LuxTextareaAcComponent',
  'LuxToggleAcComponent'
];

export const PATTERNS: LuxV22Pattern[] = [
  {
    category: 'config',
    regexp: /\bLuxComponentsConfigModule\b/,
    fileEndings: ['.ts'],
    oncePerFile: true,
    hint: 'LuxComponentsConfigModule entfällt. Stattdessen provideLuxComponentsConfig(config) in den Providern verwenden (auch in TestBed).'
  },
  {
    category: 'signals',
    regexp: /\bLuxErrorStoreService\b/,
    fileEndings: ['.ts'],
    oncePerFile: true,
    hint: 'error, config und lastErrors sind jetzt Signals (lesen mit "()"). Statt "error = ..." setError(...) aufrufen.'
  },
  {
    category: 'forms',
    regexp: /\b(LuxFormComponentBase|LuxFormCheckableBaseClass)\b/,
    fileEndings: ['.ts'],
    oncePerFile: true,
    hint: 'Die Form-Komponenten erben nicht mehr von LuxFormComponentBase. LuxFormCheckableBaseClass entfällt.'
  },
  {
    category: 'animations',
    regexp: /\b(sideNavAnimation|sideNavOverlayAnimation|expansionAnim)\b/,
    fileEndings: ['.ts'],
    oncePerFile: true,
    hint: 'Die Exporte sideNavAnimation, sideNavOverlayAnimation und expansionAnim entfallen.'
  },
  {
    category: 'animations',
    regexp: /\b(provideAnimations|provideAnimationsAsync|provideNoopAnimations|NoopAnimationsModule|BrowserAnimationsModule)\b/,
    fileEndings: ['.ts'],
    oncePerFile: true,
    hint:
      'Die LUX-Components brauchen @angular/animations nicht mehr. Entfernen, falls die Anwendung es selbst nicht nutzt. ' +
      'In Specs mit Material-Overlays ggf. MATERIAL_ANIMATIONS mit animationsDisabled: true verwenden.'
  },
  {
    category: 'options',
    regexp: /\balignIconWithLabel\b/,
    fileEndings: ['.ts', '.html'],
    hint: 'alignIconWithLabel hatte keine Wirkung und entfällt.'
  },
  {
    category: 'options',
    regexp: /<lux-card\b[^>]*\bluxIconName\b/,
    fileEndings: ['.ts'],
    hint: 'luxIconName an lux-card hatte keine Wirkung und entfällt (Inline-Template).'
  },
  {
    category: 'options',
    // Nur Zugriffe über eine Variable, deren Name "tooltip" enthält, sonst gäbe es zu viele Fehltreffer (z.B. eigenes "luxMenu").
    regexp: /\b\w*[tT]ooltip\w*(\(\))?!?\??\.(luxButton|luxLinkPlain|luxLink|luxMenu|luxActionNavAc|luxActionNav)\b/,
    fileEndings: ['.ts'],
    hint: 'Die Felder luxButton, luxLink, luxLinkPlain, luxMenu, luxActionNav und luxActionNavAc der LuxTooltipDirective entfallen.'
  },
  {
    category: 'styling',
    regexp: /\b(lux-bold|lux-uppercase|lux-lowercase|lux-vertical-align-baseline)\b/,
    fileEndings: ['.html', '.ts', '.scss', '.css'],
    oncePerFile: true,
    hint: 'Die Klasse setzt kein !important mehr und setzt sich gegen spezifischere Regeln ggf. nicht mehr durch. Darstellung prüfen.'
  },
  {
    category: 'styling',
    regexp: /lux.*!important/,
    fileEndings: ['.scss', '.css'],
    oncePerFile: true,
    hint: 'Eigenes !important gegen LUX-Styles ist ggf. nicht mehr nötig, weil das Theme kaum noch !important verwendet.'
  },
  {
    category: 'tests',
    regexp: /['"]@ihk-gfi\/lux-components\/test-utils['"]/,
    fileEndings: ['.ts'],
    oncePerFile: true,
    hint: 'Die Test-Utilities setzen Vitest voraus. wait(), click() und setInputValue() mit await aufrufen, fakeAsync()/tick() entfernen.'
  },
  {
    category: 'ac',
    regexp: new RegExp(`</?lux-(${DEPRECATED_AC_SELECTORS.join('|')})(?=[\\s/>])`),
    fileEndings: ['.html', '.ts'],
    oncePerFile: true,
    hint: 'Deprecated "-ac"-Selektor. Funktioniert weiter, kann z.B. von lux-input-ac in lux-input umbenannt werden (eigene CSS-Selektoren mit anpassen).'
  },
  {
    category: 'ac',
    regexp: new RegExp(`\\b(${DEPRECATED_AC_CLASSES.join('|')})\\b`),
    fileEndings: ['.ts'],
    oncePerFile: true,
    hint: 'Deprecated "Ac"-Klassenname. Funktioniert weiter, kann z.B. von LuxInputAcComponent in LuxInputComponent umbenannt werden.'
  }
];

/**
 * Sucht alle Stellen, die nach dem Updater noch von Hand (oder mit dem KI-Prompt) umgestellt werden müssen.
 * @param tree Der Tree der Anwendung.
 * @param rootPath Der Pfad, ab dem gesucht wird.
 */
export function findV22Findings(tree: Tree, rootPath: string): LuxV22Finding[] {
  const findings: LuxV22Finding[] = [];
  const reported = new Set<string>();

  findUsages(tree, rootPath, PATTERNS).forEach((usage) => {
    const key = `${usage.filePath}|${PATTERNS.indexOf(usage.pattern)}`;
    if (usage.pattern.oncePerFile) {
      if (reported.has(key)) {
        return;
      }
      reported.add(key);
    }
    findings.push({ category: usage.pattern.category, filePath: usage.filePath, line: usage.line, hint: usage.pattern.hint });
  });

  findDateValueUsages(tree, rootPath).forEach((finding) => findings.push({ category: 'dates', ...finding }));

  const root = normalizeRoot(rootPath);
  const karmaConf = `${root}/karma.conf.js`;
  if (tree.exists(karmaConf)) {
    findings.push({
      category: 'tests',
      filePath: karmaConf,
      line: 1,
      hint: 'Das Projekt verwendet Karma. Die Test-Utilities von LUX setzen Vitest voraus (siehe Angular-Doku zur Umstellung auf Vitest).'
    });
  }

  const packageJson = `${root}/package.json`;
  if (tree.exists(packageJson)) {
    tree
      .readText(packageJson)
      .split(/\r?\n/)
      .forEach((text, index) => {
        if (text.includes('"jasmine-axe"')) {
          findings.push({
            category: 'tests',
            filePath: packageJson,
            line: index + 1,
            hint: 'jasmine-axe wird von LUX nicht mehr verwendet. LuxA11yTestHelper nutzt axe-core direkt.'
          });
        }
      });
  }

  return findings;
}

/**
 * Schreibt den Bericht mit den offenen Stellen als Markdown.
 * @param findings Die Fundstellen.
 * @param rootPath Der Projektpfad (wird in den Dateipfaden des Berichts weggelassen).
 */
export function createReport(findings: LuxV22Finding[], rootPath: string): string {
  const root = normalizeRoot(rootPath);
  const lines: string[] = [
    '# LUX-Components 22: offene Stellen',
    '',
    'Dieser Bericht wurde von `ng g @ihk-gfi/lux-components-update:update-22.0.0` erzeugt. ' +
      'Er listet die Stellen, die der Updater nicht automatisch umstellen konnte.',
    `Details stehen im [Update-Guide v22](${UPDATE_GUIDE_URL}). Mit dem KI-Prompt \`${PROMPT_FILE}\` lassen sich die Stellen abarbeiten.`,
    '',
    'Die Datei bitte löschen, sobald alle Stellen umgesetzt sind.',
    ''
  ];

  if (findings.length === 0) {
    lines.push('Es wurden keine Stellen gefunden.', '');
    return lines.join('\n');
  }

  (Object.keys(CATEGORIES) as LuxV22Category[]).forEach((category) => {
    const categoryFindings = findings.filter((finding) => finding.category === category);
    if (categoryFindings.length === 0) {
      return;
    }

    const { title, anchor } = CATEGORIES[category];
    lines.push(`## ${title} (${categoryFindings.length})`, '', `Siehe [Update-Guide v22](${UPDATE_GUIDE_URL}#${anchor}).`, '');
    categoryFindings.forEach((finding) => lines.push(`- \`${relativePath(finding.filePath, root)}:${finding.line}\`: ${finding.hint}`));
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Meldet die offenen Stellen auf der Konsole (Anzahl pro Kategorie) und schreibt den Bericht {@link REPORT_FILE} ins Projekt.
 * @param options Die Optionen.
 */
export function checkBreakingChanges(options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const findings = findV22Findings(tree, options.path);
    const reportPath = `${normalizeRoot(options.path)}/${REPORT_FILE}`;
    const report = createReport(findings, options.path);

    if (tree.exists(reportPath)) {
      tree.overwrite(reportPath, report);
    } else {
      tree.create(reportPath, report);
    }

    if (findings.length === 0) {
      logSuccess(`Keine offenen Stellen gefunden (siehe "${REPORT_FILE}").`);
      return tree;
    }

    logWarn(
      `${findings.length} Stelle(n) bitte prüfen. Details stehen in "${REPORT_FILE}", der KI-Prompt "${PROMPT_FILE}" hilft beim Umsetzen.`
    );
    (Object.keys(CATEGORIES) as LuxV22Category[]).forEach((category) => {
      const count = findings.filter((finding) => finding.category === category).length;
      if (count > 0) {
        logInfo(`${CATEGORIES[category].title}: ${count}`);
      }
    });

    return tree;
  };
}

function normalizeRoot(rootPath: string | undefined): string {
  const root = (rootPath ?? '').trim().replace(/\/+$/, '');
  return root && !root.startsWith('/') ? '/' + root : root;
}

function relativePath(filePath: string, root: string): string {
  const relative = root && filePath.startsWith(root + '/') ? filePath.slice(root.length + 1) : filePath;
  return relative.replace(/^\//, '');
}

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { iterateFilesAndModifyContent } from './files';
import { logInfo, logSuccess, logWarn } from './logging';
import { Options } from './types';

/**
 * Eine Stelle in der Anwendung, die für die Umstellung auf Datums- und Zeitwerte ohne Zeitzone (v22) geprüft werden muss.
 */
export interface LuxDateValueFinding {
  filePath: string;
  line: number;
  hint: string;
}

interface LuxDateValuePattern {
  regexp: RegExp;
  fileEndings: string[];
  hint: string;
}

const PATTERNS: LuxDateValuePattern[] = [
  {
    regexp: /<lux-datetimepicker(-ac)?\b/,
    fileEndings: ['.html', '.ts'],
    hint: 'lux-datetimepicker entfällt. Stattdessen lux-datepicker und lux-timepicker verwenden.'
  },
  {
    regexp: /\bLuxDate[tT]ime[pP]icker\w*|\bLuxDatetimeOverlay\w*/,
    fileEndings: ['.ts'],
    hint: 'Die Klassen des Datetimepickers entfallen.'
  },
  {
    regexp: /\b(LuxDatepickerAdapter|LuxDatepickerAcAdapter|LuxTimepickerAdapter)\b/,
    fileEndings: ['.ts'],
    hint: 'Die DateAdapter von Datepicker und Timepicker werden nicht mehr exportiert.'
  },
  {
    regexp: /\bLuxUtil\.(parseISO8601AsUTC|isISO8601WithoutTimezone|ISO_8601_FULL|newDateWithoutTime)\b/,
    fileEndings: ['.ts'],
    hint: 'Die Funktion entfällt, z.B. LuxUtil.todayAsLocalDate() oder LuxUtil.toLocalDate(date) verwenden.'
  },
  {
    regexp: /\bluxCustomFilter\b/,
    fileEndings: ['.html'],
    hint: 'luxCustomFilter erhält den Tag jetzt als "yyyy-MM-dd" statt als Date, Wochentag über LuxUtil.getDayOfWeek(date).'
  },
  {
    regexp: /\blux(MinDate|MaxDate|StartDate)\b/,
    fileEndings: ['.html'],
    hint: 'Der Wert muss "yyyy-MM-dd" sein.'
  },
  {
    regexp: /\blux(MinTime|MaxTime)\b/,
    fileEndings: ['.html'],
    hint: 'Der Wert muss "HH:mm" sein.'
  },
  {
    regexp: /<lux-(datepicker|datepicker-ac|timepicker)\b/,
    fileEndings: ['.html', '.ts'],
    hint: 'Die Werte sind jetzt ohne Zeitzone ("yyyy-MM-dd", "HH:mm" bzw. "yyyy-MM-ddTHH:mm").'
  }
];

/**
 * Sucht die Stellen, die für die Umstellung auf Datums- und Zeitwerte ohne Zeitzone geprüft werden müssen.
 * Wertformate im Anwendungscode lassen sich nicht zuverlässig automatisch umstellen, deshalb wird nur gemeldet.
 * @param tree Der Tree der Anwendung.
 * @param rootPath Der Pfad, ab dem gesucht wird.
 */
export function findDateValueUsages(tree: Tree, rootPath: string): LuxDateValueFinding[] {
  const findings: LuxDateValueFinding[] = [];

  iterateFilesAndModifyContent(
    tree,
    rootPath,
    false,
    (filePath: string, content: string) => {
      content.split(/\r?\n/).forEach((text, index) => {
        PATTERNS.filter((pattern) => pattern.fileEndings.some((ending) => filePath.endsWith(ending)) && pattern.regexp.test(text)).forEach(
          (pattern) => findings.push({ filePath, line: index + 1, hint: pattern.hint })
        );
      });
    },
    '.html',
    '.ts'
  );

  return findings;
}

/**
 * Meldet die Stellen, die für die Umstellung auf Datums- und Zeitwerte ohne Zeitzone geprüft werden müssen
 * (siehe Update-Guide v22). Die Dateien werden nicht verändert.
 * @param options Die Optionen.
 */
export function checkDateValues(options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const findings = findDateValueUsages(tree, options.path);

    if (findings.length === 0) {
      logSuccess('Keine Datums- oder Zeitwerte gefunden, die geprüft werden müssen.');
      return tree;
    }

    logWarn(
      `${findings.length} Stelle(n) mit Datums- oder Zeitwerten bitte prüfen. Datepicker und Timepicker arbeiten jetzt ohne Zeitzone, ` +
        'Werte im Format bis Version 21 werden abgelehnt (siehe Update-Guide v22, "Datums- und Zeitwerte ohne Zeitzone").'
    );
    findings.forEach((finding) => logInfo(`${finding.filePath}:${finding.line} - ${finding.hint}`));

    return tree;
  };
}

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

/**
 * Ein Suchmuster für Stellen, die beim Update gemeldet werden.
 */
export interface LuxUsagePattern {
  /** Der reguläre Ausdruck, der zeilenweise geprüft wird (ohne g-Flag). */
  regexp: RegExp;
  /** Die Dateiendungen, in denen gesucht wird (z.B. ".html" oder ".spec.ts"). */
  fileEndings: string[];
  /** Der Hinweis für die Fundstelle. */
  hint: string;
}

/**
 * Eine Fundstelle zu einem {@link LuxUsagePattern}.
 */
export interface LuxUsage<P extends LuxUsagePattern> {
  filePath: string;
  line: number;
  pattern: P;
}

/**
 * Sucht zeilenweise nach den Mustern in allen passenden Dateien (node_modules, dist usw. werden übersprungen).
 * @param tree Der Tree der Anwendung.
 * @param rootPath Der Pfad, ab dem gesucht wird.
 * @param patterns Die Suchmuster.
 */
export function findUsages<P extends LuxUsagePattern>(tree: Tree, rootPath: string, patterns: P[]): LuxUsage<P>[] {
  const usages: LuxUsage<P>[] = [];
  const fileEndings = [...new Set(patterns.flatMap((pattern) => pattern.fileEndings))];

  iterateFilesAndModifyContent(
    tree,
    rootPath,
    false,
    (filePath: string, content: string) => {
      content.split(/\r?\n/).forEach((text, index) => {
        patterns
          .filter((pattern) => pattern.fileEndings.some((ending) => filePath.endsWith(ending)) && pattern.regexp.test(text))
          .forEach((pattern) => usages.push({ filePath, line: index + 1, pattern }));
      });
    },
    ...fileEndings
  );

  return usages;
}

const PATTERNS: LuxUsagePattern[] = [
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
  return findUsages(tree, rootPath, PATTERNS).map((usage) => ({ filePath: usage.filePath, line: usage.line, hint: usage.pattern.hint }));
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

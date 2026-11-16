/**
 * Datums- und Zeitwerte ohne Zeitzone (wie Java LocalDate/LocalTime oder Temporal.PlainDate/PlainTime).
 *
 * Die Funktionen arbeiten ohne JavaScript-Date und sind damit unabhängig von der Zeitzone des Nutzers.
 * Einzige Ausnahmen sind localDateOf() und localTimeOf(), die den lokalen Tag bzw. die lokale Uhrzeit eines
 * Date-Objekts liefern.
 * Die Feldnamen folgen Temporal, der Monat zählt also von 1 bis 12.
 */

export interface LuxLocalDate {
  readonly year: number;
  /** 1 bis 12 */
  readonly month: number;
  readonly day: number;
}

export interface LuxLocalTime {
  readonly hour: number;
  readonly minute: number;
}

export interface LuxLocalDateTime {
  readonly date: LuxLocalDate;
  readonly time: LuxLocalTime;
}

// "yyyy-MM-dd", toleriert wird auch Mitternacht ohne Zeitzone (z.B. Java LocalDateTime für ein reines Datum)
const LOCAL_DATE_REGEXP = /^(\d{4})-(\d{2})-(\d{2})(?:T00:00(?::00)?)?$/;

// "HH:mm", toleriert werden Sekunden ":00" (Java, .NET und Temporal geben Uhrzeiten immer mit Sekunden aus)
const LOCAL_TIME_REGEXP = /^(\d{2}):(\d{2})(?::00)?$/;

// "yyyy-MM-ddTHH:mm", toleriert werden Sekunden ":00"
const LOCAL_DATE_TIME_REGEXP = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::00)?$/;

// v21-Format: UTC-Zeitpunkt mit Sekunden 00, Millisekunden optional (z.B. Java Instant gibt keine aus)
const V21_REGEXP = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):00(?:\.0+)?Z$/;

// Tage von 0000-03-01 bis 1970-01-01 (siehe toEpochDay)
const DAYS_0000_03_01_TO_1970_01_01 = 719468;
const DAYS_PER_400_YEARS = 146097;

/**
 * Liest ein Datum "yyyy-MM-dd" (auch "yyyy-MM-ddT00:00" bzw. "yyyy-MM-ddT00:00:00").
 * @returns das Datum oder null, wenn der Wert kein gültiges Datum in diesem Format ist (z.B. 31.02.).
 */
export function parseLocalDate(value: unknown): LuxLocalDate | null {
  const match = typeof value === 'string' ? LOCAL_DATE_REGEXP.exec(value) : null;
  return match ? toValidDate(+match[1], +match[2], +match[3]) : null;
}

/**
 * Liest eine Uhrzeit "HH:mm" (auch "HH:mm:00").
 * @returns die Uhrzeit oder null, wenn der Wert keine gültige Uhrzeit in diesem Format ist (z.B. 24:00).
 */
export function parseLocalTime(value: unknown): LuxLocalTime | null {
  const match = typeof value === 'string' ? LOCAL_TIME_REGEXP.exec(value) : null;
  return match ? toValidTime(+match[1], +match[2]) : null;
}

/**
 * Liest Datum und Uhrzeit "yyyy-MM-ddTHH:mm" (auch "yyyy-MM-ddTHH:mm:00").
 * @returns Datum und Uhrzeit oder null, wenn der Wert nicht in diesem Format ist.
 */
export function parseLocalDateTime(value: unknown): LuxLocalDateTime | null {
  const match = typeof value === 'string' ? LOCAL_DATE_TIME_REGEXP.exec(value) : null;
  return match ? toValidDateTime(match) : null;
}

/**
 * Liest einen Wert im v21-Format ("2029-05-26T14:30:00.000Z"). Datum und Uhrzeit sind die UTC-Werte,
 * die Sekunden müssen 00 sein.
 * @returns Datum und Uhrzeit oder null, wenn der Wert nicht genau in diesem Format ist.
 */
export function parseV21(value: unknown): LuxLocalDateTime | null {
  const match = typeof value === 'string' ? V21_REGEXP.exec(value) : null;
  return match ? toValidDateTime(match) : null;
}

export function formatLocalDate({ year, month, day }: LuxLocalDate): string {
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
}

export function formatLocalTime({ hour, minute }: LuxLocalTime): string {
  return `${pad(hour, 2)}:${pad(minute, 2)}`;
}

export function formatLocalDateTime({ date, time }: LuxLocalDateTime): string {
  return `${formatLocalDate(date)}T${formatLocalTime(time)}`;
}

/**
 * Gibt Datum und Uhrzeit im v21-Format aus ("2029-05-26T14:30:00.000Z").
 */
export function formatV21(dateTime: LuxLocalDateTime): string {
  return `${formatLocalDateTime(dateTime)}:00.000Z`;
}

/**
 * Der lokale Tag eines Date-Objekts, also der Tag aus Sicht des Nutzers.
 */
export function localDateOf(date: Date): LuxLocalDate {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

/**
 * Die lokale Uhrzeit eines Date-Objekts, also die Uhrzeit aus Sicht des Nutzers. Sekunden entfallen.
 */
export function localTimeOf(date: Date): LuxLocalTime {
  return { hour: date.getHours(), minute: date.getMinutes() };
}

export function compareLocalDate(first: LuxLocalDate, second: LuxLocalDate): number {
  return first.year - second.year || first.month - second.month || first.day - second.day;
}

export function addDaysToLocalDate(date: LuxLocalDate, days: number): LuxLocalDate {
  return fromEpochDay(toEpochDay(date) + days);
}

/**
 * Der Wochentag, 0 = Sonntag bis 6 = Samstag (wie Date.getDay()).
 */
export function dayOfWeekOf(date: LuxLocalDate): number {
  // Der 01.01.1970 war ein Donnerstag
  return (((toEpochDay(date) + 4) % 7) + 7) % 7;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year: number, month: number): number {
  return month === 2 ? (isLeapYear(year) ? 29 : 28) : [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/**
 * Tage seit dem 01.01.1970 im gregorianischen Kalender (Algorithmus "days_from_civil" von Howard Hinnant).
 * Gerechnet wird mit Jahren, die am 01.03. beginnen, damit der Schalttag am Ende des Jahres liegt.
 */
function toEpochDay({ year, month, day }: LuxLocalDate): number {
  const shiftedYear = month <= 2 ? year - 1 : year;
  const era = Math.floor(shiftedYear / 400);
  const yearOfEra = shiftedYear - era * 400;
  const dayOfYear = Math.floor((153 * ((month + 9) % 12) + 2) / 5) + day - 1;
  const dayOfEra = yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;
  return era * DAYS_PER_400_YEARS + dayOfEra - DAYS_0000_03_01_TO_1970_01_01;
}

/**
 * Umkehrung von toEpochDay() (Algorithmus "civil_from_days" von Howard Hinnant).
 */
function fromEpochDay(epochDay: number): LuxLocalDate {
  const shiftedDay = epochDay + DAYS_0000_03_01_TO_1970_01_01;
  const era = Math.floor(shiftedDay / DAYS_PER_400_YEARS);
  const dayOfEra = shiftedDay - era * DAYS_PER_400_YEARS;
  const yearOfEra = Math.floor(
    (dayOfEra - Math.floor(dayOfEra / 1460) + Math.floor(dayOfEra / 36524) - Math.floor(dayOfEra / 146096)) / 365
  );
  const dayOfYear = dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
  const shiftedMonth = Math.floor((5 * dayOfYear + 2) / 153);
  const day = dayOfYear - Math.floor((153 * shiftedMonth + 2) / 5) + 1;
  const month = shiftedMonth < 10 ? shiftedMonth + 3 : shiftedMonth - 9;
  return { year: yearOfEra + era * 400 + (month <= 2 ? 1 : 0), month, day };
}

function toValidDate(year: number, month: number, day: number): LuxLocalDate | null {
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > getDaysInMonth(year, month)) {
    return null;
  }

  return { year, month, day };
}

function toValidTime(hour: number, minute: number): LuxLocalTime | null {
  return hour <= 23 && minute <= 59 ? { hour, minute } : null;
}

function toValidDateTime(match: RegExpExecArray): LuxLocalDateTime | null {
  const date = toValidDate(+match[1], +match[2], +match[3]);
  const time = toValidTime(+match[4], +match[5]);
  return date && time ? { date, time } : null;
}

function pad(value: number, length: number): string {
  return String(value).padStart(length, '0');
}

# Util

- [Util](#util)
  - [Classes / Interfaces](#classes--interfaces)
    - [LuxConsoleService](#luxconsoleservice)
      - [1. Beispiel: Nicht-statische Funktionen](#1-beispiel-nicht-statische-funktionen)
      - [2. Beispiel: Statische Funktionen](#2-beispiel-statische-funktionen)
    - [LuxMediaQueryObserverService](#luxmediaqueryobserverservice)
      - [1. Beispiel: MediaQuery-Changes](#1-beispiel-mediaquery-changes)
    - [LuxStorageService](#luxstorageservice)
      - [1. Beispiel: Ohne Observer](#1-beispiel-ohne-observer)
      - [2. Beispiel: Mit Observer](#2-beispiel-mit-observer)
    - [LuxUtil](#luxutil)
      - [Datums- und Zeitwerte ohne Zeitzone](#datums--und-zeitwerte-ohne-zeitzone)
        - [Umrechnung zum Format von Version 21](#umrechnung-zum-format-von-version-21)
      - [Fehlertexte](#fehlertexte)

## Classes / Interfaces

Unter LUX-UTIL sind alle Klassen, Services, Interfaces, etc. zusammengefasst,
die zu keiner Component/Directive/Pipe zugewiesen werden können und allgemein
nützlich für andere Applikationen sein können.

Alle hier beschriebenen Services sind mit `providedIn: 'root'` registriert und müssen nicht in den Providern eingetragen werden.

### LuxConsoleService

Angular-Service, welcher Log-, Info-, Warn- und Error-Funktionen zum Anzeigen von Konsolen-Logs anbietet. Die Ausgaben werden nur dann dargestellt, wenn sich die Applikation nicht im Produktiv-Modus befindet.
Die nicht-statischen Funktionen unterscheiden sich in der Funktionalität nur dahingehend von den Statischen, dass sie die Datei inklusive Zeile des Log-Aufrufes mit ausgeben.
Die jeweiligen Einträge werden mit Datum + Zeitangabe angezeigt.

Die nicht-statischen Funktionen sind Getter, die eine Log-Funktion liefern (Aufruf z.B. `this.logger.log('Text')`):

| Name     | Beschreibung                                         |
| -------- | ---------------------------------------------------- |
| log      | Liefert eine Funktion, die einen Log-Eintrag ausgibt. |
| info     | Liefert eine Funktion, die einen Info-Eintrag ausgibt. |
| warn     | Liefert eine Funktion, die eine Log-Warnung ausgibt. |
| error    | Liefert eine Funktion, die einen Log-Fehler ausgibt. |
| group    | Liefert eine Funktion, die eine Log-Gruppe beginnt.  |
| groupEnd | Liefert eine Funktion, die eine Log-Gruppe beendet.  |

| Name  | Beschreibung                                                      |
| ----- | ----------------------------------------------------------------- |
| LOG   | Statische Funktion, welche einen einfachen Log-Eintrag darstellt. |
| WARN  | Statische Funktion, welche eine Log-Warnung darstellt.            |
| ERROR | Statische Funktion, welche einen Log-Fehler darstellt.            |

#### 1. Beispiel: Nicht-statische Funktionen

Ts

```typescript
private readonly logger = inject(LuxConsoleService);

constructor() {
  this.logger.log('Hallo Welt!');
}
```

#### 2. Beispiel: Statische Funktionen

Ts

```typescript
constructor() {
  LuxConsoleService.LOG('Hallo Welt!');
}
```

### LuxMediaQueryObserverService

Der LuxMediaQueryObserverService bietet Funktionen an, um auf Änderungen der Bildschirmbreite zu reagieren.

| Funktion / Property                                                        | Beschreibung                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| activeMediaQuery: string (Getter)                                          | Liefert den aktuellen Media-Query-Wert zurück (z.B. 'md').                                                                                                                                                                    |
| getMediaQueryChangedAsObservable(...breakpoints: string[]): Observable\<string> | Liefert ein Observable, welches über alle Änderungen an der aktuellen Media-Query ('xs' bis 'xl') informiert. Werden Breakpoints übergeben (z.B. 'Handset', 'TabletPortrait'), wird nur bei diesen Breakpoints informiert (siehe `BREAKPOINTS_ALL`). |
| isSmaller(query: string): boolean                                          | Prüft, ob die aktuelle Media-Query kleiner als die übergebene ist ('xs' bis 'xl').                                                                                                                                            |
| isSmallerOrEqual(query: string): boolean                                   | Prüft, ob die aktuelle Media-Query kleiner oder gleich der übergebenen ist.                                                                                                                                                   |
| isGreater(query: string): boolean                                          | Prüft, ob die aktuelle Media-Query größer als die übergebene ist.                                                                                                                                                             |
| isGreaterOrEqual(query: string): boolean                                   | Prüft, ob die aktuelle Media-Query größer oder gleich der übergebenen ist.                                                                                                                                                    |
| isXS(): boolean                                                            | Prüft, ob aktuell der Media-Query-Wert für XS (bis 599px) gültig ist.                                                                                                                                                         |
| isSM(): boolean                                                            | Prüft, ob aktuell der Media-Query-Wert für SM (bis 959px) gültig ist.                                                                                                                                                         |
| isMD(): boolean                                                            | Prüft, ob aktuell der Media-Query-Wert für MD (bis 1279px) gültig ist.                                                                                                                                                        |
| isLG(): boolean                                                            | Prüft, ob aktuell der Media-Query-Wert für LG (bis 1919px) gültig ist.                                                                                                                                                        |
| isXL(): boolean                                                            | Prüft, ob aktuell der Media-Query-Wert für XL (ab 1920px) gültig ist.                                                                                                                                                         |
| isHandset(), isTablet(), isWeb(): boolean                                  | Prüfen die Geräteklassen-Breakpoints von Angular CDK (Handset, Tablet, Web).                                                                                                                                                  |
| isHandsetPortrait(), isTabletPortrait(), isWebPortrait(): boolean          | Wie oben, jeweils im Hochformat.                                                                                                                                                                                              |
| isHandsetLandscape(), isTabletLandscape(), isWebLandscape(): boolean       | Wie oben, jeweils im Querformat.                                                                                                                                                                                              |
| BREAKPOINTS_DEFAULT / BREAKPOINTS_ALL (statisch)                           | Listen der unterstützten Breakpoints (`['xs', 'sm', 'md', 'lg', 'xl']` bzw. zusätzlich 'Handset', 'Tablet', 'Web' und deren Portrait-/Landscape-Varianten).                                                                  |

#### 1. Beispiel: MediaQuery-Changes

Ts

```typescript
@Component({
  selector: 'app-beispiel',
  ...
})
export class BeispielComponent {
  private readonly mediaObserver = inject(LuxMediaQueryObserverService);

  constructor() {
    this.mediaObserver.getMediaQueryChangedAsObservable().pipe(takeUntilDestroyed()).subscribe(() => {
      if (this.mediaObserver.isXS()) {
        console.log('Media-Query XS aktiviert...');
      }
    });
  }
}
```

### LuxStorageService

Der LuxStorageService speichert Daten im lokalen Browserstorage. Wenn man beim Speichern (Methode -> setItem) angibt, dass es sich um sensible Daten handelt, können diese einfach über die Methode 'clearSensitiveItems' gelöscht werden.

Im Chrome-Browser kann der Storage wie folgt angezeigt und geändert werden:

- mit F12 die Developer Tools öffnen
- auf den Reiter 'Application' wechseln
- links den 'Local Storage' aufklappen
- die URL der App anklicken
- den Wert des Schlüssels 'FilterDatum' ändern (Doppelklick auf den Wert)
- mit Return den neuen Wert übernehmen

| Funktion                                                      | Beschreibung                                                                                                                                              |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getItem(key: string): string \| null                          | Diese Methode liefert den Wert für den übergebenen Schlüssel zurück (`null`, wenn es keinen Eintrag gibt).                                                |
| getItemAsObservable(key: string): Observable\<string \| null>  | Diese Methode liefert ein Observable zurück, das über alle Änderungen an dem Schlüssel informiert wird.                                                   |
| getKeys(): string[]                                           | Diese Methode liefert alle Schlüssel zurück, die über den Service gespeichert wurden.                                                                     |
| length: number (Getter)                                       | Die Anzahl der gespeicherten Einträge.                                                                                                                    |
| setItem(key: string, value: string, sensitive: boolean): void | Diese Methode setzt den übergebenen Wert für den Schlüssel. Zusätzlich muss angegeben werden, ob es sich um sensible oder personenbezogene Daten handelt. |
| removeItem(key: string): void                                 | Diese Methode entfernt den übergebenen Schlüssel.                                                                                                         |
| clearSensitiveItems(): void                                   | Diese Methode löscht alle sensiblen und personenbezogenen Einträge (d.h. alle Items bei denen das Flag 'sensitive' auf true gesetzt wurde).               |
| clearAll(): void                                              | Diese Methode löscht alle Einträge aus dem Storage.                                                                                                       |

#### 1. Beispiel: Ohne Observer

Ts

```typescript
private readonly luxStorageService = inject(LuxStorageService);

readonly value: string | null = this.luxStorageService.getItem('FilterDatum');

methode() {
  this.luxStorageService.setItem('FilterDatum', '01.01.2018', false);
}
```

#### 2. Beispiel: Mit Observer

Ts

```typescript
private readonly luxStorageService = inject(LuxStorageService);

readonly value = toSignal(this.luxStorageService.getItemAsObservable('FilterDatum'));
```

Html

```html
<p>Filterdatum: {{ value() }}</p>
```

### LuxUtil

Die Klasse LuxUtil ist eine Utility-Klasse, welche eine Reihe von statischen Methoden anbietet, um Lösungen für immer wieder benötigte, allgemeine Aufgaben zu bündeln.

Wichtig:

Um aus einem Angular-Template heraus eine dieser Methoden aufzurufen, muss diese innerhalb der dazugehörigen TypeScript-Klasse gekapselt werden.
Das liegt daran, dass die Templates in Angular immer nur auf Methoden und Attribute ihrer eigenen TypeScript-Klassen zugreifen können.

| Funktion                                                                                             | Beschreibung                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| assertNonNull(name: string, value: any): void                                                        | Wirft einen Fehler ("… should be initialized."), wenn der Wert `null` oder `undefined` ist.                                                                                                                       |
| readPropertyValueFromObject(el: any, propertyNamePath: string): any                                  | Liest aus dem Objekt "el" ein bestimmtes Feld "propertyNamePath" aus. Dieses lässt sich auch über mehrere Unterobjekte verschachteln (z.B. "person.address.street").                                             |
| getErrorMessage(tService: TranslocoService, formControl: FormControl): string                        | Gibt eine von verschiedenen vordefinierten Fehlernachrichten passend zu den vorhandenen Fehlern des übergebenen FormControls zurück. Siehe [Fehlertexte](#fehlertexte).                                          |
| getErrorMessageForErrors(tService: TranslocoService, errors: ValidationErrors \| null): string       | Wie getErrorMessage, arbeitet aber direkt auf einem ValidationErrors-Objekt (z.B. aus Signal Forms, siehe toLegacyValidationErrors).                                                                            |
| toLegacyValidationErrors(errors: readonly ValidationError.WithOptionalFieldTree[]): ValidationErrors \| null | Übersetzt die Fehlerliste aus Signal Forms in das klassische ValidationErrors-Objekt (Schlüssel in der Reactive-Forms-Schreibweise, z.B. `minlength`), damit bestehende luxErrorCallbacks weiter funktionieren. |
| isDate(value: any): boolean                                                                          | Prüft, ob das mitgegebene Objekt ein gültiges JavaScript-Date ist.                                                                                                                                                |
| showValidationErrors(formGroup: FormGroup \| UntypedFormGroup): void                                  | Iteriert durch alle Controls der FormGroup und markiert diese als "touched", so dass evtl. aufgetretene Validierungsfehler direkt ersichtlich sind. Nützlich um schnell alle Fehler in einem Formular anzuzeigen. |
| goTo(id: string): void                                                                               | Diese Methode scrollt zu dem HTML-Element mit der übergebenen Id.                                                                                                                                                 |
| goToTop(selector: string = 'div.lux-app-content-container'): void                                     | Diese Methode scrollt zum Element mit dem übergebenen Selector (Standard: Anfang des Inhaltsbereichs).                                                                                                            |
| stopEventPropagation(event: Event): void                                                             | Diese Methode nimmt ein Event entgegen und verhindert, dass das Event weiter verarbeitet wird. Z.B. ein Klick auf einen Button im Accordionheader sollte nicht zusätzlich das Accordion auf-/zuklappen.           |
| isNumber(toCheck: any): boolean                                                                      | Prüft, ob der Wert als Zahl interpretiert werden kann.                                                                                                                                                            |
| base64ToArrayBuffer(data: string): ArrayBuffer                                                       | Wandelt einen Base64-String (ohne data-URL-Präfix) in einen ArrayBuffer um.                                                                                                                                       |
| isKeyArrowLeft/-Up/-Right/-Down(event: KeyboardEvent): boolean                                       | Prüfen, ob die entsprechende Pfeiltaste gedrückt wurde.                                                                                                                                                           |
| isKeyHome/isKeyEnd/isKeyPageUp/isKeyPageDown(event: KeyboardEvent): boolean                          | Prüfen, ob Pos1, Ende, Bild auf bzw. Bild ab gedrückt wurde.                                                                                                                                                      |
| isKeyEnter/isKeyTab/isKeyBackspace/isKeySpace/isKeyDelete/isKeyEscape(event: KeyboardEvent): boolean | Prüfen, ob Enter, Tab, Backspace, Leertaste, Entf bzw. Escape gedrückt wurde.                                                                                                                                     |
| isKeyF2(event: KeyboardEvent): boolean                                                               | Prüft, ob die Taste F2 gedrückt wurde.                                                                                                                                                                            |
| stringWithoutASCIIChars(value: string): string                                                       | Entfernt Sonder- und Steuerzeichen außerhalb des erlaubten ASCII-Zeichensatzes aus dem String.                                                                                                                    |
| getAcceptTypesAsMessagePart(tService: TranslocoService, acceptTypes: string): string                  | Liefert für die akzeptierten Dateitypen (z.B. '.pdf,.txt,.png') einen übersetzten Nachrichtenteil (z.B. "PDF, TXT oder PNG").                                                                                     |
| checkIfRequestIsAssetRequest(request: HttpRequest\<any>): boolean                                     | Prüft, ob es sich um einen Asset-Request handelt (URL enthält "/assets/").                                                                                                                                        |

#### Datums- und Zeitwerte ohne Zeitzone

Diese Funktionen arbeiten mit Datums- und Zeitwerten ohne Zeitzone, wie sie `lux-datepicker` und `lux-timepicker` verwenden: `"2029-05-26"`, `"14:30"` bzw. `"2029-05-26T14:30"`.
Sie rechnen ohne JavaScript-Date und liefern deshalb in jeder Zeitzone dasselbe Ergebnis.

| Funktion                                                                                     | Beschreibung                                                                                                                                         |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| isLocalDate(value: unknown): boolean                                                         | Prüft, ob der Wert ein Datum `"yyyy-MM-dd"` ist (kein 31.02.). Mitternacht ohne Zeitzone (`"2029-05-26T00:00:00"`) ist erlaubt, wie beim Datepicker. |
| isLocalTime(value: unknown): boolean                                                         | Prüft, ob der Wert eine Uhrzeit `"HH:mm"` ist (keine 24:00). Sekunden `:00` sind erlaubt (`"14:30:00"`).                                             |
| isLocalDateTime(value: unknown): boolean                                                     | Prüft, ob der Wert Datum und Uhrzeit `"yyyy-MM-ddTHH:mm"` sind. Sekunden `:00` sind erlaubt.                                                         |
| todayAsLocalDate(): string                                                                   | Liefert den heutigen Tag aus Sicht des Nutzers, z.B. `"2029-05-26"`.                                                                                 |
| toLocalDate(date: Date \| null \| undefined): string \| null                                 | Liefert den lokalen Tag eines Date-Objekts, z.B. `new Date(2029, 4, 26)` ergibt `"2029-05-26"`. Für ein ungültiges Date `null`.                      |
| toLocalTime(date: Date \| null \| undefined): string \| null                                 | Liefert die lokale Uhrzeit eines Date-Objekts ohne Sekunden, z.B. `new Date(2029, 4, 26, 14, 30)` ergibt `"14:30"`. Für ein ungültiges Date `null`.  |
| toLocalDateTime(date: Date \| null \| undefined): string \| null                             | Liefert Datum und Uhrzeit aus Sicht des Nutzers ohne Sekunden. In Deutschland wird `new Date("2029-05-26T12:30:00Z")` zu `"2029-05-26T14:30"`.       |
| addDays(localDate: string \| null \| undefined, days: number): string \| null                | Addiert Tage, auch negativ. `addDays("2029-02-28", 1)` ergibt `"2029-03-01"`.                                                                        |
| compareLocalDates(first: string, second: string): number                                     | Liefert eine negative Zahl, wenn `first` vor `second` liegt, 0 bei gleichem Tag, sonst eine positive Zahl.                                           |
| getDayOfWeek(localDate: string \| null \| undefined): number \| null                         | Liefert den Wochentag, 0 = Sonntag bis 6 = Samstag (wie `Date.getDay()`).                                                                            |
| combineDateTime(localDate, localTime): string \| null                                        | Führt Datum und Uhrzeit zusammen, `"2029-05-26"` und `"14:30"` ergeben `"2029-05-26T14:30"`. Fehlt einer der Werte, `null`.                          |
| splitDateTime(localDateTime): { date: string; time: string } \| null                         | Trennt Datum und Uhrzeit, `"2029-05-26T14:30"` ergibt `{ date: "2029-05-26", time: "14:30" }`.                                                       |

Alle Funktionen nehmen die erlaubten Varianten an (z.B. `"14:30:00"`) und geben immer die kurze Form aus (`"14:30"`).
`null` und `undefined` ergeben `null`, nur `compareLocalDates` braucht zwei Werte. Bei einem ungültigen Wert werfen `addDays`, `compareLocalDates`, `getDayOfWeek`, `combineDateTime` und `splitDateTime` einen Fehler.

Beispiel: nur Werktage im Datepicker auswählbar machen.

```ts
readonly weekdaysOnly = (date: string) => ![0, 6].includes(LuxUtil.getDayOfWeek(date)!);
```

##### Umrechnung zum Format von Version 21

Bis Version 21 waren die Werte UTC-Zeitpunkte. Kann das Backend noch nicht umgestellt werden, rechnet die Anwendung beim Laden und Speichern mit diesen Funktionen um (siehe [Update-Guide v22](update-guide-v22#datums--und-zeitwerte-ohne-zeitzone)).

| Funktion                               | Beispiel                                                    |
| -------------------------------------- | ----------------------------------------------------------- |
| fromV21Date(value): string \| null     | `"2029-05-26T00:00:00.000Z"` ergibt `"2029-05-26"`          |
| toV21Date(value): string \| null       | `"2029-05-26"` ergibt `"2029-05-26T00:00:00.000Z"`          |
| fromV21Time(value): string \| null     | `"1970-01-01T14:30:00.000Z"` ergibt `"14:30"`               |
| toV21Time(value): string \| null       | `"14:30"` ergibt `"1970-01-01T14:30:00.000Z"`               |
| fromV21DateTime(value): string \| null | `"2029-05-26T14:30:00.000Z"` ergibt `"2029-05-26T14:30"`    |
| toV21DateTime(value): string \| null   | `"2029-05-26T14:30"` ergibt `"2029-05-26T14:30:00.000Z"`    |

Die Regeln sind streng, es gibt keine Heuristik und keine Zeitzone:

- Ein Datum muss genau auf UTC-Mitternacht liegen, der Tag ist der UTC-Tag. Millisekunden sind optional (`"2029-05-26T00:00:00Z"`), ausgegeben wird immer `.000Z`.
- Bei Uhrzeiten zählen die UTC-Werte, die Sekunden müssen `00` sein. `fromV21Time()` ignoriert den Datumsteil, `toV21Time()` gibt immer `1970-01-01` aus.
- Die Funktionen rechnen keine Zeitzone um. `toV21DateTime("2029-05-26T14:30")` ergibt 14:30 Uhr UTC, weil die Komponenten in Version 21 die UTC-Uhrzeit angezeigt haben. Den echten Zeitpunkt liefert `new Date("2029-05-26T14:30").toISOString()`. Ebenso ergibt `fromV21DateTime("2029-05-26T12:30:00.000Z")` den Wert `"2029-05-26T12:30"` und nicht die lokale Uhrzeit. Die liefert `toLocalDateTime(new Date("2029-05-26T12:30:00.000Z"))`. Ein vollständiges Beispiel steht beim [LUX-Timepicker](lux‐timepicker-v22#7-zeitpunkte-aus-dem-backend).
- `null`, `undefined` und `""` ergeben `null`.
- Einen Wert, der nicht passt, geben die Funktionen unverändert zurück. Die Komponente zeigt ihn dann als Fehler an, und im Dev-Modus warnt die Konsole.

#### Fehlertexte

Die Texte stammen aus den LUX-Übersetzungen (`luxc.util.error_message.*`, deutsche Fassung):

| Fehler    | Fehlertext                           |
| --------- | ------------------------------------ |
| required  | \* Pflichtfeld                       |
| minlength | Die Mindestlänge ist [n]             |
| maxlength | Die Maximallänge ist [n]             |
| email     | Dies ist keine gültige E-Mailadresse |
| min       | Der Minimalwert ist [n]              |
| max       | Der Maximalwert ist [n]              |
| pattern   | Entspricht nicht dem Muster "\<xy>"  |

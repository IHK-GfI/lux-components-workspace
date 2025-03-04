# Util

- [Util](#util)
  - [Classes / Interfaces](#classes--interfaces)
    - [LuxConsoleService](#luxconsoleservice)
      - [1. Beispiel: Nicht-statische Funktionen](#1-beispiel-nicht-statische-funktionen)
      - [2. Beispiel: Statische Funktionen](#2-beispiel-statische-funktionen)
    - [LuxMediaQueryObserverService](#luxmediaqueryobserverservice)
      - [1. Beispiel: MediaQuery-Changes](#1-beispiel-mediaquery-changes)
    - [LuxPaginatorIntl](#luxpaginatorintl)
    - [LuxStorageService](#luxstorageservice)
      - [1. Beispiel: Ohne Observer](#1-beispiel-ohne-observer)
      - [2. Beispiel: Mit Observer](#2-beispiel-mit-observer)
    - [LuxUtil](#luxutil)
      - [Fehlertexte](#fehlertexte)

## Classes / Interfaces

Unter LUX-UTIL sind alle Klassen, Services, Interfaces, etc. zusammengefasst,
die zu keiner Component/Directive/Pipe zugewiesen werden können und allgemein
nützlich für andere Applikationen sein können.

### LuxConsoleService

Angular-Service, welcher Log-, Warn- und Error-Funktionen zum Anzeigen von Konsolen-Logs anbietet. Die Ausgaben werden nur dann dargestellt, wenn sich die Applikation nicht im Produktiv-Modus befindet.
Die nicht-statischen Funktionen unterscheiden sich in der Funktionalität nur dahingehend von den Statischen, dass sie die Datei inklusive Zeile des Log-Aufrufes mit ausgeben.
Die jeweiligen Einträge werden mit Datum + Zeitangabe angezeigt.

Der Service sollte im Root-Module der Applikation in den Providern eingetragen werden.

| Name  | Beschreibung                                                            |
| ----- | ----------------------------------------------------------------------- |
| log   | Nicht-statische Funktion, welche einen einfachen Log-Eintrag darstellt. |
| warn  | Nicht-statische Funktion, welche eine Log-Warnung darstellt.            |
| error | Nicht-statische Funktion, welche einen Log-Fehler darstellt.            |

| Name  | Beschreibung                                                      |
| ----- | ----------------------------------------------------------------- |
| LOG   | Statische Funktion, welche einen einfachen Log-Eintrag darstellt. |
| WARN  | Statische Funktion, welche eine Log-Warnung darstellt.            |
| ERROR | Statische Funktion, welche einen Log-Fehler darstellt.            |

#### 1. Beispiel: Nicht-statische Funktionen

Ts

```typescript
constructor(private logger: LuxConsoleService) {
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

> Der LuxMediaQueryObserverService muss als Provider eingetragen werden.

| Funktion / Property                                      | Beschreibung                                                                                                            |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| activeMediaQuery: string                                 | Dieses Property liefert den aktuellen Media-Query-Wert zurück (z.B. 'md').                                              |
| getMediaQueryChangedAsObservable(): Observable \<string> | Diese Methode liefert ein Observable zurück, welches über alle Änderungen an der aktuellen Media-Query informiert wird. |
| isXS(): boolean                                          | Diese Methode prüft ob aktuell der aktuelle Media-Query-Wert für XS (bis 599px) gültig ist.                             |
| isSM(): boolean                                          | Diese Methode prüft ob aktuell der aktuelle Media-Query-Wert für SM (bis 959px) gültig ist.                             |
| isMD(): boolean                                          | Diese Methode prüft ob aktuell der aktuelle Media-Query-Wert für MD (bis 1279px) gültig ist.                            |
| isLG(): boolean                                          | Diese Methode prüft ob aktuell der aktuelle Media-Query-Wert für LG (bis 1919px) gültig ist.                            |
| isXL(): boolean                                          | Diese Methode prüft ob aktuell der aktuelle Media-Query-Wert für XL (bis 5000px) gültig ist.                            |

#### 1. Beispiel: MediaQuery-Changes

Ts

```typescript
@Component({
  selector: 'app-beispiel',
  ...
})
export class BeispielComponent implements OnInit, OnDestroy {

    subscription: Subscription;

    constructor(private mediaObserver: LuxMediaQueryObserverService) {
        this.mediaSubscription = this.mediaObserver.getMediaQueryChangedAsObservable().subscribe(() => {
            if(this.mediaObserver.isXS()) {
                console.log('Media-Query XS aktiviert...');
            }
        });
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
 }
```

### LuxPaginatorIntl

Die Lux-Implementierung von MatPaginatorIntl, also der Sprachkonfiguration für die Paginations.
Die [lux-table](lux‐table-v18) und [lux-message-box](lux‐message‐box-v18) nutzen beide diese Konfiguration.

| Name              | Neuer Wert              |
| ----------------- | ----------------------- |
| itemsPerPageLabel | 'Elemente pro Seite'    |
| nextPageLabel     | 'Nächste Seite'         |
| previousPageLabel | 'Vorherige Seite'       |
| lastPageLabel     | 'Letzte Seite'          |
| firstPageLabel    | 'Erste Seite'           |
| getRangeLabel     | \<x\> + ' von ' + \<y\> |

### LuxStorageService

Der LuxStorageService speichert Daten im lokalen Browserstorage. Wenn man beim Speichern (Methode -> setItem) angibt, dass es sich um sensible Daten handelt, können diese einfach über die Methode 'clearSensitiveItems' gelöscht werden.

> Der LuxStorageService muss als Provider in der Datei "app.module.ts" eingetragen werden.

Im Chrome-Browser kann der Storage wie folgt angezeigt und geändert werden:

- mit F12 die Developer Tools öffnen
- auf den Reiter 'Application' wechseln
- links den 'Local Storage' aufklappen
- die URL der App anklicken
- den Wert des Schlüsseln 'FilterDatum' ändern (Doppelklick auf den Wert)
- mit Return den neuen Wert übernehmen

| Funktion                                                      | Beschreibung                                                                                                                                              |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getItem(key: string): string                                  | Diese Methode liefert den Wert für den übergebenen Schlüssel zurück.                                                                                      |
| getItemAsObservable(key: string): Observable \<string>        | Diese Methode liefert ein Observable zurück, das über alle Änderungen an dem Schlüssel informiert wird.                                                   |
| setItem(key: string, value: string, sensitive: boolean): void | Diese Methode setzt den übergebenen Wert für den Schlüssel. Zusätzlich muss angegeben werden, ob es sich um sensible oder personenbezogene Daten handelt. |
| removeItem(key: string): void                                 | Diese Methode entfernt den übergebenen Schlüssel.                                                                                                         |
| clearSensitiveItems(): void                                   | Diese Methode löscht alle sensiblen und personenbezogenen Einträge (d.h. alle Items bei denen das Flag 'sensitive' auf true gesetzt wurde).               |
| clearAll(): void                                              | Diese Methode löscht alle Einträge aus dem Storage.                                                                                                       |

#### 1. Beispiel: Ohne Observer

Ts

```typescript
value : string = this.luxStorageService.getItem('mustermann4711.filter.datum');


constructor(private luxStorageService: LuxStorageService) {
}


methode() {
    this.luxStorageService.setItem('FilterDatum', '01.01.2018', false);
}
```

#### 2. Beispiel: Mit Observer

Ts

```typescript
...
value$: Observable<string>;

constructor(private luxStorageService: LuxStorageService) {
}

ngOnInit() {
  this.value$ = this.luxStorageService.getItemAsObservable('FilterDatum');
}
...
```

### LuxUtil

Die Klasse LuxUtil ist eine Utility-Klasse, welche eine Reihe von statischen Methoden anbietet, um Lösungen für immer wieder benötigte, allgemeine Aufgaben zu bündeln.

Wichtig:

Um aus einem Angular-Template heraus eine dieser Methoden aufzurufen, muss diese innerhalb der dazugehörigen Typescript-Klasse gekapselt werden.
Das liegt daran, dass die Templates in Angular immer nur auf Methoden und Attribute ihrer eigenen Typescript-Klassen zugreifen können.

| Funktion                                                                                                         | Beschreibung                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isEmpty(str: string): boolean                                                                                    | Prüft ob ein String undefiniert oder eine Länge von 0 hat.                                                                                                                                                                      |
| readPropertyValueFromObject(el: any, propertyNamePath: string): any                                              | Liest aus dem Objekt "el" ein bestimmtes Feld "propertyNamePath" aus. Dieses lässt sich auch über mehrere Unterobjekte verschachteln.                                                                                           |
| getErrorMessage(formControl: FormControl): string                                                                | Gibt eine von verschiedenen vordefinierten Fehlernachrichten passend zu den vorhandenen Fehlern der übergebenen FormControl zurück. Siehe [Fehlertexte](#fehlertexte).                                                          |
| isDate(value: any): boolean                                                                                      | Prüft ob das mitgegebene Objekt ein Javascript-Date ist.                                                                                                                                                                        |
| isIE(): boolean                                                                                                  | Prüft ob die Applikation von einem Internet Explorer bis Version 11 aufgerufen worden ist.                                                                                                                                      |
| isEdge(): boolean                                                                                                | Prüft, ob die Applikation von einem Edge-Browser aufgerufen worden ist.                                                                                                                                                         |
| showValidationErrors(formGroup: FormGroup): void                                                                 | Iteriert durch alle Controls der FormGroup und markiert diese als "touched", so dass evtl. aufgetretene Validierungsfehler direkt ersichtlich sind. Nützlich um schnell alle Fehler in einem Formular anzuzeigen.               |
| goTo(id: string): void                                                                                           | Diese Methode scollt zu dem HTML-Element mit der übergebenen Id.                                                                                                                                                                |
| stopEventPropagation(event: any): void                                                                           | Diese Methode nimmt ein Event entgegen und verhindert, dass das Event weiter verarbeitet wird. Z.B. ein Klick auf einen Button im Accordionheader sollte nicht zusätzlich das Accordion auf-/zuklappen.                         |
| getColorsByBgColorsEnum(color: LuxBgAllColor \| undefined): { backgroundCSSClass: string, fontCSSClass: string } | Gibt anhand der übergebenen BackgroundColor ein Objekt mit einem CSS-String für die Font- und Background-Color wieder. Der String enthält den Namen der passenden CSS-Klasse, der Farbwert kommt dann aus der \_luxstyles.scss. |

#### Fehlertexte

| Fehler    | Fehlertext                           |
| --------- | ------------------------------------ |
| required  | Darf nicht leer sein                 |
| minlength | Die Mindestlänge ist [n]             |
| maxlength | Die Maximallänge ist [n]             |
| email     | Dies ist keine gültige E-Mailadresse |
| min       | Der Minimalwert ist [n]              |
| max       | Der Maximalwert ist [n]              |
| pattern   | Entspricht nicht dem Muster \<xy>    |

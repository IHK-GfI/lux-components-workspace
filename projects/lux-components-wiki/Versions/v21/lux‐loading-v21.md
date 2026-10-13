# LUX-Loading

- [LUX-Loading](#lux-loading)
  - [Global Blocking State](#global-blocking-state)
    - [Blockierend oder anzeigend?](#blockierend-oder-anzeigend)
    - [Wer macht was](#wer-macht-was)
    - [Barrierefreiheit](#barrierefreiheit)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [Signale](#signale)
    - [Funktionen](#funktionen)
    - [Garantien der RxJS-Operatoren](#garantien-der-rxjs-operatoren)
    - [Screenreader-Ansagen](#screenreader-ansagen)
  - [Beispiele](#beispiele)
    - [1. Formular speichern (blockierend)](#1-formular-speichern-blockierend)
    - [2. Liste filtern (anzeigend)](#2-liste-filtern-anzeigend)
    - [3. Manuell steuern](#3-manuell-steuern)
    - [4. LUX-Table (anzeigend)](#4-lux-table-anzeigend)

## Global Blocking State

Während einer Aktion wie Speichern oder Filtern dürfen keine parallelen Requests und keine widersprüchlichen Eingaben entstehen
(Doppelklick auf Speichern, Wegnavigieren mitten im Request). Der Global Blocking State sperrt die Seite dafür zentral, statt die Sperre
jeder Seite einzeln zu überlassen.

Ein Service, zwei Modi: Der `LuxLoadingService` zählt laufende Vorgänge. Der [Leave-Guard](lux‐leave‐guard-v21) und eigene
Komponenten (Progressbar, Buttons, Formularfelder) hängen an diesem Zustand. Konsumenten markieren nur ihre Requests:

```typescript
// Speichern: sperrt die Seite, bis die Antwort da ist
this.api.save(dto).pipe(this.loading.trackBlocking()).subscribe();

// Filtern: nur Fortschrittsanzeige, ein neuer Request überschreibt den laufenden
trigger$.pipe(switchMap((f) => this.api.search(f).pipe(this.loading.trackBusy())));
```

### Blockierend oder anzeigend?

|                    | Blockierend (`trackBlocking()`)                                         | Anzeigend (`trackBusy()`)                  |
| ------------------ | ----------------------------------------------------------------------- | ------------------------------------------ |
| Typische Vorgänge  | Speichern, Löschen, Absenden                                            | Filtern, Liste neu laden                   |
| Wirkung            | `isLoading()` und `isBusy()`; Navigationssperre und Screenreader-Ansage | nur `isBusy()`, die Seite bleibt bedienbar |
| Parallele Requests | gesperrt, bis alle fertig sind                                          | überschreibbar per `switchMap`             |

Gar nicht markiert werden sollten Hintergrund-Polling, Autosave oder Lazy Loading beim Scrollen. Solche Vorgänge sollen weder sperren noch anzeigen.

### Wer macht was

| LUX automatisch                                                                                              | Applikation                                                                                                            |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Navigationssperre über `luxLeaveGuard` (inkl. `beforeunload` über `LuxLeaveGuardBase`), Screenreader-Ansagen | Requests markieren, Formularfelder und Buttons sperren, Fortschrittsanzeige einbinden, Guard an der Route registrieren |

### Barrierefreiheit

- Zentrale Ansagen über den CDK-`LiveAnnouncer`, nur für blockierende Vorgänge. Regel: ein Vorgang, eine Ansage.
  Ergebnis-Feedback beim Filtern (z. B. Trefferanzahl) gehört zur jeweiligen Liste.
- Kein Overlay, kein Fokus-Raub: Der Fokus bleibt nach Abschluss unverändert.
- Navigationsversuche während der Sperre erhalten einen Hinweisdialog (siehe [Leave-Guard](lux‐leave‐guard-v21)).
- Bereiche, die während eines Vorgangs neu geladen werden, sollten `aria-busy="true"` tragen.
- Alle Texte kommen aus den LUX-Übersetzungen und sind überschreibbar.

## Overview / API

### Allgemein

`LuxLoadingService` ist ein Root-Service (`providedIn: 'root'`) und damit die zentrale Zustandsquelle des Global Blocking State.

| Name   | Beschreibung                        |
| ------ | ----------------------------------- |
| name   | LuxLoadingService                   |
| import | @ihk-gfi/lux-components/lux-loading |

```typescript
import { LuxLoadingService } from '@ihk-gfi/lux-components/lux-loading';

private readonly loading = inject(LuxLoadingService);
```

### Signale

| Signal    | Typ             | Beschreibung                                                         | Typische Verwendung                                             |
| --------- | --------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| isLoading | Signal<boolean> | Mindestens ein blockierender Vorgang läuft (die Seite ist gesperrt). | Formularfelder, eigene Buttons, alles was sperren soll          |
| isBusy    | Signal<boolean> | Irgendein Vorgang läuft (blockierend oder anzeigend).                | Fortschrittsanzeigen, z. B. `lux-progress` oder Skeleton-Zeilen |

| Szenario                          | isLoading | isBusy |
| --------------------------------- | --------- | ------ |
| Nichts läuft                      | false     | false  |
| Nur Filter läuft (`trackBusy`)    | false     | true   |
| Speichern läuft (`trackBlocking`) | true      | true   |

### Funktionen

| Funktion                                      | Beschreibung                                                                       |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| trackBlocking\<T>(): MonoTypeOperatorFunction | RxJS-Operator, der ein Observable als blockierenden Vorgang markiert.              |
| trackBusy\<T>(): MonoTypeOperatorFunction     | RxJS-Operator, der ein Observable als anzeigenden Vorgang markiert.                |
| block(): () => void                           | Startet einen blockierenden Vorgang und liefert eine idempotente Release-Funktion. |
| busy(): () => void                            | Startet einen anzeigenden Vorgang und liefert eine idempotente Release-Funktion.   |
| show(): void                                  | Einfache Fassade: erhöht den Zähler blockierender Vorgänge um 1.                   |
| hide(): void                                  | Einfache Fassade: verringert den Zähler blockierender Vorgänge um 1 (nie unter 0). |

### Garantien der RxJS-Operatoren

- Die Freigabe erfolgt bei Complete, Error und Unsubscribe (`finalize`). Ein vergessenes Aufräumen im Fehlerfall ist ausgeschlossen.
- Der Zähler startet erst beim Subscribe, nicht beim Aufbau der Pipe.
- Zählerbasiert: Bei parallelen Vorgängen wird erst freigegeben, wenn der letzte fertig ist.
- `switchMap`-tauglich: Das Unsubscribe eines überholten Requests gibt dessen Anteil frei.

### Screenreader-Ansagen

Übergänge blockierender Vorgänge werden automatisch angesagt (`polite`, CDK-`LiveAnnouncer`). Anzeigende Vorgänge werden nicht angesagt.

| Key               | Deutsch                     | Englisch                |
| ----------------- | --------------------------- | ----------------------- |
| luxc.loading.busy | Verarbeitung läuft.         | Processing in progress. |
| luxc.loading.done | Verarbeitung abgeschlossen. | Processing finished.    |

## Beispiele

### 1. Formular speichern (blockierend)

```typescript
import { Component, inject } from '@angular/core';
import { LuxLeaveGuardBase } from '@ihk-gfi/lux-components/lux-leave-guard';
import { LuxLoadingService } from '@ihk-gfi/lux-components/lux-loading';

@Component({ ... })
export class AntragBearbeitenComponent extends LuxLeaveGuardBase {
  protected readonly loading = inject(LuxLoadingService);

  save(): void {
    this.api.saveAntrag(this.form.value).pipe(this.loading.trackBlocking()).subscribe(() => this.form.markAsPristine());
  }

  hasUnsavedData(): boolean {
    return this.form.dirty;
  }
}
```

```typescript
// app.routes.ts
{ path: 'antrag', component: AntragBearbeitenComponent, canDeactivate: [luxLeaveGuard] }
```

Formularfelder dürfen während des Requests gesperrt werden (temporäres Deaktivieren bei Systemzuständen).
Eigene Buttons nutzen `luxLoading` (Spinner, verhindert erneutes Klicken):

```html
<lux-input-ac luxLabel="Name" [luxDisabled]="loading.isLoading()"></lux-input-ac>

<lux-button luxLabel="Speichern" luxColor="primary" [luxFlat]="true" [luxLoading]="loading.isLoading()" (luxClicked)="save()"></lux-button>
```

### 2. Liste filtern (anzeigend)

```typescript
export class AntragslisteComponent {
  protected readonly loading = inject(LuxLoadingService);
  private readonly filterTrigger = new Subject<AntragsFilter>();

  readonly items = signal<Antrag[]>([]);

  constructor() {
    this.filterTrigger
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((filter) => this.api.search(filter).pipe(this.loading.trackBusy())),
        takeUntilDestroyed()
      )
      .subscribe((result) => this.items.set(result));
  }
}
```

Der Filter bleibt bedienbar, die Navigation bleibt möglich. Solange der Request läuft, kann die Liste z. B. eine Fortschrittsanzeige zeigen:

```html
@if (loading.isBusy()) {
<lux-progress luxMode="indeterminate"></lux-progress>
}
```

### 3. Manuell steuern

Für Vorgänge ohne Observable:

```typescript
const release = this.loading.block(); // oder busy()
try {
  await doSomething();
} finally {
  release(); // idempotent, mehrfacher Aufruf ist harmlos
}
```

### 4. LUX-Table (anzeigend)

Die [lux-table](lux‐table-v21) meldet ihren Ladezustand über `luxLoadingChange`. Mit `luxShowProgress = false` entfällt die interne Progressbar,
die Fortschrittsanzeige übernimmt dann der globale Ladebalken (`isBusy()`):

```html
<lux-table [luxHttpDAO]="httpDao" [luxShowProgress]="false" (luxLoadingChange)="onTableLoadingChange($event)"> ... </lux-table>
```

```typescript
private releaseTableLoading?: () => void;

onTableLoadingChange(loading: boolean) {
  this.releaseTableLoading?.();
  this.releaseTableLoading = loading ? this.loading.busy() : undefined;
}

ngOnDestroy() {
  this.releaseTableLoading?.();
}
```

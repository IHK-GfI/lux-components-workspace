# LUX-Leave-Guard

- [LUX-Leave-Guard](#lux-leave-guard)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [ILuxLeaveGuard](#iluxleaveguard)
    - [luxLeaveGuard](#luxleaveguard)
    - [LuxLeaveGuardBase](#luxleaveguardbase)
  - [Verhalten](#verhalten)
  - [Texte](#texte)
  - [Beispiele](#beispiele)
    - [1. Interface implementieren](#1-interface-implementieren)
    - [2. Guard in der Route registrieren](#2-guard-in-der-route-registrieren)
    - [3. Basisklasse mit beforeunload-Schutz](#3-basisklasse-mit-beforeunload-schutz)
    - [4. Zusammenspiel mit dem LuxLoadingService](#4-zusammenspiel-mit-dem-luxloadingservice)

## Overview / API

### Allgemein

Der Leave-Guard schützt Routen vor dem unbeabsichtigten Verlassen, wenn die Komponente ungespeicherte Änderungen enthält.
Gibt es ungespeicherte Daten, erscheint ein Bestätigungsdialog mit zwei Aktionen:

- **Verwerfen und fortfahren** (Warn-Aktion): Die Navigation wird zugelassen, die Änderungen gehen verloren.
- **Abbrechen** (Standard-Button): Die Navigation wird abgebrochen, die Seite bleibt geöffnet.

Zusätzlich blockiert der Guard die Navigation, solange über den [LuxLoadingService](lux‐loading-v21) ein blockierender Vorgang läuft
(Pattern „Global Blocking State“). In diesem Fall erscheint ein Hinweisdialog, der die Navigation ablehnt.

| Name   | Beschreibung                            |
| ------ | --------------------------------------- |
| import | @ihk-gfi/lux-components/lux-leave-guard |

### ILuxLeaveGuard

Interface, das die geschützte Komponente implementieren muss.

| Funktion                  | Beschreibung                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| hasUnsavedData(): boolean | Liefert `true`, wenn ungespeicherte Änderungen vorliegen. Der Ladezustand muss hier nicht berücksichtigt werden, das macht der Guard. |

### luxLeaveGuard

Funktionaler Guard vom Typ `CanDeactivateFn<ILuxLeaveGuard>` für die Eigenschaft `canDeactivate` einer Route.

### LuxLeaveGuardBase

Abstrakte Basisklasse (`@Directive()`), die `ILuxLeaveGuard` implementiert. Sie ergänzt den Guard um einen `beforeunload`-Handler,
der auch beim Neuladen der Seite oder beim Schließen des Browser-Tabs greift. Der Browser zeigt dann seine eigene (nicht anpassbare) Rückfrage an.

| Funktion                           | Beschreibung                                                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| abstract hasUnsavedData(): boolean | Muss von der Komponente implementiert werden.                                                                    |
| handleBeforeUnload(event)          | Verhindert das Verlassen, wenn `hasUnsavedData()` `true` liefert oder `LuxLoadingService.isLoading()` aktiv ist. |

## Verhalten

| Situation                                         | Verhalten                                                     |
| ------------------------------------------------- | ------------------------------------------------------------- |
| Keine ungespeicherten Daten, kein Ladezustand     | Navigation wird direkt erlaubt.                               |
| Ungespeicherte Daten, Dialog bestätigt            | Navigation wird erlaubt.                                      |
| Ungespeicherte Daten, Dialog abgebrochen          | Navigation wird abgelehnt.                                    |
| Blockierender Vorgang läuft (`isLoading()`)       | Hinweisdialog, die Navigation wird abgelehnt.                 |
| Nur anzeigender Vorgang läuft (`isBusy()`)        | Kein Einfluss, der Guard verhält sich wie ohne Ladezustand.   |
| Seite neu laden / Tab schließen (mit Basisklasse) | Browser-Rückfrage bei ungespeicherten Daten oder Ladezustand. |

## Texte

Alle Dialogtexte kommen aus den LUX-Übersetzungen (`luxc-de.json`, `luxc-en.json`) und können in der Applikation überschrieben werden.

| Key                              | Deutsch                                                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| luxc.leave-guard.unsaved.title   | Ungespeicherte Änderungen                                                                                 |
| luxc.leave-guard.unsaved.content | Es liegen ungespeicherte Änderungen vor. Beim Fortfahren gehen diese Änderungen verloren.                 |
| luxc.leave-guard.unsaved.confirm | Verwerfen und fortfahren                                                                                  |
| luxc.leave-guard.unsaved.decline | Abbrechen                                                                                                 |
| luxc.leave-guard.busy.title      | Aktion wird verarbeitet                                                                                   |
| luxc.leave-guard.busy.content    | Eine Aktion wird noch verarbeitet. Die Seite kann verlassen werden, sobald der Vorgang abgeschlossen ist. |
| luxc.leave-guard.busy.close      | Schließen                                                                                                 |

## Beispiele

### 1. Interface implementieren

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ILuxLeaveGuard } from '@ihk-gfi/lux-components/lux-leave-guard';

@Component({
  selector: 'app-mein-formular',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <input formControlName="name" />
    </form>
  `
})
export class MeinFormularComponent implements ILuxLeaveGuard {
  form = new FormGroup({
    name: new FormControl('')
  });

  hasUnsavedData(): boolean {
    return this.form.dirty;
  }
}
```

### 2. Guard in der Route registrieren

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { luxLeaveGuard } from '@ihk-gfi/lux-components/lux-leave-guard';
import { MeinFormularComponent } from './mein-formular.component';

export const routes: Routes = [
  {
    path: 'formular',
    component: MeinFormularComponent,
    canDeactivate: [luxLeaveGuard]
  }
];
```

Nach erfolgreichem Speichern muss `hasUnsavedData()` wieder `false` liefern, z. B. über `markAsPristine()`:

```typescript
save() {
  this.myService.save(this.form.value).subscribe(() => {
    this.form.markAsPristine(); // dirty = false → der Guard lässt die Navigation durch
  });
}
```

### 3. Basisklasse mit beforeunload-Schutz

```typescript
import { Component } from '@angular/core';
import { LuxLeaveGuardBase } from '@ihk-gfi/lux-components/lux-leave-guard';

@Component({ ... })
export class MeinFormularComponent extends LuxLeaveGuardBase {
  form = new FormGroup({ ... });

  hasUnsavedData(): boolean {
    return this.form.dirty;
  }
}
```

### 4. Zusammenspiel mit dem LuxLoadingService

Wird ein Request mit `trackBlocking()` markiert, sperrt der Guard die Navigation, bis der Request abgeschlossen ist.
Details zum Pattern stehen auf der Seite [LuxLoadingService](lux‐loading-v21).

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
    return this.form.dirty; // den Ladezustand nicht einrechnen, das macht der Guard selbst
  }
}
```

# LUX-Skeleton

![Beispielbild LUX-Skeleton](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐skeleton-v21-img.png)

- [LUX-Skeleton](#lux-skeleton)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [Import](#import)
    - [@Input](#input)
    - [Verhalten](#verhalten)
    - [Barrierefreiheit](#barrierefreiheit)
  - [Beispiele](#beispiele)
    - [1. Varianten](#1-varianten)
    - [2. Absatz](#2-absatz)
    - [3. Listenzeile](#3-listenzeile)
    - [4. Ohne Animation](#4-ohne-animation)

## Overview / API

### Allgemein

Die Komponente `lux-skeleton` ist ein dekorativer Lade-Platzhalter. Silhouetten werden aus den Varianten `text`, `rect` und `circle`
zusammengesetzt und ersetzen den Inhalt, solange er noch geladen wird.

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-skeleton |

### Import

Die Komponente liegt in einem eigenen Entry Point:

```typescript
import { LuxSkeletonComponent, LuxSkeletonVariant } from '@ihk-gfi/lux-components/lux-skeleton';
```

### @Input

| Name        | Typ                            | Standard | Beschreibung                                                                                                     |
| ----------- | ------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------- |
| luxVariant  | `'text' \| 'rect' \| 'circle'` | `'text'` | Form des Platzhalters.                                                                                           |
| luxWidth    | string                         |          | CSS-Länge (z. B. `120px`, `40%`); bei `circle` der Durchmesser. Ohne Angabe gilt der Standardwert der Variante.  |
| luxHeight   | string                         |          | Feste CSS-Länge (z. B. `16px`, `4em`), keine Prozentangabe (siehe unten); wird bei `circle` ignoriert.           |
| luxCount    | number                         | `1`      | Anzahl der untereinander dargestellten Platzhalter; bei `text` wird die letzte Zeile kürzer dargestellt.         |
| luxAnimated | boolean                        | `true`   | Schaltet die Puls-Animation ein oder aus. `false` eignet sich z. B. für visuelle Regressionstests.               |

Standardgrößen der Varianten:

| Variante | Breite | Höhe                  |
| -------- | ------ | --------------------- |
| text     | 100 %  | 1em                   |
| rect     | 100 %  | 4em                   |
| circle   | 2.5em  | gleich der Breite     |

### Verhalten

- `luxHeight` unterstützt nur feste Längen wie `px`, `em` oder `rem`. Eine Prozentangabe bezieht sich auf die Höhe des Elternelements.
  Da sich der Platzhalter nach seinem Inhalt richtet, gibt es diese Bezugsgröße nicht, und der Platzhalter wäre unsichtbar.
  `luxWidth` unterstützt dagegen auch Prozentangaben; bei `circle` ergibt sich die Höhe aus der Breite.
- `text` misst sich am umgebenden Font (`1em`): In einer Überschrift ist der Platzhalter automatisch so hoch wie die Überschrift.
- `luxCount > 1` rendert bei `text` die letzte Zeile kürzer (Absatz-Optik): Sie ist 60 % so breit wie die übrigen Zeilen, bezogen auf
  `luxWidth`. Werte kleiner als 1 werden als 1 behandelt.
- Die Puls-Animation respektiert `prefers-reduced-motion`; `luxAnimated=false` schaltet sie ab. Steht der Puls unerwartet still,
  zuerst die Bewegungsreduzierung des Betriebssystems prüfen (Windows: „Animationseffekte" bzw. „Animationen in Windows anzeigen").

### Barrierefreiheit

- Die Komponente trägt immer `aria-hidden="true"`, die Platzhalter sind rein dekorativ.
- Der ladende Container bekommt `aria-busy="true"`. Das Ergebnis-Feedback nach dem Laden (z. B. die Trefferanzahl) gehört zur Liste.
- Das Zusammenspiel mit Requests beschreibt der [Global Blocking State](lux‐loading-v21#global-blocking-state) des `LuxLoadingService`.
  Skeletons eignen sich vor allem für anzeigende Vorgänge (`trackBusy()`, `isBusy()`), z. B. beim Neuladen einer Liste.

## Beispiele

### 1. Varianten

Die drei Formen der Komponente: Textzeile (typografie-relativ), Rechteck und Kreis.

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐skeleton-v21-img-01.png)

Html

```html
<div class="lux-flex lux-flex-col lux-gap-4">
  <lux-skeleton luxVariant="text"></lux-skeleton>
  <lux-skeleton luxVariant="rect" luxHeight="4em"></lux-skeleton>
  <lux-skeleton luxVariant="circle" luxWidth="2.5em"></lux-skeleton>
</div>
```

### 2. Absatz

Mehrere Textzeilen über `luxCount`; die letzte Zeile ist automatisch kürzer.

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐skeleton-v21-img-02.png)

Html

```html
<lux-skeleton [luxCount]="3"></lux-skeleton>
```

### 3. Listenzeile

Silhouette für ladende Listen: Kreis plus zwei Textzeilen pro Eintrag, `aria-busy` am Container.

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐skeleton-v21-img-03.png)

Html

```html
<ul class="lux-flex lux-flex-col lux-gap-4" [attr.aria-busy]="loading.isBusy()" aria-label="Personen">
  @if (loading.isBusy()) {
    @for (row of [1, 2, 3]; track row) {
      <li class="lux-flex lux-gap-3 lux-items-center">
        <lux-skeleton luxVariant="circle" luxWidth="2.5em"></lux-skeleton>
        <div class="lux-flex-1 lux-flex lux-flex-col lux-gap-2">
          <lux-skeleton luxVariant="text" luxWidth="40%"></lux-skeleton>
          <lux-skeleton luxVariant="text"></lux-skeleton>
        </div>
      </li>
    }
  } @else {
    @for (person of persons(); track person.id) {
      <li>...</li>
    }
  }
</ul>
```

Ts

```typescript
import { LuxLoadingService } from '@ihk-gfi/lux-components/lux-loading';
import { LuxSkeletonComponent } from '@ihk-gfi/lux-components/lux-skeleton';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSkeletonComponent]
})
export class PersonListComponent {
  protected readonly loading = inject(LuxLoadingService);
  protected readonly persons = signal<Person[]>([]);

  private readonly api = inject(PersonApiService);

  reload() {
    this.api
      .loadPersons()
      .pipe(this.loading.trackBusy())
      .subscribe((persons) => this.persons.set(persons));
  }
}
```

### 4. Ohne Animation

`luxAnimated=false` schaltet die Puls-Animation ab, z. B. für visuelle Regressionstests.

Html

```html
<lux-skeleton [luxCount]="3" [luxAnimated]="false"></lux-skeleton>
```

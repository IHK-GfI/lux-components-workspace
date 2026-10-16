# luxConditional

![Beispielbild LUX-Conditional](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/luxConditional-v21-img.gif)

- [luxConditional](#luxconditional)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Verhalten](#verhalten)
    - [Animation](#animation)
    - [Ansage](#ansage)
    - [Layout](#layout)
  - [Texte](#texte)
  - [Barrierefreiheit](#barrierefreiheit)
  - [Beispiele](#beispiele)
    - [1. Einzelnes Feld](#1-einzelnes-feld)
    - [2. Mehrere Felder mit gebündelter Ansage](#2-mehrere-felder-mit-gebündelter-ansage)
    - [3. Card einblenden](#3-card-einblenden)

## Overview / API

### Allgemein

Strukturelle Direktive für bedingte Bereiche nach dem UX-Pattern "Bedingte Formularbereiche". Felder, Feldgruppen, Cards oder Hinweise,
die von einer Eingabe oder einem Zustand abhängen, erscheinen und verschwinden animiert und werden auf Wunsch Screenreadern angesagt.
Die Direktive umschließt beliebigen Inhalt; Layout und Card-Struktur bleiben bei der Anwendung.

| Name     | Beschreibung                            |
| -------- | --------------------------------------- |
| selector | luxConditional                          |
| import   | @ihk-gfi/lux-components/lux-conditional |

```typescript
import { LuxConditionalDirective } from '@ihk-gfi/lux-components/lux-conditional';
```

### @Input

| Name                   | Typ     | Beschreibung                                                                                                                                    |
| ---------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| luxConditional         | boolean | Bedingung (Pflicht). Bei `true` wird der Inhalt eingehängt, bei `false` nach der Ausblendanimation vollständig aus dem DOM entfernt.            |
| luxConditionalAnnounce | string  | Bezeichnung des Bereichs für die Screenreader-Ansage, in der Microsyntax als `announce`. In der Regel setzen; ohne Angabe gibt es keine Ansage. |

## Verhalten

| Situation                               | Verhalten                                                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Initiales Rendern mit `true`            | Der Inhalt ist sofort sichtbar, ohne Animation und ohne Ansage. Ein Formular liest beim Öffnen nichts vor.   |
| Wechsel auf `true`                      | Der Inhalt wird eingehängt und eingeblendet.                                                                 |
| Wechsel auf `false`                     | Der Inhalt wird ausgeblendet und danach aus dem DOM entfernt, also auch aus Tab-Reihenfolge und Validierung. |
| Schneller Wechsel `true → false → true` | Das ausblendende Element läuft zu Ende, danach bleibt genau ein Bereich übrig.                               |
| Fokus                                   | Kein Fokuswechsel, der Fokus bleibt auf dem auslösenden Element.                                             |

### Animation

| Phase                            | Verhalten                                                                |
| -------------------------------- | ------------------------------------------------------------------------ |
| Einblenden                       | Opacity 0 → 1, 6 px nach oben, Höhe von 0 auf Inhalt, 220 ms, abbremsend |
| Ausblenden                       | Opacity 1 → 0, 4 px nach oben, Höhe auf 0, 160 ms, beschleunigend        |
| `prefers-reduced-motion: reduce` | Einblenden nur über Opacity in 80 ms; Ausblenden sofort, ohne Animation  |

Bei reduzierter Bewegung entfällt die Ausblendanimation bewusst: Ohne Höhenanimation stünde der ausblendende Bereich kurz neben
dem neuen und das Layout würde springen.

Ob reduzierte Bewegung aktiv ist, entscheidet das Betriebssystem. Unter Windows ist sie aktiv, wenn
"Einstellungen > Barrierefreiheit > Visuelle Effekte > Animationseffekte" ausgeschaltet ist (ältere Versionen: "Animationen in Windows anzeigen"),
unter macOS bei "Bedienungshilfen > Anzeige > Bewegung reduzieren". Wer die volle Animation beim Testen nicht sieht, sollte dort zuerst nachsehen.
In den Chrome-DevTools lässt sich der Modus unter "Rendering > Emulate CSS media feature prefers-reduced-motion" umschalten.

Die Animation nutzt `animate.enter` und `animate.leave` aus `@angular/core`, nicht das veraltete `@angular/animations`.
Der Bereich wird als Einheit animiert, nicht Feld für Feld.

### Ansage

Ist `announce` gesetzt, wird das Erscheinen und Verschwinden über eine `polite` Live-Region (CDK `LiveAnnouncer`) angesagt.
Bereiche, die in derselben Änderung erscheinen oder verschwinden, ergeben eine gemeinsame Ansage, zum Beispiel
"Eingeblendet: Fachrichtung, Prüfungsort". Sind beide Fälle betroffen, ergibt das eine Meldung, erst die eingeblendeten,
dann die ausgeblendeten Bereiche, zum Beispiel "Eingeblendet: Tätigkeit. Ausgeblendet: Arbeitgeber, Eintrittsdatum".

`announce` ist die Bezeichnung, unter der Nutzer den Bereich wiederfinden: bei einem Feld dessen `luxLabel`, bei einer Card
deren Titel, bei einem Hinweis ein kurzes Stichwort. Die Ansagetexte sind bewusst allgemein gehalten und passen für jede Art
von Inhalt.

Die Direktive kann die Bezeichnung nicht selbst ermitteln, weil sie beliebigen Inhalt umschließt. Deshalb muss die Anwendung sie
angeben. Ohne `announce` zu arbeiten ist nur sinnvoll, wenn der Wechsel bereits anders angesagt wird, zum Beispiel wenn der
eingeblendete Inhalt eine eigene Live-Region hat (etwa eine `lux-message-box`) oder der Auslöser seinen Zustand selbst kommuniziert
(etwa ein Button mit `aria-expanded`). Sonst gäbe es doppelte Ansagen.

### Layout

Die Direktive erzeugt das Element `lux-conditional` (`display: contents`) mit einem Panel `div.lux-conditional__panel`, in dem der Inhalt liegt.
Das Panel hat keine eigenen Abstände. Innerhalb einer Flex-Zeile ist das Panel das Flex-Item; soll es den Platz eines Feldes
einnehmen, braucht es eine passende Regel der Anwendung, zum Beispiel:

```scss
.meine-zeile > lux-conditional > .lux-conditional__panel {
  flex: 1;
  min-width: 0;
}
```

In einer Flex-Zeile ist die Höhenanimation nicht sichtbar, weil die Nachbarn die Zeilenhöhe halten; Opacity und Bewegung wirken trotzdem.

## Texte

Die Ansagetexte kommen aus den LUX-Übersetzungen (`luxc-de.json`, `luxc-en.json`) und können in der Applikation überschrieben werden.
`{{labels}}` ist die kommagetrennte Liste der Bezeichnungen.

| Key                     | Deutsch                  |
| ----------------------- | ------------------------ |
| luxc.conditional.shown  | Eingeblendet: {{labels}} |
| luxc.conditional.hidden | Ausgeblendet: {{labels}} |

Wer andere Formulierungen braucht, überschreibt die beiden Keys in den Übersetzungen der Applikation.

## Barrierefreiheit

- Ansage über eine `polite` Live-Region, gebündelt pro Änderung.
- Kein automatischer Fokuswechsel in den neuen Bereich.
- Ausgeblendete Bereiche sind aus dem DOM entfernt, also weder in der Tab-Reihenfolge noch für Screenreader erreichbar.
- Bewegung respektiert `prefers-reduced-motion`.
- Ob ein bedingter Bereich in derselben Card bleibt oder eine eigene Card mit Überschrift bekommt, entscheidet die Anwendung.
  Die Direktive umschließt in beiden Fällen den gesamten Bereich.

## Beispiele

### 1. Einzelnes Feld

```html
<lux-input-ac *luxConditional="showDetails(); announce: 'Arbeitgeber'" luxLabel="Arbeitgeber"></lux-input-ac>
```

### 2. Mehrere Felder mit gebündelter Ansage

Beide Felder erscheinen in derselben Änderung; angesagt wird einmal "Eingeblendet: Arbeitgeber, Eintrittsdatum".

Html

```html
<lux-radio-ac luxLabel="Beschäftigung" [luxOptions]="employmentOptions" [(luxSelected)]="employment"></lux-radio-ac>

<lux-input-ac *luxConditional="isEmployed(); announce: 'Arbeitgeber'" luxLabel="Arbeitgeber"></lux-input-ac>
<lux-input-ac *luxConditional="isEmployed(); announce: 'Eintrittsdatum'" luxLabel="Eintrittsdatum"></lux-input-ac>
```

Ts

```typescript
import { Component, computed, signal } from '@angular/core';
import { LuxInputAcComponent, LuxRadioAcComponent } from '@ihk-gfi/lux-components';
import { LuxConditionalDirective } from '@ihk-gfi/lux-components/lux-conditional';

@Component({
  selector: 'app-beschaeftigung',
  imports: [LuxConditionalDirective, LuxInputAcComponent, LuxRadioAcComponent],
  templateUrl: './beschaeftigung.component.html'
})
export class BeschaeftigungComponent {
  employmentOptions = ['Angestellt', 'Selbstständig', 'Keine Angabe'];
  employment = signal('Keine Angabe');
  isEmployed = computed(() => this.employment() === 'Angestellt');
}
```

### 3. Card einblenden

Die Direktive funktioniert an beliebigen Elementen und Komponenten, hier an einer `lux-card` mit mehreren Feldern.
Die Card wird als Ganzes animiert.

```html
<lux-checkbox-ac luxLabel="Abweichende Rechnungsadresse" [(luxChecked)]="differentBillingAddress"></lux-checkbox-ac>

<lux-card *luxConditional="differentBillingAddress(); announce: 'Rechnungsadresse'" luxTitle="Rechnungsadresse">
  <lux-card-content>
    <lux-input-ac luxLabel="Straße und Hausnummer"></lux-input-ac>
    <lux-input-ac luxLabel="PLZ"></lux-input-ac>
    <lux-input-ac luxLabel="Ort"></lux-input-ac>
  </lux-card-content>
</lux-card>
```

# LUX-Button

![Beispielbild LUX-Button](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐button-v14-img.png)

- [LUX-Button](#lux-button)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Styleguide](#styleguide)
  - [Beispiele](#beispiele)
    - [1. Normale Buttons](#1-normale-buttons)
    - [2. Raised Buttons](#2-raised-buttons)
    - [3. Buttons mit Icons](#3-buttons-mit-icons)
    - [4. Runde Buttons](#4-runde-buttons)
  - [Zusatzinformationen](#zusatzinformationen)
    - [Konfigurationsoptionen](#konfigurationsoptionen)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxActionModule |
| selector | lux-button      |

### @Input

| Name                  | Typ                             | Beschreibung                                                                                                                                                                                              |
| --------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxType               | 'button' \| 'reset' \| 'submit' | Bestimmt den Typ des Buttons, das bestimmt ob in einem ReactiveForm der jeweilige "submit" oder "reset" bzw. kein Form-Event ausgestoßen wird ("button"). Mögliche Werte: "submit", "reset", "button"     |
| luxLabel              | string                          | Bestimmt das Label, welches in dieser Component angezeigt werden soll.                                                                                                                                    |
| luxColor              | LuxThemePalette                 | Diese Property definiert die Farben der Component.                                                                                                                                                        |
| luxRaised             | boolean                         | Gibt an, ob der Button hervorgehoben wird.                                                                                                                                                                |
| luxStroked            | boolean                         | Gibt an, ob der Button eine Outline erhält.                                                                                                                                                               |
| luxIconName           | string                          | Name des Font-Awesome oder Material Icons.                                                                                                                                                                |
| luxIconShowRight      | boolean                         | Gibt an, ob das Icon rechts angezeigt wird.                                                                                                                                                               |
| luxTagId              | string                          | [LUX-Tag-Id](luxTagId-v14#direkte-konfiguration) für die automatischen Tests.                                                                                                                             |
| luxDisabled           | boolean                         | Gibt an, ob das Element deaktiviert ist.                                                                                                                                                                  |
| luxRounded            | boolean                         | Gibt an, ob ein runder Button verwendet werden soll.                                                                                                                                                      |
| luxIconAlignWithLabel | boolean                         | Entfernt die vertikale Zentrierung des Icons, so dass es mit dem Label ausgerichtet ist.                                                                                                                  |
| luxThrottleTime       | number                          | Verhindert, dass ein Button mehrfach hinter einander ausgelöst wird. Über diese Property kann mann den Standardwert aus der [Config - buttonConfiguration](config-v14#buttonConfiguration) überschreiben. |
| luxButtonBadge        | string                          | Text der in einer Badge hinter dem Label in einem Lux-Button angezeigt werden kann. Die maximale Länge beträgt vier Zeichen und wird bei Überlänge automatisch mit Ellipsis '...' abgeschnitten.          |
| luxButtonBadgeColor   | LuxThemePalette                 | Farbe der ButtonBadge, die analog zur Button-Farbe gewählt werden kann. Mögliche Werte: "primary", "accent", "warn".                                                                                      |

### @Output

| Name          | Typ                    | Beschreibung                                                                                                                                    |
| ------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| luxClicked    | EventEmitter \<Event\> | Event welches beim Klick auf den primären Button ausgelöst wird und einen Clicked-Event als Parameter enthält.                                  |
| luxAuxClicked | EventEmitter \<Event\> | Event welches beim Klick auf einen anderen Mausbutton als dem primären Mausbutton ausgelöst wird und einen Clicked-Event als Parameter enthält. |

## Styleguide

Grundlegende Regeln zum Umgang mit buttons sind:

- Der erste Buchstabe der Buttonbeschriftung wird immer groß geschrieben. Danach folgen Kleinbuchstaben.
- Lange Buttonbezeichnungen sind unschön und verursachen in der mobilen Darstellung Probleme. Daher soll die Buttonbezeichnung 25 Zeichen nicht überschreiten.
- Da es schwierig ist für alle Anwendungsfälle passende Richtlinien zur Button-Benennung festzulegen, soll darauf geachtet werden, dass Buttonbezeichnungen möglichst kurz und verständlich gehalten werden. Z.B. "Übersicht" anstatt "Zur Übersicht Abfragen".
- Die Beschriftung für sonstige Buttons soll maximal aus zwei Wörtern bestehen und der Struktur 'Nomen' + 'Verb' folgen. Z.B. "Artikel löschen". Wobei das 'Nomen' als optional zu betrachten ist und nur Verwendung findet, wenn es dem Sachzusammenhang dienlich ist. Ist dies nicht der Fall, wird als Buttonbeschriftung nur "Löschen" verwendet.
- Die Reihenfolge (und Beschriftung) für Standard-Buttons soll wie folgt eingehalten werden. "Speichern" -> rechts und "Abbrechen" -> links.
- Buttons sollen nicht im "freien Raum" hängen, sondern immer z.B. in einer Card bzw. dem Action-Bereich angesiedelt sein.
- Aufgrund der Reduzierung der Mauswege im Rahmen der UX und der Barrierefreiheit sollen Buttons unten links angeordnet sein.
- _Die Art der Buttons muss noch definiert werden..._

## Beispiele

### 1. Normale Buttons

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐button-v14-img-01.png)

Ts

```typescript
onClick(label: string) {
  console.log(label);
}
```

Html

```html
<lux-button
  [luxRaised]="false"
  luxLabel="Lorem ohne"
  (luxClicked)="onClick('Lorem ohne')"
></lux-button>
<lux-button
  [luxRaised]="false"
  luxLabel="Lorem primary"
  (luxClicked)="onClick('Lorem primary')"
  luxColor="primary"
></lux-button>
<lux-button
  [luxRaised]="false"
  luxLabel="Lorem warn"
  (luxClicked)="onClick('Lorem warn')"
  luxColor="warn"
></lux-button>
<lux-button
  [luxRaised]="false"
  luxLabel="Lorem accent"
  (luxClicked)="onClick('Lorem accent')"
  luxColor="accent"
></lux-button>
```

### 2. Raised Buttons

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐button-v14-img-02.png)

Ts

```typescript
onClick(label: string) {
  console.log(label);
}
```

Html

```html
<div fxLayout="row" fxLayoutGap="10px">
  <lux-button
    [luxRaised]="true"
    luxLabel="Lorem ohne"
    (luxClicked)="onClick('Lorem ohne')"
  ></lux-button>
  <lux-button
    [luxRaised]="true"
    luxLabel="Lorem primary"
    (luxClicked)="onClick('Lorem primary')"
    luxColor="primary"
  ></lux-button>
  <lux-button
    [luxRaised]="true"
    luxLabel="Lorem warn"
    (luxClicked)="onClick('Lorem warn')"
    luxColor="warn"
  ></lux-button>
  <lux-button
    [luxRaised]="true"
    luxLabel="Lorem accent"
    (luxClicked)="onClick('Lorem accent')"
    luxColor="accent"
  ></lux-button>
</div>
```

### 3. Buttons mit Icons

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐button-v14-img-03.png)

Ts

```typescript
onClick(label: string) {
  console.log(label);
}
```

Html

```html
<div fxLayout="row" fxLayoutGap="10px">
  <lux-button
    luxIconName="lux-save"
    [luxRaised]="true"
    luxLabel="Lorem ohne"
    (luxClicked)="onClick('Lorem ohne')"
  ></lux-button>
  <lux-button
    luxIconName="lux-save"
    [luxRaised]="true"
    luxLabel="Lorem primary"
    luxColor="primary"
    (luxClicked)="onClick('Lorem primary')"
  ></lux-button>
  <lux-button
    luxIconName="lux-save"
    [luxRaised]="true"
    luxLabel="Lorem warn"
    luxColor="warn"
    (luxClicked)="onClick('Lorem warn')"
  ></lux-button>
  <lux-button
    luxIconName="lux-save"
    [luxRaised]="true"
    luxLabel="Lorem accent"
    luxColor="accent"
  >
    (luxClicked)="onClick('Lorem accent')"</lux-button
  >
</div>
```

### 4. Runde Buttons

![Beispielbild 04](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐button-v14-img-04.png)

Ts

```typescript
onClick(label: string) {
  console.log(label);
}
```

Html

```html
<div fxLayout="row" fxLayoutGap="10px">
  <lux-button
    luxIconName="lux-interface-user-single"
    [luxRounded]="true"
    (luxClicked)="onClick('1')"
  ></lux-button>
  <lux-button
    luxIconName="lux-interface-user-single"
    luxColor="primary"
    [luxRounded]="true"
    (luxClicked)="onClick('2')"
  ></lux-button>
  <lux-button
    luxIconName="lux-interface-user-single"
    luxColor="warn"
    [luxRounded]="true"
    (luxClicked)="onClick('3')"
  ></lux-button>
  <lux-button
    luxIconName="lux-interface-user-single"
    luxColor="accent"
    [luxRounded]="true"
    (luxClicked)="onClick('3')"
  ></lux-button>
</div>
```

## Zusatzinformationen

### Konfigurationsoptionen

Durch Nutzung der [LUX-Components-Config](config-v14) kann für diese Component bestimmt werden, dass der Text immer in Großbuchstaben ausgegeben wird.
Will man die LuxButtons als Ausnahmen für die Ausgabe in Großbuchstaben hinzufügen, muss der Selektor "lux-button" dem Config-Module übergeben werden.

Standardmäßig werden die Texte der Buttons immer in Großbuchstaben angezeigt.

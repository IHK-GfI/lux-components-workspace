# LUX-Card

![Beispielbild LUX-Card](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐card-v14-img.png)

- [LUX-Card](#lux-card)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxIconComponent](#luxiconcomponent)
    - [LuxCardInfoComponent](#luxcardinfocomponent)
    - [LuxCardContentComponent](#luxcardcontentcomponent)
    - [LuxCardContentExpandedComponent](#luxcardcontentexpandedcomponent)
    - [LuxCardActionsComponent](#luxcardactionscomponent)
  - [Styleguide](#styleguide)
  - [Beispiele](#beispiele)
    - [1. Simple Card](#1-simple-card)
    - [2. Card mit Actions](#2-card-mit-actions)
    - [3. Erweiterbare Card](#3-erweiterbare-card)
    - [4. Dynamische Actions](#4-dynamische-actions)
    - [5. Layout mit Cards](#5-layout-mit-cards)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxLayoutModule |
| selector | lux-card        |

### @Input

| Name              | Typ           | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTitle          | string        | Titel der Card.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| luxSubTitle       | string        | Subtitel der Card                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| luxDisabled       | boolean       | Gibt an, ob die Card angeklickt werden kann.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| luxTagId          | string        | [LUX-Tag-Id](luxTagId-v14#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| luxTitleLineBreak | boolean       | Boolean-Flag der bestimmt, ob die Titel und Untertitel der LuxCards beim überschreiten der Breite mit "..." verkürzt oder mit Umbrüchen angezeigt werden.                                                                                                                                                                                                                                                                                                                                                                                                           |
| luxExpanded       | boolean       | Bestimmt, ob die Card aktuell ausgeklappt ist oder nicht.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| luxUseTabIndex    | boolean       | Bestimmt, ob die Card einen Tabindex setzt, wenn die Card angeklickt werden kann. (siehe luxClicked)                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| luxHeading        | number (1..6) | Bestimmt, welches Überschriften-Tag (h1...h6) für den luxTitle verwendet wird. <br><br> Die Darstellung einer LUX-Card ist fest definiert und sollte überall gleich aussehen. Das man die Überschriften (h1,...h6) ändern kann, zielt nicht auf die Darstellung ab, sondern auf die Struktur der App (Stichwort: Barrierefreiheit). Eine HTML-Seite muss in ihren Überschriften vollständig korrekt strukturiert sein und dafür kann es nötig werden, dass die LUX-Cards ein anderes Überschriftenlevel benötigen, da sonst z.B. Screenreader ein Problem bekommen. |

### @Output

| Name              | Typ                     | Beschreibung                                                                                                               |
| ----------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| luxClicked        | EventEmitter \<Event>   | Event, wenn auf einen Eintrag geklickt wird. Besitzt keine Event-Payload.                                                  |
| luxExpandedChange | EventEmitter \<boolean> | Event, welches beim Ein- und Ausklappen der Card ausgelöst wird. Enthält als Event-Payload den aktuellen luxExpanded-Wert. |
| luxAfterExpansion | EventEmitter \<void>    | Event, welches nach dem Ende der Ein- bzw. Ausklappanimation der Card ausgelöst wird.                                      |

## Components

### LuxIconComponent

Das LuxIconComponent kann über Content-Projection eingebunden werden und wird dann links vom Titel angezeigt.

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-icon     |

### LuxCardInfoComponent

Die LuxCardInfoComponent kann einen beliebigen (jedoch am Besten kleinen Content) besitzen und wird rechts neben dem Titel angezeigt.

| Name     | Beschreibung  |
| -------- | ------------- |
| selector | lux-card-info |

### LuxCardContentComponent

Die LuxCardContentComponent enthält den eigentlichen Inhalt der Card und wird unterhalb der Titelzeile angezeigt.

| Name     | Beschreibung     |
| -------- | ---------------- |
| selector | lux-card-content |

### LuxCardContentExpandedComponent

Enthält erweiterten Inhalt. Wenn man diesen Selector einer LUX-CARD hinzufügt, dann wird oben rechts ein Pfeil-Button eingeblendet.
Über diesen Button kann die Karte auf- und zugeklappt werden und neuer Inhalt unterhalb des eigentlichen LuxCardContentComponents dargestellt werden.

Wenn diese Component zu einer Card hinzugefügt wird, wird keine LuxCardInfoComponent angezeigt.

| Name     | Beschreibung              |
| -------- | ------------------------- |
| selector | lux-card-content-expanded |

### LuxCardActionsComponent

Diese Component kann dazu benutzt werden, etwaige Buttons (lux-button) oder Links (lux-link) darzustellen.
Diese werden unterhalb der LuxCardContentComponent dargestellt.

| Name     | Beschreibung     |
| -------- | ---------------- |
| Selector | lux-card-actions |

## Styleguide

Grundlegende Regeln zum Umgang mit Cards sind:

- Cards mit wenig Informationen in der Desktopansicht nebeneinander darstellen.
- Kein Schachteln von Cards
- Schaltflächen, die sich auf Inhalte z.B. einer lux-card beziehen, sollen auch innerhalb der Card untergebracht sein.
- Nebeneinander angezeigte Cards müssen die gleiche Höhe haben. Alternativ kann um die Höhe anzugleichen die Breite variiert werden, soweit sich dann nach unten kein Flatterbild entwickelt. Responsive Design beachten!
- Vertikal untereinander angeordnete Cards sollen exakt die gleiche Breite haben. Also generell bündig. Und immer den gesamten Platz ausfüllen, den das umgebende DIV bereit hält.

## Beispiele

### 1. Simple Card

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐card-v14-img-01.png)

Ts

```typescript
onClick() {
  console.log('card clicked');
}
```

Html

```html
<lux-card luxTitle="Title" luxSubTitle="Subtitle" (luxClicked)="onClick()">
  <lux-icon luxIconName="fa-id-card"></lux-icon>
  <lux-card-info>
    <lux-icon luxIconName="fa-cogs"></lux-icon>
  </lux-card-info>
  <lux-card-content>
    <p>Lorem Ipsum Content</p>
  </lux-card-content>
</lux-card>
```

### 2. Card mit Actions

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐card-v14-img-02.png)

Html

```html
<lux-card luxTitle="Title" luxSubTitle="Subtitle">
  <lux-card-content>
    <p>Lorem Ipsum Content</p>
  </lux-card-content>
  <lux-card-actions>
    <lux-link
      luxLabel="http://www.gfi.ihk.de"
      [luxRaised]="true"
      luxColor="accent"
    ></lux-link>
    <lux-button
      luxLabel="OK"
      [luxRaised]="true"
      luxColor="primary"
    ></lux-button>
  </lux-card-actions>
</lux-card>
```

### 3. Erweiterbare Card

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐card-v14-img-03.gif)

Html

```html
<lux-card luxTitle="Lorem ipsum dolor sit amet">
  <lux-card-content>
    <div fxLayout="column" class="lux-flex-layout-gap-10">
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      </p>
    </div>
  </lux-card-content>
  <lux-card-content-expanded>
    <div fxLayout="column">
      Expanded example text.
      <p>
        <lux-input luxLabel="At vero"></lux-input>
        <lux-input luxLabel="Stet clita"></lux-input>
      </p>
    </div>
  </lux-card-content-expanded>
</lux-card>
```

### 4. Dynamische Actions

![Beispielbild 04-01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐card-v14-img-04-01.png)
![Beispielbild 04-02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐card-v14-img-04-02.png)

Die Actions werden je nach Platz im Menü versteckt.

Html

```html
<lux-card luxTitle="Lorem ipsum dolor sit amet">
  <lux-card-content>
    <p>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
    </p>
  </lux-card-content>
  <lux-card-actions fxFill>
    <lux-menu
      luxMenuIconName="fa-ellipsis-v"
      [luxDisplayExtended]="true"
      [luxDisplayMenuLeft]="false"
    >
      <lux-menu-item
        luxLabel="Aktion 4"
        luxIconName="fa-user"
        [luxAlwaysVisible]="false"
        [luxRaised]="true"
      ></lux-menu-item>
      <lux-menu-item
        luxLabel="Aktion 3"
        luxIconName="fa-car"
        [luxAlwaysVisible]="false"
        [luxRaised]="true"
      ></lux-menu-item>
      <lux-menu-item
        luxLabel="Aktion 2"
        luxIconName="fa-minus"
        [luxAlwaysVisible]="false"
        [luxRaised]="true"
      ></lux-menu-item>
      <lux-menu-item
        luxLabel="Aktion 1"
        luxIconName="fa-plus"
        [luxAlwaysVisible]="true"
        [luxRaised]="true"
        luxColor="primary"
      ></lux-menu-item>
    </lux-menu>
  </lux-card-actions>
</lux-card>
```

### 5. Layout mit Cards

![Beispielbild 05](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐card-v14-img-05.png)

Details stehen auf der Seite [lux‐layout‐card‐row](lux‐layout‐card‐row-v14).

Html

```html
<lux-layout-card-row>
  <!-- Card #0 -->
  <lux-card
    luxTitle="Lorem ipsum"
    *luxLayoutRowItem="{}"
    luxSubTitle="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy"
  >
    <lux-icon fxHide.lt-md="true" luxIconName="fa-house"></lux-icon>
    <lux-card-content></lux-card-content>
    <lux-card-actions>
      <lux-button luxLabel="ut labore" [luxRaised]="true"></lux-button>
      <lux-button luxLabel="et dolore" [luxRaised]="true"></lux-button>
    </lux-card-actions>
  </lux-card>
  <!-- Card #1 -->
  <lux-card
    luxTitle="Stet clita"
    *luxLayoutRowItem="{}"
    luxSubTitle="Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
  >
    <lux-icon fxHide.lt-md="true" luxIconName="fa-user"></lux-icon>
    <lux-card-content>
      <lux-toggle luxLabel="Lorem ipsum dolor sit"></lux-toggle>
      <lux-toggle luxLabel="Sed diam nonumy"></lux-toggle>
    </lux-card-content>
    <lux-card-actions>
      <lux-button luxLabel="eirmod tempor"></lux-button>
    </lux-card-actions>
  </lux-card>
</lux-layout-card-row>

<lux-layout-card-row>
  <!-- Card #2 -->
  <lux-card
    luxTitle="At vero"
    *luxLayoutRowItem="{}"
    luxSubTitle="At vero eos et accusam et justo duo dolores et ea rebum"
  >
    <lux-icon fxHide.lt-md="true" luxIconName="fa-car"></lux-icon>
    <lux-card-content>
      <lux-toggle luxLabel="Stet clita kasd gubergren"></lux-toggle>
    </lux-card-content>
  </lux-card>
  <!-- Card #3 -->
  <lux-card
    luxTitle="No sea"
    *luxLayoutRowItem="{}"
    luxSubTitle="Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet"
  >
    <lux-icon fxHide.lt-md="true" luxIconName="fa-cogs"></lux-icon>
    <lux-card-content>
      <lux-toggle luxLabel="Stet clita kasd gubergren"></lux-toggle>
      <lux-toggle luxLabel="No sea"></lux-toggle>
      <lux-toggle luxLabel="Takimata sanctus"></lux-toggle>
      <lux-toggle luxLabel="Est Lorem ipsum"></lux-toggle>
      <div fxLayout="row wrap" class="lux-flex-layout-gap-10">
        <lux-input luxLabel="Dolor sit amet" class="title-input"></lux-input>
        <lux-input luxLabel="Lorem ipsum dolor" class="title-input"></lux-input>
      </div>
    </lux-card-content>
    <lux-card-actions>
      <lux-button
        luxLabel="dolor sit amet"
        [luxRaised]="true"
        luxColor="primary"
      ></lux-button>
    </lux-card-actions>
  </lux-card>
</lux-layout-card-row>
```

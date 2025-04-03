# LUX-Card

![Beispielbild LUX-Card](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐card-v18-img.png)

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
| selector | lux-card        |

### @Input

| Name               | Typ           | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTitle           | string        | Titel der Card.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| luxTitleTooltip    | string        | Titeltooltipp der Card.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| luxSubTitle        | string        | Subtitel der Card                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| luxSubTitleTooltip | string        | Subtiteltooltip der Card                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| luxDisabled        | boolean       | Gibt an, ob die Card angeklickt werden kann.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| luxTagId           | string        | [LUX-Tag-Id](luxTagId-v18#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| luxTitleLineBreak  | boolean       | Boolean-Flag der bestimmt, ob die Titel und Untertitel der LuxCards beim überschreiten der Breite mit "..." verkürzt oder mit Umbrüchen angezeigt werden.                                                                                                                                                                                                                                                                                                                                                                                                           |
| luxExpanded        | boolean       | Bestimmt, ob die Card aktuell ausgeklappt ist oder nicht.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| luxUseTabIndex     | boolean       | Bestimmt, ob die Card einen Tabindex setzt, wenn die Card angeklickt werden kann. (siehe luxClicked)                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| luxHeading         | number (1..6) | Bestimmt, welches Überschriften-Tag (h1...h6) für den luxTitle verwendet wird. <br><br> Die Darstellung einer LUX-Card ist fest definiert und sollte überall gleich aussehen. Das man die Überschriften (h1,...h6) ändern kann, zielt nicht auf die Darstellung ab, sondern auf die Struktur der App (Stichwort: Barrierefreiheit). Eine HTML-Seite muss in ihren Überschriften vollständig korrekt strukturiert sein und dafür kann es nötig werden, dass die LUX-Cards ein anderes Überschriftenlevel benötigen, da sonst z.B. Screenreader ein Problem bekommen. |

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

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐card-v18-img-01.png)

Ts

```typescript
onClick() {
  console.log('card clicked');
}
```

Html

```html
<lux-card luxTitle="Title" luxSubTitle="Subtitle" (luxClicked)="onClick()">
  <lux-icon luxIconName="lux-id-card"></lux-icon>
  <lux-card-info>
    <lux-icon luxIconName="lux-cogs"></lux-icon>
  </lux-card-info>
  <lux-card-content>
    <p>Lorem Ipsum Content</p>
  </lux-card-content>
</lux-card>
```

### 2. Card mit Actions

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐card-v18-img-02.png)

Html

```html
<lux-card luxTitle="Title" luxSubTitle="Subtitle">
  <lux-card-content>
    <p>Lorem Ipsum Content</p>
  </lux-card-content>
  <lux-card-actions>
    <lux-link
      luxLabel="http://www.gfi.ihk.de"
      [luxFlat]="true"
      luxColor="accent"
    ></lux-link>
    <lux-button luxLabel="OK" [luxFlat]="true" luxColor="primary"></lux-button>
  </lux-card-actions>
</lux-card>
```

### 3. Erweiterbare Card

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐card-v18-img-03.png)

Html

```html
<lux-card luxTitle="Lorem ipsum dolor sit amet">
  <lux-card-content>
    <div class="lux-flex lux-flex-col lux-gap-5">
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      </p>
    </div>
  </lux-card-content>
  <lux-card-content-expanded>
    <div class="lux-flex lux-flex-col lux-gap-5">
      Expanded example text.
      <p>
        <lux-input-ac luxLabel="At vero"></lux-input-ac>
        <lux-input-ac luxLabel="Stet clita"></lux-input-ac>
      </p>
    </div>
  </lux-card-content-expanded>
</lux-card>
```

### 4. Dynamische Actions

![Beispielbild 04-01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐card-v18-img-04-01.png)
![Beispielbild 04-02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐card-v18-img-04-02.png)

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
  <lux-card-actions>
    <lux-menu
      luxMenuIconName="lux-interface-setting-menu-vertical"
      [luxDisplayExtended]="true"
      [luxDisplayMenuLeft]="false"
    >
      <lux-menu-item
        luxLabel="Aktion 2"
        luxIconName="lux-interface-remove-1"
        [luxAlwaysVisible]="false"
        [luxRaised]="false"
        [luxFlat]="true"
      ></lux-menu-item>
      <lux-menu-item
        luxLabel="Aktion 3"
        luxIconName="lux-car"
        [luxAlwaysVisible]="false"
        [luxRaised]="false"
        [luxFlat]="true"
      ></lux-menu-item>
      <lux-menu-item
        luxLabel="Aktion 4"
        luxIconName="lux-interface-user-single"
        [luxAlwaysVisible]="false"
        [luxRaised]="false"
        [luxFlat]="true"
      ></lux-menu-item>
      <lux-menu-item
        luxLabel="Aktion 1"
        luxIconName="lux-interface-add-1"
        [luxAlwaysVisible]="true"
        [luxRaised]="false"
        [luxFlat]="true"
        luxColor="primary"
      ></lux-menu-item>
    </lux-menu>
  </lux-card-actions>
</lux-card>
```

### 5. Layout mit Cards

![Beispielbild 05](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐card-v18-img-05.png)

Html

```html
<div class="lux-grid lux-grid-cols-2 lux-gap-4">
  <lux-card
    class="lux-flex lux-flex-auto"
    luxTitle="Lorem ipsum"
    luxSubTitle="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy"
  >
    <lux-icon
      class="lt-md:lux-display-none"
      luxIconName="lux-home-1"
    ></lux-icon>
    <lux-card-content></lux-card-content>
    <lux-card-actions>
      <lux-button luxLabel="ut labore" [luxStroked]="true"></lux-button>
      <lux-button luxLabel="et dolore" [luxStroked]="true"></lux-button>
    </lux-card-actions>
  </lux-card>
  <lux-card
    class="lux-flex lux-flex-auto"
    luxTitle="Stet clita"
    luxSubTitle="Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
  >
    <lux-icon
      class="lt-md:lux-display-none"
      luxIconName="lux-interface-user-human"
    ></lux-icon>
    <lux-card-content>
      <lux-toggle-ac
        luxLabel="Lorem ipsum dolor sit"
        [luxNoLabels]="true"
      ></lux-toggle-ac>
      <lux-toggle-ac
        luxLabel="Sed diam nonumy"
        [luxNoLabels]="true"
      ></lux-toggle-ac>
    </lux-card-content>
    <lux-card-actions>
      <lux-button luxLabel="eirmod tempor"></lux-button>
    </lux-card-actions>
  </lux-card>
  <lux-card
    class="lux-flex lux-flex-auto"
    luxTitle="At vero"
    luxSubTitle="At vero eos et accusam et justo duo dolores et ea rebum"
  >
    <lux-icon class="lt-md:lux-display-none" luxIconName="lux-car"></lux-icon>
    <lux-card-content>
      <lux-toggle-ac luxLabel="Stet clita kasd gubergren"></lux-toggle-ac>
    </lux-card-content>
  </lux-card>
  <lux-card
    class="lux-flex lux-flex-auto"
    luxTitle="No sea"
    luxSubTitle="Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet"
  >
    <lux-icon class="lt-md:lux-display-none" luxIconName="lux-cogs"></lux-icon>
    <lux-card-content>
      <lux-toggle-ac
        luxLabel="Stet clita kasd gubergren"
        [luxNoLabels]="true"
      ></lux-toggle-ac>
      <lux-toggle-ac luxLabel="No sea" [luxNoLabels]="true"></lux-toggle-ac>
      <lux-toggle-ac
        luxLabel="Takimata sanctus"
        [luxNoLabels]="true"
      ></lux-toggle-ac>
      <lux-toggle-ac
        luxLabel="Est Lorem ipsum"
        [luxNoLabels]="true"
      ></lux-toggle-ac>
      <div class="lux-flex lux-gap-4">
        <lux-input-ac
          luxLabel="Dolor sit amet"
          class="title-input"
        ></lux-input-ac>
        <lux-input-ac
          luxLabel="Lorem ipsum dolor"
          class="title-input"
        ></lux-input-ac>
      </div>
    </lux-card-content>
    <lux-card-actions>
      <lux-button
        luxLabel="dolor sit amet"
        [luxFlat]="true"
        luxColor="primary"
      ></lux-button>
    </lux-card-actions>
  </lux-card>
</div>
```

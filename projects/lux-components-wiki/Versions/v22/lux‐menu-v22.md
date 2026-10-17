# LUX-Menu

![Beispielbild LUX-Menu](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐menu-v22-img.png)

- [LUX-Menu](#lux-menu)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxMenuItemComponent](#luxmenuitemcomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
      - [@Output](#output-1)
    - [LuxMenuPanelHeaderComponent](#luxmenupanelheadercomponent)
      - [@Input](#input-2)
    - [LuxMenuSectionTitleComponent](#luxmenusectiontitlecomponent)
      - [@Input](#input-3)
  - [Beispiele](#beispiele)
    - [1. Einfaches Menü](#1-einfaches-menü)
    - [2. Extendedmenü (linksbündig)](#2-extendedmenü-linksbündig)
    - [3. Extendedmenü (rechtsbündig)](#3-extendedmenü-rechtsbündig)
    - [4. Menü mit Sektionen](#4-menü-mit-sektionen)
    - [5. Großes Menü mit Sektionen](#5-großes-menü-mit-sektionen)
  - [Zusatzinformationen](#zusatzinformationen)
    - [Konfigurationsoptionen](#konfigurationsoptionen)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-menu     |

### @Input

| Name                        | Typ     | Beschreibung                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxMenuIconName             | string  | Ein Iconname (z.B. "lux-interface-user-single"). Default: 'lux-interface-setting-menu-1'.                                                                                                                                                                                                                                                                          |
| luxTagId                    | string  | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                      |
| luxDisplayMenuLeft          | boolean | Bestimmt die Anordnung von Menü-Button und horizontaler Navigation (siehe luxDisplayExtended): Bei true stehen die Einträge der horizontalen Navigation links und der Menü-Button rechts davon, bei false steht der Menü-Button links. Default: true.                                                                                                              |
| luxDisplayExtended          | boolean | Bestimmt, ob nicht nur das normale Menu (ausklappbar über einen Button), sondern auch eine horizontale Navigation angeboten wird. Default: false.                                                                                                                                                                                                                  |
| luxMaximumExtended          | number  | Bestimmt, wie viele Elemente maximal in der horizontalen Navigation dargestellt werden können. Default: 5.                                                                                                                                                                                                                                                         |
| luxClassName                | string  | Ermöglicht es, dem Menu eigene CSS-Klassen mitzugeben (nützlich, wenn man das Styling nachträglich anpassen möchte). Default: ''.                                                                                                                                                                                                                                  |
| luxAriaMenuTriggerLabel     | string  | Aria-Label für den Menütriggerbutton. Default: ''.                                                                                                                                                                                                                                                                                                                 |
| luxToggleDisabled           | boolean | Deaktiviert den Menü-Button. Default: false.                                                                                                                                                                                                                                                                                                                       |
| luxMenuLabel                | string  | Label für den Menütriggerbutton. Tipp, man kann das Icon mit 'luxMenuIconName=""' ausblenden, damit nur das Label sichtbar ist. Default: ''.                                                                                                                                                                                                                       |
| luxMenuTriggerIconShowRight | boolean | Gibt an, ob das Icon im Menü-Button rechts vom Label (luxMenuLabel) angezeigt wird. Default: false.                                                                                                                                                                                                                                                                |
| luxMenuItemFixWidth         | number  | Über diese Property kann die Menüitembreite fix gesetzt werden. Normalerweise wird die Breite dynamisch berechnet, aber wenn z.B. das Menü ausschließlich aus einheitlichen Buttons besteht, kann man die Berechnung einsparen. Default: 0 (dynamische Berechnung).                                                                                                |
| luxShowSections             | boolean | Diese Property gibt an ob in dem Menü LuxDivider und Überschriften angezeigt werden können. Dafür muss die Property luxDisplayExtended auf False gesetzt werden. Das Menü unterstützt nicht eine horizontale Navigation außerhalb des Panels. Damit die einzelnen Elemente angezeigt werden muss an jedes Element #menuSection hinzugefügt werden. Default: false. |
| luxMenuPanelLarge           | boolean | Über diese Property kann die Darstellung des Menü-Panels geändert werden. Dies funktioniert jedoch nur wenn luxShowSections auf true gesetzt wird. Die Icons werden größer angezeigt und die MenüItems können eine zweite Unterzeile haben. Damit die einzelnen Elemente angezeigt werden muss an jedes Element #menuSection hinzugefügt werden. Default: false.   |

### @Output

| Name          | Typ  | Beschreibung                                    |
| ------------- | ---- | ----------------------------------------------- |
| luxMenuOpened | void | Wird ausgelöst, wenn das Menü geöffnet wird.    |
| luxMenuClosed | void | Wird ausgelöst, wenn das Menü geschlossen wird. |

## Components

### LuxMenuItemComponent

Ein einzelner Menüeintrag. Er wird je nach Konfiguration als Button in der horizontalen Navigation oder als Eintrag im Menü-Panel dargestellt.

#### Allgemein

| Name     | Beschreibung  |
| -------- | ------------- |
| selector | lux-menu-item |

#### @Input

| Name                   | Typ                                                        | Beschreibung                                                                                                                                                                                     |
| ---------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxAlwaysVisible       | boolean                                                    | Bestimmt dass das Element unabhängig von Weight-Wert, maximal-erlaubten Elementen und Screen-Size in der horizontalen Navigation dargestellt werden soll. Default: true.                         |
| luxHideLabelIfExtended | boolean                                                    | Über dieses Flag ist es möglich das Label des MenuItems im "ausgeklappten" Zustand zu verstecken. Default: false.                                                                                |
| luxLabel               | string                                                     | Bestimmt das Label, welches in dieser Component angezeigt werden soll. Default: ''.                                                                                                              |
| luxColor               | LuxThemePalette                                            | Diese Property definiert die Farben der Component. Die Farbe (`warn`, `accent`) wird sowohl für den Button in der erweiterten Ansicht als auch für den Eintrag im Menu-Panel übernommen.         |
| luxRaised              | boolean                                                    | Gibt an, ob der Button hervorgehoben wird. Default: false.                                                                                                                                       |
| luxIconName            | string                                                     | Ein LUX-Iconname.                                                                                                                                                                                |
| luxTagId               | string                                                     | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                    |
| luxDisabled            | boolean                                                    | Gibt an, ob das Element deaktiviert ist. Default: false.                                                                                                                                         |
| luxRounded             | boolean                                                    | Gibt an, ob ein runder Button verwendet werden soll. Default: false.                                                                                                                             |
| luxFlat                | boolean                                                    | Gibt an, ob der Button in der horizontalen Navigation flach (gefüllt, ohne Schatten) dargestellt wird. Default: false.                                                                           |
| luxStroked             | boolean                                                    | Gibt an, ob der Button in der horizontalen Navigation mit Rahmen dargestellt wird. Default: false.                                                                                               |
| luxIconShowRight       | boolean                                                    | Gibt an, ob das Icon rechts vom Label angezeigt wird. Wirkt nur in der erweiterten Ansicht (Buttons neben dem Menü), im Menü-Panel steht das Icon immer links. Default: false.                   |
| luxDisabledAria        | boolean                                                    | Setzt `aria-disabled="true"`, ohne das Element technisch zu deaktivieren. Der Eintrag bleibt fokussierbar, statt luxClicked wird luxClickNotAllowed ausgelöst. Default: false.                   |
| luxHidden              | boolean                                                    | Gibt an, ob der Menüeintrag ausgeblendet werden soll. Default: false.                                                                                                                            |
| luxClass               | string \| string[] \| Set\<string> \| Record\<string, any> | CSS-Klassen für den Eintrag (vgl. ngClass).                                                                                                                                                      |
| luxButtonTooltip       | string                                                     | Tooltip für das Element. Der Tooltip wird aber nur angezeigt, wenn das Element als Button außerhalb des Menüs dargestellt wird. Default: ''.                                                     |
| luxMenuTooltip         | string                                                     | Tooltip für das Element. Der Tooltip wird aber nur angezeigt, wenn das Element als Button innerhalb des Menüs dargestellt wird. Default: ''.                                                     |
| luxPrio                | number                                                     | Über die Priorität kann die Anzeigereihenfolge beeinflusst werden. Default: 0.                                                                                                                   |
| luxButtonBadge         | string                                                     | Text der in einer Badge hinter dem Label in einem Lux-Button angezeigt werden kann. Die maximale Länge beträgt vier Zeichen und wird bei Überlänge automatisch mit Ellipsis '...' abgeschnitten. |
| luxButtonBadgeColor    | LuxThemePalette                                            | Farbe der ButtonBadge, die analog zur Button-Farbe gewählt werden kann. Mögliche Werte: "primary", "accent", "warn". Default: 'primary'.                                                         |
| luxMenuItemSubtitle    | string                                                     | Wenn im Menü die Properties luxMenuPanelLarge und luxShowSections auf true stehen, wird der Text in einer zweiten Zeile angezeigt. Default: ''.                                                  |
| luxMenuItemSelected    | boolean                                                    | Wenn im Menü die Property luxShowSections auf true steht, kann ein MenuItem als ausgewählt angezeigt werden. Default: false.                                                                     |

Hinweis: SVG-Icons mit unterschiedlichen Seitenverhaeltnissen werden im Menu-Panel vollstaendig und proportional innerhalb der maximalen Icon-Breite/-Hoehe dargestellt.

#### @Output

| Name                         | Typ     | Beschreibung                                                                                           |
| ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| luxClicked                   | Event   | Event welches beim Klick auf den Button ausgelöst wird und einen Clicked-Event als Parameter enthält.  |
| luxClickNotAllowed           | Event   | Wird bei einem Klick ausgelöst, wenn `luxDisabledAria` gesetzt ist (luxClicked wird dann unterdrückt). |
| luxHiddenChange              | boolean | Wird ausgelöst, wenn sich luxHidden ändert.                                                            |
| luxHideLabelIfExtendedChange | boolean | Wird ausgelöst, wenn sich luxHideLabelIfExtended ändert.                                               |
| luxAlwaysVisibleChange       | boolean | Wird ausgelöst, wenn sich luxAlwaysVisible ändert.                                                     |

### LuxMenuPanelHeaderComponent

Diese Komponente funktioniert nur im Zusammenhang mit luxShowSections.

| Name     | Beschreibung          |
| -------- | --------------------- |
| selector | lux-menu-panel-header |

#### @Input

| Name        | Typ    | Beschreibung                                                                                                                                                    |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTitle    | string | Der Text der als Überschrift (z.B. der Benutzername) angezeigt werden soll. Das Element wird nur angezeigt wenn es im Menü an erster Stelle steht. Default: ''. |
| luxSubtitle | string | Text der unter der Überschrift steht (z.B. Email des Users).                                                                                                    |

### LuxMenuSectionTitleComponent

Diese Komponente funktioniert nur im Zusammenhang mit luxShowSections.

| Name     | Beschreibung           |
| -------- | ---------------------- |
| selector | lux-menu-section-title |

#### @Input

| Name     | Typ    | Beschreibung                                                     |
| -------- | ------ | ---------------------------------------------------------------- |
| luxTitle | string | Der Text der als Überschrift angezeigt werden soll. Default: ''. |

## Beispiele

### 1. Einfaches Menü

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐menu-v22-img-01.png)

Ts

```typescript
log(msg: string) {
  console.log(msg);
}
```

Html

```html
<lux-menu luxMenuIconName="lux-interface-setting-menu-1" [luxDisplayExtended]="false">
  <lux-menu-item luxLabel="Menu-Item 0" luxIconName="lux-phone-book" (luxClicked)="log('Item 0 click')" />
  <lux-menu-item luxLabel="Menu-Item 1" luxIconName="lux-card" (luxClicked)="log('Item 1 click')" />
  <lux-menu-item luxLabel="Menu-Item 2" luxIconName="lux-mail-sign-at" (luxClicked)="log('Item 2 click')" />
</lux-menu>
```

### 2. Extendedmenü (linksbündig)

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐menu-v22-img-02.png)

Ts

```typescript
log(msg: string) {
  console.log(msg);
}
```

Html

```html
<lux-menu luxMenuIconName="lux-interface-setting-menu-1" [luxDisplayExtended]="true" [luxDisplayMenuLeft]="true" [luxMaximumExtended]="2">
  <lux-menu-item luxLabel="Menu-Item 0" luxIconName="lux-phone-book" (luxClicked)="log('Item 0 click')" />
  <lux-menu-item luxLabel="Menu-Item 1" luxIconName="lux-card" (luxClicked)="log('Item 1 click')" />
  <lux-menu-item luxLabel="Menu-Item 2" luxIconName="lux-mail-sign-at" (luxClicked)="log('Item 2 click')" />
</lux-menu>
```

### 3. Extendedmenü (rechtsbündig)

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐menu-v22-img-03.png)

Ts

```typescript
log(msg: string) {
  console.log(msg);
}
```

Html

```html
<lux-menu luxMenuIconName="lux-interface-setting-menu-1" [luxDisplayExtended]="true" [luxDisplayMenuLeft]="false" [luxMaximumExtended]="2">
  <lux-menu-item luxLabel="Menu-Item 0" luxIconName="lux-phone-book" (luxClicked)="log('Item 0 click')" />
  <lux-menu-item luxLabel="Menu-Item 1" luxIconName="lux-card" (luxClicked)="log('Item 1 click')" />
  <lux-menu-item luxLabel="Menu-Item 2" luxIconName="lux-mail-sign-at" (luxClicked)="log('Item 2 click')" />
</lux-menu>
```

### 4. Menü mit Sektionen

![Beispielbild 04](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐menu-v22-img-04.png)

Ts

```typescript
log(msg: string) {
  console.log(msg);
}
```

Html

```html
<lux-menu luxMenuIconName="lux-interface-setting-menu-1" [luxDisplayExtended]="false" [luxShowSections]="true">
  <lux-menu-panel-header luxTitle="Benutzername Beispiel" luxSubtitle="Benutzername@Beispiel.de" #menuSection />
  <lux-divider #menuSection />
  <lux-menu-item luxLabel="Menu-Item 0" luxIconName="lux-phone-book" (luxClicked)="log('Item 0 click')" #menuSection />
  <lux-menu-item luxLabel="Menu-Item 1" luxIconName="lux-card" (luxClicked)="log('Item 1 click')" #menuSection />
  <lux-divider #menuSection />
  <lux-menu-section-title luxTitle="Beispiel Überschrift" #menuSection />
  <lux-menu-item luxLabel="Menu-Item 2" luxIconName="lux-mail-sign-at" (luxClicked)="log('Item 2 click')" #menuSection />
</lux-menu>
```

### 5. Großes Menü mit Sektionen

![Beispielbild 05](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐menu-v22-img-05.png)

Ts

```typescript
// Um Custom Icons aus einem CDN zu laden, müssen diese einmal registriert werden (z.B. in der app.component.ts)
private readonly iconService = inject(LuxIconRegistryService);

constructor() {
  this.iconService.getSvgIconList().push({ iconName: 'custom-icon-name', iconBasePath: 'https://[my-domain].de/', iconPath: 'assets/icons/favicon.svg' });
}

log(msg: string) {
  console.log(msg);
}
```

Html

```html
<lux-menu luxMenuIconName="lux-interface-setting-menu-1" [luxDisplayExtended]="false" [luxShowSections]="true" [luxMenuPanelLarge]="true">
  <lux-menu-panel-header luxTitle="Benutzername Beispiel" luxSubtitle="Benutzername@Beispiel.de" #menuSection />
  <lux-divider #menuSection />
  <lux-menu-item
    luxLabel="Menu-Item 0"
    luxIconName="lux-phone-book"
    (luxClicked)="log('Item 0 click')"
    luxMenuItemSubtitle="Item-Subtitle 0"
    #menuSection
  />
  <lux-menu-item
    luxLabel="Menu-Item 1"
    luxIconName="lux-card"
    (luxClicked)="log('Item 1 click')"
    luxMenuItemSubtitle="Item-Subtitle 1"
    #menuSection
  />
  <lux-divider #menuSection />
  <lux-menu-section-title luxTitle="Beispiel Überschrift" #menuSection />
  <lux-menu-item
    luxLabel="Menu-Item 2"
    luxIconName="custom-icon-name"
    (luxClicked)="log('Item 2 click')"
    luxMenuItemSubtitle="Item-Subtitle 2"
    #menuSection
  />
</lux-menu>
```

## Zusatzinformationen

### Konfigurationsoptionen

Standardmäßig werden die Texte der Menüeinträge **nicht** in Großbuchstaben angezeigt.

Über die [LUX-Components-Config](config-v22) (`labelConfiguration.allUppercase: true` in `provideLuxComponentsConfig()`) kann festgelegt werden, dass die Texte in Großbuchstaben ausgegeben werden.
Will man die Menüeinträge davon ausnehmen, muss der Selektor "lux-menu-item" in `labelConfiguration.notAppliedTo` eingetragen werden.

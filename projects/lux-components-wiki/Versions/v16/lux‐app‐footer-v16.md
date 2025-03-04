# LUX-App-Footer

![Beispielbild LUX-App-Footer](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐app‐footer-v16-img.png)

- [LUX-App-Footer](#lux-app-footer)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@ViewChild](#viewchild)
  - [Services](#services)
    - [LuxAppFooterButtonService](#luxappfooterbuttonservice)
    - [LuxAppFooterLinkService](#luxappfooterlinkservice)
  - [Classes / Interfaces](#classes--interfaces)
    - [LuxAppFooterButtonInfo](#luxappfooterbuttoninfo)
    - [LuxAppFooterLinkInfo](#luxappfooterlinkinfo)
  - [Beispiele](#beispiele)
    - [1. Footerbuttons definieren](#1-footerbuttons-definieren)
    - [2. Zentrierter Inhalt des App-Footers](#2-zentrierter-inhalt-des-app-footers)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxLayoutModule |
| selector | lux-app-footer  |

### @Input

| Name                   | Typ     | Beschreibung                                                                                                                                                                        |
| ---------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxVersion             | string  | Ein App-Version (z.B. 1.0.0). Die Version wird allerdings nur in Bildschirmbreiten >= 1920px dargestellt.                                                                           |
| luxAriaRoleFooterLabel | string  | Aria-Label (z.B. für Screenreader) für das `role`-Attribut mit dem Wert `contentinfo`. Wird der Wert geleert (''), dann wird kein `role`-Attribut gesetzt.                          |
| luxCenteredView        | boolean | Flag um den Inhalt des Headers auf eine Max-Width zu beschränkt und bei grosser Screensize zentriert darzustellen, default = false. Empfehlung, diesen Wert über die config setzen. |
| luxCenteredWidth       | string  | Größenangabe für einen beschränkten und zentrierten Header-Inhalt, default = 1500px. Empfehlung, diesen Wert über die config setzen.                                                |

### @ViewChild

| Name       | Typ              | Beschreibung              |
| ---------- | ---------------- | ------------------------- |
| buttonMenu | LuxMenuComponent | Das Buttonmenü im Footer. |

## Services

### LuxAppFooterButtonService

Dieser Service bietet die Möglichkeit Buttons rechtsbündig eine Reihe von `LuxButtonComponents` darzustellen.
Der Service nimmt einzelne Objekte bzw. Arrays von `LuxAppFooterButtonInfo` entgegen.

!!! In der `ngOnDestroy`-Methode muss zwingend die Subscription gelöst und ggf. die Buttons zurückgesetzt werden.

```typescript
ngOnDestroy() {
  this.buttonService.buttonInfos = [];
  this.buttonSubscription.unsubscribe();
}
```

| Funktion                                                              | Beschreibung                                                                                                                                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| buttonInfos(): LuxAppFooterButtonInfo[]                               | Die Funktion liefert die angezeigten Buttons zurück.                                                                                                                                 |
| getButtonInfosAsObservable(): Observable \<LuxAppFooterButtonInfo[]\> | Die Funktion Liefert ein Observable zurück.                                                                                                                                          |
| pushButtonInfos(...value: LuxAppFooterButtonInfo[]): void             | Ermöglicht es, dem aktuellen Array von Buttons für den Footer neue Einträge hinzuzufügen. Hier kann ein Array, aber auch ein einzelnes Objekt übergeben werden.                      |
| removeButtonInfoAtIndex(i: number):void                               | Entfernt einen Button an der Position i aus dem aktuellen Array von Buttons.                                                                                                         |
| removeButtonInfoByCmd(cmd: string): void                              | Entfernt einen Button anhand des ihm zugewiesenen cmd-Strings aus dem Array von Buttons.                                                                                             |
| clearButtonInfos(): void                                              | Entfernt alle Buttons aus dem Footer.                                                                                                                                                |
| sendButtonCommand(cmd: string): void                                  | Triggert die Information, dass ein bestimmter Button mit dem übergebenen cmd-String angeklickt wurde.                                                                                |
| getButtonInfoByCmd(cmd: string): string \| undefined                  | Gibt ein LuxAppFooterButtonInfo-Objekt aus dem Array buttonInfos anhand eines übergebenen CMD-Strings zurück. Wenn kein Objekt gefunden werden konnte, wird undefined wiedergegeben. |

### LuxAppFooterLinkService

Dieser Service bietet die Möglichkeit Links linksbündig eine Reihe von `LuxLinkComponents` darzustellen.
darzustellen. Der Service nimmt einzelne Objekte bzw. Arrays von `LuxAppFooterLinkInfo` entgegen.

| Funktion                                                          | Beschreibung                                                                                                          |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| linkInfos(): LuxAppFooterLinkInfo[]                               | Die Funktion liefert die angezeigten Links zurück.                                                                    |
| getLinkInfosAsObservable(): Observable \<LuxAppFooterLinkInfo[]\> | Die Funktion Liefert ein Observable zurück.                                                                           |
| pushLinkInfos(...links: LuxAppFooterLinkInfo[]): void             | Die Fukntion ermöglicht es, neue Links hinzuzufügen. Es können einzelne Links oder ein ganzes Array übergeben werden. |
| removeLinkInfoAtIndex(i: number): void                            | Die Funktion entfernt den Link an der übergebenen Position.                                                           |
| clearLinkInfos(): void                                            | Die Funktion entfernt alle Links.                                                                                     |

## Classes / Interfaces

### LuxAppFooterButtonInfo

Die Buttons können über den `LuxAppFooterButtonService` hinzugefügt werden.
Der Service nimmt Objekte der Klasse `LuxAppFooterButtonInfo` (implementiert das Interface `ILuxAppFooterButtonInfo`) entgegen und generiert daraus das Button-Menü im Footer.

Die Klasse bietet über die statische `generateInfo`-Methode eine Factory-Methode für die Erzeugung an.

| Name          | Typ                                     | Beschreibung                                                                                                   |
| ------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| label         | string                                  | Eine Buttonbezeichnung.                                                                                        |
| cmd           | string                                  | Eindeutige Buttonkennung.                                                                                      |
| color         | LuxThemePalette                         | Eine Themepalette `primary` \| `accent` \| `warn` oder `undefined`.                                            |
| disabled      | boolean                                 | Gibt an, ob der Button deaktiviert werden soll.                                                                |
| hidden        | boolean                                 | Gibt an, ob der Button ausgeblendet werden soll.                                                               |
| raised        | boolean                                 | Eintrag hervorheben.                                                                                           |
| iconName      | string                                  | Ein Iconname.                                                                                                  |
| alwaysVisible | boolean                                 | Diesen Button bevorzugt anzeigen (siehe auch `prio`).                                                          |
| onClick       | (that: ILuxAppFooterButtonInfo) => void | Die Funktion wird aufgerufen, wenn der Button betätigt wurde.                                                  |
| tooltip       | string                                  | Tooltip für das Element. Der Tooltip wird nur angezeigt, wenn der Button außerhalb des Menüs dargestellt wird. |
| tooltipMenu   | string                                  | Tooltip für das Element. Der Tooltip wird nur angezeigt, wenn der Button innerhalb des Menüs dargestellt wird. |
| prio          | number                                  | Eine Priorität, welche die Anzeigereihenfolge festlegt.                                                        |

### LuxAppFooterLinkInfo

Links können über den `LuxAppFooterLinkService` hinzugefügt werden.
Der Service nimmt Objekte der Klasse `LuxAppFooterLinkInfo` (implementiert das Interface `ILuxAppFooterLinkInfo`) entgegen und generiert daraus das Button-Menü im Footer.
Ein Beispiel ist in dem Blueprint zu sehen. Der Link-Service nimmt Objekte der Klasse LuxAppFooterLinkInfo (implementiert das Interface ILuxAppFooterLinkInfo) entgegen und generiert aus jedem einzelnen Objekt einen Link, der zu einer Seite der Webanwendung führt. Ist das Browserfenster klein, so werden ab einer gewissen Breite nur noch die Links gezeigt, die das alwaysVisible Flag gesetzt haben.

Die Klasse bietet über die statische `generateInfo`-Methode eine Factory-Methode für die Erzeugung an.

| Name          | Typ     | Beschreibung                                                             |
| ------------- | ------- | ------------------------------------------------------------------------ |
| label         | string  | Label das für den Eintrag angezeigt wird.                                |
| path          | string  | Pfad, der über den Routing Service zu einer Seite der Webanwendung führt |
| alwaysVisible | boolean | Unabhängig von allen Faktoren diesen Eintrag anzeigen.                   |
| blank         | boolean | Ermöglicht es, einen externen Link in einem neuen Tab zu öffnen.         |

## Beispiele

### 1. Footerbuttons definieren

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐app‐footer-v16-img-01.png)

Ts

```typescript
  delegateTaskBtn = LuxAppFooterButtonInfo.generateInfo({
    label: 'Delegieren',
    cmd: 'delegateTask',
    alwaysVisible: false,
    onClick: this.onDelegateTask.bind(this)
  });

  finishTaskBtn = LuxAppFooterButtonInfo.generateInfo({
    label: 'Abschließen',
    cmd: 'finishTask',
    color: 'primary',
    disabled: false,
    alwaysVisible: true,
    onClick: this.onFinishTask.bind(this)
  });

  cancelTaskBtn = LuxAppFooterButtonInfo.generateInfo({
    label: 'Abbrechen',
    cmd: 'cancelTask',
    color: 'warn',
    onClick: this.onCancelTask.bind(this)
  });

  constructor(private buttonService: LuxAppFooterButtonService, private router: Router, private linkService: LuxAppFooterLinkService, private themeService: LuxThemeService) {
    themeService.loadTheme();
    router.initialNavigation();
  }

  ngOnInit(): void {
    this.linkService.linkInfos = [
      new LuxAppFooterLinkInfo('Datenschutz', 'datenschutz', true),
      new LuxAppFooterLinkInfo('Impressum', 'impressum')
    ];

    // Button manipulieren
    this.cancelTaskBtn.disabled = true;

    // Direkt hinzufügen
    this.buttonService.buttonInfos = [this.cancelTaskBtn, this.delegateTaskBtn];

    // Später hinzufügen
    this.buttonService.pushButtonInfos(this.finishTaskBtn);
  }

  ngOnDestroy() {
    this.buttonService.buttonInfos = [];
  }

  onCancelTask() {
    console.log('cancelTask clicked');
  }

  onDelegateTask() {
    console.log('delegateTask clicked');
  }

  onFinishTask() {
    console.log('finishTask clicked');
  }
```

Html

```html
<div class="lux-app-container">
  <lux-app-header></lux-app-header>
  <lux-app-content></lux-app-content>
  <lux-app-footer></lux-app-footer>
</div>
```

### 2. Zentrierter Inhalt des App-Footers

Empfehlung: Die Werte für luxCenteredView und luxCenteredWidth über eine Config-Datei zu setzen [vgl.](config-v16.md).
Damit werden die selben Parameter auch beim App-Header-Ac gesetzt.
Die centeredWidth kann optional verändert werden (default=1500px).
Aufgrund der unterschiedlichen Möglichkeiten der App-Gestaltung, muss in allen Fällen der Content-Bereich selbstständig angepasst werden.
Dazu kann die layout-Klasse "lux-container" verwendet werden und z.B. dem Host-Element als Attribut übergeben werden.

Bei der Verwendung von Mediaquerries, lux-tabs und lux-table ist das gewünschte Responsive Verhalten zu testen und gegebenenfalls anzupassen.

Ts

```typescript
const myConfiguration: LuxComponentsConfigParameters = {
 
  viewConfiguration: {
    centerdView: true,
    centeredWidth: '1000px',
  }
};

```

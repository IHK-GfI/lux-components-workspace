# LUX-App-Header-Ac

![Beispielbild LUX-App-Header](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐app‐header‐ac-v18-img.png)

- [LUX-App-Header-Ac](#lux-app-header-ac)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxLangSelectComponent](#luxlangselectcomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
    - [LuxAppHeaderAcUserMenu](#luxappheaderacusermenu)
    - [LuxAppHeaderAcNavMenu](#luxappheaderacnavmenu)
      - [@Input](#input-2)
    - [LuxAppHeaderAcNavMenuItem](#luxappheaderacnavmenuitem)
      - [@Input](#input-3)
    - [LuxAppHeaderAcActionNavComponent](#luxappheaderacactionnavcomponent)
  - [Beispiele](#beispiele)
    - [1. Header mit User-Menu, Sprachwechsler und Navigations-Menu](#1-header-mit-user-menu-sprachwechsler-und-navigations-menu)
    - [2. Header mit individuellem Action-Menü](#2-header-mit-individuellem-action-menü)
    - [3. Verwenden des App-Icons als Favicon](#3-verwenden-des-app-icons-als-favicon)
    - [4. Zentrierter Inhalt des App-Headers-AC](#4-zentrierter-inhalt-des-app-headers-ac)

## Overview / API

### Allgemein

App-Header für das Theme Authentic. Der Header wird in zwei Zeilen aufgeteilt. In der oberen "Top-Bar" werden ein Icon für die jeweilige IHK und ein individuelles App-Icon angezeigt. Diese sollen mit den Links zur Hompage oder Start-Seite der App veknüpft werden. Weiterhin können hier optional eigene Action-Menüs und ein User-Menu eingefügt werden.
Darunter befindet sich Zeile in der die Nav-Bar angezeigt wird.

| Name     | Beschreibung      |
| -------- | ----------------- |
| selector | lux-app-header-ac |

### @Input

| Name                       | Typ      | Beschreibung                                                                                                                                                                             |
| -------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxAppTitle                | string   | Applikationstitel (z.B. LUX Components)                                                                                                                                                  |
| luxAppTitleShort           | string   | Applikationstitel in kurz (wird für Mobilansichten verwendet)                                                                                                                            |
| luxUserName                | string   | Benutzername (z.B. Max Mustermann)                                                                                                                                                       |
| luxBrandLogoSrc            | string   | Relative Pfadangabe zur Logodatei z.B. "assets/logos/brandlogo.svg"                                                                                                                      |
| luxHideBrandLogo           | boolean  | Flag zum Ausblenden des Brandlogos des Headers, default = false                                                                                                                          |
| luxAppLogoSrc              | string   | Relative Pfadangabe zum Appicon, dieses Icon soll gleichzeitig als favicon verwendet werden z.B. "assets/favicons/favicon.svg"                                                           |
| luxHideAppLogo             | boolean  | Flag zum Ausblenden der Applogos des Headers, default = false                                                                                                                            |
| luxHideTopBar              | boolean  | Flag zum Ausblenden der Topbar des Headers, default = false                                                                                                                              |
| luxHideNavBar              | boolean  | Flag zum Ausblenden der Navbar des Headers, default = false                                                                                                                              |
| luxAriaUserMenuButtonLabel | string   | Aria-Label (z.B. für Screenreader) für den Benutzermenübutton.                                                                                                                           |
| luxAriaRoleHeaderLabel     | string   | Aria-Label (z.B. für Screenreader) für das Attribute "role" mit dem Wert "banner". Wenn man den Wert auf '' setzt, wird kein Attribute "role" gesetzt.                                   |
| luxAriaTitleIconLabel      | string   | Aria-Label (z.B. für Screenreader) für das Appicon in der Mitte der Topbar. Wenn der Link zur Startseite führt, könnte man den Wert auch auf 'Appicon / Zur Hauptseite wechseln' ändern. |
| luxAriaTitleImageLabel     | string   | Aria-Label (z.B. für Screenreader) für das Titelimage. Wenn der Link zur Hauptseite führt, könnte man den Wert auch auf 'Brandlogo / Zur Hauptseite wechseln' ändern.                    |
| luxLocaleSupported         | string[] | Array mit den unterstützten Sprachen. Die Sprachauswahl wird erst im App-Header angezeigt, wenn mindestens 2 Sprachen angegeben wurden.                                                  |
| luxLocaleBaseHref          | string   | Der BaseHref, wie z.B. '/subdomain/'                                                                                                                                                     |
| luxCenteredView            | boolean  | Flag um den Inhalt des Headers auf eine Max-Width zu beschränkt und bei grosser Screensize zentriert darzustellen, default = false. Empfehlung, diesen Wert über die config setzen.      |
| luxCenteredWidth           | string   | Größenangabe für einen beschränkten und zentrierten Header-Inhalt, default = 1500px. Empfehlung, diesen Wert über die config setzen.                                                     |

### @Output

| Name                | Typ                    | Beschreibung                                 |
| ------------------- | ---------------------- | -------------------------------------------- |
| luxAppLogoClicked   | EventEmitter \<Event\> | Event, welches beim Klick auf den App-Logo   |
| luxBrandLogoClicked | EventEmitter \<Event\> | Event, welches beim Klick auf den Brand-Logo |

## Components

### LuxLangSelectComponent

Die Sprachauswahl aus dem LUX-App-Header kann auch als eigenständige Komponente eingesetzt werden.

#### Allgemein

| Name     | Beschreibung       |
| -------- | ------------------ |
| selector | lux-lang-select-ac |

#### @Input

| Name               | Typ      | Beschreibung                          |
| ------------------ | -------- | ------------------------------------- |
| luxLocaleSupported | string[] | Array mit den unterstützten Sprachen. |
| luxLocaleBaseHref  | string   | Der BaseHref, wie z.B. '/subdomain/'  |

### LuxAppHeaderAcUserMenu

Die LuxAppHeaderAcUserMenu ermöglicht es ein User-Menu rechts in der Top-Bar einzufügen. Das Menü zeigt ein anderes Icon an, wenn eine Userin eingeloggt ist. Gleichzeitig wird der UserName oben im geöffneten Menu-Panel angezeigt.
Dafür einfach die Component in den LuxAppHeaderComponent einbauen und die gewünschte Anzahl an Menüeinträgen über LuxMenuItemComponents (siehe [lux-menu](lux‐menu-v18)) einsetzen.

| Name     | Beschreibung                |
| -------- | --------------------------- |
| selector | lux-app-header-ac-user-menu |

### LuxAppHeaderAcNavMenu

Das LuxAppHeaderAcNavMenu ermöglicht es ein Navigations-Menu in der unteren Nav-Bar einzufügen.
Dafür einfach die Component in den LuxAppHeaderComponent einbauen und die gewünschte Anzahl an Menüeinträgen über LuxAppHeaderAcNavMenuItemComponents einsetzen (vergleiche auch [lux-menu](lux‐menu-v18)).

| Name     | Beschreibung               |
| -------- | -------------------------- |
| selector | lux-app-header-ac-nav-menu |

#### @Input

| Name                      | Typ    | Beschreibung                                            |
| ------------------------- | ------ | ------------------------------------------------------- |
| luxNavMenuMaximumExtended | number | Anzahl der immer sichtbaren NavMenuItems, default ist 5 |

### LuxAppHeaderAcNavMenuItem

Das Menu-Item für das LuxAppHeaderAcNavMenu.

| Name     | Beschreibung                    |
| -------- | ------------------------------- |
| selector | lux-app-header-ac-nav-menu-item |

#### @Input

| Name                | Typ             | Beschreibung                                                                                                                                                                                     |
| ------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxTagId            | number          | Anzahl der immer sichtbaren NavMenuItems, default ist 5                                                                                                                                          |
| luxSelected         | boolean         | über dieses Flag können ausgewählte Menüeinträge markiert werden, default ist false                                                                                                              |
| luxButtonBadge      | string          | Text der in einer Badge hinter dem Label in einem Lux-Button angezeigt werden kann. Die maximale Länge beträgt vier Zeichen und wird bei Überlänge automatisch mit Ellipsis '...' abgeschnitten. |
| luxButtonBadgeColor | LuxThemePalette | Farbe der ButtonBadge, die analog zur Button-Farbe gewählt werden kann. Mögliche Werte: "primary", "accent", "warn".                                                                             |

### LuxAppHeaderAcActionNavComponent

DieLuxAppHeaderAcActionNavComponent ermöglicht es zusätzliche Menu-Einträge in der Top-Bar im App-Header einzutragen.

Dafür einfach die Component in den LuxAppHeaderAcComponent einbauen und die gewünschte Anzahl an Menüeinträgen über LuxMenuItemComponents (siehe [lux-menu](lux‐menu-v18)) einsetzen.

| Name     | Beschreibung                 |
| -------- | ---------------------------- |
| selector | lux-app-header-ac-action-nav |

## Beispiele

### 1. Header mit User-Menu, Sprachwechsler und Navigations-Menu

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐app‐header‐ac-v18-img-01.png)

TS

```typescript
url = '/';

constructor(public router: Router, private themeService: LuxThemeService) {
  themeService.loadTheme();

  router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });
}

goToHome() {
    this.router.navigate(['home']);
  }

  goToContact() {
    this.router.navigate(['contact']);
  }

goToConfig() {
    this.router.navigate(['configuration']);
  }

  goToHomepage() {
    window.open('https://www.ihk-gfi.de/');
  }

```

Html

```html
<lux-app-header-ac
  luxAppTitle="LUX Teaparty"
  luxAppTitleShort="Teaparty"
  luxUserName="Maxi Musterline"
  [luxLocaleSupported]="['de', 'en']"
  (luxAppLogoClicked)="goToHome()"
  (luxBrandLogoClicked)="goToHomepage()"
>
  <lux-app-header-ac-user-menu luxTooltip="Usermenü">
    <lux-menu-item
      luxLabel="Anmelden"
      luxTagId="user-menu-toggle-login"
    ></lux-menu-item>
    <lux-menu-item
      luxLabel="Einstellungen"
      luxTagId="user-menu-setting"
    ></lux-menu-item>
    <lux-menu-item
      luxLabel="Profil bearbeiten"
      luxTagId="user-menu-profil"
    ></lux-menu-item>
  </lux-app-header-ac-user-menu>

  <lux-app-header-ac-nav-menu [luxNavMenuMaximumExtended]="4">
    <lux-app-header-ac-nav-menu-item
      luxLabel="Home"
      luxAriaLabel="Home"
      luxTagId="navItem0"
      [luxSelected]="url.endsWith('home')"
      (luxClicked)="goToHome()"
    >
    </lux-app-header-ac-nav-menu-item>
    <lux-app-header-ac-nav-menu-item
      luxLabel="Neuanlage"
      luxAriaLabel="Neuanlage Kundenkontakt"
      luxTagId="navItem2"
      [luxSelected]="url.endsWith('contact')"
      (luxClicked)="goToContact()"
    >
    </lux-app-header-ac-nav-menu-item>
    <lux-app-header-ac-nav-menu-item
      luxLabel="Konfiguration"
      luxAriaLabel="Konfiguration einstellen"
      luxTagId="navItem3"
      [luxSelected]="url.endsWith('configuration')"
      (luxClicked)="goToConfig()"
    >
    </lux-app-header-ac-nav-menu-item>
  </lux-app-header-ac-nav-menu>
  <lux-app-header-ac></lux-app-header-ac
></lux-app-header-ac>
```

### 2. Header mit individuellem Action-Menü

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐app‐header‐ac-v18-img-02.png)

TS

```typescript
url = '/';

  constructor(public router: Router, private themeService: LuxThemeService) {
    themeService.loadTheme();

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });
  }

  actionClicked(message: string, icon: string) {
    console.log(message, icon);
  }

```

Html

```html
<lux-app-header-ac luxAppTitle="LUX Teaparty">
  <lux-app-header-ac-action-nav>
    <lux-app-header-ac-action-nav-item>
      <lux-app-header-ac-action-nav-item-custom>
        <lux-menu
          luxMenuLabel="IHK"
          luxMenuIconName="lux-interface-arrows-button-down"
          [luxMenuTriggerIconShowRight]="true"
          [luxDisplayExtended]="false"
          luxTooltip="IHK wechseln"
          [luxTooltipShowDelay]="1000"
        >
          <lux-menu-item
            luxLabel="IHK 101"
            luxIconName="lux-factory"
            (luxClicked)="actionClicked('IHK 101-Action clicked!', 'lux-factory')"
          ></lux-menu-item>
          <lux-menu-item
            luxLabel="IHK 106"
            luxIconName="lux-factory"
            (luxClicked)="actionClicked('IHK 106-Action clicked!', 'lux-factory')"
          ></lux-menu-item>
          <lux-menu-item
            luxLabel="IHK 189"
            luxIconName="lux-factory"
            (luxClicked)="actionClicked('IHK 189-Action clicked!', 'lux-factory')"
          ></lux-menu-item>
        </lux-menu>
      </lux-app-header-ac-action-nav-item-custom>
    </lux-app-header-ac-action-nav-item>
    <lux-app-header-ac-action-nav-item
      luxIconName="lux-interface-arrows-synchronize"
      luxColor="primary"
      luxAriaLabel="Actionbeispiel-Button"
      luxTagId="action0"
      (luxClicked)="actionClicked('Button', 'lux-interface-arrows-synchronize')"
    ></lux-app-header-ac-action-nav-item>
  </lux-app-header-ac-action-nav>
  <lux-app-header-ac></lux-app-header-ac
></lux-app-header-ac>
```

### 3. Verwenden des App-Icons als Favicon

Für das Authentic-Theme soll das individuelle AppIcon im Header gleichzeitig als favIcon der Anwendung genutzt werden.

Dazu wird mit jedem Team ein eignes Icon erstellt. Der Hintergrund ist fest vorgegeben und für die Zuordung der Anwendung kann ein Buchstabenkürzel aus 2-5 Buchstaben eingesetzt werden oder es wird ein symbolisches Icon gewählt.

Anschließend wird dieses Icon als svg-Datei bereitgestellt und zustäzlich eine png- und eine ico-Datei als Fallback erzeugt.

Diese werden dann wie folgt eingebunden:

1. Die Datei favicon.ico im src-Ordner durch die neue Datei ersetzen
2. Im Ordner assets einen Unterordner favicons erstellen und die Dateien favicon.svg und favicon.png dort ablegen.
3. In der Datei index.html den Link

```html
<link rel="icon" type="image/x-icon" href="favicon.ico" />
```

löschen und durch folgende Links ersetzen

```html
<link rel="icon" type="image/svg+xml" href="assets/favicons/favicon.svg" />
<link rel="icon" type="image/png" href="assets/favicons/favicon.png" />
```

Hinweis: Den Pfad zum Assets-Ordner evtl. anpassen.

Vgl. auch <https://wiki.selfhtml.org/wiki/Grafik/Favicon#SVG-Favicons>

### 4. Zentrierter Inhalt des App-Headers-AC

Empfehlung: Die Werte für luxCenteredView und luxCenteredWidth über eine Config-Datei zu setzen [vgl.](config-v18.md).
Damit werden die selben Parameter auch beim App-Footer gesetzt.
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
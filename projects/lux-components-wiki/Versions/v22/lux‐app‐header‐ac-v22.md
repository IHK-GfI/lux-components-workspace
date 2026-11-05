# LUX-App-Header-Ac

![Beispielbild LUX-App-Header](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐app‐header‐ac-v22-img.png)

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
      - [@Input](#input-2)
    - [LuxAppHeaderAcNavMenu](#luxappheaderacnavmenu)
      - [@Input](#input-3)
    - [LuxAppHeaderAcNavMenuItem](#luxappheaderacnavmenuitem)
      - [@Input](#input-4)
    - [LuxAppHeaderAcActionNavComponent](#luxappheaderacactionnavcomponent)
    - [LuxAppHeaderAcActionNavItemComponent](#luxappheaderacactionnavitemcomponent)
      - [@Input](#input-5)
      - [@Output](#output-1)
    - [LuxAppHeaderAcActionNavItemCustomComponent](#luxappheaderacactionnavitemcustomcomponent)
  - [Beispiele](#beispiele)
    - [1. Header mit User-Menu, Sprachwechsler und Navigations-Menu](#1-header-mit-user-menu-sprachwechsler-und-navigations-menu)
    - [2. Header mit individuellem Action-Menü](#2-header-mit-individuellem-action-menü)
    - [3. Verwenden des App-Icons als Favicon](#3-verwenden-des-app-icons-als-favicon)
    - [4. Zentrierter Inhalt des App-Headers-AC](#4-zentrierter-inhalt-des-app-headers-ac)

## Overview / API

### Allgemein

App-Header für das Theme Authentic. Der Header wird in zwei Zeilen aufgeteilt. In der oberen "Top-Bar" werden ein Icon für die jeweilige IHK und ein individuelles App-Icon angezeigt. Diese sollen mit den Links zur Homepage oder Start-Seite der App verknüpft werden. Weiterhin können hier optional eigene Action-Menüs und ein User-Menu eingefügt werden.
Darunter befindet sich eine Zeile, in der die Nav-Bar angezeigt wird.

| Name     | Beschreibung      |
| -------- | ----------------- |
| selector | lux-app-header-ac |

### @Input

| Name                       | Typ      | Beschreibung                                                                                                                                                                                             |
| -------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxAppTitle                | string   | Applikationstitel (z.B. LUX Components)                                                                                                                                                                  |
| luxAppTitleShort           | string   | Applikationstitel in Kurzform (wird für Mobilansichten verwendet)                                                                                                                                        |
| luxUserName                | string   | Benutzername (z.B. Max Mustermann)                                                                                                                                                                       |
| luxUserEmail               | string   | Email (z.B. max\@mustermann.example.com)                                                                                                                                                                 |
| luxBrandLogoSrc            | string   | Relative Pfadangabe zur Logodatei z.B. "assets/logos/brandlogo.svg"                                                                                                                                      |
| luxHideBrandLogo           | boolean  | Flag zum Ausblenden des Brandlogos des Headers, default = false                                                                                                                                          |
| luxAppLogoSrc              | string   | Relative Pfadangabe zum App-Icon, dieses Icon soll gleichzeitig als favicon verwendet werden z.B. "assets/favicons/favicon.svg"                                                                          |
| luxHideAppLogo             | boolean  | Flag zum Ausblenden der App-Logos des Headers, default = false                                                                                                                                           |
| luxHideTopBar              | boolean  | Flag zum Ausblenden der Topbar des Headers, default = false                                                                                                                                              |
| luxHideNavBar              | boolean  | Flag zum Ausblenden der Navbar des Headers, default = false                                                                                                                                              |
| luxAriaUserMenuButtonLabel | string   | Aria-Label (z.B. für Screenreader) für den Benutzermenübutton. Default: ''.                                                                                                                              |
| luxAriaRoleHeaderLabel     | string   | Aria-Label (z.B. für Screenreader) für das Attribute "role" mit dem Wert "banner". Wenn man den Wert auf '' setzt, wird kein Attribute "role" gesetzt. Default: ''.                                      |
| luxAriaTitleIconLabel      | string   | Aria-Label (z.B. für Screenreader) für das App-Icon in der Mitte der Top-Bar. Wenn der Link zur Startseite führt, könnte man den Wert auch auf 'App-Icon / Zur Hauptseite wechseln' ändern. Default: ''. |
| luxAriaTitleImageLabel     | string   | Aria-Label (z.B. für Screenreader) für das Titelimage. Wenn der Link zur Hauptseite führt, könnte man den Wert auch auf 'Brandlogo / Zur Hauptseite wechseln' ändern. Default: ''.                       |
| luxLocaleSupported         | string[] | Array mit den unterstützten Sprachen. Die Sprachauswahl wird erst im App-Header angezeigt, wenn mindestens 2 Sprachen angegeben wurden. Default: ['de'].                                                 |
| luxLocaleBaseHref          | string   | Der BaseHref, wie z.B. '/subdomain/'. Default: ''.                                                                                                                                                       |
| luxCenteredView            | boolean  | Flag um den Inhalt des Headers auf eine Max-Width zu beschränkt und bei grosser Screensize zentriert darzustellen, default = false. Empfehlung, diesen Wert über die config setzen.                      |
| luxCenteredWidth           | string   | Größenangabe für einen beschränkten und zentrierten Header-Inhalt, default = 1500px. Empfehlung, diesen Wert über die config setzen.                                                                     |

### @Output

| Name                | Typ   | Beschreibung                                                 |
| ------------------- | ----- | ------------------------------------------------------------ |
| luxAppLogoClicked   | Event | Event, welches beim Klick auf das App-Logo ausgelöst wird.   |
| luxBrandLogoClicked | Event | Event, welches beim Klick auf das Brand-Logo ausgelöst wird. |

## Components

### LuxLangSelectComponent

Die Sprachauswahl aus dem LUX-App-Header kann auch als eigenständige Komponente eingesetzt werden.

#### Allgemein

| Name     | Beschreibung       |
| -------- | ------------------ |
| selector | lux-lang-select-ac |

#### @Input

| Name               | Typ      | Beschreibung                                           |
| ------------------ | -------- | ------------------------------------------------------ |
| luxLocaleSupported | string[] | Array mit den unterstützten Sprachen. Default: ['de']. |
| luxLocaleBaseHref  | string   | Der BaseHref, wie z.B. '/subdomain/'. Default: ''.     |

### LuxAppHeaderAcUserMenu

Die LuxAppHeaderAcUserMenu ermöglicht es ein User-Menu rechts in der Top-Bar einzufügen. Das Menü zeigt ein anderes Icon an, wenn eine Userin eingeloggt ist. Gleichzeitig wird der UserName oben im geöffneten Menu-Panel angezeigt.
Dafür einfach die Component in die LuxAppHeaderAcComponent einbauen und die gewünschte Anzahl an Menüeinträgen über LuxMenuItemComponents (siehe [lux-menu](lux‐menu-v22)) einsetzen.

| Name     | Beschreibung                |
| -------- | --------------------------- |
| selector | lux-app-header-ac-user-menu |

#### @Input

| Name                         | Typ     | Beschreibung                                                                                                                                                                                                                                                                   |
| ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxUseSectionsAndHeaderPanel | boolean | Mit der Property wird bestimmt, ob der Benutzername und die Email oben im Menü angezeigt werden sollen, und ob luxDivider und luxMenuSectionTitle benutzt werden können. Damit alle Elemente angezeigt werden, muss an jedes ein #menuSection angefügt werden. Default: false. |

### LuxAppHeaderAcNavMenu

Das LuxAppHeaderAcNavMenu ermöglicht es ein Navigations-Menu in der unteren Nav-Bar einzufügen.
Dafür einfach die Component in die LuxAppHeaderAcComponent einbauen und die gewünschte Anzahl an Menüeinträgen über LuxAppHeaderAcNavMenuItemComponents einsetzen (vergleiche auch [lux-menu](lux‐menu-v22)).

| Name     | Beschreibung               |
| -------- | -------------------------- |
| selector | lux-app-header-ac-nav-menu |

#### @Input

| Name                      | Typ    | Beschreibung                                            |
| ------------------------- | ------ | ------------------------------------------------------- |
| luxNavMenuMaximumExtended | number | Anzahl der immer sichtbaren NavMenuItems, default ist 5 |

### LuxAppHeaderAcNavMenuItem

Das Menu-Item für das LuxAppHeaderAcNavMenu. Die Komponente erbt von `lux-menu-item` und bietet alle dessen Inputs (u.a. `luxLabel`, `luxIconName`, `luxDisabled`, `luxAriaLabel`) und das Output `luxClicked` an (siehe [lux-menu](lux‐menu-v22)). Die folgende Tabelle nennt nur die Ergänzungen bzw. die für das Nav-Menü wichtigsten Inputs.

| Name     | Beschreibung                    |
| -------- | ------------------------------- |
| selector | lux-app-header-ac-nav-menu-item |

#### @Input

| Name                | Typ             | Beschreibung                                                                                                                                                                                     |
| ------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxTagId            | string          | LUX-Tag-Id für die automatischen Tests.                                                                                                                                                          |
| luxSelected         | boolean         | über dieses Flag können ausgewählte Menüeinträge markiert werden, default ist false                                                                                                              |
| luxButtonBadge      | string          | Text der in einer Badge hinter dem Label in einem Lux-Button angezeigt werden kann. Die maximale Länge beträgt vier Zeichen und wird bei Überlänge automatisch mit Ellipsis '...' abgeschnitten. |
| luxButtonBadgeColor | LuxThemePalette | Farbe der ButtonBadge, die analog zur Button-Farbe gewählt werden kann. Mögliche Werte: "primary", "accent", "warn".                                                                             |

### LuxAppHeaderAcActionNavComponent

Die LuxAppHeaderAcActionNavComponent ermöglicht es, zusätzliche Menü-Einträge in der Top-Bar im App-Header einzutragen.

Dafür einfach die Component in die LuxAppHeaderAcComponent einbauen und die gewünschte Anzahl an Einträgen über `lux-app-header-ac-action-nav-item` einsetzen. Für eigene Inhalte wird innerhalb eines `lux-app-header-ac-action-nav-item` ein `lux-app-header-ac-action-nav-item-custom` verwendet (siehe Beispiel 2). Optional kann hier auch der Session-Timer `lux-app-header-ac-session-timer` eingebunden werden (siehe [lux-session-timer](lux‐session‐timer-v22)).

| Name     | Beschreibung                 |
| -------- | ---------------------------- |
| selector | lux-app-header-ac-action-nav |

### LuxAppHeaderAcActionNavItemComponent

Ein einzelner Eintrag der LuxAppHeaderAcActionNavComponent.

| Name     | Beschreibung                      |
| -------- | --------------------------------- |
| selector | lux-app-header-ac-action-nav-item |

#### @Input

| Name        | Typ             | Beschreibung                                                    |
| ----------- | --------------- | --------------------------------------------------------------- |
| luxLabel    | string          | Das Label des Eintrags. Default: ''.                            |
| luxIconName | string          | Der Name des Icons für diesen Eintrag (optional).               |
| luxColor    | LuxThemePalette | Die Farbe des Eintrags (`primary` \| `accent` \| `warn`).       |
| luxDisabled | boolean         | Bestimmt, ob der Eintrag deaktiviert ist. Default: false.       |
| luxTagId    | string          | Enthält die TagId, die für die automatischen Tests wichtig ist. |

#### @Output

| Name       | Typ   | Beschreibung                                       |
| ---------- | ----- | -------------------------------------------------- |
| luxClicked | Event | Wird ausgelöst, sobald der Eintrag geklickt wurde. |

### LuxAppHeaderAcActionNavItemCustomComponent

Container für eigenen Inhalt (z.B. ein lux-menu, siehe Beispiel 2). Wird innerhalb eines `lux-app-header-ac-action-nav-item` platziert; dieses stellt dann statt des Standard-Buttons den eigenen Inhalt dar.

| Name     | Beschreibung                             |
| -------- | ---------------------------------------- |
| selector | lux-app-header-ac-action-nav-item-custom |

## Beispiele

### 1. Header mit User-Menu, Sprachwechsler und Navigations-Menu

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐app‐header‐ac-v22-img-01.png)

TS

```typescript
private readonly router = inject(Router);

readonly url = toSignal(
  this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => event.urlAfterRedirects)
  ),
  { initialValue: '/' }
);

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
  luxBrandLogoSrc="assets/logos/brandlogo.svg"
  luxAppLogoSrc="assets/favicons/favicon.svg"
  [luxLocaleSupported]="['de', 'en']"
  (luxAppLogoClicked)="goToHome()"
  (luxBrandLogoClicked)="goToHomepage()"
>
  <lux-app-header-ac-user-menu luxTooltip="Usermenü">
    <lux-menu-item luxLabel="Anmelden" luxTagId="user-menu-toggle-login" />
    <lux-menu-item luxLabel="Einstellungen" luxTagId="user-menu-setting" />
    <lux-menu-item luxLabel="Profil bearbeiten" luxTagId="user-menu-profil" />
  </lux-app-header-ac-user-menu>

  <lux-app-header-ac-nav-menu [luxNavMenuMaximumExtended]="4">
    <lux-app-header-ac-nav-menu-item
      luxLabel="Home"
      luxAriaLabel="Home"
      luxTagId="navItem0"
      [luxSelected]="url().endsWith('home')"
      (luxClicked)="goToHome()"
    />
    <lux-app-header-ac-nav-menu-item
      luxLabel="Neuanlage"
      luxAriaLabel="Neuanlage Kundenkontakt"
      luxTagId="navItem2"
      [luxSelected]="url().endsWith('contact')"
      (luxClicked)="goToContact()"
    />
    <lux-app-header-ac-nav-menu-item
      luxLabel="Konfiguration"
      luxAriaLabel="Konfiguration einstellen"
      luxTagId="navItem3"
      [luxSelected]="url().endsWith('configuration')"
      (luxClicked)="goToConfig()"
    />
  </lux-app-header-ac-nav-menu>
</lux-app-header-ac>
```

### 2. Header mit individuellem Action-Menü

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐app‐header‐ac-v22-img-02.png)

TS

```typescript
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
          />
          <lux-menu-item
            luxLabel="IHK 106"
            luxIconName="lux-factory"
            (luxClicked)="actionClicked('IHK 106-Action clicked!', 'lux-factory')"
          />
          <lux-menu-item
            luxLabel="IHK 189"
            luxIconName="lux-factory"
            (luxClicked)="actionClicked('IHK 189-Action clicked!', 'lux-factory')"
          />
        </lux-menu>
      </lux-app-header-ac-action-nav-item-custom>
    </lux-app-header-ac-action-nav-item>
    <lux-app-header-ac-action-nav-item
      luxIconName="lux-interface-arrows-synchronize"
      luxColor="primary"
      luxAriaLabel="Actionbeispiel-Button"
      luxTagId="action0"
      (luxClicked)="actionClicked('Button', 'lux-interface-arrows-synchronize')"
    />
  </lux-app-header-ac-action-nav>
</lux-app-header-ac>
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

Empfehlung: Die Werte für luxCenteredView und luxCenteredWidth über die LUX-Konfiguration zu setzen [vgl.](config-v22#viewconfiguration).
Damit werden die selben Parameter auch beim App-Footer gesetzt.
Die centeredWidth kann optional verändert werden (default=1500px).
Aufgrund der unterschiedlichen Möglichkeiten der App-Gestaltung, muss in allen Fällen der Content-Bereich selbstständig angepasst werden.
Dazu kann die layout-Klasse "lux-container" verwendet werden und z.B. dem Host-Element als Attribut übergeben werden.

Bei der Verwendung von Media Queries, lux-tabs und lux-table ist das gewünschte Responsive Verhalten zu testen und gegebenenfalls anzupassen.

Ts

```typescript
const myConfiguration: LuxComponentsConfigParameters = {
  viewConfiguration: {
    centeredView: true,
    centeredWidth: '1000px'
  }
};
```

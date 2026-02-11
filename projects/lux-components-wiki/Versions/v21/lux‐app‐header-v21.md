# LUX-App-Header

![Beispielbild LUX-App-Header](lux‐app‐header-v21-img.png)

- [LUX-App-Header](#lux-app-header)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxLangSelectComponent](#luxlangselectcomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
    - [LuxSideNavComponent](#luxsidenavcomponent)
      - [Allgemein](#allgemein-2)
      - [@Input](#input-2)
      - [@Output](#output-1)
    - [LuxSideNavItemComponent](#luxsidenavitemcomponent)
      - [Allgemein](#allgemein-3)
      - [@Input](#input-3)
      - [@Output](#output-2)
      - [ng-content](#ng-content)
    - [LuxSideNavHeaderComponent](#luxsidenavheadercomponent)
    - [LuxSideNavFooterComponent](#luxsidenavfootercomponent)
    - [LuxAppHeaderRightNavComponent](#luxappheaderrightnavcomponent)
    - [LuxAppHeaderActionNavComponent](#luxappheaderactionnavcomponent)
  - [Beispiele](#beispiele)
    - [1. Menü links und rechts](#1-menü-links-und-rechts)
    - [2. Actionmenü mit individueller Komponente (IHK-Selektor)](#2-actionmenü-mit-individueller-komponente-ihk-selektor)
    - [3. Erweiterbares Menü](#3-erweiterbares-menü)

## Overview / API

### Allgemein

Komponente zur Darstellung des Applikationsheaders. Hier können ein seitliches Menü sowie ein aufklappbares Menü auf der rechten Seite definiert werden.

> Bitte darauf achten, dass kein Parent-Element des Headers einen niedrigen z-index-Wert setzt, da ansonsten das seitliche Menü nicht mehr korrekt über den anderen Elementen liegt und der Overlay ebenfalls fehlerhaft ist.

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-app-header  |

### @Input

| Name                       | Typ      | Beschreibung                                                                                                                                                                                              |
| -------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxAppTitle                | string   | Applikationstitel (z.B. LUX Components)                                                                                                                                                                   |
| luxAppTitleShort           | string   | Applikationstitel in kurz (wird für Mobilansichten verwendet)                                                                                                                                             |
| luxUserName                | string   | Benutzername (z.B. Max Mustermann)                                                                                                                                                                        |
| luxIconName                | string   | Ein LUX-Iconname. Das Icon wird ausschließlich angezeigt, wenn keine LUX-SIDE-NAV (das Appmenü) verwendet wird.                                                                                           |
| luxImageSrc                | string   | Quelle des Bildes (z.B. assets/images/example.svg). Das Icon wird ausschließlich angezeigt, wenn keine LUX-SIDE-NAV (das Appmenü) verwendet wird.                                                         |
| luxImageHeight             | string   | Über diese Property kann die Höhe des Bildes (siehe luxImageSrc) beeinflusst werden.                                                                                                                      |
| luxAriaRoleHeaderLabel     | string   | Aria-Label (z.B. für Screenreader) für das Attribute "role" mit dem Wert "banner". Wenn man den Wert auf '' setzt, wird kein Attribute "role" gesetzt.                                                    |
| luxAriaAppMenuButtonLabel  | string   | Aria-Label (z.B. für Screenreader) für den Appmenübutton.                                                                                                                                                 |
| luxAriaUserMenuButtonLabel | string   | Aria-Label (z.B. für Screenreader) für den Benutzermenübutton.                                                                                                                                            |
| luxAriaTitleIconLabel      | string   | Aria-Label (z.B. für Screenreader) für das Titelicon (nur wenn ein Link hinterlegt ist). Wenn der Link zur Hauptseite führt, könnte man den Wert auch auf 'Titelicon / Zur Hauptseite wechseln' ändern.   |
| luxAriaTitleImageLabel     | string   | Aria-Label (z.B. für Screenreader) für das Titelimage (nur wenn ein Link hinterlegt ist). Wenn der Link zur Hauptseite führt, könnte man den Wert auch auf 'Titelimage / Zur Hauptseite wechseln' ändern. |
| luxAriaTitleLinkLabel      | string   | Aria-Label (z.B. für Screenreader) für Apptitel (nur wenn ein Link hinterlegt ist). Wenn der Link zur Hauptseite führt, könnte man den Wert auch auf 'LUX Components / Zur Hauptseite wechseln' ändern.   |
| luxLocaleSupported         | string[] | Array mit den unterstützten Sprachen. Die Sprachauswahl wird erst im App-Header angezeigt, wenn mindestens 2 Sprachen angegeben wurden.                                                                   |
| luxLocaleBaseHref          | string   | Der BaseHref, wie z.B. '/subdomain/'                                                                                                                                                                      |

### @Output

| Name       | Typ                    | Beschreibung                                                                                                                     |
| ---------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| luxClicked | EventEmitter \<Event\> | Event, welches beim Klick auf den App-Titel, das App-Icon (falls vorhanden) oder das App-Image (falls vorhanden) ausgelöst wird. |

## Components

### LuxLangSelectComponent

Die Sprachauswahl aus dem LUX-App-Header kann auch als eigenständige Komponente eingesetzt werden.

#### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-lang-select |

#### @Input

| Name               | Typ      | Beschreibung                          |
| ------------------ | -------- | ------------------------------------- |
| luxLocaleSupported | string[] | Array mit den unterstützten Sprachen. |
| luxLocaleBaseHref  | string   | Der BaseHref, wie z.B. '/subdomain/'  |

### LuxSideNavComponent

#### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-side-nav |

#### @Input

| Name                       | Typ     | Beschreibung                                                                                                                                                                         |
| -------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxDashboardLink           | string  | Link zum Dashboard. Kann auf externe Seiten, aber auch auf andere Routen innerhalb der Applikation verweisen. Für Routen in der Applikation den Link mit einem Slash ( / ) beginnen. |
| luxDashboardLinkTitle      | string  | Titel für den Menüeintrag des Dashboardlinks.                                                                                                                                        |
| luxOpenLinkBlank           | boolean | Öffnet den Link (vorausgesetzt es handelt sich um einen Link der nicht innerhalb der Applikation navigiert) in einem neuen Browser-Tab.                                              |
| luxAriaRoleNavigationLabel | string  | Aria-Label (z.B. für Screenreader) für das Attribute "role" mit dem Wert "navigation". Wenn man den Wert auf '' setzt, wird kein Attribute "role" gesetzt.                           |

#### @Output

| Name                     | Typ                      | Beschreibung                                                                                |
| ------------------------ | ------------------------ | ------------------------------------------------------------------------------------------- |
| luxSideNavExpandedChange | EventEmitter \<boolean\> | Das Event wird ausgelöst, wenn das App-Menü (SideNav links) geöffnet oder geschlossen wird. |

### LuxSideNavItemComponent

#### Allgemein

Komponente, welche einen einzelnen Eintrag in der seitlichen Navigation darstellt. Diese kann ineinander verschachtelt werden und Lux-Divider als visuelle Trennung annehmen.

| Name     | Beschreibung      |
| -------- | ----------------- |
| selector | lux-side-nav-item |

#### @Input

| Name            | Typ     | Beschreibung                                                                                                                                      |
| --------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxLabel        | string  | Bestimmt das Label dieses Navigationsmenüeintrags.                                                                                                |
| luxDisabled     | boolean | Bestimmt ob dieser Menüeintrag deaktiviert ist oder nicht.                                                                                        |
| luxTagId        | string  | Enthält die TagId, die für die automatischen Tests wichtig ist.                                                                                   |
| luxSelected     | boolean | Bestimmt ob dieser Eintrag als selektiert dargestellt wird. Es findet keine Prüfung auf Selektion mit den anderen Einträgen dieser SideNav statt. |
| luxCloseOnClick | boolean | Bestimmt ob ein Klick auf diesen Eintrag das SideNav schließt oder nicht.                                                                         |
| luxIconName     | string  | Enthält den Namen des Icons für diesen Eintrag (optional).                                                                                        |
| luxExpandable   | boolean | Bestimmt, ob dieses Item ausklappbar ist.                                                                                                         |
| luxExpanded     | boolean | Dieses Flag legt fest ob der Eintrag aktuell ausgeklappt ist.                                                                                     |

#### @Output

| Name       | Typ                    | Beschreibung                                                                                                                            |
| ---------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| luxClicked | EventEmitter \<Event\> | Event welches ausgeführt wird, sobald das Item geklickt wurde. Als Übergabewert wird das Objekt für Klick-Events aus dem weitergegeben. |

#### ng-content

| Name              | Typ | Beschreibung                                                                                                          |
| ----------------- | --- | --------------------------------------------------------------------------------------------------------------------- |
| lux-side-nav-item |     | Wird zur Content-Projection von weiteren Einträgen als Unterauflistung zu diesem Eintrag genutzt.                     |
| lux-divider       |     | Ermöglicht das Einbinden eines Lux-Dividers für einen Eintrag, um so eine Trennung zum Element darunter herzustellen. |

### LuxSideNavHeaderComponent

Diese Component kann dazu genutzt werden, einen fixen Header oberhalb der Menüeinträge darzustellen.

| Name     | Beschreibung        |
| -------- | ------------------- |
| selector | lux-side-nav-header |

### LuxSideNavFooterComponent

Diese Component kann dazu genutzt werden, einen fixen Footer unterhalb der Menüeinträge darzustellen.

| Name     | Beschreibung        |
| -------- | ------------------- |
| selector | lux-side-nav-footer |

### LuxAppHeaderRightNavComponent

Die LuxAppHeaderRightNavComponent ermöglicht es ein sogenanntes "Burger-Menu" auf der rechten Seite des Headers einzurichten.
Dafür einfach die Component in den LuxAppHeaderComponent einbauen und die gewünschte Anzahl an Menüeinträgen über LuxMenuItemComponents (siehe [lux-menu](lux‐menu-v21)) einsetzen.

| Name     | Beschreibung             |
| -------- | ------------------------ |
| selector | lux-app-header-right-nav |

### LuxAppHeaderActionNavComponent

DieLuxAppHeaderActionNavComponent ermöglicht es zusätzliche Menu-Einträge in dem App-Header einzutragen.

Dafür einfach die Component in den LuxAppHeaderComponent einbauen und die gewünschte Anzahl an Menüeinträgen über LuxMenuItemComponents (siehe [lux-menu](lux‐menu-v21)) einsetzen.

| Name     | Beschreibung              |
| -------- | ------------------------- |
| selector | lux-app-header-action-nav |

## Beispiele

### 1. Menü links und rechts

![Beispielbild 01](lux‐app‐header-v21-img-01.png)

Html

```html
<lux-app-header
  luxAppTitle="LUX Components"
  luxAppTitleShort="Components"
  luxUserName="Max Mustermann"
>
  <lux-side-nav
    luxDashboardLink="http://dashboardrt.cloudapps.gfi.ihk.de/DashboardRT/dashboard"
    [luxOpenLinkBlank]="true"
  >
    <lux-side-nav-header>
      <h3>Willkommen, Herr Mustermann</h3>
      <lux-divider></lux-divider>
    </lux-side-nav-header>
    <lux-side-nav-item
      luxLabel="Projektarbeiten"
      luxTagId="project-side-nav-item"
      luxIconName="lux-interface-content-file"
    >
      <lux-side-nav-item
        luxLabel="Projekt 0"
        luxTagId="project-0"
      ></lux-side-nav-item>
      <lux-side-nav-item
        luxLabel="Projekt 1"
        luxTagId="project-1"
      ></lux-side-nav-item>
    </lux-side-nav-item>
    <lux-side-nav-item
      luxLabel="Berichtshefte"
      [luxDisabled]="true"
      luxTagId="report-side-nav-item"
      luxIconName="lux-file-pdf"
    >
      <lux-divider></lux-divider>
    </lux-side-nav-item>
    <lux-side-nav-item
      luxLabel="Bescheinigungen"
      luxTagId="certificate-side-nav-item"
      luxIconName="lux-programming-script-file-code-1"
    ></lux-side-nav-item>
    <lux-side-nav-footer>
      <div class="lux-flex lux-flex-wrap lux-gap-4">
        <lux-button luxLabel="Datenschutz" [luxFlat]="true"></lux-button>
        <lux-button luxLabel="Impressum" [luxFlat]="true"></lux-button>
      </div>
    </lux-side-nav-footer>
  </lux-side-nav>
  <lux-app-header-right-nav>
    <lux-menu-item
      luxLabel="Abmelden"
      luxIconName="lux-interface-logout"
      luxTagId="abmelden-menu-item"
    ></lux-menu-item>
  </lux-app-header-right-nav>
</lux-app-header>
```

### 2. Actionmenü mit individueller Komponente (IHK-Selektor)

![Beispielbild 02](lux‐app‐header-v21-img-02.png)

Html

```html
<lux-app-header
  luxAppTitle="LUX Components"
  luxAppTitleShort="Components"
  luxUserName="Max Mustermann"
>
  <lux-side-nav luxDashboardLink="ToDo" [luxOpenLinkBlank]="true">
    <lux-side-nav-header>
      <h3>Willkommen, Herr Mustermann</h3>
      <lux-divider></lux-divider>
    </lux-side-nav-header>
    <lux-side-nav-item
      luxLabel="Projektarbeiten"
      luxTagId="project-side-nav-item"
      luxIconName="lux-interface-content-file"
    >
      <lux-side-nav-item
        luxLabel="Projekt 0"
        luxTagId="project-0"
      ></lux-side-nav-item>
      <lux-side-nav-item
        luxLabel="Projekt 1"
        luxTagId="project-1"
      ></lux-side-nav-item>
    </lux-side-nav-item>
  </lux-side-nav>
  <lux-app-header-action-nav>
    <lux-app-header-action-nav-item>
      <lux-app-header-action-nav-item-custom>
        <lux-menu
          luxMenuLabel="IHK"
          luxMenuIconName="lux-interface-arrows-button-down"
          [luxMenuTriggerIconShowRight]="true"
          [luxDisplayExtended]="false"
        >
          <lux-menu-item
            luxLabel="IHK 101"
            luxIconName="lux-factory"
          ></lux-menu-item>
          <lux-menu-item
            luxLabel="IHK 106"
            luxIconName="lux-factory"
          ></lux-menu-item>
          <lux-menu-item
            luxLabel="IHK 189"
            luxIconName="lux-factory"
          ></lux-menu-item>
        </lux-menu>
      </lux-app-header-action-nav-item-custom>
    </lux-app-header-action-nav-item>
    <lux-app-header-action-nav-item
      luxIconName="lux-interface-alert-alarm-bell-2"
      luxColor="accent"
      luxTagId="action0"
    ></lux-app-header-action-nav-item>
  </lux-app-header-action-nav>
  <lux-app-header-right-nav>
    <lux-menu-item
      luxLabel="Abmelden"
      luxIconName="lux-interface-logout"
      luxTagId="abmelden-menu-item"
    ></lux-menu-item>
  </lux-app-header-right-nav>
</lux-app-header>
```

### 3. Erweiterbares Menü

![Beispielbild 03](lux‐app‐header-v21-img-03.png)

Html

```html
<lux-app-header
  luxAppTitle="LUX Components"
  luxAppTitleShort="Components"
  luxUserName="Max Mustermann"
>
  <lux-side-nav luxDashboardLink="ToDo" [luxOpenLinkBlank]="true">
    <lux-side-nav-header>
      <h3>Willkommen, Herr Mustermann</h3>
    </lux-side-nav-header>
    <lux-side-nav-item
      luxLabel="Projektarbeiten"
      luxTagId="project-side-nav-item"
      luxIconName="lux-interface-content-file"
      [luxExpandable]="true"
      [luxExpanded]="false"
      [luxCloseOnClick]="false"
    >
      <lux-side-nav-item
        luxLabel="Projekt 0"
        luxTagId="project-0"
      ></lux-side-nav-item>
      <lux-side-nav-item
        luxLabel="Projekt 1"
        luxTagId="project-1"
      ></lux-side-nav-item>
    </lux-side-nav-item>
  </lux-side-nav>
  <lux-app-header-right-nav>
    <lux-menu-item
      luxLabel="Abmelden"
      luxIconName="lux-interface-logout"
      luxTagId="abmelden-menu-item"
    ></lux-menu-item>
  </lux-app-header-right-nav>
</lux-app-header>
```

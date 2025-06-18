# LUX-Tenant-Logo

![Beispielbild LUX-Tenant-Logo](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐tenant‐logo-v19-img.png)

- [LUX-Tenant-Logo](#lux-tenant-logo)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [LuxTenantLogo](#luxtenantlogo)
    - [@Input](#input)
    - [@Output](#output)
    - [Konfiguration](#konfiguration)
      - [Logos mit der App ausliefern](#logos-mit-der-app-ausliefern)
      - [Logos über ein CDN laden](#logos-über-ein-cdn-laden)
  - [Beispiele](#beispiele)
    - [1. Tenant Logo in lux-app-header-ac](#1-tenant-logo-in-lux-app-header-ac)
    - [2. Tenant Logo mit automatischen Varianten](#2-tenant-logo-mit-automatischen-varianten)

## Overview / API

Diese Komponente soll wie eine Lookup Komponente benutzt werden, die eine Lookup-Url bereitstellt und je nach Bildschirmauflösung zwischen verschiedenen Varianten wechselt.

### Allgemein

| Name     | Beschreibung        |
| -------- | ------------------- |
| selector | lux-tenant-logo     |

### LuxTenantLogo

### @Input

| Name                | Typ    | Beschreibung                                                                                                                                                                           |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTenantKey        | string | Bestimmt den Schlüssel, der die unterschiedlichen Logos unterscheidet.                                                                                                                 |
| luxTenantVariant    | string | Bestimmt die Variante des Logos. Wird automatisch ermittelt wenn diese Property leer gelassen wird.                                                                                    |
| luxTenantLogoHeight | string | Bestimmt die Höhe des Bildes, hier können alle (CSS) bekannten Größen eingegeben werden. Beispiele: luxTenantLogoHeight="10%", luxTenantLogoHeight="10em", luxTenantLogoHeight="100px" |

### @Output

| Name                 | Typ                   | Beschreibung                                                         |
| -------------------- | --------------------- | -------------------------------------------------------------------- |
| luxTenantLogoClicked | EventEmitter \<Event> | Dieser Output-Emitter gibt das Click-Event auf dem lux-image wieder. |

### Konfiguration

#### Logos mit der App ausliefern

Siehe [LUX-Components-Config](config-v19#logos-mit-der-app-ausliefern).

#### Logos über ein CDN laden

Siehe [LUX-Components-Config](config-v19#logos-über-ein-cdn-laden).

## Beispiele

### 1. Tenant Logo in lux-app-header-ac

**Wichtig**:

Es kann entweder das Attribut **luxBrandLogoSrc** der lux-app-header-ac Komponente benutzt werden oder die **lux-tenant-logo** Komponente!

Um die lux-tenant-logo Komponente zu verwenden, muss das Attribut **luxHideBrandLogo** auf **true** gesetzt werden, ansonsten wird weiterhin das Attribut luxBrandLogoSrc verwendet.

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐tenant‐logo-v19-img-01.png)

Html

```html
<lux-app-header-ac ... [luxHideBrandLogo]="true" ...>
  <lux-tenant-logo luxTenantKey="202" luxTenantVariant="lang"></lux-tenant-logo>

  ...
</lux-app-header-ac>
```

### 2. Tenant Logo mit automatischen Varianten

Lang:

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐tenant‐logo-v19-img-01.png)

Unten:

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐tenant‐logo-v19-img-02.png)

Ohne:

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐tenant‐logo-v19-img-03.png)

Html

```html
<lux-tenant-logo luxTenantKey="100"></lux-tenant-logo>
```

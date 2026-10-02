# LUX-Tenant-Logo

![Beispielbild LUX-Tenant-Logo](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tenant‐logo-v22-img.png)

- [LUX-Tenant-Logo](#lux-tenant-logo)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
    - [Konfiguration](#konfiguration)
      - [Logos mit der App ausliefern](#logos-mit-der-app-ausliefern)
      - [Logos über ein CDN laden](#logos-über-ein-cdn-laden)
  - [Fehlerbehandlung](#fehlerbehandlung)
  - [Beispiele](#beispiele)
    - [1. Tenant Logo in lux-app-header-ac](#1-tenant-logo-in-lux-app-header-ac)
    - [2. Tenant Logo mit automatischen Varianten](#2-tenant-logo-mit-automatischen-varianten)

## Overview / API

Diese Komponente soll wie eine Lookup-Komponente benutzt werden, die eine Lookup-URL bereitstellt und je nach Bildschirmauflösung zwischen verschiedenen Varianten wechselt.

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-tenant-logo |

### @Input

| Name                | Typ    | Beschreibung                                                                                                                                                                           |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTenantKey | string | Bestimmt den Schlüssel, der die unterschiedlichen Logos unterscheidet (z.B. die Kammernummer). Pflicht-Input. |
| luxTenantVariant | string | Bestimmt die Variante des Logos, z.B. 'lang', 'kurz', 'unten' oder 'ohne' (entsprechend den vorhandenen Logo-Dateien `<luxTenantKey>_<Variante>.svg`). Wird die Property leer gelassen, wird die Variante automatisch ermittelt: 'kurz' bei den Media Queries xs und sm, sonst 'lang'. |
| luxTenantLogoHeight | string | Bestimmt die Höhe des Bildes, hier können alle (CSS) bekannten Größen eingegeben werden. Beispiele: luxTenantLogoHeight="10%", luxTenantLogoHeight="10em", luxTenantLogoHeight="100px". Default: ''. |

### @Output

| Name                 | Typ   | Beschreibung                                               |
| -------------------- | ----- | ---------------------------------------------------------- |
| luxTenantLogoClicked | Event | Dieser Output gibt das Click-Event des `lux-image` weiter. |

### Konfiguration

#### Logos mit der App ausliefern

Siehe [LUX-Components-Config](config-v22#logos-mit-der-app-ausliefern).

#### Logos über ein CDN laden

Siehe [LUX-Components-Config](config-v22#logos-über-ein-cdn-laden).

## Fehlerbehandlung

Die Komponente verfügt über ein robustes Fehlerbehandlungssystem für die Verwaltung fehlender oder nicht erreichbarer Logos:

1. **Gewünschtes Logo wird gefunden**: Das Logo wird normal angezeigt.
2. **Gewünschtes Logo nicht gefunden**: Die Komponente greift auf ein Standardlogo zurück, indem die Variante "kurz" verwendet wird (z.B. wenn "100_lang.svg" nicht gefunden wird, versucht es "100_kurz.svg").
3. **CDN nicht erreichbar oder Standardlogo auch nicht verfügbar**: Eine lokalisierte Fehlermeldung (z.B. "Logo nicht verfügbar") wird angezeigt.

Diese automatische Fehlerbehandlung stellt sicher, dass die Anwendung auch bei fehlenden Ressourcen stabil läuft und dem Benutzer eine aussagekräftige Rückmeldung gegeben wird.

## Beispiele

### 1. Tenant Logo in lux-app-header-ac

**Wichtig**:

Es kann entweder das Attribut **luxBrandLogoSrc** der lux-app-header-ac Komponente benutzt werden oder die **lux-tenant-logo** Komponente!

Um die lux-tenant-logo Komponente zu verwenden, muss das Attribut **luxHideBrandLogo** auf **true** gesetzt werden, ansonsten wird weiterhin das Attribut luxBrandLogoSrc verwendet.

![Beispielbild LUX-Tenant-Logo](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tenant‐logo-v22-img.png)

Html

```html
<lux-app-header-ac ... [luxHideBrandLogo]="true" ...>
  <lux-tenant-logo luxTenantKey="202" luxTenantVariant="lang" />

  ...
</lux-app-header-ac>
```

### 2. Tenant Logo mit automatischen Varianten

Lang:

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tenant‐logo-v22-img-01.png)

Unten:

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tenant‐logo-v22-img-02.png)

Ohne:

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tenant‐logo-v22-img-03.png)

Html

```html
<lux-tenant-logo luxTenantKey="100" />
```

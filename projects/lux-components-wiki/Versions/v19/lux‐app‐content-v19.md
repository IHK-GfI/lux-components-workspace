# LUX-App-Content

- [LUX-App-Content](#lux-app-content)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiel](#beispiel)
  - [Zusatzinformationen](#zusatzinformationen)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-app-content |

### @Input

| Name                 | Typ    | Beschreibung                                                                                                                                        |
| -------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxAriaRoleMainLabel | string | Aria-Label (z.B. für Screenreader) für das `role`-Attribut mit dem Wert `main`. Wird der Wert geleert (''), dann wird kein `role`-Attribut gesetzt. |

## Beispiel

Html

```html
<div class="lux-app-container">
  <lux-app-header>
    <!-- Hier Header-Elemente, wie z.B. SideNav oder RightNav -->
  </lux-app-header>
  <lux-app-content>
    <!-- Hier kann Inhalt via Content-Projection eingebunden werden (siehe p-Tag) -->
    <!-- Durch das router-outlet-Tag in der Component wird der geroutete Inhalt ebenfalls hier gerendert -->
    <p>Test</p>
  </lux-app-content>
  <lux-app-footer>
    <!-- Hier Footer-Buttons und -Links über den entsprechenden Service erzeugen -->
  </lux-app-footer>
</div>
```

## Zusatzinformationen

Diese Komponente beinhaltet das `router-outlet`-Tag und füllt mithilfe von eigenen CSS-Styles den Bereich zwischen
`LuxAppHeader` und `LuxAppFooter` auf.

Optional ist es möglich, direkt Inhalte via Content-Projection in die `LuxAppContentComponent` hereinzureichen.

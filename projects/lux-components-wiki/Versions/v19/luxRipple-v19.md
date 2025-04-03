# luxRipple

- [luxRipple](#luxripple)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

| Name     | Beschreibung        |
| -------- | ------------------- |
| selector | luxRipple           |

Mithilfe der [LUX-Components-Config](config-v18) lassen sich globale Einstellungen für die LUX-Ripples der aktuellen Applikation festlegen.

### @Input

| Name                   | Typ     | Beschreibung                                                                                                                                                                                                |
| ---------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxRippleColor         | string  | Enthält die Farbe des Ripples, wenn undefined wird ein leicht transparenter Grau-Wert genommen. Kann einen beliebigen (CSS-gültigen) Farbwert beinhalten (z.B. "blue", "#f00", "rgba(100, 100, 255, 0.4)"). |
| luxRippleUnbounded     | boolean | Dieser Flag stellt ein ob die Animation der Ripple über die Komponente hinauslaufen kann.                                                                                                                   |
| luxRippleCentered      | boolean | Dieser Flag stellt ein ob die Animation aus dem Zentrum der Komponente läuft oder vom jeweiligen Klick.                                                                                                     |
| luxRippleRadius        | number  | Diese Property ermöglicht es, den Radius der Animation festzulegen. Wenn 0 werden die Begrenzungen der Komponente genommen.                                                                                 |
| luxRippleDisabled      | boolean | Dieser Flag deaktiviert das Auslösen der Ripple-Animationen über Maus-Klicks.                                                                                                                               |
| luxRippleEnterDuration | number  | Diese Property ermöglicht es, die Dauer der Eingangsanimation zu bestimmen.                                                                                                                                 |
| luxRippleExitDuration  | number  | Diese Property ermöglicht es, die Dauer der Ausgangsanimation zu bestimmen.                                                                                                                                 |

## Beispiel

Html

```html
<div
  style="padding: 100px; text-align: center"
  luxRipple
  [luxRippleDisabled]="false"
  [luxRippleColor]="'rgba(100, 100, 255, 0.4)'"
>
  Ripple-Target
</div>
```

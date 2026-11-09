# luxAriaDescribedBy

- [luxAriaDescribedBy](#luxariadescribedby)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

ARIA steht für Accessible Rich Internet Applications.

Über die LUX-ARIA-XXX-Direktiven können die LUX-Components mit ARIA-Tags versehen werden,
um möglichst barrierefreie Anwendungen zu erstellen.

| Name     | Beschreibung        |
| -------- | ------------------- |
| selector | luxAriaDescribedby  |

### @Input

| Name                       | Typ    | Beschreibung                                                                                                    |
| -------------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| luxAriaDescribedby         | string | Gibt die ID des beschreibenden Elements an.                                                                     |
| luxAriaDescribedbySelector | string | Über den CSS-Selector (z.B. button) kann das Element beeinflusst werden, an dem das Aria-Attribut gehängt wird. |

## Beispiel

Html

```html
<lux-button luxLabel="Speichern" luxAriaDescribedby="save-hint"></lux-button>
<div id="save-hint">Bitte vergessen Sie nicht, die AGBs zu akzeptieren!</div>
```

### Formularfelder

`lux-input-ac` und `lux-datepicker-ac` besitzen einen gleichnamigen Input `luxAriaDescribedby` (wie bei `luxAriaLabel` und `luxAriaLabelledby`).
Er wird am nativen Eingabeelement vor die eigene Hinweis- bzw. Fehler-Id gestellt, zum Beispiel für eine gemeinsame Meldung mehrerer Felder.
Ist die Direktive im Konsumenten importiert und wird das Attribut an einer dieser Komponenten gesetzt, landet es zusätzlich am Hostelement.

```html
<lux-input-ac luxLabel="Von" luxAriaDescribedby="bereich-meldung"></lux-input-ac>
<lux-input-ac luxLabel="Bis" luxAriaDescribedby="bereich-meldung"></lux-input-ac>
<p id="bereich-meldung" role="status">Von 200 darf nicht größer als Bis 100 sein.</p>
```

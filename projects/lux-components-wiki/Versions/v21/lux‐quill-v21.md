# LUX-Quill

![Beispielbild LUX-Quill](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐quill-v21-img.png)

- [LUX-Quill](#lux-quill)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [Installation](#installation)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
    - [ControlValueAccessor](#controlvalueaccessor)
    - [Zustände](#zustände)
  - [Konfiguration](#konfiguration)
    - [Presets](#presets)
    - [LuxQuillConfig](#luxquillconfig)
    - [Überschriften: Darstellung und Semantik](#überschriften-darstellung-und-semantik)
    - [App-weite Vorgaben (LUX\_QUILL\_CONFIG)](#app-weite-vorgaben-lux_quill_config)
  - [Wert und Ausgabe](#wert-und-ausgabe)
  - [Erweiterbarkeit](#erweiterbarkeit)
  - [Tastaturbedienung und Barrierefreiheit](#tastaturbedienung-und-barrierefreiheit)
  - [Beispiele](#beispiele)
    - [1. Kommentar ohne Formular](#1-kommentar-ohne-formular)
    - [2. Dokument in einem Reactive Form](#2-dokument-in-einem-reactive-form)
    - [3. Überschriften als h2 und h3](#3-überschriften-als-h2-und-h3)
    - [4. Ausgabe anzeigen](#4-ausgabe-anzeigen)

## Overview / API

### Allgemein

| Name     | Beschreibung                      |
| -------- | --------------------------------- |
| selector | lux-quill                         |
| import   | @ihk-gfi/lux-components/lux-quill |

`lux-quill` ist ein Rich-Text-Editor auf Basis von [Quill.js](https://quilljs.com) (Version 2). Er eignet sich für Freitext (z. B. Kommentare) ebenso wie für strukturierte Inhalte (z. B. Textbausteine für Briefe oder PDF-Dokumente). Die Optik (Rahmen, Label, Hinweis, Fehlermeldung, Zustände) entspricht den übrigen Formularfeldern der LUX-Components.

Verfügbare Formatierungen:

- Textstil: Standardtext, Überschrift 1, Überschrift 2 (abhängig von der [Konfiguration](#überschriften-darstellung-und-semantik))
- Fett, Kursiv, Unterstrichen
- Aufzählung und Nummerierung
- Einzug vergrößern/verkleinern (auch per `Tab` bzw. `Umschalt+Tab`)
- Link einfügen, bearbeiten und entfernen
- Formatierung entfernen

Typografie:

| Textstil      | Schriftgröße | Schriftart                                         | Schriftstärke |
| ------------- | ------------ | -------------------------------------------------- | ------------- |
| Standardtext  | 1rem         | App-Schrift (`--lux-theme-app-font-family`)        | Regular (400) |
| Überschrift 1 | 1.5rem       | Headline-Schrift (`--lux-theme-app-headline-font`) | Medium (500)  |
| Überschrift 2 | 1.25rem      | Headline-Schrift (`--lux-theme-app-headline-font`) | Medium (500)  |

Links werden wie alle Textlinks der LUX-Components dargestellt (`--lux-theme-link-plain-*`).

### Installation

Quill ist eine optionale Abhängigkeit der LUX-Components und muss in der Anwendung installiert werden:

```bash
npm install quill@^2.0.3
```

Quill nutzt intern das CommonJS-Paket `quill-delta`. Um die entsprechende Build-Warnung zu vermeiden, kann es in der `angular.json` freigegeben werden:

```json
"allowedCommonJsDependencies": ["quill-delta"]
```

Die Styles des Editors sind im LUX-Theme enthalten. Ein CSS von Quill wird nicht benötigt.

### Inputs

| Name              | Typ                                          | Default     | Beschreibung                                                                                                                                                                                                                                                                                                       |
| ----------------- | -------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| value             | string                                       | `''`        | Der Wert als HTML-String (für die Nutzung ohne Formular). `model<string>`, also auch als `[(value)]` nutzbar. Ein leerer Editor liefert `''`.                                                                                                                                                                      |
| luxLabel          | string                                       | `''`        | Label oberhalb des Editors. Es wird per `aria-labelledby` mit dem Editor verknüpft.                                                                                                                                                                                                                                |
| luxHint           | string                                       | `''`        | Hinweistext unterhalb des Editors.                                                                                                                                                                                                                                                                                 |
| luxPlaceholder    | string                                       | `''`        | Platzhalter im leeren Editor.                                                                                                                                                                                                                                                                                      |
| luxAriaLabel      | string \| undefined                          | `undefined` | Zugänglicher Name, wenn kein sichtbares Label vorhanden ist.                                                                                                                                                                                                                                                       |
| luxAriaLabelledby | string \| undefined                          | `undefined` | Id eines externen Label-Elements. Hat Vorrang vor `luxAriaLabel` und `luxLabel`.                                                                                                                                                                                                                                   |
| luxErrorMessage   | string \| undefined                          | `undefined` | Eigene Fehlermeldung. Sie ersetzt bei jedem Validierungsfehler die Standardmeldung.                                                                                                                                                                                                                                |
| luxErrorCallback  | LuxErrorCallbackFnType \| undefined          | `undefined` | Funktion `(value, errors) => string \| undefined` für eigene Fehlermeldungen je Fehler. Wird nach `luxErrorMessage` ausgewertet.                                                                                                                                                                                   |
| luxRequired       | boolean                                      | `false`     | Pflichtfeld. Nur ohne Formular. In Reactive Forms bzw. mit `ngModel` den `Validators.required` verwenden, `luxRequired` wird dort ignoriert.                                                                                                                                                                       |
| luxDisabled       | boolean                                      | `false`     | Deaktiviert Editor und Toolbar. `model<boolean>`, also auch als `[(luxDisabled)]` nutzbar. In Reactive Forms bzw. mit `ngModel` wird der Zustand mit dem FormControl synchronisiert: `luxDisabled` ruft `disable()`/`enable()` auf, und `formControl.disable()`/`enable()` wird über `luxDisabledChange` gemeldet. |
| readonly          | boolean                                      | `false`     | Schreibschutz. Die Toolbar wird ausgeblendet, der Inhalt bleibt per Tastatur erreichbar und lesbar.                                                                                                                                                                                                                |
| luxNoTopLabel     | boolean                                      | `false`     | Blendet das Label nur visuell aus, für Screenreader bleibt es erhalten.                                                                                                                                                                                                                                            |
| luxNoBottomLabel  | boolean                                      | `false`     | Entfernt den Bereich für Hinweis und Fehlermeldung. Achtung: Damit entfällt auch die per `aria-describedby` verknüpfte Fehlermeldung.                                                                                                                                                                              |
| luxDense          | boolean                                      | `false`     | Kompaktere Darstellung (geringere Innenabstände und Mindesthöhe).                                                                                                                                                                                                                                                  |
| luxMinHeight      | string \| undefined                          | `undefined` | Minimale Höhe des Eingabebereichs, z. B. `'8rem'`. Standard: `6rem` (dense: `4rem`).                                                                                                                                                                                                                               |
| luxMaxHeight      | string \| undefined                          | `undefined` | Maximale Höhe des Eingabebereichs, z. B. `'20rem'`. Längere Inhalte scrollen innerhalb des Editors.                                                                                                                                                                                                                |
| luxId             | string                                       | `''`        | Id des Editors. Ohne Angabe wird eine eindeutige Id erzeugt.                                                                                                                                                                                                                                                       |
| luxTagId          | string \| undefined                          | `undefined` | Tag-Id für automatisierte Tests (`luxTagIdHandler`).                                                                                                                                                                                                                                                               |
| luxPreset         | LuxQuillPreset (`'comment'` \| `'document'`) | `'comment'` | Vordefinierte Konfiguration, siehe [Presets](#presets).                                                                                                                                                                                                                                                            |
| luxConfig         | Partial\<LuxQuillConfig> \| undefined        | `undefined` | Überschreibt einzelne Einstellungen des Presets und von `LUX_QUILL_CONFIG`, siehe [LuxQuillConfig](#luxquillconfig). Eine Änderung zur Laufzeit baut den Editor neu auf. Der Inhalt bleibt erhalten und wird an die neue Konfiguration angepasst (z. B. `<h1>` → `<p class="lux-quill-heading-1">` beim Wechsel auf `headingMode: 'visual'`, nicht mehr erlaubte Formate entfallen). Der angepasste Wert wird über `valueChange` bzw. an das FormControl gemeldet, im Formular ohne es als "dirty" zu markieren. |

### Outputs

| Name              | Typ                           | Beschreibung                                                                                                                        |
| ----------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| valueChange       | OutputEmitterRef\<string>     | Emittiert den neuen Wert (HTML) nach jeder Änderung durch den Benutzer und wenn eine geänderte Konfiguration den Wert anpasst (siehe `luxConfig`). Wird nicht ausgelöst, wenn der Wert von außen gesetzt wird. |
| luxDisabledChange | OutputEmitterRef\<boolean>    | Emittiert, wenn sich der Disabled-Zustand ändert, z. B. durch `formControl.disable()`. Gegenstück zu `[(luxDisabled)]`.             |
| luxFocusIn        | OutputEmitterRef\<FocusEvent> | Emittiert, wenn der Fokus in die Komponente (Toolbar oder Editor) wechselt.                                                         |
| luxFocusOut       | OutputEmitterRef\<FocusEvent> | Emittiert, wenn der Fokus die Komponente verlässt. Das Control gilt danach als "touched".                                           |
| luxEditorCreated  | OutputEmitterRef\<Quill>      | Liefert die Quill-Instanz nach jeder (Neu-)Erzeugung, z. B. für Erweiterungen. Siehe [Erweiterbarkeit](#erweiterbarkeit).           |

Öffentliche Methoden: `focus()` setzt den Fokus in den Editor, `openLinkDialog()` öffnet den Link-Dialog.

### ControlValueAccessor

`lux-quill` implementiert `ControlValueAccessor` und funktioniert mit `formControlName`, `[formControl]` und `[(ngModel)]`. Der Formwert ist ein HTML-String.

- Validatoren werden am FormControl gesetzt. Ein `Validators.required` wird erkannt (Sternchen am Label, `aria-required`), ein leerer Editor liefert `''`.
- Fehlermeldungen erscheinen, sobald das Control "touched" ist, also nach dem Verlassen der Komponente. Reihenfolge: `luxErrorMessage`, `luxErrorCallback`, Standardmeldung der LUX-Components.
- Werte, die von außen gesetzt werden (z. B. `setValue()`), lösen keine Wertänderung aus und machen das Control nicht "dirty".

Hinweis: Validatoren wie `Validators.maxLength` beziehen sich auf den HTML-String inklusive der Tags, nicht auf die Anzahl der sichtbaren Zeichen.

### Zustände

Fehler (Pflichtfeld nach dem Verlassen):

![Zustand Fehler](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐quill-v21-img-05.png)

Deaktiviert (`luxDisabled` bzw. `formControl.disable()`):

![Zustand Disabled](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐quill-v21-img-06.png)

Schreibgeschützt (`readonly`, ohne Toolbar):

![Zustand Readonly](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐quill-v21-img-07.png)

## Konfiguration

### Presets

| Preset     | Einsatz                                  | Überschriften                                                           |
| ---------- | ---------------------------------------- | ----------------------------------------------------------------------- |
| `comment`  | Freitext, z. B. Kommentare (Standard)    | Keine. Eingefügte Überschriften werden zu normalem Text.                |
| `document` | Strukturierte Inhalte, z. B. Briefe, PDF | Semantische Überschriften (`<h1>`, `<h2>`) für Druck- und PDF-Ausgaben. |

Beide Presets bieten dieselbe Toolbar. Sie stehen als Konstanten `LUX_QUILL_PRESET_COMMENT` und `LUX_QUILL_PRESET_DOCUMENT` zur Verfügung.

### LuxQuillConfig

| Eigenschaft   | Typ                                                          | Beschreibung                                                                                                                                                                                                                                                                                                                                        |
| ------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| headingMode   | LuxQuillHeadingMode (`'none'` \| `'visual'` \| `'semantic'`) | Darstellung und Semantik der Überschriften, siehe [unten](#überschriften-darstellung-und-semantik).                                                                                                                                                                                                                                                 |
| headingLevels | [LuxQuillHeadingLevel, LuxQuillHeadingLevel]                 | HTML-Ebenen (1-6) für Überschrift 1 und Überschrift 2 im Modus `'semantic'`. Standard: `[1, 2]`.                                                                                                                                                                                                                                                    |
| toolbar       | LuxQuillToolbarItem[]                                        | Einträge und Reihenfolge der Toolbar: `'heading'`, `'bold'`, `'italic'`, `'underline'`, `'bulletList'`, `'orderedList'`, `'outdent'`, `'indent'`, `'link'`, `'clean'`. Formate ohne Toolbar-Eintrag sind im Editor nicht erlaubt (auch nicht per Tastenkürzel oder beim Einfügen). Ohne `'indent'`/`'outdent'` wechselt `Tab` wie üblich den Fokus. |
| formats       | string[]                                                     | Zusätzliche, per `Quill.register(...)` registrierte Quill-Formate. Siehe [Erweiterbarkeit](#erweiterbarkeit).                                                                                                                                                                                                                                       |
| modules       | Record\<string, unknown>                                     | Zusätzliche Quill-Module bzw. Modul-Optionen. `keyboard.bindings` und `clipboard.matchers` werden mit denen von `lux-quill` zusammengeführt.                                                                                                                                                                                                        |

Die wirksame Konfiguration ergibt sich aus Preset, `LUX_QUILL_CONFIG` und `luxConfig` (in dieser Reihenfolge, spätere Angaben überschreiben frühere eigenschaftsweise).

### Überschriften: Darstellung und Semantik

Darstellung und HTML-Semantik der Überschriften sind voneinander unabhängig: Die Optik hängt immer an einer CSS-Klasse (`lux-quill-heading-1` bzw. `lux-quill-heading-2`), die HTML-Ebene steuern `headingMode` und `headingLevels`.

| headingMode | Toolbar               | Ergebnis für "Überschrift 1"                                         |
| ----------- | --------------------- | -------------------------------------------------------------------- |
| `none`      | ohne Textstil-Auswahl | – (normaler Text)                                                    |
| `visual`    | mit Textstil-Auswahl  | `<p class="lux-quill-heading-1">…</p>`                               |
| `semantic`  | mit Textstil-Auswahl  | `<h1 class="lux-quill-heading-1">…</h1>` (Ebene aus `headingLevels`) |

Textstil-Auswahl in der Toolbar (Modus `visual` oder `semantic`):

![Textstil-Auswahl](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐quill-v21-img-03.png)

Beim Laden eines Werts und beim Einfügen aus der Zwischenablage werden beliebige Überschriften (`<h1>`-`<h6>`) auf die zwei Stufen abgebildet: Ebenen bis einschließlich `headingLevels[0]` werden zu Überschrift 1, tiefere zu Überschrift 2. Im Modus `none` werden sie zu normalem Text.

### App-weite Vorgaben (LUX_QUILL_CONFIG)

```typescript
import { LUX_QUILL_CONFIG } from '@ihk-gfi/lux-components/lux-quill';

export const appConfig: ApplicationConfig = {
  providers: [{ provide: LUX_QUILL_CONFIG, useValue: { toolbar: ['bold', 'italic', 'underline', 'bulletList', 'orderedList', 'link'] } }]
};
```

## Wert und Ausgabe

Der Wert ist semantisches HTML (`quill.getSemanticHTML()`):

- Absätze als `<p>`, Listen als `<ul>`/`<ol>` (eingerückte Listeneinträge als verschachtelte Listen)
- Fett, Kursiv und Unterstrichen als `<strong>`, `<em>` und `<u>`
- Eingerückte Absätze erhalten die Klasse `ql-indent-1` bis `ql-indent-8`
- Links als `<a href="…" rel="noopener noreferrer" target="_blank">`

Beim Setzen eines Werts und beim Einfügen bleiben im Editor nur die erlaubten Formate erhalten. Skripte, Event-Handler, Inline-Styles und nicht erlaubte Elemente werden entfernt, Links mit unsicheren Protokollen (z. B. `javascript:`) werden neutralisiert. Ein von außen gesetzter Wert (`[(value)]`, `setValue()`, `ngModel`) wird dabei nicht zurückgeschrieben: `value` bzw. das FormControl enthalten den ursprünglichen HTML-String, bis der Benutzer den Inhalt ändert oder eine Konfigurationsänderung den Wert anpasst. Werte aus fremden Quellen deshalb bei der Anzeige außerhalb des Editors weiterhin bereinigen (siehe unten). Der Link-Dialog erlaubt `http`, `https`, `mailto` und `tel`, Adressen ohne Protokoll werden um `https://` ergänzt.

Link-Dialog (Toolbar-Button oder `Strg+K`):

![Link-Dialog](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐quill-v21-img-04.png)

Für die Anzeige außerhalb des Editors stellt das Theme die Klasse `lux-quill-content` bereit (Typografie, Überschriften, Listen, Einzüge, Link-Fokus). Gespeichertes HTML sollte bei der Anzeige trotzdem bereinigt werden, z. B. mit [lux-html](lux‐html-v21), siehe [Beispiel 4](#4-ausgabe-anzeigen).

## Erweiterbarkeit

Weitere Quill-Funktionen lassen sich über `luxConfig` bzw. `LUX_QUILL_CONFIG` ergänzen:

1. Format bzw. Modul einmalig global registrieren: `Quill.register(...)` (z. B. `import Quill from 'quill/core'`).
2. Den Namen des Formats in `formats` aufnehmen, Modul-Optionen in `modules`.
3. Über `luxEditorCreated` erhält die Anwendung die Quill-Instanz, z. B. für eigene Event-Handler.

Beispiel: Durchgestrichen per `Strg+Umschalt+S`

```typescript
import Quill from 'quill/core';
import Strike from 'quill/formats/strike';

Quill.register({ 'formats/strike': Strike }, true);

@Component({
  selector: 'app-notiz',
  imports: [LuxQuillComponent],
  template: `<lux-quill luxLabel="Notiz" [luxConfig]="config" [(value)]="notiz"></lux-quill>`
})
export class NotizComponent {
  notiz = signal('');
  config: Partial<LuxQuillConfig> = {
    formats: ['strike'],
    modules: {
      keyboard: {
        bindings: {
          strike: {
            // Mit gedrückter Umschalttaste meldet der Browser den Großbuchstaben.
            key: 'S',
            shortKey: true,
            shiftKey: true,
            handler(this: { quill: Quill }, _range: unknown, context: { format: Record<string, unknown> }) {
              this.quill.format('strike', !context.format['strike'], 'user');
              return false;
            }
          }
        }
      }
    }
  };
}
```

Die Hilfsfunktionen `luxQuillResolveConfig`, `luxQuillFormats`, `luxQuillHeadingAttributes` und `luxQuillNormalizeHtml` werden ebenfalls exportiert.

## Tastaturbedienung und Barrierefreiheit

| Taste                          | Wirkung                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| `Tab` / `Umschalt+Tab`         | Einzug des Absatzes bzw. Listeneintrags vergrößern / verkleinern.                    |
| `Escape`, dann `Tab`           | Verlässt den Editor (vorwärts bzw. mit `Umschalt+Tab` rückwärts, z. B. zur Toolbar). |
| `Strg+B` / `Strg+I` / `Strg+U` | Fett / Kursiv / Unterstrichen (macOS: `Cmd`).                                        |
| `Strg+K`                       | Link einfügen oder bearbeiten.                                                       |
| Pfeiltasten, `Pos1`, `Ende`    | Navigation innerhalb der Toolbar.                                                    |

- Da `Tab` im Editor einrückt, gibt `Escape` den Fokus frei (WCAG 2.1.2 "Keine Tastaturfalle"). Dieser Hinweis ist per `aria-describedby` mit dem Editor verknüpft. Ohne `'indent'`/`'outdent'` in der Toolbar wechselt `Tab` direkt den Fokus.
- Der Editor hat die Rolle `textbox` mit `aria-multiline`, `aria-required`, `aria-invalid`, `aria-readonly` und `aria-disabled`. Label, Hinweis und Fehlermeldung sind per `aria-labelledby` bzw. `aria-describedby` verknüpft.
- Die Toolbar (`role="toolbar"`) ist ein einziger Tab-Stopp (Roving Tabindex). Umschalter melden ihren Zustand per `aria-pressed`, die Textstil-Auswahl ist ein Menü mit `menuitemradio`-Einträgen.
- Klicks auf die Toolbar nehmen dem Editor weder Fokus noch Markierung.

## Beispiele

### 1. Kommentar ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐quill-v21-img-01.png)

Html

```html
<lux-quill luxLabel="Kommentar" luxPlaceholder="Kommentar eingeben" [luxRequired]="true" [(value)]="comment"></lux-quill>
```

Ts

```typescript
comment = signal('');
```

### 2. Dokument in einem Reactive Form

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐quill-v21-img-02.png)

Html

```html
<form [formGroup]="form">
  <lux-quill
    formControlName="anschreiben"
    luxLabel="Anschreiben"
    luxHint="Erscheint im PDF unterhalb der Anrede."
    luxPreset="document"
    luxMinHeight="12rem"
  ></lux-quill>
</form>
```

Ts

```typescript
form = new FormGroup({
  anschreiben: new FormControl('', { nonNullable: true, validators: Validators.required })
});
```

### 3. Überschriften als h2 und h3

Steht der Inhalt auf einer Seite, die bereits eine `<h1>` besitzt, können die Überschriften eine Ebene tiefer ausgegeben werden. Die Optik bleibt die von Überschrift 1 und 2.

Html

```html
<lux-quill luxLabel="Abschnitt" luxPreset="document" [luxConfig]="{ headingLevels: [2, 3] }" [(value)]="section"></lux-quill>
```

### 4. Ausgabe anzeigen

Html

```html
<lux-html [luxData]="comment()" luxClass="lux-quill-content" [luxSanitizeConfig]="{ addAllowedAttrs: ['target'] }"></lux-html>
```

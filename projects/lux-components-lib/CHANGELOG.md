# Changelog

- [Changelog](#changelog)
  - [Version 19.0.0](#version-1900)
    - [Technische Änderungen](#technische-änderungen)
      - [Umstellung auf Standalone-Components](#umstellung-auf-standalone-components)
      - [Neue Einstiegspunkte](#neue-einstiegspunkte)
      - [lux-file-list ist deprecated](#lux-file-list-ist-deprecated)
    - [Optische Änderungen](#optische-änderungen)
    - [Allgemein](#allgemein)
    - [Issues](#issues)

## Version 19.0.0

### Technische Änderungen

#### Umstellung auf Standalone-Components

Die LUX-Components wurden auf Standalone-Components umgestellt. D.h. es ändert sich die Art, wie die LUX-Components importiert werden.
  
  Alt:

  ```ts
  @NgModule({
  imports: [
    LuxFormModule // <-- Modulimport
    ]
  })
  export class MyModule {}
  ```

  Neu:

  ```ts
  @NgModule({
  imports: [
    LuxInputAcComponent // <-- Standalone-Component-Import
    ]
  })
  export class MyModule {}
  ```

  D.h. es wird nicht mehr ein vollständiges Modul importiert, sondern direkt die benötigte Komponente.

#### Neue Einstiegspunkte

Die LUX-Components bieten jetzt unterschiedliche Einstiegspunkte. Dies hat den Vorteil, dass nur die Komponenten geladen werden, die auch imporiert werden. Wenn man z.B. die Komponente _lux-html_ mit deren Abhängigkeiten nicht verwendet, wird diese auch nicht mehr geladen.
  
  | Einstiegspunkt                           | Komponente                                     | Beispiel                                                                              |
  | ---------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------- |
  | @ihk-gfi/lux-components/lux-html         | _lux-html_                                     | `import { LuxHtmlComponent } from '@ihk-gfi/lux-components/lux-html';`                |
  | @ihk-gfi/lux-components/lux-markdown     | _lux-markdown_                                 | `import { LuxMarkdownComponent } from '@ihk-gfi/lux-components/lux-markdown';`        |
  | @ihk-gfi/lux-components/lux-file-preview | _lux-file-preview_                             | `import { LuxFilePreviewService } from '@ihk-gfi/lux-components/lux-file-preview';`   |
  | @ihk-gfi/lux-components                  | Alle anderen Komponenten (z.B. _lux-input-ac_) | `import { LuxInputAcComponent, LuxStepperComponent } from '@ihk-gfi/lux-components';` |

#### lux-file-list ist deprecated

Die Komponente _lux-file-list_ wurde als deprecated markiert. Bitte die Komponente _lux-file-upload_ verwenden.
Die _lux-file-upload_ verfügt auch über eine Listendarstellung (siehe Property _luxListOnly_).

### Optische Änderungen

- Die PDF-Vorschau der Komponente _lux-file-preview_ nutzt jetzt die PDF-Browser-Integration und basiert nicht länger auf den Abhängigkeiten _ng2-pdf-viewer_ und _pdfjs-dist_.
- Aufgrund der Barrierefreiheit wurden die folgenden Komponenten (z.B. Farbkontraste, Hover-Effekte,...) überarbeitet:
  - _lux-button_
  - _lux-chips_
  - _lux-badge_
  - _lux-textbox_
  - _lux-message_
  - _lux-snackbar_
  - _lux-file_upload_
- Aufgrund der Barrierefreiheit wurde die Farbe _brown_ aus den folgenden Klassen ersatzlos entfernt:
  - _LuxProgressColor_
  - _LuxSnackbarColor_
  - _LuxIconColor_
  - _LuxBadgeColor_
  - _LuxMessageBoxColor_
  - _LuxBgAllColor_

### Allgemein

- Update auf Angular 19.
- Neue Directive _LuxAutofocusDirective_ (z.B. _\<lux-input-ac luxAutofocus ...>\</lux-input-ac>_) hinzugefügt.
- Die Komponente _lux-file-upload_ wurde überarbeitet und verfügt jetzt auch über eine Listendarstellung (siehe Property _luxListOnly_).
- Verbesserungen der Barrierefreiheit (z.B. Farben für High-contrast-Mode).

### Issues

- Issue  #1: Probleme in der Barrierefreiheit der Lux-Chips
- Issue  #2: Fehlt: autofocus-Eigenschaft für das Input-Element
- Issue  #3: lux-dialog: aria-hidden on an element
- Issue  #5: lux-button: den Spinner an Stelle eines Icons anzeigen
- Issue #17: Style-Anpassungen: die css-Variablen sollen überarbeitet und verwendet werden
- Issue #21: lux-file-upload: Erweiterung durch Custom-Actions, neuer Modus und Redesign für Authentic
- Issue #22: lux-autocomplete-ac: Inkonsistentes Verhalten bei Nutzung von ViewEncapsulation.ShadowDom
- Issue #23: ARIA-label für File-Upload-Komponenten
- Issue #24: A11y: Textgrößen müssen anpassbar sein
- Issue #28: lux-Accordion: Property LuxTogglePosition wird nicht richtig übernommen
- Issue #32: lux-file-upload: lux-interface-alert-warning-triangle in der Error Message anzeigen
- Issue #33: lux-snackbar - Text nicht sichtbar
- Issue #35: lux-tooltip: soll auch bei Keyboardfocus funktionieren
- Issue #36: LUX-Componentsversion 19 umsetzen
- Issue #40: Barrierefreiheit für die v19 herstellen
- Issue #41: lux-form-wrapper: Kontrast beim "Hint-Container" bei disabled
- Issue #42: Farben für High-contrast-Mode anlegen
- Issue #43: lux-list: neues Attribut für Aria-Label erstellen
- Issue #44: lux-stepper: Aria Rollen der Kindelemente prüfen und anpassen
- Issue #50: lux-file-list: Neue Option in der DeleteActionConfig, um Lösch-Button einzeln zu deaktivieren
- Issue #51: lux-stepper - der Finish-Button lässt sich trotz luxDisabled=true anklicken
- Issue #58: Probleme mit Aria-Labeln

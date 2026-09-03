# Changelog

- [Changelog](#changelog)
  - [Version 21.8.0](#version-2180)
    - [Issues](#issues)
  - [Version 21.7.0](#version-2170)
    - [Issues](#issues-1)
  - [Version 21.6.0](#version-2160)
    - [Issues](#issues-2)
  - [Version 21.5.0](#version-2150)
    - [Issues](#issues-3)
  - [Version 21.4.0](#version-2140)
    - [Issues](#issues-4)
  - [Version 21.3.1](#version-2131)
    - [Issues](#issues-5)
  - [Version 21.3.0](#version-2130)
    - [Issues](#issues-6)
  - [Version 21.2.0](#version-2120)
    - [Issues](#issues-7)
  - [Version 21.1.0](#version-2110)
    - [Issues](#issues-8)
  - [Version 21.0.0](#version-2100)
    - [Issues](#issues-9)
  - [Version 19.7.0](#version-1970)
    - [Issues](#issues-10)
  - [Version 19.6.0](#version-1960)
    - [Issues](#issues-11)
  - [Version 19.5.0](#version-1950)
    - [Issues](#issues-12)
  - [Version 19.4.0](#version-1940)
    - [Issues](#issues-13)
  - [Version 19.3.0](#version-1930)
    - [Issues](#issues-14)
  - [Version 19.2.0](#version-1920)
    - [Issues](#issues-15)
  - [Version 19.1.0](#version-1910)
    - [Issues](#issues-16)
  - [Version 19.0.0](#version-1900)
    - [Technische Änderungen](#technische-änderungen)
      - [Umstellung auf Standalone-Components](#umstellung-auf-standalone-components)
      - [Neue Einstiegspunkte](#neue-einstiegspunkte)
      - [lux-file-list ist deprecated](#lux-file-list-ist-deprecated)
    - [Optische Änderungen](#optische-änderungen)
    - [Allgemein](#allgemein)
    - [Issues](#issues-17)

## Version 21.8.0

### Issues

- Issue #259: `lux-select-ac` behält beim Selektieren einer Option die Reihenfolge bei (#266)
- Issue #267: A11y: luxNoTopLabel/luxNoLabels blenden das Label nur noch visuell aus (lux-sr-only), das `<label>` bleibt im DOM und der zugängliche Name erhalten. Neu: luxAriaLabel und luxAriaLabelledby als Inputs auf allen Form-Controls. Behoben: doppelte DOM-ID in lux-select-ac. Hinweis 1: Anwendungs-Tests, die bei luxNoTopLabel auf ein fehlendes `<label>` prüfen, müssen angepasst werden. Hinweis 2: luxNoBottomLabel/luxNoLabels entfernen weiterhin bewusst Hint und Fehlermeldung aus dem DOM. Hinweis 3: lux-file-list und lux-file-upload folgen in einem separaten Issue. Hinweis 4 für fakeAsync-Tests: Die Form-Controls planen beim Initialisieren einen einmaligen setTimeout für die A11y-Prüfung ein, der in fakeAsync-Tests per tick() oder flush() abgearbeitet werden muss.
- Issue #268: lux-menu-Items können per luxDisabledAria wahrnehmbar deaktiviert werden (sichtbar, fokussierbar, Screenreader sagen "deaktiviert" an); Klick/Enter emittiert luxClickNotAllowed statt luxClicked. Bewusst ohne Styling: aria-disabled Items sehen wie normale Items aus, die Anwendung reagiert über luxClickNotAllowed. Abgrenzung: luxDisabled (aus der Tastaturreihenfolge entfernt) vs. luxDisabledAria (wahrnehmbar deaktiviert) vs. luxHidden (ausgeblendet). Neu dafür: Direktive luxAriaDisabled, die aria-disabled zuverlässig auch an Material-Elementen setzt.
- Issue #269: lux-table deaktiviert die alternierenden Zeilenfarben automatisch, sobald mindestens eine Zeile eine `lux-text-highlight-*`-Klasse trägt. Die Zeilentrennung erfolgt dann über horizontale Trennlinien.
- Issue #274: Sicherheitsrisiko: window.open() ohne "noopener,noreferrer" bei externen Links in LuxLinkComponent (Reverse Tabnabbing). lux-link und lux-link-plain öffnen Links in neuen Tabs jetzt mit noopener,noreferrer, zusätzlich setzen die Anker bei luxBlank das rel-Attribut "noopener noreferrer".
- Issue #275: Neue Optionen `luxStickyHeader` und `luxStickyHeaderOffset` für lux-panel und lux-accordion. Der Header eines geöffneten Panels bleibt beim Scrollen am oberen Rand des Scroll-Bereichs sichtbar, bis der Panel-Inhalt aus dem Sichtbereich geschoben ist.
- Issue #282: Step-Titel wird korrekt angezeigt, auch wenn Header/Content in separate Komponenten ausgelagert werden (#283)
- Issue #284: `LuxFormComponentBase`: `distinctUntilChanged()` unterdrückt keine `valueChanges`-Events mehr nach Wertänderungen mit `emitEvent: false` (#285)

## Version 21.7.0

### Issues

- Issue #74: axe-core für automatisierte Tests verwenden (#265)
- Issue #238: Lux-Session-Timer verschwindet nicht wenn der User sich ausloggt (#261)
- Issue #247: Menu-Panels-Items analog zu Button-Farben darstellen (#258)
- Issue #248: Muted-Colors für Badges anbieten (#260)
- Issue #262: luxTooltipIfTruncated erkennt mehrzeilig gekürzten Text (line-clamp) nicht (#263)

## Version 21.6.0

### Issues

- Issue #128: Eigene Paginator Komponente im Lux Components Design (#243)
- Issue #189: lux-menu-panel soll auch rechteckige Icons anzeigen können (#239)
- Issue #237: Umstellung Anrede und Dialoge (#255)
- Issue #240: `[luxRequired]="true"` überschreibt Reactive-Form-Validatoren in `lux-input-ac` (#254)
- Issue #241: Tooltip-Unterstützung für `lux-select-ac` mit Filter (#253)
- Issue #242: Lookup-autocomplete-ac Text zurücksetzen (#244)
- Issue #245: Link zu LuxBrandLogo im lux-app-header (#246)
- Issue #250: LuxValidators.email implementiert (#256)
- Issue #251: Neue luxTooltipIfTruncated-Direktive implementiert (#257)

## Version 21.5.0

### Issues

- Issue #167: lux-tabs: Notification soll in andern Farben darstellbar sein (#231)
- Issue #168: Neue Komponente Timepicker (#236)
- Issue #205: lux-list: Erweiterung der Tastaturnavigation für komplexe List-Items (#233)
- Issue #227: Neue Utility-Klassen aus Camara-Components übernehmen (#235)
- Issue #232: Lux-Table Property "luxColWidthsPercent" wird mit LUX Components 21 ignoriert oder rechnet falsch (#234)

## Version 21.4.0

### Issues

- Issue #15: LuxRequired funktioniert für die Chips nicht wenn keine Reactive Forms benutzt werden (#208)
- Issue #18: lux-checkbox-container: Erweiterung (#219)
- Issue #70: lux-table: Fehler beim sortieren nach Spalte mit Checkbox (#207)
- Issue #127: Erweiterung des Tenant-Logo um Fehlerbehandlung (#229)
- Issue #154: Lux-Stepper überarbeiten (#228)
- Issue #182: Lux-Card: Card-Actions werden bei mobiler Ansicht nicht übereinander angezeigt (#209)
- Issue #190: lux-message-box: die Paginator-Background-Color auf Transparent setzen (#211)
- Issue #193: lux-menu: Custom-Trigger wird nach dem schließen des Menu-Panels nicht fokussiert (#210)
- Issue #196: DateTimePicker Bug beim selektieren des ersten Tages eines Monats (#212)
- Issue #197: Performance-Problem bei einer großen Menge von Objekten im Autocomplete (#206)
- Issue #198: Chips disabled erlaubt weiterhin Eingaben (#221)
- Issue #199: Berechnung der verbleibenden Sessiondauer anhand von Timestamp (#199)
- Issue #201: Scrollbar in einzeiligen Snackbars wenn in Edge geöffnet (#213)
- Issue #202: Layout-Bruch in LUX-Menu Einträgen mit Icons in Firefox (#214)
- Issue #203: lux-message-box im ausklappbaren Bereich von lux-card (#215)
- Issue #216: lux-card: Card nur mit Actions aber ohne Header und Content hat einen zu großen oberen Abstand (#218)
- Issue #217: LuxTable - LuxNoDataText Anzeigefehler bei Signals (#220)
- Issue #223: lux-accordion - Panel-Ränder nicht sichtbar (#224)
- Issue #225: lux-filter-form - Unterschiedlicher Abstand nach unten (#226)

## Version 21.3.1

### Issues

- Issue #194: Icon-Pfade sind fehlerhaft (#195)

## Version 21.3.0

### Issues

- Issue #166: Feinschliff Styletokens v21 (#187)
- Issue #180: lux-table: Cursor wird auch bei readonly-Tabelle zum Pointer (#185)
- Issue #183: LuxDialogService: Error in ui when setting percentage for width/height in dialogConfig (#186)
- Issue #184: Neue Icons hinzufügen (#192)
- Issue #188: Lux-File-Upload: Edit/Delete-Configs sollten so angezeigt werden, wie sie konfiguriert sind (#191)

## Version 21.2.0

### Issues

- Issue #141: Selectable Filter (#158)
- Issue #155: reine Icon-Buttons (#175)
- Issue #169: Neue Komponte "Button-Toggle" (#173)
- Issue #170: Neue Komponente "Cookie Consent" (#172)
- Issue #176: Sprung nach Selektieren von Optionen gefixet und Tests erweitert (#178)

## Version 21.1.0

### Issues

- Issue #156: Chips mit langem Inhalt laufen aus der Ansicht (#163)
- Issue #153: Enhance lux-breadcrumb component with multi-line support … (#159)
- Issue #161: Dialog Breite einstellen funktioniert nicht (#162)
- Issue #164: Local Storage darf nur von Komponenten bei gesetztem Config-Property "useLocalStorageForComponentsAllowed=true" genutzt werden (#165)

## Version 21.0.0

### Issues

- Issue #7: Session Countdown
- Issue #62: Komponenten lux-link und lux-link-plain sollen sich wie HTML-Anchor-Tags verhalten (#149)
- Issue #68: Umstellung auf Angular v20
- Issue #75: Readonly-Status der Form-Controls soll optisch überarbeitet werden (#150)
- Issue #108: I18N auf Transloco umstellen (#115)
- Issue #121: Farbe des Nativen Links entspricht nicht den Themefarben (#142)
- Issue #122: Umstellung auf das neue Material-Theme 3 inklusive Design Tokens (#136)
- Issue #125: Custom-Header für eine Lux-Card (#151)
- Issue #129: Neue Popup-Komponente (Tooltip-/Popover-ähnlich) (#140)
- Issue #133: Title/Subtitle aktualisiert sich nicht in Liste des master-detail-ac (#144)
- Issue #134: Erweiterung Button-Komponente: luxDisabledAria & ClickNotAllowed Event (#145)
- Issue #137: Umstellung auf Angular v21 (#147)
- Issue #157: Finalisierung Release v21: Bugfixes, Dokumentation, Updater,... (#160)
    - [Issues](#issues-8)

## Version 19.7.0

### Issues

- Issue #170: Neue Komponente "Cookie Consent" (#172)

## Version 19.6.0

### Issues

- Issue #164: Local Storage darf nur von Komponenten bei gesetztem Config-Property "useLocalStorageForComponentsAllowed=true" genutzt werden (#165)

## Version 19.5.0

### Issues

- Issue #110: Bei hohem Kontrast fehlt das Öffnen-Icon des LUX-Selects (#123)
- Issue #112: Klick auf Input- oder Textarea-Padding führt zu unerwartetem Verhalten (#124)
- Issue #130: LUX-Lookup-Komponenten an den Lookup-Service 2.x anpassen (#131)
- Issue #132: Erweiterung von lux-chips-ac um keepInputLabel (#135)
- Issue #138: Automatische Auswahl der einzigen Option in Autocomplete deaktivierbar machen (#139)

## Version 19.4.0

### Issues

- Issue #67: lux-menu-panel neue Optionen einführen
- Issue #93: Filter ist nicht barrierefrei (#120)
- Issue #101: Kontraste im Green Theme (#107)
- Issue #102: Text Overflow in Tiles und Panels (#106)
- Issue #104: luxTagId wird für Menüitems im Overlay (lux-menu-item als Button) nicht gesetzt (#105)
- Issue #113: Farbe der zweiten Zeile im großen Menü Panel korrigieren
- Issue #116: Umstellung des Tenant-Icons bei Blueprint und Demo (#119)
- Issue #117: LUX-Tile verwendet die noch Schriftart "Roboto" (#118)

## Version 19.3.0

### Issues

- Issue #4: Buttons im Lux App-Footer werden nicht korrekt in das 3-Punkt-Menü geschoben
- Issue #10: Annimation für den Lux-Master-Detail-Ac wieder herstellen (#95)
- Issue #11: lux-tabs: Custom-Tabs in Kombination mit Lazy-Loading funktioniert nicht (#97)
- Issue #12: LuxTable: Spalten ein- und ausblenden (#103)
- Issue #13: Scrollen über Master-Detail funktioniert nicht (#91)
- Issue #61: LuxFilterForm: Eigene Components (#98)
- Issue #69: Lux-Table: Unterschiedliche Anzahl-Anzeige bei Multiselect (mit/ohne HttpDao (#100)
- Issue #85: file upload maxfilecount (#89)
- Issue #88: Stylingklassen für Texthighlight (#92)
- Issue #94: Master-Detail ist nicht barrierefrei (#96)
- Issue #99: Lux-Card: Unerwünschtes Padding und Ausrichtung der Action-Buttons

## Version 19.2.0

### Issues

- Issue #9: LuxDialog asynchron nicht nutzbar (#82)
- Issue #37: chips-ac: Auswahl reagiert nicht auf Scrollen auf der Main Page (#79)
- Issue #80: Lux-Autocomplete-ac um TemplateRef für Custom-Options erweitert (#81)
- Issue #83: Editierbare Tabellen ermöglichen (#84)
- Issue #86: Fehlermeldungen in editierbaren Tabellen verschoben (#87)

## Version 19.1.0

### Issues

- Issue #14: lux-lookup-combobox: Selektierter Eintrag wird manchmal nicht angezeigt (#66)
- Issue #63: lux-file-upload - Die Custom-Actions sollen auch in der Listenansicht angezeigt werden (#65)

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

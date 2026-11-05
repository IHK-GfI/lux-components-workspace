# LUX-File-List

**Diese Komponente ist veraltet. Bitte die Komponente LUX-File-Upload verwenden!**

![Beispielbild LUX-File-List](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐list-v22-img.png)

- [LUX-File-List](#lux-file-list)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Classes / Interfaces](#classes--interfaces)
    - [ILuxFileObject](#iluxfileobject)
    - [ILuxFileError](#iluxfileerror)
    - [LuxFileErrorCause](#luxfileerrorcause)
    - [ILuxFilesActionConfig](#iluxfilesactionconfig)
    - [ILuxFileActionConfig](#iluxfileactionconfig)
    - [ILuxFilesListActionConfig](#iluxfileslistactionconfig)
    - [ILuxFileListActionConfig](#iluxfilelistactionconfig)
    - [ILuxFileListDeleteActionConfig](#iluxfilelistdeleteactionconfig)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Simple](#2-simple)
    - [3. Mit Formular](#3-mit-formular)
    - [4. Mit Upload-URL](#4-mit-upload-url)
    - [5. Mit Base64-Callback](#5-mit-base64-callback)
    - [6. Mit Download](#6-mit-download)
    - [7. Mit Dateieinschränkungen](#7-mit-dateieinschränkungen)

## Overview / API

### Allgemein

| Name     | Beschreibung  |
| -------- | ------------- |
| selector | lux-file-list |

**Diese Komponente ist veraltet. Bitte die Komponente LUX-File-Upload verwenden!**

### @Input

| Name                    | Typ                            | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxShowPreview          | boolean                        | Dieses Flag steuert, ob für Image-Dateien ein kleines Preview-Bild anstelle eines normalen Icons angezeigt werden soll (Voraussetzung: base64-Inhalt der Datei ist geladen). Default: true.                                                                                                                                                                                                        |
| luxMultiple             | boolean                        | Bestimmt, ob mehrere Dateien für diese Component geladen werden können. Default: true.                                                                                                                                                                                                                                                                                                             |
| luxMaxSizeMiB           | number                         | Definiert die maximale Dateigröße in MiB, die jede Datei haben darf. Default: 10.                                                                                                                                                                                                                                                                                                                  |
| luxMaxFileCount         | number                         | Definiert die maximale Anzahl an Dateien, die ausgewählt werden dürfen. Default: 100.                                                                                                                                                                                                                                                                                                              |
| luxCapture              | string                         | Bestimmt für Mobilgeräte, ob die Front- bzw. Rückkamera verwendet wird. Mögliche Werte: '' (keine Vorgabe), 'user' (Frontkamera), 'environment' (Rückkamera). Default: ''.                                                                                                                                                                                                                         |
| luxUploadUrl            | string                         | Enthält die URL mit der Schnittstelle, die angesprochen werden soll um die Dateien hochzuladen. Wenn diese Property leer ist, wird kein automatischer Upload durchgeführt. Default: ''.                                                                                                                                                                                                            |
| luxUploadActionConfig   | ILuxFilesListActionConfig      | Enthält die Konfiguration für alle Upload-Buttons der Component.                                                                                                                                                                                                                                                                                                                                   |
| luxDeleteActionConfig   | ILuxFileListDeleteActionConfig | Enthält die Konfiguration für alle Delete-Buttons der Component.                                                                                                                                                                                                                                                                                                                                   |
| luxViewActionConfig     | ILuxFileActionConfig           | Enthält die Konfiguration für alle View-Buttons der Component. Die View-Buttons rufen die "contentCallback"-Methode des jeweiligen ILuxFileObjects auf, um den Inhalt nachzuladen (wenn er nicht bereits vorhanden ist). Dadurch ist es möglich, Dateien dynamisch nachzuladen, wenn erforderlich. Für eine Vorschau siehe auch [lux-file-preview](lux‐file‐preview-v22).                          |
| luxDownloadActionConfig | ILuxFileActionConfig           | Enthält die Konfiguration für alle Download-Buttons der Component.                                                                                                                                                                                                                                                                                                                                 |
| luxCustomActionConfigs  | ILuxFileActionConfig[]         | Enthält die Konfiguration für alle Custom-Buttons der Component. Default: [].                                                                                                                                                                                                                                                                                                                      |
| luxMaximumExtended      | number                         | Anzahl der Aktionen, die direkt als Buttons angezeigt werden; weitere Aktionen landen in einem Menü. Default: 6.                                                                                                                                                                                                                                                                                   |
| formField               | FieldTree\<T\>                 | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                                                                                                                                                        |
| value                   | ILuxFileObject[] \| null       | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet.                                                                                                                                                                                                                                                                    |
| luxSelected             | ILuxFileObject[] \| null       | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden. Property, die die aktuell bekannten ILuxFileObjects enthält. Durch den Output "luxSelectedChange" ist ein Two-Way-Binding möglich.                                                                                                                                                                                             |
| luxAccept               | string                         | Über diese Property ist es möglich nur bestimmte Dateitypen zu erlauben (z.B. '.pdf' oder 'image/\*'). Default: ''.                                                                                                                                                                                                                                                                                |
| luxContentsAsBlob       | boolean                        | Schaltet die Dateibehandlung so um, dass sie anstelle von Base64-Strings mit Blobs für die Dateien umgeht. Anmerkung: Bei Base64 den Präfix nicht vergessen: data:\[\<MIME-Typ>\]\[;charset=\<Zeichensatz>\]\[;base64\],\<Daten> Z.B. data:image/png;base64,iVBORw0KGgoAAAA... Default: false.                                                                                                     |
| luxUploadReportProgress | boolean                        | Schaltet die Progressbar um, so dass beim Upload von Dateien vom Backend Feedback zurückgegeben werden kann, um so dem User den Fortschritt mitteilen zu können. Die Component liest dafür die Werte "loaded" und "total" aus dem HttpEvent der Post-Abfrage aus, um den Progress zu bestimmen. Wenn false, wird stattdessen eine Progressbar im "indetermined"-Zustand angezeigt. Default: false. |
| luxDnDActive            | boolean                        | Bestimmt, ob Dateien via Drag-and-Drop (DnD) auf diese Component übertragen werden können. Default: true.                                                                                                                                                                                                                                                                                          |
| luxHeading              | number (1..6)                  | Bestimmt, welches Überschriften-Tag (h1...h6) für das Label der Liste verwendet wird. <br><br> Die Darstellung ist fest definiert; das Überschriftenlevel dient ausschließlich der Struktur der Seite (Barrierefreiheit), damit die Überschriften einer Seite vollständig korrekt verschachtelt werden können. Default: 2.                                                                         |
| luxTagId                | string                         | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                                                      |
| luxRequired             | boolean                        | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                                                                                            |
| luxControlBinding       | string                         | **Veraltet**, stattdessen `[formField]` verwenden. Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                                                    |
| luxErrorMessage         | string                         | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                                                                                     |
| luxDisabled             | boolean                        | Bestimmt, ob die Component deaktiviert ist oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich.                                                                                                                                                                                                                                                                                             |
| luxReadonly             | boolean                        | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                                                                                                                                                                                   |
| luxErrorCallback        | LuxErrorCallbackFnType         | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                                                                         |
| luxControlValidators    | ValidatorFnType                | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                                                                             |
| luxLabel                | string                         | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                        |
| luxHint                 | string                         | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                                                                                           |
| luxFormGroup            | FormGroup                      | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                                                                                                                                                                              |
| luxFormControl          | FormControl                    | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                                                                                                                                                                                 |

### @Output

| Name              | Typ                      | Beschreibung                                                                                                                                                                                         |
| ----------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxSelectedChange | ILuxFileObject[] \| null | Gehört zur veralteten `luxSelected`-API, stattdessen `(valueChange)` verwenden. Output-Event das bei Änderungen am luxSelected-Feld ausgestoßen wird. Ermöglicht das Two-Way-Binding an luxSelected. |
| luxFocusIn        | FocusEvent               | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                             |
| luxFocusOut       | FocusEvent               | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                            |
| luxDisabledChange | boolean                  | Event welches beim Disablen des Elements ausgelöst wird.                                                                                                                                             |
| valueChange       | ILuxFileObject[] \| null | Wird ausgelöst, wenn sich der Wert ändert (implizit aus dem `value`-Model, Grundlage von `[(value)]`).                                                                                               |
| luxBlur           | FocusEvent               | Wird ausgelöst, wenn das Element selbst den Fokus verliert (Kindelemente werden nicht betrachtet).                                                                                                   |
| luxFocus          | FocusEvent               | Wird ausgelöst, wenn das Element selbst den Fokus erhält (Kindelemente werden nicht betrachtet).                                                                                                     |

## Classes / Interfaces

### ILuxFileObject

Dieses Interface stellt eine Datei dar und wird von den LuxFileComponents entgegen genommen und weiter gereicht.
Sie enthält den Namen der Datei sowie den Base64-Stringwert bzw. den Blob-Content sowie eine Callback-Funktion, welche diesen wiedergibt.

| Name             | Typ                                      | Beschreibung                                                                                                                                                                                                                                                                                       |
| ---------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name             | string                                   | Enthält den Namen der Datei.                                                                                                                                                                                                                                                                       |
| type             | string                                   | Enthält den Dateityp.                                                                                                                                                                                                                                                                              |
| size?            | number                                   | Enthält die Dateigröße (Bytes).                                                                                                                                                                                                                                                                    |
| content?         | string \| Blob                           | Enthält den Base64-Inhalt bzw. den Blob-Wert der Datei.                                                                                                                                                                                                                                            |
| contentCallback? | Promise\<any> \| Observable\<any> \| any | Enthält eine Funktion, welche den Base64-Inhalt/Blob-Wert der Datei wiedergibt. Diese Funktion wird von der View-Action (standardmäßig der Button mit dem "eye"-Icon) aufgerufen, um den Base64 Inhalt nachzuladen. Bei großen Dateien nützlich, um nicht direkt alle Inhalte auf einmal zu laden. |
| namePrefix?      | string                                   | Enthält den Präfix                                                                                                                                                                                                                                                                                 |
| namePrefixColor? | string                                   | Enthält die Farbe des Präfixes                                                                                                                                                                                                                                                                     |
| nameSuffix?      | string                                   | Enthält den Suffix                                                                                                                                                                                                                                                                                 |
| nameSuffixColor? | string                                   | Enthält die Farbe des Suffixes                                                                                                                                                                                                                                                                     |

### ILuxFileError

Dieses Interface wird von den Objekten genutzt, welche bei Fehlern während der Ausführung der Component (z.B. dem Upload oder der Dateiauswahl) entstehen.

| Name      | Typ               | Beschreibung                                                                                   |
| --------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| cause     | LuxFileErrorCause | Enum-Wert mit der Ursache des Fehlers.                                                         |
| exception | any               | Enthält den eigentlichen Fehler, dies kann ein Fehlerobjekt oder aber auch Fehler-Nachrichten. |
| file?     | File              | Enthält die Datei, bei der der Fehler aufgetreten ist.                                         |

### LuxFileErrorCause

Enum mit möglichen Fehlerquellen.

| Name              | Wert                   | Beschreibung                                                                             |
| ----------------- | ---------------------- | ---------------------------------------------------------------------------------------- |
| MaxSizeError      | 'luxMaximumSize'       | Fehler, der bei überschrittener Dateigröße auftritt.                                     |
| MaxFileCount      | 'luxMaxFileCount'      | Fehler, wenn die maximale Anzahl an Dateien (luxMaxFileCount) überschritten wird.        |
| ReadingFileError  | 'luxReadingFile'       | Fehler, der beim Auslesen des Base64-Inhalts einer Datei auftritt.                       |
| UploadFileError   | 'luxUploadFile'        | Fehler, der beim Hochladen einer/mehrerer Dateien auftritt.                              |
| FileNotAccepted   | 'luxUnacceptedFile'    | Fehler, wenn die Datei nicht den korrekten Dateityp hat (eingeschränkt durch luxAccept). |
| MultipleForbidden | 'luxMultipleForbidden' | Fehler, der beim Übergeben von mehreren Dateien auftritt, obwohl nur eine erlaubt ist.   |

### ILuxFilesActionConfig

Dieses Interface enthält die möglichen Einstellungen für die Action-Buttons der LuxFileComponents.

| Name     | Typ                               | Beschreibung                                                                                                |
| -------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| hidden   | boolean                           | Bestimmt, ob diese Aktion für die aktuelle LuxFileComponent angezeigt werden soll oder nicht.               |
| disabled | boolean                           | Bestimmt, ob diese Aktion für die aktuelle LuxFileComponent deaktiviert ist oder nicht.                     |
| iconName | string                            | Definiert das Icon für diese Aktion.                                                                        |
| label    | string                            | Die Bezeichnung.                                                                                            |
| prio?    | number                            | Über die Priorität kann die Anzeigereihenfolge beeinflusst werden.                                          |
| onClick? | (files: ILuxFileObject[]) => void | Optionaler Callback, welcher bei der Durchführung der Aktion mit allen betroffenen Dateien aufgerufen wird. |

### ILuxFileActionConfig

Wie ILuxFilesActionConfig, der Callback erhält jedoch eine einzelne Datei (verwendet u.a. für luxViewActionConfig, luxDownloadActionConfig und luxCustomActionConfigs).

| Name     | Typ                            | Beschreibung                                                                                  |
| -------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| hidden   | boolean                        | Bestimmt, ob diese Aktion für die aktuelle LuxFileComponent angezeigt werden soll oder nicht. |
| disabled | boolean                        | Bestimmt, ob diese Aktion für die aktuelle LuxFileComponent deaktiviert ist oder nicht.       |
| iconName | string                         | Definiert das Icon für diese Aktion.                                                          |
| label    | string                         | Die Bezeichnung.                                                                              |
| prio?    | number                         | Über die Priorität kann die Anzeigereihenfolge beeinflusst werden.                            |
| onClick? | (file: ILuxFileObject) => void | Optionaler Callback, welcher bei der Durchführung der Aktion aufgerufen wird.                 |

### ILuxFilesListActionConfig

Dieses Interface erweitert _ILuxFilesActionConfig_ um die Einstellungen für die Aktion im Header der Liste (verwendet für luxUploadActionConfig).

| Name           | Typ     | Beschreibung                                                   |
| -------------- | ------- | -------------------------------------------------------------- |
| hiddenHeader   | boolean | Bestimmt, ob die Aktion im Header der Liste ausgeblendet wird. |
| disabledHeader | boolean | Bestimmt, ob die Aktion im Header der Liste deaktiviert ist.   |
| iconNameHeader | string  | Definiert das Icon der Aktion im Header der Liste.             |
| labelHeader    | string  | Die Bezeichnung der Aktion im Header der Liste.                |

### ILuxFileListActionConfig

Dieses Interface erweitert _ILuxFileActionConfig_ um dieselben Header-Einstellungen wie _ILuxFilesListActionConfig_ (hiddenHeader, disabledHeader, iconNameHeader, labelHeader).

### ILuxFileListDeleteActionConfig

Dieses Interface erweitert _ILuxFileListActionConfig_ (verwendet für luxDeleteActionConfig).

| Name         | Typ                               | Beschreibung                                                                |
| ------------ | --------------------------------- | --------------------------------------------------------------------------- |
| isDeletable? | (file: ILuxFileObject) => boolean | Optionaler Callback, der prüft, ob der Delete-Button aktiviert werden darf. |

## Beispiele

### 1. Signal Forms

Ab v22 lässt sich die Komponente über `[formField]` an ein [Angular Signal Form](https://angular.dev/guide/forms/signals/overview) binden. Pflichtfeld, Deaktivierung und Validierung werden im Schema von `form()` festgelegt. Ein dort hinterlegter `message`-Text wird als Fehlermeldung angezeigt (`luxErrorMessage` und `luxErrorCallback` haben Vorrang). Die Direktive `FormField` muss in den `imports` der Komponente stehen.

`required()` von Angular behandelt ein leeres Array nicht als leer. Für Pflichtfelder mit einem Array als Wert deshalb zusätzlich `luxRequiredArray()` verwenden.

Ts

```typescript
import { FormField, form, required, validate } from '@angular/forms/signals';
import { ILuxFileObject, luxRequiredArray } from '@ihk-gfi/lux-components';

readonly model = signal<{ attachments: ILuxFileObject[] | null }>({ attachments: null });
readonly uploadForm = form(this.model, (path) => {
  required(path.attachments);
  validate(path.attachments, luxRequiredArray());
});
```

Html

```html
<lux-file-list luxLabel="Anlagen" [luxMultiple]="true" [formField]="uploadForm.attachments" />
```

### 2. Simple

**Diese Komponente ist veraltet. Bitte die Komponente LUX-File-Upload verwenden!**

![Beispielbild 01-01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐list-v22-img-01-01.png)

![Beispielbild 01-02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐list-v22-img-01-02.png)

Ts

```typescript
readonly selected = signal<ILuxFileObject[] | null>(null);

private readonly http = inject(HttpClient);

constructor() {
  this.loadFileFromAssets();
}

/**
 * Für das Beispiel laden wir eine Datei aus dem Assets-Ordner.
 * Voraussetzung: assets-Ordner enthält den Unterordner "png" und die Datei "example.png".
 */
loadFileFromAssets() {
  this.http.get('assets/png/example.png', { responseType: 'blob' }).subscribe((blob: Blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      this.selected.set([{ name: 'example.png', type: 'image/png', content: reader.result as string }]);
    };
    reader.readAsDataURL(blob);
  });
}

onSelectedFilesChange($event: ILuxFileObject[] | null) {
  console.log($event);
}
```

Html

```html
<lux-file-list
  luxLabel="Ihre Dateien"
  luxHint="Klicken Sie auf den 'Upload'-Button oder nutzen Drag-and-Drop"
  [(value)]="selected"
  (valueChange)="onSelectedFilesChange($event)"
/>
```

### 3. Mit Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

**Diese Komponente ist veraltet. Bitte die Komponente LUX-File-Upload verwenden!**

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐list-v22-img-02.png)

Ts

```typescript
readonly form = new FormGroup({
  file: new FormControl<ILuxFileObject[] | null>(null)
});

private readonly http = inject(HttpClient);

constructor() {
  this.loadFileFromAssets();
}

/**
 * Für das Beispiel laden wir eine Datei aus dem Assets-Ordner.
 * Voraussetzung: assets-Ordner enthält den Unterordner "png" und die Datei "example.png".
 */
loadFileFromAssets() {
  this.http.get('assets/png/example.png', { responseType: 'blob' }).subscribe((blob: Blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      this.form.controls.file.setValue([{ name: 'example.png', type: 'image/png', content: reader.result as string }]);
    };
    reader.readAsDataURL(blob);
  });
}
```

Html

```html
<div [formGroup]="form">
  <lux-file-list
    luxLabel="Ihre Dateien"
    luxHint="Klicken Sie auf den 'Upload'-Button oder nutzen Drag-and-Drop"
    luxControlBinding="file"
  />
</div>
```

### 4. Mit Upload-URL

**Diese Komponente ist veraltet. Bitte die Komponente LUX-File-Upload verwenden!**

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐list-v22-img-03.png)

Html

```html
<lux-file-list
  luxLabel="Ihre Dateien"
  luxHint="Klicken Sie auf den 'Upload'-Button oder nutzen Drag-and-Drop"
  luxUploadUrl="https://fachbackend/fb/upload-data/"
/>
```

### 5. Mit Base64-Callback

**Diese Komponente ist veraltet. Bitte die Komponente LUX-File-Upload verwenden!**

![Beispielbild 04](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐list-v22-img-04.gif)

Ts

```typescript
private readonly http = inject(HttpClient);

// Die Konfiguration für die Action, die den contentCallback aufruft
readonly viewActionConfig: ILuxFileActionConfig = {
  disabled: false,
  hidden: false,
  iconName: 'lux-interface-edit-view',
  label: 'Anzeigen'
};

// Wir erzeugen ein ILuxFileObject ohne Inhalt, dieser wird erst beim Aufruf der View-Action über den Callback geladen
readonly selected = signal<ILuxFileObject[] | null>([
  {
    name: 'example.png',
    type: 'image/png',
    content: '',
    contentCallback: () =>
      this.http.get('assets/png/example.png', { responseType: 'blob' }).pipe(switchMap((blob) => from(this.readFile(blob))))
  }
]);

/**
 * Helper-Function zum Auslesen des Base64-Inhalts der Beispiel-Datei.
 */
readFile(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
```

Html

```html
<lux-file-list
  luxLabel="Ihre Dateien"
  luxHint="Klicken Sie auf den 'Upload'-Button oder nutzen Drag-and-Drop"
  [luxViewActionConfig]="viewActionConfig"
  [(value)]="selected"
  #exampleFileList
/>

<!-- Nachweis, dass der Inhalt vorhanden ist -->
{{ exampleFileList.value()?.[0]?.content ? 'Not Empty' : 'Empty' }}
```

### 6. Mit Download

**Diese Komponente ist veraltet. Bitte die Komponente LUX-File-Upload verwenden!**

![Beispielbild 05](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐list-v22-img-05.png)

Ts

```typescript
readonly selected = signal<ILuxFileObject[] | null>(null);

readonly downloadActionConfig: ILuxFileActionConfig = {
  disabled: false,
  hidden: false,
  iconName: 'lux-file-download',
  label: 'Download'
};

private readonly http = inject(HttpClient);

constructor() {
  this.loadFileFromAssets();
}

/**
 * Für das Beispiel laden wir eine Datei aus dem Assets-Ordner.
 * Voraussetzung: assets-Ordner enthält den Unterordner "png" und die Datei "example.png".
 */
loadFileFromAssets() {
  this.http.get('assets/png/example.png', { responseType: 'blob' }).subscribe((blob: Blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      this.selected.set([{ name: 'example.png', type: 'image/png', content: reader.result as string }]);
    };
    reader.readAsDataURL(blob);
  });
}
```

Html

```html
<lux-file-list
  luxLabel="Bitte Laden Sie eine Datei hoch"
  luxHint="Klicken Sie auf den 'Upload'-Button oder nutzen Drag-and-Drop"
  [luxDownloadActionConfig]="downloadActionConfig"
  [(value)]="selected"
/>
```

### 7. Mit Dateieinschränkungen

**Diese Komponente ist veraltet. Bitte die Komponente LUX-File-Upload verwenden!**

![Beispielbild 06-01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐list-v22-img-06.gif)

Html

```html
<lux-file-list
  luxLabel="Bitte Laden Sie eine Datei hoch"
  luxHint="Klicken Sie auf den 'Upload'-Button oder nutzen Drag-and-Drop"
  luxAccept=".pdf, .xlsx"
  [luxMaxSizeMiB]="5"
  luxCapture="user"
/>
```

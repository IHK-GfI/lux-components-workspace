# LUX-File-Upload

![Beispielbild LUX-File-Upload](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐upload-v22-img.png)

- [LUX-File-Upload](#lux-file-upload)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Classes / Interfaces](#classes--interfaces)
    - [ILuxFileObject](#iluxfileobject)
    - [ILuxFileError](#iluxfileerror)
    - [LuxFileErrorCause](#luxfileerrorcause)
    - [ILuxFileActionConfig](#iluxfileactionconfig)
    - [ILuxFilesActionConfig](#iluxfilesactionconfig)
    - [ILuxFileUploadDeleteActionConfig](#iluxfileuploaddeleteactionconfig)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Simple](#2-simple)
    - [3. Mit Formular](#3-mit-formular)
    - [4. Mit Dateieinschränkungen](#4-mit-dateieinschränkungen)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-file-upload |

### @Input

| Name                    | Typ                              | Beschreibung                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxLabel                | string                           | Enthält das Label vor dem Link (siehe luxLabelLink). Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                                                                         |
| luxLabelLink            | string                           | Enthält das Label für den Link. Default: ''.                                                                                                                                                                                                                                                                                                                              |
| luxLabelLinkShort       | string                           | Enthält das Label für den Link in der mobilen Ansicht. Default: ''.                                                                                                                                                                                                                                                                                                       |
| luxListOnly             | boolean                          | Gibt an, ob nur die Dateiliste ohne Uploadmöglichkeit angezeigt wird. `luxListOnly` blendet nur die Upload-Möglichkeit aus. Die Sichtbarkeit von View/Delete/Custom-Buttons wird weiterhin über die jeweiligen Action-Configs (insbesondere `hidden`) gesteuert. Default: false.                                                                                          |
| luxUploadActionConfig   | ILuxFilesActionConfig            | Enthält die Konfiguration für den Upload-Button der Component.                                                                                                                                                                                                                                                                                                            |
| luxDeleteActionConfig   | ILuxFileUploadDeleteActionConfig | Enthält die Konfiguration für alle Delete-Buttons der Component.                                                                                                                                                                                                                                                                                                          |
| luxViewActionConfig     | ILuxFileActionConfig             | Enthält die Konfiguration für alle View-Buttons der Component. Die View-Buttons rufen die "contentCallback"-Methode des jeweiligen ILuxFileObjects auf, um den Inhalt nachzuladen (wenn er nicht bereits vorhanden ist). Dadurch ist es möglich, Dateien dynamisch nachzuladen, wenn erforderlich. Für eine Vorschau siehe auch [lux-file-preview](lux‐file‐preview-v22). |
| luxDownloadActionConfig | ILuxFileActionConfig             | Enthält die Konfiguration für alle Download-Buttons der Component.                                                                                                                                                                                                                                                                                                        |
| luxCustomActionConfigs  | ILuxFileActionConfig[]           | Enthält die Konfiguration für alle Custom-Buttons der Component. Default: [].                                                                                                                                                                                                                                                                                             |
| luxHint                 | string                           | Enthält den Hinweistext unterhalb der FormComponent.                                                                                                                                                                                                                                                                                                                      |
| luxUploadIcon           | string                           | Enthält den Namen für das Upload-Icon. Default: 'lux-programming-cloud-upload'.                                                                                                                                                                                                                                                                                           |
| luxDeleteIcon           | string                           | Enthält den Namen für das Delete-Icon. Default: ''.                                                                                                                                                                                                                                                                                                                       |
| luxMultiple             | boolean                          | Bestimmt, ob mehrere Dateien für diese Component geladen werden können. Default: true.                                                                                                                                                                                                                                                                                    |
| luxMaxSizeMiB           | number                           | Definiert die maximale Dateigröße in MiB, die jede Datei haben darf. Default: 10.                                                                                                                                                                                                                                                                                         |
| luxMaxFileCount         | number                           | Definiert die maximale Anzahl an Dateien, die ausgewählt werden dürfen. Default: 100.                                                                                                                                                                                                                                                                                     |
| luxCapture              | string                           | Bestimmt für Mobilgeräte, ob die Front- bzw. Rückkamera verwendet wird. Mögliche Werte: '' (keine Vorgabe), 'user' (Frontkamera), 'environment' (Rückkamera). Default: ''.                                                                                                                                                                                                |
| formField               | FieldTree\<T\>                   | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                                                                                                                               |
| value                   | ILuxFileObject[] \| null         | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet.                                                                                                                                                                                                                                           |
| luxSelected             | ILuxFileObject[] \| null         | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden. Property, die die aktuell bekannten ILuxFileObjects enthält. Durch den Output "luxSelectedChange" ist ein Two-Way-Binding möglich.                                                                                                                                                                    |
| luxAccept               | string                           | Über diese Property ist es möglich nur bestimmte Dateitypen zu erlauben (z.B. '.pdf' oder 'image/\*'). Default: ''.                                                                                                                                                                                                                                                       |
| luxContentsAsBlob       | boolean                          | Schaltet die Dateibehandlung so um, dass sie anstelle von Base64-Strings mit Blobs für die Dateien umgeht. Anmerkung: Bei Base64 den Präfix nicht vergessen: data:\[\<MIME-Typ\>\]\[;charset=\<Zeichensatz\>\]\[;base64\],\<Daten\> Z.B. data:image/png;base64,iVBORw0KGgoAAAA... Default: false.                                                                         |
| luxUploadUrl            | string                           | Enthält die URL mit der Schnittstelle, die angesprochen werden soll, um die Dateien hochzuladen. Wenn diese Property leer ist, wird kein automatischer Upload durchgeführt. Default: ''.                                                                                                                                                                                  |
| luxUploadReportProgress | boolean                          | Schaltet die Progressbar um, so dass beim Upload von Dateien vom Backend Feedback zurückgegeben werden kann. Die Component liest dafür die Werte "loaded" und "total" aus dem HttpEvent der Post-Abfrage aus. Wenn false, wird stattdessen eine Progressbar im "indeterminate"-Zustand angezeigt. Default: false.                                                         |
| luxDnDActive            | boolean                          | Bestimmt, ob Dateien via Drag-and-Drop (DnD) auf diese Component übertragen werden können. Default: true.                                                                                                                                                                                                                                                                 |
| luxRequired             | boolean                          | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                                                                   |
| luxControlBinding       | string                           | **Veraltet**, stattdessen `[formField]` verwenden. Das Controlbinding (z.B. Vorname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                             |
| luxErrorMessage         | string                           | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                                                            |
| luxDisabled             | boolean                          | Bestimmt, ob die Component deaktiviert ist oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich.                                                                                                                                                                                                                                                                    |
| luxReadonly             | boolean                          | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                                                                                                                                                          |
| luxErrorCallback        | LuxErrorCallbackFnType           | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                                                |
| luxControlValidators    | ValidatorFnType                  | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                                                    |
| luxTagId                | string                           | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                             |
| luxFormGroup            | FormGroup                        | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                                                                                                                                                     |
| luxFormControl          | FormControl                      | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                                                                                                                                                        |

### @Output

| Name              | Typ                      | Beschreibung                                                                                                                                                                                         |
| ----------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxSelectedChange | ILuxFileObject[] \| null | Gehört zur veralteten `luxSelected`-API, stattdessen `(valueChange)` verwenden. Output-Event das bei Änderungen am luxSelected-Feld ausgestoßen wird. Ermöglicht das Two-Way-Binding an luxSelected. |
| valueChange       | ILuxFileObject[] \| null | Wird ausgelöst, wenn sich der Wert ändert (implizit aus dem `value`-Model, Grundlage von `[(value)]`).                                                                                               |
| luxBlur           | FocusEvent               | Wird ausgelöst, wenn das Element selbst den Fokus verliert (Kindelemente werden nicht betrachtet).                                                                                                   |
| luxFocus          | FocusEvent               | Wird ausgelöst, wenn das Element selbst den Fokus erhält (Kindelemente werden nicht betrachtet).                                                                                                     |
| luxFocusIn        | FocusEvent               | Wird beim Fokussieren des Elements ausgelöst.                                                                                                                                                        |
| luxFocusOut       | FocusEvent               | Wird beim Fokusverlust des Elements ausgelöst.                                                                                                                                                       |
| luxDisabledChange | boolean                  | Wird ausgelöst, wenn sich luxDisabled ändert (Grundlage von `[(luxDisabled)]`).                                                                                                                      |

## Classes / Interfaces

### ILuxFileObject

Dieses Interface stellt eine Datei dar und wird von den LuxFileComponents entgegen genommen und weiter gereicht.
Sie enthält den Namen der Datei sowie den Base64-Stringwert bzw. den Blob-Content sowie eine Callback-Funktion, welche diesen wiedergibt.

| Name             | Typ                                        | Beschreibung                                                                                                                                                                                                                                                                                       |
| ---------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name             | string                                     | Enthält den Namen der Datei.                                                                                                                                                                                                                                                                       |
| type             | string                                     | Enthält den Dateityp.                                                                                                                                                                                                                                                                              |
| size?            | number                                     | Enthält die Dateigröße (Bytes).                                                                                                                                                                                                                                                                    |
| content?         | string \| Blob                             | Enthält den Base64-Inhalt bzw. den Blob-Wert der Datei.                                                                                                                                                                                                                                            |
| contentCallback? | Promise\<any\> \| Observable\<any\> \| any | Enthält eine Funktion, welche den Base64-Inhalt/Blob-Wert der Datei wiedergibt. Diese Funktion wird von der View-Action (standardmäßig der Button mit dem "eye"-Icon) aufgerufen, um den Base64-Inhalt nachzuladen. Bei großen Dateien nützlich, um nicht direkt alle Inhalte auf einmal zu laden. |
| namePrefix?      | string                                     | Enthält das Präfix                                                                                                                                                                                                                                                                                 |
| namePrefixColor? | string                                     | Enthält die Farbe des Präfixes                                                                                                                                                                                                                                                                     |
| nameSuffix?      | string                                     | Enthält das Suffix                                                                                                                                                                                                                                                                                 |
| nameSuffixColor? | string                                     | Enthält die Farbe des Suffixes                                                                                                                                                                                                                                                                     |

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

### ILuxFileActionConfig

Dieses Interface enthält die möglichen Einstellungen für die Action-Buttons der LuxFileComponents.

| Name     | Typ                            | Beschreibung                                                                                  |
| -------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| hidden   | boolean                        | Bestimmt, ob diese Aktion für die aktuelle LuxFileComponent angezeigt werden soll oder nicht. |
| disabled | boolean                        | Bestimmt, ob diese Aktion für die aktuelle LuxFileComponent deaktiviert ist oder nicht.       |
| iconName | string                         | Definiert das Icon für diese Aktion.                                                          |
| label    | string                         | Die Bezeichnung.                                                                              |
| prio?    | number                         | Über die Priorität kann die Anzeigereihenfolge beeinflusst werden.                            |
| onClick? | (file: ILuxFileObject) => void | Optionaler Callback, welcher bei der Durchführung der Aktion aufgerufen wird.                 |

### ILuxFilesActionConfig

Wie ILuxFileActionConfig, der Callback erhält jedoch alle betroffenen Dateien (verwendet für luxUploadActionConfig).

| Name     | Typ                               | Beschreibung                                                                                                |
| -------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| hidden   | boolean                           | Bestimmt, ob diese Aktion für die aktuelle LuxFileComponent angezeigt werden soll oder nicht.               |
| disabled | boolean                           | Bestimmt, ob diese Aktion für die aktuelle LuxFileComponent deaktiviert ist oder nicht.                     |
| iconName | string                            | Definiert das Icon für diese Aktion.                                                                        |
| label    | string                            | Die Bezeichnung.                                                                                            |
| prio?    | number                            | Über die Priorität kann die Anzeigereihenfolge beeinflusst werden.                                          |
| onClick? | (files: ILuxFileObject[]) => void | Optionaler Callback, welcher bei der Durchführung der Aktion mit allen betroffenen Dateien aufgerufen wird. |

### ILuxFileUploadDeleteActionConfig

Dieses Interface erweitert _ILuxFileActionConfig_ (verwendet für luxDeleteActionConfig).

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
<lux-file-upload luxLabel="Anlagen" [luxMultiple]="true" [formField]="uploadForm.attachments" />
```

### 2. Simple

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐upload-v22-img-01.png)

Ts

```typescript
export class FileUploadExampleComponent {
  readonly selectedFiles = signal<ILuxFileObject[] | null>([]);
}
```

Html

```html
<lux-file-upload [(value)]="selectedFiles" />
```

### 3. Mit Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐upload-v22-img-02.png)

Ts

```typescript
export class FileUploadExampleComponent {
  readonly form = new FormGroup({
    files: new FormControl<ILuxFileObject[] | null>(null)
  });
}
```

Html

```html
<div [formGroup]="form">
  <lux-file-upload luxControlBinding="files" />
</div>
```

### 4. Mit Dateieinschränkungen

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐upload-v22-img-03.png)

Ts

```typescript
export class FileUploadExampleComponent {
  private readonly tService = inject(TranslocoService);

  readonly acceptedTypes = '.pdf,.png';
  readonly hint = 'Es werden nur folgende Dateitypen unterstützt: ' + LuxUtil.getAcceptTypesAsMessagePart(this.tService, this.acceptedTypes);

  readonly form = new FormGroup({
    files: new FormControl<ILuxFileObject[] | null>(null, Validators.required)
  });
}
```

Html

```html
<div [formGroup]="form">
  <lux-file-upload
    luxControlBinding="files"
    [luxAccept]="acceptedTypes"
    [luxContentsAsBlob]="true"
    [luxHint]="hint"
  />
</div>
```

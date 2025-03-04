# LUX-File-Upload

![Beispielbild LUX-File-Upload](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐file‐upload-v16-img.png)

- [LUX-File-Upload](#lux-file-upload)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Classes / Interfaces](#classes--interfaces)
    - [ILuxFileObject](#iluxfileobject)
    - [ILuxFileError](#iluxfileerror)
    - [LuxFileErrorCause](#luxfileerrorcause)
    - [ILuxFilesActionConfig](#iluxfilesactionconfig)
  - [Beispiele](#beispiele)
    - [1. Simple](#1-simple)
    - [2. Mit Formular](#2-mit-formular)
    - [3. Mit Dateieinschränkungen](#3-mit-dateieinschränkungen)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxFormModule   |
| selector | lux-file-upload |

### @Input

| Name                 | Typ                     | Beschreibung                                                                                                                                                                                                                                                                                                               |
| -------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxLabel             | string                  | Enthält das Label vor dem Link (siehe luxLabelLink).                                                                                                                                                                                                                                                                       |
| luxLabelLink         | string                  | Enthält das Label für den Link.                                                                                                                                                                                                                                                                                            |
| luxLabelLinkShort    | string                  | Enthält das Label für den Link in der mobilen Ansicht.                                                                                                                                                                                                                                                                     |
| luxHint              | string                  | Enthält den Hinweistext unterhalb der FormComponent.                                                                                                                                                                                                                                                                       |
| luxUploadIcon        | string                  | Enthält den Namen für das Upload-Icon.                                                                                                                                                                                                                                                                                     |
| luxDeleteIcon        | string                  | Enthält den Namen für das Delete-Icon.                                                                                                                                                                                                                                                                                     |
| luxMultiple          | boolean                 | Bestimmt, ob mehrere Dateien für diese Component geladen werden können.                                                                                                                                                                                                                                                    |
| luxMaxSizeMB         | number                  | Definiert die maximale Dateigröße, die jede Datei haben darf.                                                                                                                                                                                                                                                              |
| luxCapture           | string                  | Bestimmt für Mobilgeräte, ob die Front bzw. Rückkamera verwendet werden. Mögliche Werte: ''/undefined; user (Frontkamera), environment (Rückkamera)                                                                                                                                                                        |
| luxSelected          | LuxFileObject[] \| null | Property, die die aktuell bekannten LuxFileObjects beinhaltet. Durch den Event-Emitter "luxSelectedChange" ist ein Two-Way-Binding möglich.                                                                                                                                                                                |
| luxAccept            | string                  | Über diese Property ist es möglich nur bestimmte Dateitypen zu erlauben (z.B. '.pdf' oder 'image/\*').                                                                                                                                                                                                                     |
| luxContentsAsBlob    | boolean                 | Schaltet die Dateibehandlung so um, dass sie anstelle von Base64-Strings mit Blobs für die Dateien umgeht. Anmerkung: Bei Base64 den Präfix nicht vergessen: data:\[\<MIME-Typ\>\]\[;charset=\<Zeichensatz\>\]\[;base64\],\<Daten\> Z.B. data:image/png;base64,iVBORw0KGgoAAAA...                                          |
| luxRequired          | boolean                 | Bestimmt ob die Component ein Pflichtfeld ist oder nicht.                                                                                                                                                                                                                                                                  |
| luxControlBinding    | string                  | Das Controlbinding (z.B. Vorname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                                 |
| luxErrorMessage      | string                  | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                             |
| luxDisabled          | boolean                 | Bestimmt ob die Component deaktiviert ist oder nicht. Durch den Event-Emitter "luxDisabledChange" ist ein Two-Way-Binding möglich.                                                                                                                                                                                         |
| luxReadonly          | boolean                 | Bestimmt ob sich das Feld im reinen Lese-Zustand befindet (ähnlich wie disabled, aber ohne die Auswirkungen auf Forms und andere visuelle Darstellung).                                                                                                                                                                    |
| luxErrorCallback     | LuxErrorCallbackFnType  | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben. |
| luxControlValidators | ValidatorFnType         | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                     |
| luxTagId             | string                  | [LUX-Tag-Id](luxTagId-v16#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                              |

### @Output

| Name              | Typ                                      | Beschreibung                                                                                                         |
| ----------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| luxSelectedChange | EventEmitter \<LuxFileObject[] \| null\> | Output-Event das bei Änderungen am luxSelected-Feld ausgestoßen wird. Ermöglicht das Two-Way-Binding an luxSelected. |

## Classes / Interfaces

### ILuxFileObject

Dieses Interface stellt eine Datei dar und wird von den LuxFileComponents entgegen genommen und weiter gereicht.
Sie enthält den Namen der Datei sowie den Base64-Stringwert bzw. den Blob-Content sowie eine Callback-Funktion, welche diesen wiedergibt.

| Name            | Typ                                      | Beschreibung                                                                                                                                                                                                                                                                                      |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name            | string                                   | Enthält den Namen der Datei.                                                                                                                                                                                                                                                                      |
| type            | string                                   | Enthält den Dateityp.                                                                                                                                                                                                                                                                             |
| size            | number                                   | Enthält die Dateigröße (Bytes).                                                                                                                                                                                                                                                                   |
| content         | string \| Blob                           | Enthält den Base64-Inhalt bzw. den Blob-Wert der Datei.                                                                                                                                                                                                                                           |
| contentCallback | Promise\<any> \| Observable\<any> \| any | Enthält eine Funktion, welche den Base64-Inhalt/Blob-Wert der Datei wiedergibt. Diese Funktion wird von der View-Action (Standardmäßig der Button mit dem "eye"-Icon aufgerufen, um den Base64 Inhalt nachzuladen. Bei großen Dateien nützlich, um nicht direkt alle Inhalte auf einmal zu laden. |
| namePrefix      | string                                   | Enthält den Präfix                                                                                                                                                                                                                                                                                |
| namePrefixColor | string                                   | Enthält die Farbe des Präfixes                                                                                                                                                                                                                                                                    |
| nameSuffix      | string                                   | Enthält den Suffix                                                                                                                                                                                                                                                                                |
| nameSuffixColor | string                                   | Enthält die Frabe des Suffixes                                                                                                                                                                                                                                                                    |

### ILuxFileError

Dieses Interface wird von den Objekten genutzt, welche bei Fehlern während der Ausführung der Component (z.B. dem Upload oder der Dateiauswahl) entstehen.

| Name      | Typ               | Beschreibung                                                                                   |
| --------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| cause     | LuxFileErrorCause | Enum-Wert mit der Ursache des Fehlers.                                                         |
| exception | any               | Enthält den eigentlichen Fehler, dies kann ein Fehlerobjekt oder aber auch Fehler-Nachrichten. |
| file      | File              | Enthält die Datei, bei der der Fehler aufgetreten ist.                                         |

### LuxFileErrorCause

Enum mit möglichen Fehlerquellen.

| Name              | Beschreibung                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------- |
| MaxSizeError      | Fehler, der bei überschrittener Dateigröße auftritt.                                     |
| ReadingFileError  | Fehler, der beim Auslesen des Base64-Inhalts einer Datei auftritt.                       |
| UploadFileError   | Fehler, der beim Hochladen einer/mehrerer Dateien auftritt.                              |
| FileNotAccepted   | Fehler, wenn die Datei nicht den korrekten Dateityp hat (eingeschränkt durch luxAccept). |
| MultipleForbidden | Fehler, der beim übergeben von mehreren Dateien auftritt, obwohl nur eine erlaubt ist.   |

### ILuxFilesActionConfig

Dieses Interface enthält die möglichen Einstellungen für die Action-Buttons der LuxFileComponents.

| Name     | Typ                              | Beschreibung                                                                                  |
| -------- | -------------------------------- | --------------------------------------------------------------------------------------------- |
| hidden   | boolean                          | Bestimmt, ob diese Aktion für die aktuelle LuxFileComponent angezeigt werden soll oder nicht. |
| disabled | boolean                          | Bestimmt, ob diese Aktion für die aktuelle LuxFileComponent deaktiviert ist oder nicht.       |
| iconName | string                           | Definiert das Icon für diese Aktion.                                                          |
| prio     | number                           | Über die Priorität kann die Anzeigereihenfolge beeinflusst werden.                            |
| label    | string                           | Die Bezeichnung                                                                               |
| onClick? | (file: ILuxFileObject[]) => void | Optionaler Callback, welcher bei der Durchführung der Aktion aufgerufen wird.                 |

## Beispiele

### 1. Simple

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐file‐upload-v16-img-01.png)

Ts

```typescript
export class FileUploadExampleComponent {
  selectedFiles: ILuxFileObject[] | null = [];
}
```

Html

```html
<lux-file-upload [(luxSelected)]="selectedFiles"></lux-file-upload>
```

### 2. Mit Formular

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐file‐upload-v16-img-02.png)

Ts

```typescript
export class FileUploadExampleComponent implements OnInit {
  form: FormGroup;

  constructor(private filePreviewService: LuxFilePreviewService) {
    this.form = new FormGroup({
      files: new FormControl<ILuxFileObject[] | null>(null),
    });
  }
}
```

Html

```html
<div [formGroup]="form">
  <lux-file-upload luxControlBinding="files"></lux-file-upload>
</div>
```

### 3. Mit Dateieinschränkungen

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐file‐upload-v16-img-03.png)

Ts

```typescript
export class FileUploadExampleComponent implements OnInit {
  acceptedTypes = ".pdf,.png";
  hint =
    "Es werden nur folgende Dateitypen unterstützt: " +
    LuxUtil.getAcceptTypesAsMessagePart(this.acceptedTypes);

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      files: new FormControl<ILuxFileObject[] | null>(
        null,
        Validators.required,
      ),
    });
  }
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
  ></lux-file-upload>
</div>
```

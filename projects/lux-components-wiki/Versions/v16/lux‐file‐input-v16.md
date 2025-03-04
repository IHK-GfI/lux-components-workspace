# LUX-File-Input

![Beispielbild LUX-File-Input](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐file‐input-v16-img.png)

- [LUX-File-Input](#lux-file-input)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Classes / Interfaces](#classes--interfaces)
    - [ILuxFileObject](#iluxfileobject)
    - [ILuxFileError](#iluxfileerror)
    - [LuxFileErrorCause](#luxfileerrorcause)
    - [ILuxFileActionConfig](#iluxfileactionconfig)
  - [Beispiele](#beispiele)
    - [1. Simple](#1-simple)
    - [2. Mit Formular](#2-mit-formular)
    - [3. Mit Upload-URL](#3-mit-upload-url)
    - [4. Mit Base64-Callback](#4-mit-base64-callback)
    - [5. Mit Download](#5-mit-download)
    - [6. Mit Dateieinschränkungen](#6-mit-dateieinschränkungen)

## Overview / API

### Allgemein

| Name     | Beschreibung      |
| -------- | ----------------- |
| import   | LuxFormModule     |
| selector | lux-file-input-ac |

### @Input

| Name                    | Typ                    | Beschreibung                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxMaxSizeMB            | number                 | Definiert die maximale Dateigröße, die jede Datei haben darf.                                                                                                                                                                                                                                                                                                                              |
| luxCapture              | string                 | Bestimmt für Mobilgeräte, ob die Front bzw. Rückkamera verwendet werden. Mögliche Werte: ''/undefined; user (Frontkamera), environment (Rückkamera)                                                                                                                                                                                                                                        |
| luxUploadUrl            | string                 | Enthält die URL mit der Schnittstelle, die angesprochen werden soll um die Dateien hochzuladen. Wenn diese Property leer ist, wird kein automatischer Upload durchgeführt.                                                                                                                                                                                                                 |
| luxUploadActionConfig   | ILuxFileActionConfig   | Enthält die Konfiguration für alle Upload-Buttons der Component. Ab 1.7.17 gibt es für die die erweiterte Konfiguration ILuxFileListActionConfig.                                                                                                                                                                                                                                          |
| luxDeleteActionConfig   | ILuxFileActionConfig   | Enthält die Konfiguration für alle Delete-Buttons der Component. Ab 1.7.17 gibt es für die die erweiterte Konfiguration ILuxFileListActionConfig.                                                                                                                                                                                                                                          |
| luxViewActionConfig     | ILuxFileActionConfig   | Enthält die Konfiguration für alle View-Buttons der Component. Die View-Buttons rufen die "base64Callback"-Methode des jeweiligen luxFileObjects auf, um den base64-Wert nachzuladen (wenn er nicht bereits vorhanden ist). Dadurch ist es möglich, Dateien dynamisch nachzuladen, wenn erforderlich.  Ab 1.8.3  gibt es auch eine Dateivorschau [lux-file-preview](lux‐file‐preview-v16). |
| luxDownloadActionConfig | ILuxFileActionConfig   | Enthält die Konfiguration für alle Download-Buttons der Component.                                                                                                                                                                                                                                                                                                                         |
| luxCustomActionConfigs  | ILuxFileActionConfig[] | Enthält die Konfiguration für alle Custom-Buttons der Component.                                                                                                                                                                                                                                                                                                                           |
| luxSelected             | LuxFileObject \| null  | Property, die die aktuell bekannten LuxFileObjects beinhaltet. Wenn nur ein einziges LuxFileObject gesetzt ist, ist dieses alleinstehend. Andernfalls ist es ein Array von LuxFileObjects. Durch den Event-Emitter "luxSelectedChange" ist ein Two-Way-Binding möglich.                                                                                                                    |
| luxAccept               | string                 | Über diese Property ist es möglich nur bestimmte Dateitypen zu erlauben (z.B. '.pdf' oder 'image/\*').                                                                                                                                                                                                                                                                                     |
| luxContentsAsBlob       | boolean                | Schaltet die Dateibehandlung so um, dass sie anstelle von Base64-Strings mit Blobs für die Dateien umgeht. Anmerkung: Bei Base64 den Präfix nicht vergessen: data:\[\<MIME-Typ>\]\[;charset=\<Zeichensatz>\]\[;base64\],\<Daten> Z.B. data:image/png;base64,iVBORw0KGgoAAAA...                                                                                                             |
| luxUploadReportProgress | boolean                | Schaltet die Progressbar um, so dass beim Upload von Dateien vom Backend Feedback zurückgegeben werden kann, um so dem User den Fortschritt mitteilen zu können. Die Component liest dafür die Werte "loaded" und "total" aus dem HttpEvent der Post-Abfrage aus, um den Progress zu bestimmen. Wenn false, wird stattdessen eine Progressbar im "indetermined"-Zustand angezeigt.         |
| luxDnDActive            | boolean                | Bestimmt ob Dateien via Drag-and-Drop (DnD) auf diese Component übertragen werden können.                                                                                                                                                                                                                                                                                                  |
| luxClearOnError         | boolean                | Gibt an, ob die aktuelle Datei entfernt wird, wenn bei der neu hochgeladenen Datei die Validierung fehlschlägt.                                                                                                                                                                                                                                                                            |
| luxTagId                | string                 | [LUX-Tag-Id](luxTagId-v16#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                                              |
| luxPlaceholder          | string                 | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird.                                                                                                                                                                                                                                                                                                     |
| luxAutocomplete         | string                 | Steuert, ob der Browser den Inhalt cachen darf.                                                                                                                                                                                                                                                                                                                                            |
| luxRequired             | boolean                | Bestimmt ob die Component ein Pflichtfeld ist oder nicht.                                                                                                                                                                                                                                                                                                                                  |
| luxControlBinding       | string                 | Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                                                                                               |
| luxErrorMessage         | string                 | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                                                                             |
| luxDisabled             | boolean                | Bestimmt ob die Component deaktiviert ist oder nicht. Durch den Event-Emitter "luxDisabledChange" ist ein Two-Way-Binding möglich.                                                                                                                                                                                                                                                         |
| luxReadonly             | boolean                | Bestimmt ob sich das Feld im reinen Lese-Zustand befindet (ähnlich wie disabled, aber ohne die Auswirkungen auf Forms und andere visuelle Darstellung).                                                                                                                                                                                                                                    |
| luxErrorCallback        | LuxErrorCallbackFnType | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                                                                 |
| luxControlValidators    | ValidatorFnType        | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                                                                     |
| luxLabel                | string                 | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt.                                                                                                                                                                                                                             |
| luxHint                 | string                 | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                                                                                   |
| luxHintShowOnlyOnFocus  | boolean                | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                                                                |
| luxLabelLongFormat      | boolean                | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                                                                                  |
| luxNoLabels             | boolean                | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                                                                                |
| luxNoTopLabel           | boolean                | Gib an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                                                                                          |
| luxNoBottomLabel        | boolean                | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                                                                                           |
| luxDense                | boolean                | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                                                                      |

### @Output

| Name              | Typ                                   | Beschreibung                                                                                                                                                                                                                                                                                       |
| ----------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxSelectedChange | EventEmitter \<LuxFileObject \| null> | Output-Event das bei Änderungen am luxSelected-Feld ausgestoßen wird. Ermöglicht das Two-Way-Binding an luxSelected.                                                                                                                                                                               |
| luxBlur           | EventEmitter \<FocusEvent>            | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusOut (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus verliert und Kindelemente nicht betrachtet werden. |
| luxFocus          | EventEmitter \<FocusEvent>            | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusIn (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus erhält und Kindelemente nicht betrachtet werden.     |
| luxFocusIn        | EventEmitter \<FocusEvent>            | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                           |
| luxFocusOut       | EventEmitter \<FocusEvent>            | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                          |

## Classes / Interfaces

### ILuxFileObject

Dieses Interface stellt eine Datei dar und wird von den LuxFileComponents entgegen genommen und weiter gereicht.
Sie enthält den Namen der Datei sowie den Base64-Stringwert bzw. den Blob-Content sowie eine Callback-Funktion, welche diesen wiedergibt.

| Name            | Typ                                      | Beschreibung                                                                                                                                                                                                                                                                                      |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name            | string                                   | Enthält den Namen der Datei.                                                                                                                                                                                                                                                                      |
| type            | string                                   | Enthält den Dateityp.                                                                                                                                                                                                                                                                             |
| size            | number                                   | Enthält die Dateigröße (Bytes)                                                                                                                                                                                                                                                                    |
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
| file?     | File              | Enthält die Datei, bei der der Fehler aufgetreten ist.                                         |

### LuxFileErrorCause

Enum mit möglichen Fehlerquellen.

| Name              | Beschreibung                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------- |
| MaxSizeError      | Fehler, der bei überschrittener Dateigröße auftritt.                                     |
| ReadingFileError  | Fehler, der beim Auslesen des Base64-Inhalts einer Datei auftritt.                       |
| UploadFileError   | Fehler, der beim Hochladen einer/mehrerer Dateien auftritt.                              |
| FileNotAccepted   | Fehler, wenn die Datei nicht den korrekten Dateityp hat (eingeschränkt durch luxAccept). |
| MultipleForbidden | Fehler, der beim übergeben von mehreren Dateien auftritt, obwohl nur eine erlaubt ist.   |

### ILuxFileActionConfig

Dieses Interface enthält die möglichen Einstellungen für die Action-Buttons der LuxFileComponents.

| Name     | Typ                            | Beschreibung                                                                                  |
| -------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| hidden   | boolean                        | Bestimmt, ob diese Aktion für die aktuelle LuxFileComponent angezeigt werden soll oder nicht. |
| disabled | boolean                        | Bestimmt, ob diese Aktion für die aktuelle LuxFileComponent deaktiviert ist oder nicht.       |
| iconName | string                         | Definiert das Icon für diese Aktion.                                                          |
| prio     | number                         | Über die Priorität kann die Anzeigereihenfolge beeinflusst werden.                            |
| label    | string                         | Die Bezeichnung                                                                               |
| onClick? | (file: ILuxFileObject) => void | Optionaler Callback, welcher bei der Durchführung der Aktion aufgerufen wird.                 |

## Beispiele

### 1. Simple

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐file‐input-v16-img-01.png)

Ts

```typescript
selected: ILuxFileObject | null = null;

constructor(private http: HttpClient) {
  this.loadFileFromAssets();
}

/**
  * Für das Beispiel laden wir eine Datei aus dem Assets-Ordner.
  * Voraussetzung: assets-Ordner enthält den Unterordner "png" und die Datei "example.png".
  */
loadFileFromAssets() {
  this.http.get('assets/png/example.png', {responseType: 'blob'})
    .subscribe((response: Blob) => {
      const file = <any>response;
      file.name = 'example.png';
      file.lastModifiedDate = new Date();
      const reader = new FileReader();
      reader.onload = (fileData: any) => {
        this.selected = {name: 'example.png', type:'image/png', content: fileData.target.result};
      };
      reader.readAsDataURL(file);
    });
}

onSelectedFilesChange(file: ILuxFileObject | null) {
  console.log(file);
  this.selected = file;
}
```

Html

```html
<lux-file-input-ac
  luxLabel="Bitte Laden Sie eine Datei hoch"
  luxHint="Klicken Sie auf den 'Upload'-Button oder nutzen Drag-and-Drop"
  [luxSelected]="selected"
  (luxSelectedChange)="onSelectedFilesChange($event)"
>
</lux-file-input-ac>
```

### 2. Mit Formular

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐file‐input-v16-img-02.png)

Ts

```typescript
form;

constructor(private http: HttpClient) {
  this.form = new FormGroup({
    file: new FormControl<ILuxFileObject | null>(null)
  });

  this.loadFileFromAssets();
}

/**
  * Für das Beispiel laden wir eine Datei aus dem Assets-Ordner.
  * Voraussetzung: assets-Ordner enthält den Unterordner "png" und die Datei "example.png".
  */
loadFileFromAssets() {
  this.http.get('assets/png/example.png', { responseType: 'blob' }).subscribe((response: Blob) => {
    const file = <any>response;
    file.name = 'example.png';
    file.lastModifiedDate = new Date();
    const reader = new FileReader();
    reader.onload = (fileData: any) => {
      this.form.get('file')!.setValue({ name: 'example.png', type: 'image/png', content: fileData.target.result });
    };
    reader.readAsDataURL(file);
  });
}
```

Html

```html
<div [formGroup]="form">
  <lux-file-input-ac
    luxLabel="Bitte Laden Sie eine Datei hoch"
    luxHint="Klicken Sie auf den 'Upload'-Button oder nutzen Drag-and-Drop"
    luxControlBinding="file"
  >
  </lux-file-input-ac>
</div>
```

### 3. Mit Upload-URL

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐file‐input-v16-img-03.png)

Html

```html
<lux-file-input-ac
  luxLabel="Bitte Laden Sie eine Datei hoch"
  luxHint="Klicken Sie auf den 'Upload'-Button oder nutzen Drag-and-Drop"
  luxUploadUrl="https://fachbackend/fb/upload-data/"
>
</lux-file-input-ac>
```

### 4. Mit Base64-Callback

![Beispielbild 04](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐file‐input-v16-img-04.gif)

Ts

```typescript
selected;

// Die Konfiguration für die Action, die den base64Callback aufruft
viewActionConfig: ILuxFileActionConfig = {
  disabled: false,
  hidden: false,
  iconName: 'lux-interface-edit-view',
  label: 'Anzeigen'
};

constructor(private http: HttpClient) {

  // Wir erzeugen ein LuxFileObject ohne Inhalt, dieser wird erst beim Aufruf der View-Action über den Callback gesetzt
  this.selected = {name: 'example.png', type: 'image/png', content: '', contentCallback: () => {
      // Dieser Block wird erst bei der View-Action aufgerufen und läd nachträglich den echten Inhalt der Datei
      return new Observable((observer: Observer<string>) => {
        this.http.get('assets/png/example.png', {responseType: 'blob'}).pipe(
          map((response: Blob) => {
            const file = <any>response;
            file.name = 'example.png';
            file.lastModifiedDate = new Date();

            return this.readFile(file)
              .then((base64: string) => {
                observer.next(base64);
                observer.complete;
              })
              .catch((error) => observer.error(error));
          })).subscribe();
      });
    }};
}

/**
  * Helper-Function zum Auslesen des Base64-Inhalts der Beispiel-Datei.
  */
readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new window['FileReader']();

    reader.onload = (fileData) => resolve(fileData.target!.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
```

Html

```html
<lux-file-input-ac
  luxLabel="Bitte Laden Sie eine Datei hoch"
  luxHint="Klicken Sie auf den 'Upload'-Button oder nutzen Drag-and-Drop"
  [luxViewActionConfig]="viewActionConfig"
  [luxSelected]="selected"
  #exampleFileInput
>
</lux-file-input-ac>

<!-- Nachweis, dass der Inhalt vorhanden ist -->
{{ exampleFileInput.luxSelected?.content ? 'Not Empty' : 'Empty' }}
```

### 5. Mit Download

![Beispielbild 05](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐file‐input-v16-img-05.png)

Ts

```typescript
selected: ILuxFileObject | null = null;

downloadActionConfig: ILuxFileActionConfig = {
  disabled: false,
  hidden: false,
  iconName: 'lux-file-download',
  label: 'Download'
};

constructor(private http: HttpClient) {
  this.loadFileFromAssets();
}

/**
 * Für das Beispiel laden wir eine Datei aus dem Assets-Ordner.
 * Voraussetzung: assets-Ordner enthält den Unterordner "png" und die Datei "example.png".
 */
loadFileFromAssets() {
  this.http.get('assets/png/example.png', {responseType: 'blob'})
    .subscribe((response: Blob) => {
      const file = <any>response;
      file.name = 'example.png';
      file.lastModifiedDate = new Date();
      const reader = new FileReader();
      reader.onload = (fileData: any) => {
        this.selected = {name: 'example.png', type: 'image/png', content: fileData.target.result};
      };
      reader.readAsDataURL(file);
    });
}
```

Html

```html
<lux-file-input-ac
  luxLabel="Bitte Laden Sie eine Datei hoch"
  luxHint="Klicken Sie auf den 'Upload'-Button oder nutzen Drag-and-Drop"
  [luxDownloadActionConfig]="downloadActionConfig"
  [luxSelected]="selected"
>
</lux-file-input-ac>
```

### 6. Mit Dateieinschränkungen

![Beispielbild 06](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐file‐input-v16-img-06.gif)

Html

```html
<lux-file-input-ac
  luxLabel="Bitte Laden Sie eine Datei hoch"
  luxHint="Klicken Sie auf den 'Upload'-Button oder nutzen Drag-and-Drop"
  luxAccept=".pdf, .xlsx"
  [luxMaxSizeMB]="5"
  luxCapture="user"
>
</lux-file-input-ac>
```

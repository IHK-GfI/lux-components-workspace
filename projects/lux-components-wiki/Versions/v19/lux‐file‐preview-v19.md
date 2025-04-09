# LUX-File-Preview

![Beispielbild LUX-File-Preview](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐file‐preview-v18-img.png)
![Beispielbild LUX-File-Preview](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐file‐preview-v18-img2.png)

- [LUX-File-Preview](#lux-file-preview)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
  - [Classes / Services](#classes--services)
    - [LuxFilePreviewService](#luxfilepreviewservice)
    - [LuxFilePreviewRef](#luxfilepreviewref)
    - [LuxFilePreviewConfig](#luxfilepreviewconfig)
    - [LuxFilePreviewData](#luxfilepreviewdata)
  - [Beispiel](#beispiel)

## Overview / API

**Wichtig!**
Bevor die LuxFilePreview verwendet werden kann, muss das Projekt einmalig angepasst werden.

| Datei                                            | Änderungen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| package.json                                     | Im Abschnitt "dependencies" müssen die Abhängigkeiten `"ng2-pdf-viewer": "x.x.x"` und `"pdfjs-dist": "x.x.x"` ergänzt werden. Es müssen dieselben Versionen verwendet werden, welche auch von den LUX-Components im eigenen Projekt verwendet werden. <br><br>D.h. die entsprechenden Versionen können der Datei "package.json" der zum Projekt passenden LUX-Componentsversion (siehe [Releases](https://github.com/IHK-GfI/lux-components/releases) _-> Asstes -> Source code (zip) -> "package.json"_) entnommen werden. <br><br> `npm install` im Anschluss nicht vergessen! |
| node_modules/pdfjs-dist/build/pdf.worker.min.mjs | Die Datei "pdf.worker.min.mjs" muss in den Ordner "src/assets/pdf" kopiert und danach in "pdf.worker.min.js" umbenannt werden.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| app.module.ts                                    | Im Abschnitt "imports" muss das LuxFilePreviewModule ergänzt werden. <br><br> Im Konstruktor oder in der Methode "ngDoBootstrap" muss der der PDF-Worker verlinkt werden. Dazu muss die Zeile `(window as any).pdfWorkerSrc = '/assets/pdf/pdf.worker.min.js';` ergänzt werden.                                                                                                                                                                                                                                                                                                  |

### Allgemein

| Name     | Beschreibung                             |
| -------- | ---------------------------------------- |
| selector | lux-file-preview                         |
| import   | @ihk-gfi/lux-components/lux-file-preview |

## Classes / Services

### LuxFilePreviewService

| Name                                                  | Beschreibung              |
| ----------------------------------------------------- | ------------------------- |
| open(config: LuxFilePreviewConfig): LuxFilePreviewRef | Öffnet die Dateivorschau. |

### LuxFilePreviewRef

| Name          | Beschreibung                |
| ------------- | --------------------------- |
| close(): void | Schließt die Dateivorschau. |

### LuxFilePreviewConfig

| Name        | Typ                |
| ----------- | ------------------ |
| previewData | LuxFilePreviewData |

### LuxFilePreviewData

| Name          | Typ             |
| ------------- | --------------- |
| fileComponent | LuxFormFileBase |
| fileObject    | ILuxFileObject  |

## Beispiel

Wichtig! Bitte alle Hinweise auf dem Tab "Overview / API" beachten!!!

![Beispielbild 01-01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐file‐preview-v18-img-01-01.png)
![Beispielbild 01-02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐file‐preview-v18-img-01-02.png)

Ts

```typescript
  @ViewChild('fileListComponent', { static: false }) fileComponent!: LuxFileListComponent;

  viewActionConfig: ILuxFileActionConfig = {
    disabled: false,
    hidden  : false,
    iconName: 'lux-interface-edit-view',
    label   : 'Ansehen',
    onClick : (fileObject: ILuxFileObject) => {
      this.filePreviewService.open({
        previewData: {
          fileComponent: this.fileComponent,
          fileObject   : fileObject
        }
      });
    }
  };

  form: FormGroup;

  constructor(private filePreviewService: LuxFilePreviewService) {
    this.form = new FormGroup({
      file: new FormControl<ILuxFileObject[] | null>(null)
    });
  }
```

Html

```html
<form [formGroup]="form">
  <lux-file-list
    luxLabel="Bescheinigung"
    luxControlBinding="file"
    [luxViewActionConfig]="viewActionConfig"
    #fileListComponent
  ></lux-file-list>
</form>
```

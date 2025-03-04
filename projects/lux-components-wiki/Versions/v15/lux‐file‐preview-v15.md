# LUX-File-Preview

![Beispielbild LUX-File-Preview](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐file‐preview-v15-img.png)
![Beispielbild LUX-File-Preview](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐file‐preview-v15-img2.png)

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

| Datei                                                                                          | Änderungen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| package.json                                                                                   | Im Abschnitt "dependencies" müssen die Abhängigkeiten `"ng2-pdf-viewer": "x.x.x"` und `"pdfjs-dist": "x.x.x"` ergänzt werden. Es müssen dieselben Versionen verwendet werden, welche auch von den LUX-Components im eigenen Projekt verwendet werden. <br><br>D.h. die entsprechenden Versionen können der Datei "package.json" der zum Projekt passenden LUX-Componentsversion (siehe [Releases](https://github.com/IHK-GfI/lux-components/releases) _-> Asstes -> Source code (zip) -> "package.json"_) entnommen werden. <br> `npm install` im Anschluss nicht vergessen!                                                                                                                                                                                                                                                                                                                                                         |
| angular.json                                                                                   | LUX-Components 13+: <br><br>Im Abschnitt "assets" müssen die Zeilen `{"glob":"pdf.worker.min.js","input":"./node_modules/ng2-pdf-viewer/node_modules/pdfjs-dist/build","output":"./assets/pdf"}` und `{"glob":"**/*","input":"./node_modules/pdfjs-dist/cmaps/","output":"./assets/cmaps"}` ergänzt werden. <br><br>LUX-Components 11: <br><br>Im Abschnitt "assets" müssen die Zeilen `{"glob":"pdf.worker.js","input":"./node_modules/pdfjs-dist/build","output":"./assets/pdf"}` und `{"glob":"**/*","input":"./node_modules/pdfjs-dist/cmaps/","output":"./assets/cmaps"}` ergänzt werden.                                                                                                                                                                                                                                                                                                                                       |
| app.module.ts                                                                                  | Im Abschnitt "imports" muss das LuxFilePreviewModule ergänzt werden. <br><br> Im Konstruktor oder in der Methode "ngDoBootstrap" muss der Assets-Ordner "assets/pdf" (siehe oben) verlinkt werden. Dazu muss die Zeile `(window as any).pdfWorkerSrc = '/assets/pdf/pdf.worker.min.js';` (LUX-Components 13+) oder `(window as any).pdfWorkerSrc = '/assets/pdf/pdf.worker.js';` (LUX-Components 11) ergänzt werden. Alternativ zur lokalen Worker-Auslieferung, kann auch eine externe URL als `pdfWorkerSrc` angegeben werden. In diesem Fall muss der Worker auch nicht in den lokalen Assets-Ordner kopiert werden. Jedoch muss die externe URL in der CSP ergänzt werden, da ansonsten das Laden des Workers verhindert wird. <br><br>Im Abschnitt "entryComponents" muss die LuxFilePreviewComponent ergänzt werden. <br> **Ab Version 13.0.0 entfällt dieser Teil, da die Angabe der "entryComponent" obsolet geworden ist.** |
| Gilt nur für JAST-Projekte: <br><br> Alle application\*.yml-Dateien (z.B. application-dev.yml) | Anpassung der Content Security Policy (siehe csp:) Die `font-src` muss um `'self' data:` ergänzt werden. Bitte die einfachen Anführungszeichen beachten. Die `worker-src` muss um `'self' blob:` ergänzt werden. Die `img-src` muss um `blob:` ergänzt werden. Die `connect-src` muss um `blob:` ergänzt werden.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

### Allgemein

| Name     | Beschreibung         |
| -------- | -------------------- |
| import   | LuxFilePreviewModule |
| selector | lux-file-preview     |

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

![Beispielbild 01-01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐file‐preview-v15-img-01-01.png)
![Beispielbild 01-02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐file‐preview-v15-img-01-02.png)

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

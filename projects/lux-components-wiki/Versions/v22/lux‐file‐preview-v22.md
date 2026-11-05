# LUX-File-Preview

![Beispielbild LUX-File-Preview](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐preview-v22-img.png)
![Beispielbild LUX-File-Preview](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐preview-v22-img2.png)

- [LUX-File-Preview](#lux-file-preview)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
  - [Classes / Services](#classes--services)
    - [LuxFilePreviewService](#luxfilepreviewservice)
    - [LuxFilePreviewRef](#luxfilepreviewref)
    - [LuxFilePreviewConfig](#luxfilepreviewconfig)
    - [LuxFilePreviewData](#luxfilepreviewdata)
  - [Beispiele](#beispiele)
    - [1. Mit Two-Way-Binding](#1-mit-two-way-binding)
    - [2. Signal Forms](#2-signal-forms)

## Overview / API

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

| Name           | Typ                | Beschreibung                                                         |
| -------------- | ------------------ | -------------------------------------------------------------------- |
| previewData    | LuxFilePreviewData | Die Daten für die Vorschau (Datei und auslösende File-Komponente).   |
| panelClass?    | string             | CSS-Klasse für das Overlay-Panel. Default: 'lux-file-preview-panel'. |
| hasBackdrop?   | boolean            | Bestimmt, ob ein Backdrop angezeigt wird. Default: true.             |
| backdropClass? | string             | CSS-Klasse für den Backdrop. Default: 'lux-file-preview-backdrop'.   |

### LuxFilePreviewData

| Name           | Typ             | Beschreibung                                              |
| -------------- | --------------- | --------------------------------------------------------- |
| fileComponent? | LuxFormFileBase | Die File-Komponente, aus der die Vorschau geöffnet wurde. |
| fileObject?    | ILuxFileObject  | Die Datei, die angezeigt werden soll.                     |

Die Vorschaudaten werden der Vorschau-Komponente über das InjectionToken `LUX_FILE_PREVIEW_DATA` bereitgestellt; eigene Vorschau-Komponenten können sie per `inject(LUX_FILE_PREVIEW_DATA)` abfragen.

## Beispiele

### 1. Mit Two-Way-Binding

![Beispielbild 01-01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐preview-v22-img-01-01.png)
![Beispielbild 01-02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐file‐preview-v22-img-01-02.png)

Ts

```typescript
private readonly filePreviewService = inject(LuxFilePreviewService);

readonly fileComponent = viewChild.required<LuxFormFileBase>('fileUploadComponent');

readonly files = signal<ILuxFileObject[] | null>(null);

readonly viewActionConfig: ILuxFileActionConfig = {
  disabled: false,
  hidden: false,
  iconName: 'lux-interface-edit-view',
  label: 'Ansehen',
  onClick: (fileObject: ILuxFileObject) => {
    this.filePreviewService.open({
      previewData: {
        fileComponent: this.fileComponent(),
        fileObject: fileObject
      }
    });
  }
};
```

Html

```html
<lux-file-upload
  luxLabel="Bescheinigung"
  [luxViewActionConfig]="viewActionConfig"
  [(value)]="files"
  #fileUploadComponent
/>
```

### 2. Signal Forms

Innerhalb eines [Angular Signal Form](https://angular.dev/guide/forms/signals/overview) wird die File-Komponente über `[formField]` gebunden; die Vorschau wird genauso über die View-Action geöffnet. Die Direktive `FormField` muss in den `imports` der Komponente stehen.

Ts

```typescript
import { FormField, form } from '@angular/forms/signals';

private readonly filePreviewService = inject(LuxFilePreviewService);

readonly fileComponent = viewChild.required<LuxFormFileBase>('fileUploadComponent');

readonly model = signal<{ certificates: ILuxFileObject[] | null }>({ certificates: null });
readonly uploadForm = form(this.model);

readonly viewActionConfig: ILuxFileActionConfig = {
  disabled: false,
  hidden: false,
  iconName: 'lux-interface-edit-view',
  label: 'Ansehen',
  onClick: (fileObject: ILuxFileObject) => {
    this.filePreviewService.open({
      previewData: {
        fileComponent: this.fileComponent(),
        fileObject: fileObject
      }
    });
  }
};
```

Html

```html
<lux-file-upload
  luxLabel="Bescheinigung"
  [luxViewActionConfig]="viewActionConfig"
  [formField]="uploadForm.certificates"
  #fileUploadComponent
/>
```

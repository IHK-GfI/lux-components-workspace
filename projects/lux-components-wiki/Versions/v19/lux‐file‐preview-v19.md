# LUX-File-Preview

![Beispielbild LUX-File-Preview](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐file‐preview-v19-img.png)
![Beispielbild LUX-File-Preview](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐file‐preview-v19-img2.png)

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

![Beispielbild 01-01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐file‐preview-v19-img-01-01.png)
![Beispielbild 01-02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐file‐preview-v19-img-01-02.png)

Ts

```typescript
  @ViewChild('fileUploadComponent', { static: false }) fileComponent!: LuxFormFileBase;

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
  <lux-file-upload
  luxLabel="Bescheinigung "
  luxControlBinding="file"
  [luxViewActionConfig]="viewActionConfig"
  #fileUploadComponent
  ></lux-file-upload>
</form>
```

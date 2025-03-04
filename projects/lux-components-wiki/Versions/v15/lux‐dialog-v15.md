# Lux-Dialog

![Beispielbild LUX-Dialog](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐dialog-v15-img.png)

- [Lux-Dialog](#lux-dialog)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
  - [Components](#components)
    - [LuxDialogPresetComponent](#luxdialogpresetcomponent)
    - [LuxDialogStructureComponent](#luxdialogstructurecomponent)
    - [LuxDialogTitleComponent](#luxdialogtitlecomponent)
    - [LuxDialogContentComponent](#luxdialogcontentcomponent)
    - [LuxDialogActionsComponent](#luxdialogactionscomponent)
  - [Classes / Interfaces](#classes--interfaces)
    - [ILuxDialogAction](#iluxdialogaction)
    - [ILuxDialogConfig](#iluxdialogconfig)
    - [ILuxDialogPresetConfig](#iluxdialogpresetconfig)
    - [LuxDialogRef](#luxdialogref)
  - [Beispiele](#beispiele)
    - [1. Confirm Dialog mit Defaultbutton](#1-confirm-dialog-mit-defaultbutton)
    - [2. Dialog mit eigener Komponente](#2-dialog-mit-eigener-komponente)
  - [Zusatzinformationen](#zusatzinformationen)

## Overview / API

### Allgemein

| Name   | Beschreibung     |
| ------ | ---------------- |
| import | LuxPopupsModule  |
| name   | LuxDialogService |

| Funktion                                                                                                 | Beschreibung                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| open\<T>(config?: ILuxDialogPresetConfig): LuxDialogRef\<T>                                              | Diese Methode öffnet einen Dialog anhand der übergebenen Konfiguration. Titel, Aktionen sowie Inhalt sind über die Konfiguration einstellbar.                                                 |
| openComponent\<T>(component: ComponentType\<any>, config?: ILuxDialogConfig, data?: T): LuxDialogRef\<T> | Diese Methode öffnet einen Dialog mit der übergebenen Component. Zusätzlich zur Konfiguration lässt sich noch ein Daten-Objekt übergeben, welches dann von der Component genutzt werden kann. |

## Components

### LuxDialogPresetComponent

Diese Component wird von dem LuxDialogService genutzt, um einen einfachen Dialog anzuzeigen, diese kann einen Titel, Text sowie bis zu zwei Aktionsschaltflächen besitzen.

| Name     | Beschreibung      |
| -------- | ----------------- |
| selector | lux-dialog-preset |

### LuxDialogStructureComponent

Diese Component dient der Strukturierung von eigenen Dialog-Components und kann LuxDialogTitle-, LuxDialogContent- und LuxDialogActionsComponent via Content-Projection entgegennehmen.

| Name     | Beschreibung         |
| -------- | -------------------- |
| selector | lux-dialog-structure |

### LuxDialogTitleComponent

Diese Component dient der Darstellung der Titel-Zeile des Dialogs.

| Name     | Beschreibung     |
| -------- | ---------------- |
| selector | lux-dialog-title |

### LuxDialogContentComponent

Diese Component stellt den Inhaltsbereich des Dialogs dar, beispielsweise lassen sich hier Texte, aber auch Formulare verwenden.

| Name     | Beschreibung       |
| -------- | ------------------ |
| selector | lux-dialog-content |

### LuxDialogActionsComponent

Diese Component soll die Aktionsschaltflächen des Dialogs darstellen.

| Name     | Beschreibung       |
| -------- | ------------------ |
| selector | lux-dialog-actions |

## Classes / Interfaces

### ILuxDialogAction

Dieses Interface dient der Konfiguration der Aktionsschaltflächen für die LuxDialogPresetComponent.

| Name     | Typ             | Beschreibung                                                              |
| -------- | --------------- | ------------------------------------------------------------------------- |
| label    | string          | Bestimmt das Label dieser Aktionsschaltfläche.                            |
| color    | LuxThemePalette | Diese Property legt die Farbe fest ('primary', 'accent', 'warn', '')      |
| raised   | boolean         | Bestimmt ob der Button hervorgehoben dargestellt werden soll.             |
| iconName | string          | Legt das Icon der Schaltfläche fest.                                      |
| tagId    | string          | Einzigartige ID für die Erstellung von e2e Tests.                         |
| disabled | boolean         | Bestimmt ob der Button deaktiviert ist.                                   |
| rounded  | boolean         | Legt den Button als abgerundet fest (er sollte dann kein Label besitzen). |

### ILuxDialogConfig

Dieses Interface legt die einstellbaren Optionen für die Dialoge fest (LuxDialogPresetComponents und eigen erstellte).

Es existiert ein zusätzliches Objekt DEFAULT_DIALOG_CONF mit zuvor festgelegten Standardwerten die hier ebenfalls angegeben sind.

| Name         | Typ              | Beschreibung                                                                                                  |
| ------------ | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| width        | string           | Bestimmt die Breite des Dialogs. Hier können px-Werte, aber auch %-Werte gesetzt werden.                      |
| height       | string           | Bestimmt die Höhe des Dialogs. Hier können px-Werte, aber auch %-Werte gesetzt werden.                        |
| panelClass   | string, string[] | Über diese Property ist es möglich eine einzelne bzw. mehrere CSS-Klassen an den geöffneten Dialog zu setzen. |
| disableClose | boolean          | Diese Property bestimmt ob der Dialog nur über die Schaltflächen schließbar ist oder nicht.                   |

### ILuxDialogPresetConfig

Dieses Interface legt die Optionen für die LuxDialogPresetComponents fest und stellt die entsprechenden Texte, etc. ein.
ILuxDialogPresetConfig erbt von ILuxDialogConfig.

Es existiert ein zusätzliches Objekt DEFAULT_DIALOG_PRESET_CONF mit zuvor festgelegten Standardwerten die hier ebenfalls angegeben sind.

| Name            | Typ                             | Beschreibung                                                                                                                                                                                                                                            |
| --------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| confirmAction   | ILuxDialogAction                | Über diese Property lässt sich der "Bestätigen"-Button konfigurieren.                                                                                                                                                                                   |
| declineAction   | ILuxDialogAction                | Über diese Property lässt sich der "Ablehnen"-Button konfigurieren.                                                                                                                                                                                     |
| defaultButton   | 'confirm', 'decline', undefined | Über diese Property kann der Standardbutton festgelegt werden. Der Standardbutton kann direkt nach dem Öffnen des Dialogs über die Enter-Taste ausgeöst werden. `undefined` bedeutet, dass kein Button ausgelöst wird, wenn man die Enter-Taste drückt. |
| iconName        | string                          | Ein Iconname.                                                                                                                                                                                                                                           |
| title           | string                          | Diese Eigenschaft bestimmt den Titel des Dialogs.                                                                                                                                                                                                       |
| content         | string                          | Diese Eigenschaft legt den Inhalt des Dialogs fest.                                                                                                                                                                                                     |
| contentTemplate | TemplateRef \<any>              | Alternativ lässt sich zum content auch ein TemplateRef übergeben, welches kompliziertere HTML-Strukturen als einen Text enthalten kann.                                                                                                                 |

### LuxDialogRef

Diese Klasse wird von den open- und openComponent-Funktionen des LuxDialogServices zurückgegeben und ermöglichen über Observable-Properties auf das Schließen des Dialogs zu reagieren.
Eigene Dialog-Component müssen diese Klasse via Dependency-Injection besitzen, um den Dialog schließen zu können und um das übergebene data-Objekt wieder abzufragen.

| Name                      | Typ                | Beschreibung                                                                                                                                                                                                                                                                                               |
| ------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| componentInstance         | ComponentInstance  | Diese Property enthält die aktuelle Component des Dialogs.                                                                                                                                                                                                                                                 |
| dialogConfirmed           | Observable \<void> | Über diese Property kann auf einen "positiven" Abschluss des Dialogs reagiert werden. Einschränkung: Dieses Observable erhält von LuxDialogPresetComponents beim Klick auf den "Bestätigen"-Button, eigene Dialog-Components müssen dafür die closeDialog-Funktion mit dem Parameter-Wert "true" aufrufen. |
| dialogDeclined            | Observable \<void> | Über diese Property kann auf einen "negativen" Abschluss des Dialogs reagiert werden. Einschränkung: Dieses Observable erhält von LuxDialogPresetComponents beim Klick auf den "Ablehnen"-Button, eigene Dialog-Components müssen dafür die closeDialog-Funktion mit dem Parameter-Wert "false" aufrufen.  |
| dialogClosed              | Observable \<any>  | Über diese Property kann auf einen Abschluss des Dialogs reagiert werden. Dieses Observable erhält immer einen Wert, wenn der Dialog geschlossen wird (unabhängig ob abgelehnt oder bestätigt).                                                                                                            |
| data                      | any                | Erhält optional Informationen für die Dialog-Component, die diese für die Darstellung/Bearbeitung benötigt. Für LuxDialogPresetComponents entspricht dieser Wert der Konfigurationswert aus der open-Funktion.                                                                                             |
| init()                    | Methode            | Initialisiert diese Component neu und setzt dabei alle Properties zurück.                                                                                                                                                                                                                                  |
| closeDialog(result?: any) | Methode            | Schließt den aktuellen Dialog und löst anschließend je nach Bedingungen dialogDeclined oder dialogConfirmed, aber immer dialogClosed aus. DialogClosed kann optional noch ein result-Objekt beinhalten.                                                                                                    |

## Beispiele

### 1. Confirm Dialog mit Defaultbutton

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐dialog-v15-img-01.png)

Ts

```typescript
dialogConfig: ILuxDialogPresetConfig = {
    title: 'Daten löschen?',
    content: 'Ihre Date werden endgültig gelöscht. Das Löschen kann nicht rückgängig gemacht werden.',
    disableClose: true,
    width: 'auto',
    height: 'auto',
    panelClass: [],
    confirmAction: {
      label: 'Löschen',
      outlined: true,
      color: 'warn'
    },
    declineAction: {
      label: 'Abbrechen',
      flat: true,
      color: 'primary'
    },
    defaultButton: 'decline'
};

constructor(private dialogService: LuxDialogService) {
}

openDialog() {
    const dialogRef = this.dialogService.open(this.dialogConfig);

    dialogRef.dialogClosed.subscribe((result: any) => {
        console.log('dialogClosed', result);
    });

    dialogRef.dialogDeclined.subscribe((result: any) => {
        console.log('dialogDeclined');
    });

    dialogRef.dialogConfirmed.subscribe((result: any) => {
        console.log('dialogConfirmed');
    });
}
```

Html

```html
<lux-button luxLabel="Öffnen" (luxClicked)="openDialog()"></lux-button>
```

### 2. Dialog mit eigener Komponente

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐dialog-v15-img-02.png)

Ts - Aufrufer

```typescript
dialogConfig: ILuxDialogConfig = {
    disableClose: true,
    width: 'auto',
    height: 'auto',
    panelClass: [],
};

// Das hier könnte auch jedes andere Objekt sein, Hauptsache ExampleDialogComponent kann dieses Objekt interpretieren
data: string = 'Im nächsten Fenster können Sie den Vorgang widerrufen.';

constructor(private dialogService: LuxDialogService) {
}

openDialog() {
    const dialogRef = this.dialogService.openComponent(ExampleDialogComponent, this.dialogConfig, this.data);

    dialogRef.dialogClosed.subscribe((result: any) => {
        console.log('dialogClosed', result);
    });
}
```

Html - Aufrufer

```html
<lux-button luxLabel="Öffnen" (luxClicked)="openDialog()"></lux-button>
```

Html - Dialog

```html
<lux-dialog-structure>
  <lux-dialog-title>Speichern <i>(Sichern Sie Ihre Daten)</i></lux-dialog-title>
  <lux-dialog-content>
    <div class="content">
      <lux-file-upload></lux-file-upload>
      <div
        fxLayout="row"
        fxLayoutAlign="start center"
        class="toggle-agb-container"
      >
        <lux-toggle-ac
          luxLabel="AGB gelesen"
          luxHint="Ich habe die AGB und Datenschutzvereinbarungen gelesen und akzeptiere diese."
          [luxRequired]="true"
          [luxNoTopLabel]="true"
          #agbAcceptedToggle
        >
        </lux-toggle-ac>
      </div>
    </div>
  </lux-dialog-content>
  <lux-dialog-actions>
    <lux-button
      luxLabel="OK"
      luxColor="primary"
      [luxDisabled]="!agbAcceptedToggle.luxChecked"
      [luxFlat]="true"
      (luxClicked)="luxDialogRef.closeDialog(true)"
    ></lux-button>
  </lux-dialog-actions>
</lux-dialog-structure>
```

Ts - Dialog

```typescript
constructor(public luxDialogRef: LuxDialogRef<any>) {
}

ngOnInit() {
}
```

## Zusatzinformationen

Über den LuxDialogService lassen sich modale Dialoge öffnen, welche entweder einfache Abfragen ("Möchten Sie wirklich löschen?" "Ja", "Nein") anbieten können, aber auch kompliziertere Abfragen mit Formular-Elementen, etc.

Mithilfe der "open"-Funktion lassen sich schnell leicht konfigurierbare Dialoge öffnen, mit "openComponent" können eigen erstellte Dialoge angezeigt werden.

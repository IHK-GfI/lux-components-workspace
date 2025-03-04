# Lux-Tour-Hint

![Beispielbild LUX-Tour-Hint](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐tour-hint-v18-img.png)

- [Lux-Tour-Hint](#lux-tour-hint)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
  - [Components](#components)
    - [LuxTourHintPresetComponent](#luxtourhintpresetcomponent)
  - [Classes / Interfaces](#classes--interfaces)
    - [ILuxTourHintStepConfig](#iluxtourhintstepconfig)
    - [LuxTourHintRef\<T\>](#luxtourhintreft)
  - [Beispiele](#beispiele)
    - [1. Einfacher Hinweis, der sich auf ein Element bezieht](#1-einfacher-hinweis-der-sich-auf-ein-element-bezieht)
    - [2. Einfache Tour über mehrere Elemente](#2-einfache-tour-über-mehrere-elemente)
    - [3. Hinweis oder Tour ohne 'Nicht wieder anzeigen'](#3-hinweis-oder-tour-ohne-nicht-wieder-anzeigen)
    - [4. Das Schließen der Tour-Hint Komponente abhören](#4-das-schließen-der-tour-hint-komponente-abhören)
  - [Zusatzinformationen](#zusatzinformationen)
    - [Tastaturabkürzungen](#tastaturabkürzungen)
    - ["Nicht wieder anzeigen" - Cache](#nicht-wieder-anzeigen---cache)

## Overview / API

### Allgemein

| Name   | Beschreibung       |
| ------ | ------------------ |
| import | LuxTourHintModule  |
| name   | LuxTourHintService |

| Funktion                                                                                                                                                         | Beschreibung                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| open(tourConfig: ILuxTourHintStepConfig \| ILuxTourHintStepConfig[], optionDontShowAgain: boolean = true): LuxTourHintRef                                        | Diese Methode öffnet eine/n Tour/Hint anhand der übergebenen Konfiguration. Titel, Beschreibung der einzelnen Schritte können über die Konfiuration übergeben werden.                                    |
| openForComponent(comp: ComponentType\<any>, tourConfig: ILuxTourHintStepConfig \| ILuxTourHintStepConfig[], optionDontShowAgain: boolean = true): LuxTourHintRef | Diese Methode öffnet eine/n Tour/Hint mit der übergebenen Component. Titel, Zusätzlich zur Konfiguration lässt sich noch ein Daten-Objekt übergeben, welches dann von der Component genutzt werden kann. |

## Components

### LuxTourHintPresetComponent

Diese Component wird von dem LuxTourHintService genutzt, um einen einfachen 'Tour-Hint' anzuzeigen.

| Name     | Beschreibung         |
| -------- | -------------------- |
| selector | lux-tour-hint-preset |

## Classes / Interfaces

### ILuxTourHintStepConfig

Dieses Interface dient der Konfiguration eines Hinweises oder eines Schrittes für die Tour.

| Name     | Typ    | Beschreibung                                                                                                                                 |
| -------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| targetId | string | Bestimmt das Element, welches für diesen Hinweis oder Tour-Schritt fokusiert werden soll.                                                    |
| data     | any    | Diese Property gibt Daten für einen Schritt an. Für die als Standard ausgewählte Preset-Komponente wird hier 'title' und 'content' erwartet. |

### LuxTourHintRef\<T>

Diese Klasse wird von den open- und openComponent-Funktionen des LuxTourHintService zurückgegeben und ermöglichen über Methoden und Attribute mit dem geöffneten Tour-Hint Modal zu interagieren.
Eigene Dialog-Component müssen diese Klasse via Dependency-Injection besitzen, um den Tour-Hint-Modal schließen zu können.

| Name                                                | Typ     | Beschreibung                                                                                              |
| --------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| data                                                | T       | Der aktuelle mitgegebene Datensatz für die Tour-Hint Komponente                                           |
| step                                                | number  | Der aktuelle Schritt in der Tour                                                                          |
| steps                                               | number  | Die Anzahl Schritte, die es in der Tour gibt. (Wenn 1 dann ist es ein Hinweis und keine Tour)             |
| opened                                              | boolean | Gibt an, ob die Tour-Hint Komponente momentan geöffnet ist.                                               |
| optionDontShowAgain                                 | boolean | Gibt an, ob die Option 'Nicht wieder anzeigen' mit angezeigt werden soll.                                 |
| init()                                              | Methode | Initialisiert diese Component neu und setzt dabei alle Properties zurück.                                 |
| hasNext()                                           | Methode | Liefert einen Wahrheitswert, der angibt, ob es einen nächster Schritt in der Tour gibt.                   |
| hasPrevious()                                       | Methode | Liefert einen Wahrheitswert, der angibt, ob es einen voherigen Schritt in der Tour gibt.                  |
| next()                                              | Methode | Lässt die Tour einen Schritt voranschreiten und Aktualisiert die Tour-Hint Komponente für das neue Ziel.  |
| prev()                                              | Methode | Lässt die Tour einen Schritt zurückschreiten und Aktualisiert die Tour-Hint Komponente für das neue Ziel. |
| close(dontShowAgain: boolean = false)               | Methode | Schließt die Tour-Hint Komponente und gibt an, ob diese nicht nochmal angezeigt werden soll.              |
| onClose(listener: (dontShowAgain: boolean) => void) | Methode | Registriert einen Listener, der auf das Schließen der Komponente hört.                                    |

## Beispiele

### 1. Einfacher Hinweis, der sich auf ein Element bezieht

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐tour-hint-v18-img-01.png)

Hier ist es wichtig, dass die 'targetId' in der Konfiguration mit der id des auszuwählenden Elementes übereinstimmt.

Ts

```typescript

private basicHint: ILuxTourHintStepConfig = {
  targetId: "myInput",
  data: {
    title: "Hinweis",
    content: "Hier können Sie eine Bewertung zurück lassen"
  }
};

constructor(private tourHintService: LuxTourHintService) {
}

ngAfterViewInit() {
  this.tourHintService.open(this.basicHint);
}

```

Html

```html
<lux-input-ac id="myInput" luxLabel="Input 1"></lux-input-ac>
```

### 2. Einfache Tour über mehrere Elemente

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐tour-hint-v18-img-02.png)
![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐tour-hint-v18-img-03.png)
![Beispielbild 04](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐tour-hint-v18-img-04.png)

Ts

```typescript

private basicTour: ILuxTourHintStepConfig[] = [
  {
    targetId: "input1",
    data: {
      title: "Hinweis",
      content: "Hier können Sie eine Bewertung zurück lassen"
    }
  },
  {
    targetId: "button1",
    data: {
      title: "Aktionen",
      content: "Wenn Sie diesen Knopf drücken wird der Input zurückgesetzt."
    }
  },
  {
    targetId: "button2",
    data: {
      title: "Aktionen",
      content: "Wenn Sie diesen Knopf drücken wird ihre Bewertung unwiederruflich abgeschickt."
    }
  },
];

constructor(private tourHintService: LuxTourHintService) {
}

ngAfterViewInit() {
  this.tourHintService.open(this.basicTour);
}

```

Html

```html
<lux-card luxTitle="Card 1">
  <lux-card-content>
    <lux-input-ac id="input1" luxLabel="Input 1"></lux-input-ac>
    <lux-input-ac id="input2" luxLabel="Input 2"></lux-input-ac>
  </lux-card-content>
  <lux-card-actions id="actions">
    <lux-button
      luxLabel="Reset"
      [luxStroked]="true"
      luxColor="warn"
    ></lux-button>
    <lux-button luxLabel="Send" [luxStroked]="true"></lux-button>
  </lux-card-actions>
</lux-card>
```

### 3. Hinweis oder Tour ohne 'Nicht wieder anzeigen'

![Beispielbild 05](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐tour-hint-v18-img-05.png)

Hierfür kann bei dem Öffnen der Tour-Hint Komponente einfach ein 'false' als 2. Parameter mitgegeben werden:

Ts

```typescript
ngAfterViewInit(){
  this.tourHintService.open(this.basicTour, false);
}
```

### 4. Das Schließen der Tour-Hint Komponente abhören

Ts

```typescript
ngAfterViewInit(){
  let tourHintRef = this.tourHintService.open(this.basicTour);
  tourHintRef.onClose((dontShowAgain: boolean) => {
    console.log("Tour-Hint wurde geschlossen" + (dontShowAgain ? " und soll nicht wieder angezeigt werden" : "."));
  });
}
```

## Zusatzinformationen

### Tastaturabkürzungen

Mit den Pfeiltasten kann sich ganz einfach innerhalb einer Tour bewegt werden.\
Mit der Entertaste schließt sich die Tour/ der Hint.

### "Nicht wieder anzeigen" - Cache

Wenn ein Hinweis oder eine Tour mit der Option "Nicht wieder anzeigen" geschlossen wird, ist eine id zu der Tour im Webbrowser abgespeichert, welche das erneute öffnen der Tour-Hint Komponente verhindert.\
Mit der Methode LuxTourHintService.clearDSACacheForConfig(this.myTourConfig) kann die id aus der cache gelöscht werden und somit die Tour-Hint Komponente erneut geöffnet werden.

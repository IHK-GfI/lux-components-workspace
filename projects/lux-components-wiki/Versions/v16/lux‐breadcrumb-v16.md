# Lux-Breadcrumb

![Beispielbild Lux-Breadcrumb](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐breadcrumb‐v16‐img-01.png)

- [Lux-Breadcrumb](#lux-breadcrumb)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
  - [Components](#components)
    - [LuxBreadcrumbComponent](#luxbreadcrumbcomponent)
      - [@Input](#input)
      - [@Output](#output)
  - [Interface](#interface)
    - [ILuxBreadcrumbEntry](#iluxbreadcrumbentry)
  - [Beispiele](#beispiele)
    - [Beispiel mit Angular Router Navigation](#beispiel-mit-angular-router-navigation)
    - [Beispiel manuelle Navigation mit ngIf](#beispiel-manuelle-navigation-mit-ngif)

## Overview / API

### Allgemein

| Name     | Beschreibung         |
| -------- | -------------------- |
| import   | LuxBreadcrumbModule |

## Components

### LuxBreadcrumbComponent

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-breadcrumb |

#### @Input

| Name       | Typ                     | Beschreibung                                                                     |
| ---------- | ----------------------- | -------------------------------------------------------------------------------- |
| luxEntries | ILuxBreadcrumbEntry[]  | Ein Array mit allen Einträgen des Breadcrumb                                    |

#### @Output

| Name        | Typ                                  | Beschreibung                                                                                                         |
| ----------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| luxClicked  | EventEmitter \<ILuxBreadcrumbEntry> | Output-Event welches ausgelöst wird, wenn ein Breadcrumb angeklickt wird. Gibt den entsprechenden Breadcrumb zurück. |

## Interface

### ILuxBreadcrumbEntry

Dieses Interface ist für die Ansicht und Reihenfolge der Breadcrumb Einträge da.

| Name  | Typ    | Beschreibung                                                                                      |
| ----- | ------ | ------------------------------------------------------------------------------------------------- |
| name  | string | Bestimmt den Namen der Url, der in den Breadcrumb angezeigt wird.                                |
| url   | string | Hier wird der Pfad zu der gewünschten Seite eingetragen, die url kann auch leer gelassen werden.  |

## Beispiele

### Beispiel mit Angular Router Navigation

Ts

```typescript
  public entries: ILuxBreadcrumbEntry[] = [
    { name: 'Startseite', url: '/home' },
    { name: 'Komponenten', url: '/components-overview' },
    { name: 'lux-breadcrumb', url: '' }
  ];

  constructor(public router: Router) {}

  onClick(entry: ILuxBreadcrumbEntry) {
    this.router.navigate([entry.url]);
  }
```

Html

```html
  <lux-breadcrumb [luxEntries]="entries" (luxClicked)="onClick($event)"></lux-breadcrumb>
```

### Beispiel manuelle Navigation mit ngIf

![Beispielbild](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐breadcrumb‐v16‐img‐02.png)

Ts

```typescript
  public entries: ILuxBreadcrumbEntry[] = [{name: 'Übersicht', url: 'Übersicht'}];

  currentArea?: string = 'Übersicht' ;

  onBreadcrumbClick(entry: ILuxBreadcrumbEntry) {
    this.currentArea = entry.url;
    this.entries = this.entries.slice( 0 , this.entries.findIndex((e) => e.name === entry.name) + 1 );
  }

  onSwitchArea(area: string) {
    this.currentArea = area;
    let newEntry = {
      name: area,
      url: area
    };

    this.entries = [...this.entries,newEntry];
  }

```

Html

```html
<lux-breadcrumb *ngIf="entries.length > 1" [luxEntries]="entries" (luxClicked)="onBreadcrumbClick($event)"></lux-breadcrumb>
<div *ngIf="currentArea === 'Übersicht'" >
    <h4>Übersicht</h4>
    <lux-link-plain luxLabel="Berufliche Bildung" (luxClicked)="onSwitchArea('Berufliche Bildung')" ></lux-link-plain>
    ...
</div>
<div *ngIf="currentArea === 'Berufliche Bildung'">
    <h4>Berufliche Bildung</h4>
    <lux-link-plain luxLabel="Ausbildung" (luxClicked)="onSwitchArea('Ausbildung')" ></lux-link-plain>
    ...
</div>
<div *ngIf="currentArea === 'Ausbildung'">
    <h4>Ausbildung</h4>
    ...
</div>
```

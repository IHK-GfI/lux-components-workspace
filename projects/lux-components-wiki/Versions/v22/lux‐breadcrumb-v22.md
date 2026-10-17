# LUX-Breadcrumb

![Beispielbild LUX-Breadcrumb](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐breadcrumb-v22-img-01.png)

- [LUX-Breadcrumb](#lux-breadcrumb)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Interface](#interface)
    - [ILuxBreadcrumbEntry](#iluxbreadcrumbentry)
  - [Beispiele](#beispiele)
    - [Beispiel mit Angular Router Navigation](#beispiel-mit-angular-router-navigation)
    - [Beispiel manuelle Navigation mit @switch](#beispiel-manuelle-navigation-mit-switch)

## Overview / API

### Allgemein

| Name     | Beschreibung   |
| -------- | -------------- |
| selector | lux-breadcrumb |

### @Input

| Name                    | Typ                   | Beschreibung                                                                                                                                   |
| ----------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| luxEntries              | ILuxBreadcrumbEntry[] | Ein Array mit allen Einträgen des Breadcrumbs. Default: [].                                                                                    |
| luxWrap                 | boolean               | Aktiviert eine mehrzeilige Darstellung (Umbruch). Ohne Angabe wird der Breadcrumb einzeilig dargestellt und gekürzt. Default: false.           |
| luxShowOnlyFirstAndLast | boolean               | Zeigt nur den ersten und den letzten Eintrag an. Alle dazwischenliegenden Einträge werden als Platzhalter ("...") dargestellt. Default: false. |

### @Output

| Name       | Typ                 | Beschreibung                                                                                                         |
| ---------- | ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| luxClicked | ILuxBreadcrumbEntry | Output-Event, welches ausgelöst wird, wenn ein Breadcrumb angeklickt wird und den entsprechenden Eintrag zurückgibt. |

## Interface

### ILuxBreadcrumbEntry

Dieses Interface dient der Darstellung und Reihenfolge der Breadcrumb-Einträge.

| Name | Typ    | Beschreibung                                                                                      |
| ---- | ------ | ------------------------------------------------------------------------------------------------- |
| name | string | Bestimmt den Namen der URL, die im Breadcrumb angezeigt wird.                                     |
| url? | string | Hier wird der Pfad zur gewünschten Seite eingetragen; die URL ist optional und kann leer bleiben. |

## Beispiele

### Beispiel mit Angular Router Navigation

Ts

```typescript
readonly entries: ILuxBreadcrumbEntry[] = [
  { name: 'Startseite', url: '/home' },
  { name: 'Komponenten', url: '/components-overview' },
  { name: 'lux-breadcrumb', url: '' }
];

private readonly router = inject(Router);

onClick(entry: ILuxBreadcrumbEntry) {
  this.router.navigate([entry.url]);
}
```

Html

```html
<lux-breadcrumb [luxEntries]="entries" (luxClicked)="onClick($event)" />
```

### Beispiel manuelle Navigation mit @switch

![Beispielbild](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐breadcrumb-v22-img-02.png)

Ts

```typescript
readonly entries = signal<ILuxBreadcrumbEntry[]>([{ name: 'Übersicht', url: 'Übersicht' }]);
readonly currentArea = signal<string | undefined>('Übersicht');

onBreadcrumbClick(entry: ILuxBreadcrumbEntry) {
  this.currentArea.set(entry.url);
  this.entries.update((entries) => entries.slice(0, entries.findIndex((e) => e.name === entry.name) + 1));
}

onSwitchArea(area: string) {
  this.currentArea.set(area);
  const newEntry: ILuxBreadcrumbEntry = {
    name: area,
    url: area
  };

  this.entries.update((entries) => [...entries, newEntry]);
}
```

Html

```html
@if (entries().length > 1) {
  <lux-breadcrumb [luxEntries]="entries()" (luxClicked)="onBreadcrumbClick($event)" />
}
@switch (currentArea()) {
  @case ('Übersicht') {
    <div>
      <h4>Übersicht</h4>
      <lux-link-plain luxLabel="Berufliche Bildung" (luxClicked)="onSwitchArea('Berufliche Bildung')" />
      ...
    </div>
  }
  @case ('Berufliche Bildung') {
    <div>
      <h4>Berufliche Bildung</h4>
      <lux-link-plain luxLabel="Ausbildung" (luxClicked)="onSwitchArea('Ausbildung')" />
      ...
    </div>
  }
  @case ('Ausbildung') {
    <div>
      <h4>Ausbildung</h4>
      ...
    </div>
  }
}
```

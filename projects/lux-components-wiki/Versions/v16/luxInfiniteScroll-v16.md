# luxInfiniteScroll

- [luxInfiniteScroll](#luxinfinitescroll)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiele](#beispiele)
    - [1. Mit LUX-List](#1-mit-lux-list)
    - [2. Mit Div-Elementen](#2-mit-div-elementen)

## Overview / API

### Allgemein

| Name     | Beschreibung        |
| -------- | ------------------- |
| import   | LuxDirectivesModule |
| selector | luxInfiniteScroll   |

### @Input

| Name                 | Typ                  | Beschreibung                                                             |
| -------------------- | -------------------- | ------------------------------------------------------------------------ |
| luxScrollPercent     | number               | Prozentzahl in der Scrollbar, ab der das luxScrolled-Event emitted wird. |
| luxImmediateCallback | boolean              | Einstellung ob bei Initiierung ein luxScrolled-Event abgegeben wird.     |
| luxIsLoading         | boolean              | Teilt der Komponente mit, ob gerade Daten geladen werden.                |
| luxScrolled          | EventEmitter \<void> | Event, wenn das scrollende Element neue Daten bereitstellen sollte.      |

## Beispiele

### 1. Mit LUX-List

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/luxInfiniteScroll-v16-img-01.png)

Ts

```typescript
list: any[] = [];

constructor() {
  for(let i = 0; i < 10; i++) {
    this.list.push(`Item #${i}`);
  }
}

onScroll() {
  const startIndex = this.list.length;
  for(let i = 0; i < 10; i++) {
    this.list.push(`Item #${ startIndex + i}`);
  }
}
```

Html

```html
<div style="height: 500px">
  <lux-list
    class="lux-flex lux-flex-col"
    luxInfiniteScroll
    [luxScrollPercent]="80"
    [luxImmediateCallback]="true"
    (luxScrolled)="onScroll()"
  >
    <lux-list-item
      [luxTitle]="item"
      *ngFor="let item of list"
      class="lux-min-width-80"
    >
      <lux-list-item-icon>
        <lux-icon luxIconName="lux-programming-module-puzzle"></lux-icon>
      </lux-list-item-icon>
      <lux-list-item-content class="lux-min-width-80">
        Ich bin das {{ item }}.
      </lux-list-item-content>
    </lux-list-item>
  </lux-list>
</div>
```

### 2. Mit Div-Elementen

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/luxInfiniteScroll-v16-img-02.png)

Ts

```typescript
  list: any[] = [];

  constructor() {
    for(let i = 0; i < 10; i++) {
      this.list.push(`Item #${i}`);
    }
  }

  onScroll() {
    const startIndex = this.list.length;
    for(let i = 0; i < 10; i++) {
      this.list.push(`Item #${ startIndex + i}`);
    }
  }
```

Html

```html
<div
  style="height: 100%; width: 100%; overflow-y: auto"
  luxInfiniteScroll
  [luxScrollPercent]="80"
  [luxImmediateCallback]="false"
  (luxScrolled)="onScroll()"
>
  <div style="min-height: 100px; min-width: 400px" *ngFor="let item of list">
    {{ item }}
  </div>
</div>
```

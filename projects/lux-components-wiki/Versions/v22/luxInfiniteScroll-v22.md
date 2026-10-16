# luxInfiniteScroll

- [luxInfiniteScroll](#luxinfinitescroll)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Mit LUX-List](#1-mit-lux-list)
    - [2. Mit Div-Elementen](#2-mit-div-elementen)

## Overview / API

### Allgemein

| Name     | Beschreibung      |
| -------- | ----------------- |
| selector | luxInfiniteScroll |

### @Input

| Name                 | Typ     | Beschreibung                                                                            |
| -------------------- | ------- | --------------------------------------------------------------------------------------- |
| luxScrollPercent     | number  | Prozentzahl in der Scrollbar, ab der das luxScrolled-Event ausgelöst wird. Default: 85. |
| luxImmediateCallback | boolean | Einstellung, ob bei Initiierung ein luxScrolled-Event abgegeben wird. Default: true.    |
| luxIsLoading         | boolean | Teilt der Komponente mit, ob gerade Daten geladen werden. Default: false.               |

### @Output

| Name        | Typ  | Beschreibung                                                                 |
| ----------- | ---- | ---------------------------------------------------------------------------- |
| luxScrolled | void | Wird ausgelöst, wenn das scrollende Element neue Daten bereitstellen sollte. |

## Beispiele

### 1. Mit LUX-List

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/luxInfiniteScroll-v22-img-01.png)

Ts

```typescript
readonly list = signal<string[]>(Array.from({ length: 10 }, (_, i) => `Item #${i}`));

onScroll() {
  this.list.update((list) => [...list, ...Array.from({ length: 10 }, (_, i) => `Item #${list.length + i}`)]);
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
    @for (item of list(); track item) {
      <lux-list-item [luxTitle]="item" class="lux-min-width-80">
        <lux-list-item-icon>
          <lux-icon luxIconName="lux-programming-module-puzzle" />
        </lux-list-item-icon>
        <lux-list-item-content class="lux-min-width-80">
          Ich bin das {{ item }}.
        </lux-list-item-content>
      </lux-list-item>
    }
  </lux-list>
</div>
```

### 2. Mit Div-Elementen

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/luxInfiniteScroll-v22-img-02.png)

Ts

```typescript
readonly list = signal<string[]>(Array.from({ length: 10 }, (_, i) => `Item #${i}`));

onScroll() {
  this.list.update((list) => [...list, ...Array.from({ length: 10 }, (_, i) => `Item #${list.length + i}`)]);
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
  @for (item of list(); track item) {
    <div style="min-height: 100px; min-width: 400px">
      {{ item }}
    </div>
  }
</div>
```

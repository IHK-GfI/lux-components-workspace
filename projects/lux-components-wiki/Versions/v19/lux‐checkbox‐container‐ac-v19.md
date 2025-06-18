# LUX-Checkbox-Container-Ac

![Beispielbild LUX-Checkbox-Container](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐checkbox‐container‐ac-v19-img.png)

- [LUX-Checkbox-Container-Ac](#lux-checkbox-container-ac)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiele](#beispiele)
    - [1. Checkbox-Container mit einem Label](#1-checkbox-container-mit-einem-label)
    - [2. Mehrere Container in einem css-Grid](#2-mehrere-container-in-einem-css-grid)

## Overview / API

### Allgemein

Diese Komponente bietet einen einfachen Layout-Container um mehrer Checkboxen analog zu einer Radio-Group anzuordnen. Er ist für die Verwendung der lux-checkbox-ac konzipiert. Diese wird automatisch in der komprimierten Darstelllung angezeigt und enthält daher keinen Hinweis/Fehler-Container mehr! Die Container können in einem Raster mit weiteren Ac-Form-Controls im luxDense-Format ausgerichtet werden.

| Name     | Beschreibung              |
| -------- | ------------------------- |
| selector | lux-checkbox-container-ac |

### @Input

| Name        | Typ     | Beschreibung                                                                                                                                                                                                                                        |
| ----------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxLabel    | String  | Optionales Label oberhalb des Containers. Es ist im Styling dem Formcontrol-Label angepasst. Damit kann der Container mit weiteren Ac-Formular-Elementen kombiniert werden. Wird kein Label angeben wird der Label Container komplett ausgeblendet. |
| luxVertical | boolean | Mit dieser Property kann die Ausrichtung des Containers bestimmt werden. Default ist "true" und die Checkboxen werden in einer Spalte dargestellt, mit false wird auf eine Reihendarstellung gewechselt.                                            |

## Beispiele

### 1. Checkbox-Container mit einem Label

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐checkbox‐container‐ac-v19-img-01.png)

Html

```html
<lux-checkbox-container-ac luxLabel="MyTestContainerLabel">
  <lux-checkbox-ac luxLabel="Lorem ipsum"></lux-checkbox-ac>
  <lux-checkbox-ac luxLabel="dolor"></lux-checkbox-ac>
  <lux-checkbox-ac luxLabel="sit amet consectetur"></lux-checkbox-ac>
  <lux-checkbox-ac luxLabel="adipisicing"></lux-checkbox-ac>
</lux-checkbox-container-ac>
```

### 2. Mehrere Container in einem css-Grid

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐checkbox‐container‐ac-v19-img-02.png)

Html

```html
<h2>Beispiel für die Verwendung von css-Grid</h2>
<div class="lux-grid lux-grid-cols-3 lt-md:lux-grid-cols-1 lux-gap-4">
  <lux-checkbox-container-ac luxLabel="Stufe">
    <lux-checkbox-ac luxLabel="Stufe 1"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="Stufe 2"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="Stufe 2+" class="col1"></lux-checkbox-ac>
  </lux-checkbox-container-ac>
  <lux-checkbox-container-ac luxLabel="Antragsart">
    <lux-checkbox-ac luxLabel="eUZ"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="eBS"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="mUZ"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="mBS"></lux-checkbox-ac>
  </lux-checkbox-container-ac>
  <lux-checkbox-container-ac luxLabel="Status">
    <lux-checkbox-ac luxLabel="Bewilligt"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="Abgelehnt"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="Kommentiert"></lux-checkbox-ac>
    <lux-checkbox-ac luxLabel="Ungültig erklärt"></lux-checkbox-ac>
  </lux-checkbox-container-ac>
</div>
<p>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla illum
  temporibus maxime quam repellat sunt delectus, excepturi maiores, saepe
  consequatur modi tempore sit!
</p>
```

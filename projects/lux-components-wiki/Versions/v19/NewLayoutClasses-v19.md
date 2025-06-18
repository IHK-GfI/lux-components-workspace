# Lux-Layout-Klassen

- [Lux-Layout-Klassen](#lux-layout-klassen)
  - [1. Display](#1-display)
  - [2. Flex Basis](#2-flex-basis)
  - [3. Flex-Direction](#3-flex-direction)
  - [4. Flex Wrap](#4-flex-wrap)
  - [5. Flex](#5-flex)
  - [6. Flex Grow / Shrink](#6-flex-grow--shrink)
  - [7. Order](#7-order)
  - [8. Justify Content](#8-justify-content)
  - [9. Justify Items](#9-justify-items)
  - [10. Justify Self](#10-justify-self)
  - [11. Align Content](#11-align-content)
  - [12. Align Items](#12-align-items)
  - [13. Align Self](#13-align-self)
  - [14. Place Content](#14-place-content)
  - [15. Place Items](#15-place-items)
  - [16. Place Self](#16-place-self)
  - [17. Grid Template Columns](#17-grid-template-columns)
  - [18. Grid Column Start / End](#18-grid-column-start--end)
  - [19. Grid Template Rows](#19-grid-template-rows)
  - [20. Grid Row Start / End](#20-grid-row-start--end)
  - [21. Grid Auto Flow](#21-grid-auto-flow)
  - [22. Grid Auto Columns](#22-grid-auto-columns)
  - [23. Grid Auto Rows](#23-grid-auto-rows)

Mit der Version Angular 16 wurde das Modul flex-layout deprecated. Dieses erforderte die Ergänzung der bisherigen Style-Klassen um zusätzliche Layout-Klassen. Wir haben uns dabei an dem Framework TailwindCSS orientiert und die CSS-Klassen für layout, flexbox und grid übernommen, sowohl bei der Namensgebung als auch bei den zugehörigen CSS-Regeln.

Siehe auch [Tailwind-Dokumentation](https://tailwindcss.com/docs/flex)

Für die Anpassung der Breakpoints wurden sass-mixins erstellt und die neuen Layoutklassen können durch einen entsprechenden Prefix ergänzt werden. Die Werte für die Breakpoints und Namensgebung entsprechenden den bisherigen Bezeichnung der Angular-Material-Components auf denen die Lux-Components basieren.

Siehe dazu: [Austauschmöglichkeiten für Angular/Flex-Layout](Replace-FxLayout-v19.md).

## 1. Display

| Klasse                     | CSS-Regel                 | Beschreibung                                                                                                                                                                                                               |
| :------------------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| lux-flex                   | display: flex;            | Erzeugt einen Flex-Container als blocklevel Element.[css flexible layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)                                                                        |
| lux-block                  | display: block;           | Erzeugt einen Block-Container als blocklevel Element.                                                                                                                                                                      |
| lux-grid                   | display: grid;            | Erzeugt einen Grid-Container.                                                                                                                                                                                              |
| lux-inline-flex            | display: inline-flex;     | Erzeugt einen Flex-Container als inline Element.                                                                                                                                                                           |
| lux-inline-block           | display: inline-block;    | Erzeugt einen Block-Container als inline Element.                                                                                                                                                                          |
| lux-grid-inline            | display: inline-grid;     | Erzeugt einen Grid-Container als inline Element.                                                                                                                                                                           |
| lux-display-none           | display: none;            | Das Element wird nicht gerendert und aus dem DOM entfernt. Der Platz wird von den anderen Elementen der Seite eingenommen. Soll der Platz freigehalten werden und das Element nur nicht angzeigt werden, nutze lux-hidden! |
| lux-display-none-important | display: none !important; | Nur im Notfall zu gebrauchen                                                                                                                                                                                               |

## 2. Flex Basis

Klassen für die initiale Größe von flex-items.

| Klasse              | CSS-Regel                     | Beschreibung |
| :------------------ | :---------------------------- | :----------- |
| lux-flex-basis-auto | flex-basis: auto;             |              |
| lux-flex-basis-full | flex-basis: 100%;             |              |
| lux-flex-basis-0    | flex-basis: 0px;              |              |
| lux-flex-basis-1    | flex-basis: 0.25rem;  (4px)   |              |
| lux-flex-basis-2    | flex-basis: 0.5rem;  (8px)    |              |
| lux-flex-basis-3    | flex-basis: 0.75rem;  (12px)  |              |
| lux-flex-basis-4    | flex-basis: 1rem;  (16px)     |              |
| lux-flex-basis-5    | flex-basis: 1.25rem;  (20px)  |              |
| lux-flex-basis-6    | flex-basis: 1.5rem;  (24px)   |              |
| lux-flex-basis-7    | flex-basis: 1.75rem;  (28px)  |              |
| lux-flex-basis-8    | flex-basis: 2.0rem;  (32px)   |              |
| lux-flex-basis-9    | flex-basis: 2.25rem;  (36px)  |              |
| lux-flex-basis-10   | flex-basis: 2.5rem;  (40px)   |              |
| lux-flex-basis-11   | flex-basis: 2.75rem;   (44px) |              |
| lux-flex-basis-12   | flex-basis: 3.0rem;   (48px)  |              |
| lux-flex-basis-16   | flex-basis: 4rem;   (64px)    |              |
| lux-flex-basis-20   | flex-basis: 5rem;   (80px)    |              |
| lux-flex-basis-24   | flex-basis: 6rem;   (96px)    |              |
| lux-flex-basis-28   | flex-basis: 7rem;   (112px)   |              |
| lux-flex-basis-32   | flex-basis: 8rem;   (128px)   |              |
| lux-flex-basis-36   | flex-basis: 9rem;   (144px)   |              |
| lux-flex-basis-40   | flex-basis: 10rem;   (160px)  |              |
| lux-flex-basis-44   | flex-basis: 11rem;   (176px)  |              |
| lux-flex-basis-48   | flex-basis: 12rem;  (192px)   |              |
| lux-flex-basis-52   | flex-basis: 13rem; (208px*/   |              |
| lux-flex-basis-56   | flex-basis: 14rem; (224px)    |              |
| lux-flex-basis-60   | flex-basis: 15rem; (240px)    |              |
| lux-flex-basis-64   | flex-basis: 16rem; /*256px*/  |              |
| lux-flex-basis-72   | flex-basis: 18rem; (288px)    |              |
| lux-flex-basis-80   | flex-basis: 20rem;  (320px)   |              |
| lux-flex-basis-96   | flex-basis: 24rem;  (384px)   |              |
| lux-flex-basis-1/2  | flex-basis: 50%;              |              |
| lux-flex-basis-1/3  | flex-basis: 33.33333%;        |              |
| lux-flex-basis-2/3  | flex-basis: 66.66666%;        |              |
| lux-flex-basis-1/4  | flex-basis: 25%;              |              |
| lux-flex-basis-3/4  | flex-basis: 75%;              |              |
| lux-flex-basis-1/10 | flex-basis: 10%;              |              |
| lux-flex-basis-2/10 | flex-basis: 20%;              |              |
| lux-flex-basis-3/10 | flex-basis: 30%;              |              |
| lux-flex-basis-4/10 | flex-basis: 40%;              |              |
| lux-flex-basis-5/10 | flex-basis: 50%;              |              |
| lux-flex-basis-6/10 | flex-basis: 60%;              |              |
| lux-flex-basis-7/10 | flex-basis: 70%;              |              |
| lux-flex-basis-8/10 | flex-basis: 80%;              |              |
| lux-flex-basis-9/10 | flex-basis: 90%;              |              |
</table>

## 3. Flex-Direction

Klassen für die Ausrichtung der Hauptachse in einer Flexbox
| Klasse               | CSS-Regel                    | Beschreibung                                                          |
| :------------------- | :--------------------------- | :-------------------------------------------------------------------- |
| lux-flex-row         | flex-direction: row;         | Richtet die Elemente in einer Reihe aus.                              |
| lux-flex-row-reverse | flex-direction: row-reverse; | Richtet die Elemente in umgekehrter Reihenfolge in einer Reihe aus.   |
| lux-flex-col         | flex-direction: col;         | Richtete die Elemente in einer Spalte aus.                            |
| lux-flex-col-reverse | flex-direction: col-reverse; | Richtete die Elemente in umgekehrter Reihenfolge in einer Spalte aus. |

## 4. Flex Wrap

Klassen für den Zeilenumbruch in einer flex-row.

| Klasse                | CSS-Regel                | Beschreibung                                                                                              |
| :-------------------- | :----------------------- | :-------------------------------------------------------------------------------------------------------- |
| lux-flex-wrap         | flex-wrap: wrap;         | Ermöglicht den Zeilenumbruch von Flex-Items in einer Flexbox.                                             |
| lux-flex-nowrap       | flex-wrap: nowap;        | Verhindert den Zeilenumbruch von Flex-Items in einer Flexbox. Kann zu einem Overflow in der Reihe führen. |
| lux-flex-wrap-reverse | flex-wrap: wrap-reverse; | Ermöglicht den Zeilenumbruch von Flex-Items in einer Flexbox, in umgekehrter Reihenfolge.                 |

## 5. Flex

Klassen um das Grow und Shrink-Verhalten der Flex-Items gleichzeitig zu steuern.

| Klasse           | CSS-Regel                                   | Beschreibung                                                                                               |
| :--------------- | :------------------------------------------ | :--------------------------------------------------------------------------------------------------------- |
| lux-flex-1       | flex: 1 1 0%;                               | Erlaubt es dem Flex-Item zu schrumpfen und zu wachsen, ignoriert die initiale Größe.                       |
| lux-flex-auto    | flex: 1 1 auto;                             | Erlaubt es dem Flex-Item zu schrumpfen und zu wachsen, unter Berücksichtigung der initialen Größe.         |
| lux-flex-initial | flex: 0 1 auto;                             | Erlaubt es dem Flex-Item zu schrumpfen, aber nicht zu wachsen, unter Berücksichtigung der initialen Größe. |
| lux-flex-none    | flex: none;(Äquivalent für flex: 0 0 auto;) | Verhindert das Schrumpfen oder Wachsen eines Flex-Items.                                                   |

## 6. Flex Grow / Shrink

Klassen um das Grow und Shrink-Verhalten der Flex-Items individuell zu steuern

| Klasse                         | CSS-Regel                    | Beschreibung                                                 |
| :----------------------------- | :--------------------------- | :----------------------------------------------------------- |
| lux-flex-grow-0[1, 2, ... 5]   | flex-grow: 0[1, 2, ... 5];   | Lässt das Flex-Item im entsprechendem Verhältnis wachsen.    |
| lux-flex-shrink-0[1, 2, ... 5] | flex-shrink: 0[1, 2, ... 5]; | Lässt das Flex-Item im entsprechendem Verhältnis schrumpfen. |

## 7. Order

Klassen um die Reihenfolge eines Flex- oder Grid-Items zu steuern.

| Klasse                         | CSS-Regel               | Beschreibung                                                                      |
| :----------------------------- | :---------------------- | :-------------------------------------------------------------------------------- |
| lux-flex-order-0[1, 2, ... 10] | order: 0[1, 2, ... 10]; | Flex-/Grid-Items können in einer anderen Reihenfolge als im DOM gerendert werden. |

## 8. Justify Content

Klassen um Flex- oder Griditems entlang der Main-Axis des Containers zu positionieren

| Klasse              | CSS-Regel                       | Beschreibung                                                                                                           |
| :------------------ | :------------------------------ | :--------------------------------------------------------------------------------------------------------------------- |
| lux-justify-normal  | justify-content: normal;        | Ordnet die Items in ihrer Default-Position an.                                                                         |
| lux-justify-start   | justify-content: flex-start;    | Ordnet die Items am Anfang der Hauptachse an.                                                                          |
| lux-justify-end     | justify-content: flex-end;      | Ordnet die Items am Ende der Hauptachse an.                                                                            |
| lux-justify-center  | justify-content: center;        | Ordnet die Items in der Mitte der Hauptachse an.                                                                       |
| lux-justify-between | justify-content: space-between; | Verteilt die Items gleichmäßig auf der Hauptachse, so dass die Abstände zwischen den Items gleich groß sind.           |
| lux-justify-around  | justify-content: space-around;  | Verteilt die Items gleichmäßig auf der Hauptachse, so dass jedes Element auf jeder Seite den gleichen Leerraum erhält. |
| lux-justify-evenly  | justify-content: space-evenly;  | Verteilt die Items gleichmäßig auf der Hauptachse, so dass alle Abstände gleich groß sind.                             |
| lux-justify-stretch | justify-content: stretch;       | Der Verfügbare Platz entlang der Hauptachse wird durch alle Items gleichmäßig ausgefüllt.                              |

## 9. Justify Items

Klassen um Griditems entlang ihrer eigenen Achse zu positionieren

| Klasse                    | CSS-Regel               | Beschreibung                                                         |
| :------------------------ | :---------------------- | :------------------------------------------------------------------- |
| lux-justify-items-start   | justify-items: start;   | Jedes Grid-Item wird zum Beginn der eigenen Inline-Axis platziert.   |
| lux-justify-items-end     | justify-items: end;     | Jedes Grid-Item wird zum Ende der eigenen Inline-Axis platziert.     |
| lux-justify-items-center  | justify-items: center;  | Jedes Grid-Item wird in der Mitte der eigenen Inline-Axis platziert. |
| lux-justify-items-stretch | justify-items: stretch; | Jedes Grid-Item wird entlang seiner Inline-Axis ausgedehnt.          |

## 10. Justify Self

Klassen um ein Griditem individuell an der eignen Achse zu positionieren.

| Klasse                   | CSS-Regel              | Beschreibung                                                                             |
| :----------------------- | :--------------------- | :--------------------------------------------------------------------------------------- |
| lux-justify-self-auto    | justify-self: auto;    | Richtet das Grid-Item entsprechend der "justify-items"-Property des Grid-Containers aus. |
| lux-justify-self-start   | justify-self: start;   | Richtet das einzelne Grid-Item am Beginn der Inline-Axis aus.                            |
| lux-justify-self-end     | justify-self:  end;    | Richtet das einzelne Grid-Item am Ende der Inline-Axis aus.                              |
| lux-justify-self-center  | justify-self:  center; | Richtet das einzelne Grid-Item in der Mitte der Inline-Axis aus.                         |
| lux-justify-self-stretch | justify-self: stretch; | Dehnt das Grid-Item entlang der Inline-Axis aus.                                         |

## 11. Align Content

Klassen um Reihen in mehrzeiligen Flexboxen oder Gridcontainern entlang der Cross-Axis zu positionieren.

| Klasse               | CSS-Regel                | Beschreibung                                                            |
| :------------------- | :----------------------- | :---------------------------------------------------------------------- |
| lux-content-normal   | align-content: normal    | Platziere ein Element entsprechend des Defaults.                        |
| lux-content-start    | align-content: start;    | Die Reihen des Containers werden am Anfang der Cross-Axis platziert.    |
| lux-content-end      | align-content: end;      | Die Reihen des Containers werden am Ende der Cross-Axis platziert.      |
| lux-content-center   | align-content: center;   | Die Reihen des Containers werden in der Mitte der Cross-Axis platziert. |
| lux-content-between  | align-content: between;  | Den Platz zwischen den Reihen eines Containers gleichmäßig verteilen.   |
| lux-content-around   | align-content: around;   | Jede Reihe erhält zu beiden Seiten den selben Abstand zu geteilt.       |
| lux-content-evenly   | align-content: evenly;   | Alle Abstände um die Reihen eine Containers sind gleich groß.           |
| lux-content-stretch  | align-content: stretch;  | Der Verfügbare Platz wird von allen Reihen gleichmäßig eingenommen.     |
| lux-content-baseline | align-content: baseline; |                                                                         |

## 12. Align Items

Klassen um Flex- oder Griditems entlang Cross-Axis des Containers zu positionieren.

| Klasse             | CSS-Regel              | Beschreibung                                                                                                          |
| :----------------- | :--------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| lux-items-start    | align-items: start;    | Richte die Elemente zu Beginn der Cross-Axis aus.                                                                     |
| lux-items-end      | align-items: end;      | Richte die Elemente am Ende der Cross-Axis aus.                                                                       |
| lux-items-center   | align-items: center;   | Richte die Elemente zentriert auf der Cross-Axis aus.                                                                 |
| lux-items-stretch  | align-items: stretch;  | Dehne die Elemente entlang der Cross-Axis aus.                                                                        |
| lux-items-baseline | align-items: baseline; | Richte die Elemente entlang der Cross-Axis des Containers aus, so dass alle ihre Baselines auf der Selben Höhe liege. |

## 13. Align Self

Klassen um ein Flex- oder Griditem individuell entlang der Cross-Axis des Containers zu positionieren.

| Klasse                  | CSS-Regel               | Beschreibung                                                                                         |
| :---------------------- | :---------------------- | :--------------------------------------------------------------------------------------------------- |
| lux-align-self-auto     | align-self: auto;       | Positioniert das Item entsprechend der Property "align-items" seines Containers,                     |
| lux-align-self-start    | align-self: flex-start; | Positioniert das Item am Start der Cross-Axis des Containers, unabhängig von anderen Angaben.        |
| lux-align-self-end      | align-self: flex-end;   | Positioniert das Item am Ende der Cross-Axis des Containers, unabhängig von anderen Angaben.         |
| lux-align-self-center   | align-self: center;     | Positioniert das Item in der Mitte der Cross-Axis des Containers, unabhängig von anderen Angaben.    |
| lux-align-self-stretch  | align-self: stretch;    | Dehnt das Element über die gesamte Cross-Axis des Containers aus, unabhängig von anderen Angaben.    |
| lux-align-self-baseline | align-self: baseline;   | Positioniert das Item an der Baseline der Cross-Axis des Containers, unabhängig von anderen Angaben. |

## 14. Place Content

Klassen um Content gleichzeitig zu entlang der Main- und Cross-Axis zu positionieren.

| Klasse                      | CSS-Regel                 | Beschreibung                                                                                                          |
| :-------------------------- | :------------------------ | :-------------------------------------------------------------------------------------------------------------------- |
| lux-place-content-center    | place-content: center;    | Elemente werden in der Mitte beider Achsen des Containers platziert.                                                  |
| lux-place-content-start     | place-content: start;     | Elemente werden am Anfang beider Achsen des Containers platziert. (bei ltr: oben links)                               |
| lux-place-content-end       | place-content: end;       | Elemente werden am Ende beider Achsen des Containers platziert. (bei ltr: unten rechts)                               |
| lux-place-content-between   | place-content: between;   | Für Grid-Items: werden mit gleichem Abstand zueinander auf beiden Achsen verteilt. (Bis an die Ränder des Containers) |
| lux-place-content-around    | place-content: around;    | Für Grid-Items: jedes Item hat den gleichen Abstand um sich herum frei. (Auch Abstand zum Rand des Containers)        |
| lux-place-content-evenly    | place-content: evenly ;   | Für Grid-Items: die Items sind auf beiden Achsen gleichmäßig verteilt.                                                |
| lux-place-content- baseline | place-content:  baseline; |                                                                                                                       |
| lux-place-content- stretch  | place-content: stretch;   | Für Grid-Items: die Items dehnen sich gleichmäßig auf beiden Achsen aus.                                              |

## 15. Place Items

Klassen um Items gleichzeitig entlang der Main- und Cross-Axis ihrer Grid-Cell zu positionieren.

| Klasse                   | CSS-Regel              | Beschreibung                                                              |
| :----------------------- | :--------------------- | :------------------------------------------------------------------------ |
| lux-place-items-center   | place-items: center;   | Grid-Items werden in ihrer Zelle in der Mitte beider Achsen positioniert. |
| lux-place-items-start    | place-items: start;    | Grid-Items werden in ihrer Zelle am Anfang beider Achsen positioniert.    |
| lux-place-items-end      | place-items: end;      | Grid-Items werden in ihrer Zelle am Ende beider Achsen positioniert.      |
| lux-place-items-baseline | place-items: baseline; |                                                                           |
| lux-place-items- stretch | place-items: stretch;  | Grid-Items füllen die Zelle in beide Richtungen aus.                      |

## 16. Place Self

Klassen um ein Item individuell entlang der Main- und Cross-Axis zu positionieren.

| Klasse                 | CSS-Regel            | Beschreibung                                                      |
| :--------------------- | :------------------- | :---------------------------------------------------------------- |
| lux-place-self-center  | place-self: center;  | Item wird in der Mitte beider Achsen des Containers positioniert. |
| lux-place-self-start   | place-self: start;   | Item wird am Anfang beider Achsen des Containers positioniert.    |
| lux-place-self-end     | place-self: end;     | Item wird in am Ende beider Achsen des Containers positioniert.   |
| lux-place-self-auto    | place-self: auto;    | Item wird entsprechend der Property des Containers positioniert.  |
| lux-place-self-stretch | place-self: stretch; | Item füllt die Zelle in beide Richtungen aus.                     |

## 17. Grid Template Columns

Klassen um die Anzahl der Spalten in einem Grid-Container zu definieren. Alle Spalten haben die selbe Breite.

| Klasse                    | CSS-Regel                                                   | Beschreibung                                                             |
| :------------------------ | :---------------------------------------------------------- | :----------------------------------------------------------------------- |
| lux-grid-cols-1[2,...,12] | grid-template-columns: repeat(1[2,...,12], minmax(0, 1fr)); | Festlegen der Spaltenanzahl im Grid, alle Spalten haben dieselbe Breite. |
| lux-grid-cols-none        | grid-template-cols: none;                                   | Setzt die Spaltenanzahl auf Null.                                        |

## 18. Grid Column Start / End

Klassen um Grid-Items innerhalb eines Grids zu positionieren und die Breite zu definieren

| Klasse                    | CSS-Regel                                         | Beschreibung                                                                    |
| :------------------------ | :------------------------------------------------ | :------------------------------------------------------------------------------ |
| lux-col-span-1[2,...,12]  | grid-column: span 1[2,...,12] / span 1[2,...,12]; | Mit dieser Klasse kann ein Griditem die gewünschte Zahl an Spalten überspannen. |
| lux-col-span-full         | grid-column: 1 / -1;                              | Mit dieser Klasse überspannt das Griditem die gesammte Breite des Gitters.      |
| lux-col-start-1[2,...,13] | grid-column-start: 1[2,...,13];                   | Mit dieser Klasse wird die Spalte festgelegt, in der das Item starten soll.     |
| lux-col-end-1[2,...,13]   | grid-column-end: 1[2,...,13];                     | Mit dieser Klasse wird die Spalte festgelegt, in der das Item enden soll.       |
| lux-col-start-auto        | grid-column-start: auto;                          | Item wird automatisch platziert.                                                |
| lux-col-end-auto          | grid-column-end: auto;                            | Item wird automatisch platziert.                                                |
| lux-col-auto              | grid-column: auto;                                | Item wird automatisch platziert.                                                |

## 19. Grid Template Rows

Klassen um die Reihen eines Grid-Containers zu definieren

| Klasse                   | CSS-Regel                                               | Beschreibung                                                                                                                                                                               |
| :----------------------- | :------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| lux-grid-rows-1[2,...,6] | grid-template-rows: repeat(1[2,...,6], minmax(0, 1fr)); | Legt die Anzahl der Zeilen im Grid fest. Jede Zeile erhält die selbe Höhe.                                                                                                                 |
| lux-grid-rows-none       | grid-template-rows: none;                               | Die Reihen sind nicht explizit definiert, sondern werden ja nach Anzahl der Griditems und Spalten generiert. Die Höhen der Zeilen werden durch die Griditems bestimmt und könne variieren. |

## 20. Grid Row Start / End

Klassen um Grid-Items innerhalb eines Grids zu positionieren und die Höhe zu definieren

| Klasse                    | CSS-Regel                                    | Beschreibung                                                    |
| :------------------------ | :------------------------------------------- | :-------------------------------------------------------------- |
| lux-row-span-1[2,...,6]   | grid-row: span 1[2,...,6] / span 1[2,...,6]; | Legt die Anzahl der Reihen fest, die ein Item überspannen soll. |
| lux-row-span-full         | grid-row: 1 / -1;                            | Das Item überspannt alle Reihen des Grids.                      |
| lux-row-start-1[2,...,13] | grid-row-start: 1[2,...,13];                 | Legt die Startreihe des Items fest.                             |
| lux-row-end-1[2,...,13]   | grid-row-end: 1[2,...,13];                   | Legt die Endreihe des Items fest.                               |
| lux-row-start-auto        | grid-row-start: auto;                        | Das Item wird automatisch platziert.                            |
| lux-row-end-auto          | grid-row-end: auto;                          | Das Item wird automatisch platziert.                            |
| lux-row-auto              | grid-row: auto;                              | Das Item wird automatisch platziert.                            |

## 21. Grid Auto Flow

Klassen um Grid-Items innerhalb eines Grids automatisch zu platzieren.

| Klasse                  | CSS-Regel                     | Beschreibung |
| :---------------------- | :---------------------------- | :----------- |
| lux-grid-flow-row       | grid-auto-flow: row;          |              |
| lux-grid-flow-col       | grid-auto-flow: column;       |              |
| lux-grid-flow-dense     | grid-auto-flow: dense;        |              |
| lux-grid-flow-row-dense | grid-auto-flow: row dense;    |              |
| lux-grid-flow-col-dense | grid-auto-flow: column dense; |              |

## 22. Grid Auto Columns

Klassen um implizit erzeugte Spalten im Grid zu steuern.

| Klasse             | CSS-Regel                       | Beschreibung |
| :----------------- | :------------------------------ | :----------- |
| lux-auto-cols-auto | grid-auto-cols: auto;           |              |
| lux-auto-cols-min  | grid-auto-cols: min-content;    |              |
| lux-auto-cols-max  | grid-auto-cols: max-content;    |              |
| lux-auto-cols-fr   | grid-auto-cols: minmax(0, 1fr); |              |

## 23. Grid Auto Rows

Klassen um implizit erzeugte Reihen im Grid zu steuern.

| Klasse             | CSS-Regel                       | Beschreibung |
| :----------------- | :------------------------------ | :----------- |
| lux-auto-rows-auto | grid-auto-rows: auto;           |              |
| lux-auto-rows-min  | grid-auto-rows: min-content;    |              |
| lux-auto-rows-max  | grid-auto-rows: max-content;    |              |
| lux-auto-rows-fr   | grid-auto-rows: minmax(0, 1fr); |              |

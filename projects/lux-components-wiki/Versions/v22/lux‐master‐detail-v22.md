# LUX-Master-Detail

![Beispielbild LUX-Master-Detail](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐master‐detail-v22-img.png)

- [LUX-Master-Detail](#lux-master-detail)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxMasterListComponent](#luxmasterlistcomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
      - [ng-template-Bezeichner](#ng-template-bezeichner)
    - [LuxMasterHeaderComponent](#luxmasterheadercomponent)
    - [LuxMasterHeaderContentComponent](#luxmasterheadercontentcomponent)
    - [LuxMasterFooterComponent](#luxmasterfootercomponent)
    - [LuxDetailViewComponent](#luxdetailviewcomponent)
    - [LuxDetailHeaderComponent](#luxdetailheadercomponent)
  - [Beispiel](#beispiel)
  - [Zusatzinformationen](#zusatzinformationen)

## Overview / API

### Allgemein

| Name     | Beschreibung      |
| -------- | ----------------- |
| selector | lux-master-detail, lux-master-detail-ac |

### @Input

| Name                   | Typ          | Beschreibung                                                                                                                                                                        |
| ---------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxEmptyIconMaster | string | Name des Icons welches genutzt wird, wenn kein Master-Element selektiert ist. Default: 'lux-interface-alert-information-circle'. |
| luxEmptyIconMasterSize | string | Größe des Icons, welches bei leerer Master-Liste angezeigt wird (reicht von 1x bis 5x). Default: '5x'. |
| luxEmptyLabelMaster | string | Label welches dargestellt werden soll, wenn kein Master-Element selektiert ist. Default: ''. |
| luxEmptyIconDetail | string | Name des Icons welches genutzt wird, wenn kein Detail-Element selektiert ist. Default: 'lux-interface-alert-information-circle'. |
| luxEmptyIconDetailSize | string | Größe des Icons, welches bei leerem Detail-Element angezeigt wird (reicht von 1x bis 5x). Default: '5x'. |
| luxEmptyLabelDetail | string | Label welches dargestellt werden soll, wenn kein Detail-Element selektiert ist. Default: ''. |
| luxCompareWith | (o1: T, o2: T) => boolean | Funktion, welche zwei Objekte entgegennimmt und von der Komponente zum Vergleich auf Gleichheit der einzelnen Master-Einträge verwendet wird. Default: `(o1, o2) => o1 === o2`. |
| luxSelectedDetail | T \| null | Enthält das aktuell selektierte Element aus der Master-Liste. Two-Way-Binding über `[(luxSelectedDetail)]` möglich. Default: null. |
| luxMasterListLabel | string | Bestimmt das Aria-Label der Liste, welches für die Barrierefreiheit verwendet wird. Default: ''. |
| luxMasterList | any[] | Enthält die aktuelle Master-Liste. Default: []. |
| luxMasterSpinnerDelay | number | Die Zeitverzögerung in ms bis der Spinner angezeigt wird. Default: 1000. |
| luxMasterIsLoading | boolean | Boolean-Flag der bestimmt, ob der Spinner angezeigt wird. Beim Setzen auf "true" wird die Verzögerung durch luxMasterSpinnerDelay berücksichtigt. Default: false. |
| luxTagIdMaster         | string       | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                       |
| luxTagIdDetail         | string       | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                       |
| luxTitleLineBreak | boolean | Boolean-Flag, das bestimmt, ob die Titel und Untertitel in der Masteransicht beim Überschreiten der Breite mit "..." verkürzt oder mit Umbrüchen angezeigt werden. Default: false. |
| luxOpen | boolean | Bestimmt, ob die Master-Liste geöffnet ist. Two-Way-Binding über `[(luxOpen)]` möglich. Default: true. |
| luxDefaultDetailHeader | boolean | Bestimmt, ob der Standard-Detail-Header (Inhalt des selektierten Eintrags) angezeigt wird, wenn kein eigener `lux-detail-header` gesetzt ist. Default: true. |

### @Output

| Name                    | Typ       | Beschreibung                                                                                                                                                                                                                                                                            |
| ----------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxSelectedDetailChange | T \| null | Output der das Two-Way-Binding von luxSelectedDetail ermöglicht.                                                                                                                                                                                                                        |
| luxOpenChange | boolean | Wird ausgelöst, wenn die Master-Liste geöffnet oder geschlossen wird (Grundlage von `[(luxOpen)]`). |
| luxScrolled             | void      | Output der das Scroll-Event des Infinite-Scrolls auf der Master-Liste weitergibt. Wenn kein Infinite-Scrolling gewünscht ist, kann dieses Event einfach ignoriert werden, entsprechend sollte die Master-Liste direkt alle gewünschten Daten enthalten oder anderweitig befüllt werden. |

## Components

### LuxMasterListComponent

Komponente, die dem Nutzer das Erstellen von Masterlisten vereinfachen soll.
Wird von LuxMasterDetailComponent genutzt um die Liste zu generieren. Erwartet ein ng-template zur Generierung.

#### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-master-list, lux-master-list-ac |

#### @Input

| Name                   | Typ    | Beschreibung                                                                                                                                                                                                        |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTitleProp           | string | Name des Attributs der Master-Elemente, welches als Titel angezeigt werden soll. Kann auch auf Attribute von Unterelemente zeigen, beginnend bei dem ersten Unterobjekt (z.B. "base.title").                        |
| luxTitleTooltipProp    | string | Name des Attributs der Master-Elemente, welches als Titeltooltip angezeigt werden soll. Kann auch auf Attribute von Unterelemente zeigen, beginnend bei dem ersten Unterobjekt (z.B. "base.titleTooltip").          |
| luxSubTitleProp        | string | Name des Attributs der Master-Elemente, welches als Untertitel angezeigt werden soll. Kann auch auf Attribute von Unterelemente zeigen, beginnend bei dem ersten Unterobjekt (z.B. "base.subtitle").                |
| luxSubTitleTooltipProp | string | Name des Attributs der Master-Elemente, welches als Untertiteltooltipp angezeigt werden soll. Kann auch auf Attribute von Unterelemente zeigen, beginnend bei dem ersten Unterobjekt (z.B. "base.subtitleTooltip"). |

#### ng-template-Bezeichner

| Templatename     | Beschreibung                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| luxSimpleIcon    | Name des NG-Templates welches das Aussehen des Icon-Objekts definiert (\<ng-template #luxSimpleIcon>...</ng-template>       |
| luxSimpleContent | Name des NG-Templates welches das Aussehen des Content-Objekts definiert (\<ng-template #luxSimpleContent>...</ng-template> |
| luxSimpleCustomHeader | Name des optionalen NG-Templates, das einen eigenen Kopfbereich für die Listeneinträge und den Standard-Detail-Header definiert (\<ng-template #luxSimpleCustomHeader>...\</ng-template>). |

### LuxMasterHeaderComponent

Komponente, die oberhalb der Masterliste den Header-Bereich mit dem Button zum Öffnen/Schließen der Master-Liste darstellt. Sie wird von der LuxMasterDetailComponent selbst verwendet; der Inhalt wird über `lux-master-header-content` gesetzt. Dieser sollte immer gesetzt werden (z.B. mit einer Überschrift), damit der Button zum Schließen der Master-Liste richtig platziert wird.

| Name     | Beschreibung                            |
| -------- | --------------------------------------- |
| selector | lux-master-header, lux-master-header-ac |

Die Inputs und Outputs werden von der LuxMasterDetailComponent intern gesetzt bzw. ausgewertet:

| Name            | Art     | Typ     | Beschreibung                                                   |
| --------------- | ------- | ------- | -------------------------------------------------------------- |
| luxToggleHidden | @Input  | boolean | Blendet den Button zum Öffnen/Schließen der Master-Liste aus. |
| luxOpened       | @Output | boolean | Wird beim Öffnen (true) bzw. Schließen (false) ausgelöst.      |

### LuxMasterHeaderContentComponent

Diese Komponente ermöglicht es, in dem LuxMasterHeaderComponent einen Content zuzuweisen.

| Name     | Beschreibung              |
| -------- | ------------------------- |
| selector | lux-master-header-content, lux-master-header-content-ac |

### LuxMasterFooterComponent

(Optionale) Komponente die unterhalb der Masterliste einen frei befüllbaren Footer-Bereich einräumt.

| Name     | Beschreibung      |
| -------- | ----------------- |
| selector | lux-master-footer, lux-master-footer-ac |

### LuxDetailViewComponent

Komponente die zur Generierung der jeweiligen Detail-Ansicht genutzt wird. Erwartet ein ng-template.

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-detail-view, lux-detail-view-ac |

### LuxDetailHeaderComponent

Komponente die oberhalb der Detail-View platziert ist. Im Default wird der Inhalt des selektierten "List-Items" angezeigt.
Kann durch eigenen Inhalt überschrieben werden. Mit leerem Inhalt wird der Default ausgeblendet.

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-detail-header, lux-detail-header-ac |

## Beispiel

Ts

```typescript
// außerhalb der Klasse
interface MasterItem {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  content: string;
}

// in der Klasse
readonly masterItems = signal<MasterItem[]>(this.createItems(0));
readonly masterIsLoading = signal(false);
readonly masterSelected = signal<MasterItem | null>(this.masterItems()[0]);

// $event entspricht dem selektierten Objekt aus der Masterliste
loadData($event: MasterItem | null) {
  if ($event) {
    // etwas mit dem Objekt machen (z.B. weitere Daten laden)
    console.log('detail selected', $event);
  }
}

loadFurtherEntries() {
  if (this.masterItems().length < 30 && !this.masterIsLoading()) {
    this.masterIsLoading.set(true);
    // Für das Beispiel simulieren wir hier das Laden der Elemente
    setTimeout(() => {
      // weitere Master-Elemente laden, weil der untere Scrollbereich erreicht wurde
      this.masterItems.update((items) => [...items, ...this.createItems(items.length)]);
      this.masterIsLoading.set(false);
    }, 2000);
  }
}

private createItems(start: number): MasterItem[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: start + i,
    title: 'Neuer Eintrag #' + (start + i),
    subtitle: 'Untertitel #' + (start + i),
    icon: 'lux-interface-setting-cog',
    content: 'Lorem Ipsum Dolor Sit #' + (start + i)
  }));
}
```

Html

```html
<lux-master-detail
  class="lux-flex-auto lux-min-height-full lux-min-width-full"
  luxMasterListLabel="Meine Liste"
  [luxMasterSpinnerDelay]="500"
  luxEmptyIconDetail="lux-interface-edit-pencil"
  luxEmptyIconMaster="lux-interface-edit-pencil"
  luxEmptyLabelDetail="Kein Detail selektiert!"
  [luxMasterIsLoading]="masterIsLoading()"
  luxEmptyLabelMaster="Keine Masterelemente gefunden!"
  [(luxSelectedDetail)]="masterSelected"
  [luxMasterList]="masterItems()"
  (luxSelectedDetailChange)="loadData($event)"
  (luxScrolled)="loadFurtherEntries()"
>
  <lux-master-header-content>
    <!-- empfohlen ist eine Überschrift einzusetzen, es kann jedoch mit einem Leeren Master-Header auch eine Box erzeugt werden, an der der Toggle-Button für die Masterlist platziert wird -->
    <h2>Master Header</h2>
  </lux-master-header-content>

  <lux-master-list luxTitleProp="title" luxSubTitleProp="subtitle">
    <!-- Zugriff auf jedes einzelne Master-Element ueber "master" -->
    <ng-template #luxSimpleIcon let-master>
      <lux-icon [luxIconName]="master.icon" />
    </ng-template>
    <ng-template #luxSimpleContent let-master> {{ master.content }} </ng-template>
  </lux-master-list>

  <lux-detail-view>
    <!-- Zugriff auf das aktuell selektierte Element ueber "detail" -->
    <ng-template let-detail>
      <lux-card [luxTitle]="detail.title" class="lux-flex lux-flex-auto">
        <lux-card-content> {{ detail.content }} </lux-card-content>
      </lux-card>
    </ng-template>
  </lux-detail-view>

  <lux-detail-header>
    <!-- optionaler Custom-Header, ohne Inhalt wird der Default-Header ausgeblendet -->
    <lux-card luxTitle="Custom-Header">
      <lux-card-content>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
      </lux-card-content>
    </lux-card>
  </lux-detail-header>

  <lux-master-footer>
    <div>
      <h2>Master-Footer</h2>
    </div>
  </lux-master-footer>
</lux-master-detail>
```

## Zusatzinformationen

Die Master-Detail Komponente erlaubt das Erstellen einer kombinierten Ansicht, die aus einer Auflistung von Elementen auf der einen und einer frei definierbaren Detail-Ansicht auf anderen Seite besteht.

Es wird davon ausgegangen, dass die Master-Liste die vollständigen Elemente enthält, welche dann ausführlich in der Detail-Ansicht dargestellt werden. Für das evtl. anfallende nachträgliche "Befüllen" eines Listen-
eintrags wird ein Output-Event bei der Auswahl angeboten, dort kann das mitgegebene Element dann überschrieben werden.

Die Master-Detail-Komponente ist eine Standalone-Komponente. Importiert werden `LuxMasterDetailComponent` und die benötigten Subkomponenten (z.B. `LuxMasterListComponent`, `LuxMasterHeaderContentComponent`, `LuxMasterFooterComponent`, `LuxDetailViewComponent`, `LuxDetailHeaderComponent`). Außerdem bietet sie optional das Infinite-Scrolling für die Masterliste an.

Das Layout ist responsiv: In der mittleren Bildschirmgröße teilen sich Master und Detail die Breite im Verhältnis 50/50, in der Desktop-Variante im Verhältnis 30/70 (der Master jedoch maximal 500px breit). Der Detail-Header zeigt standardmäßig den selektierten Listeneintrag an und kann über `lux-detail-header` durch eigenen Inhalt ersetzt werden. Erhält die Masterliste den Fokus (mit der Tab-Taste), wird das selektierte Element bzw. das erste Listenelement fokussiert; innerhalb der Liste wird mit den Pfeiltasten navigiert, eine weitere Tab-Taste verlässt die Liste.

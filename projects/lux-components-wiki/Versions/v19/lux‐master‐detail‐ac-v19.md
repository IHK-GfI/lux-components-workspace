# LUX-Master-Detail

![Beispielbild LUX-Master-Detail-Ac](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐master‐detail‐ac-v19-img.png)

- [LUX-Master-Detail](#lux-master-detail)
  - [Overview / API](#overview--api)
    - [Wichtigste Änderungen zum bisherigen Master-Detail](#wichtigste-änderungen-zum-bisherigen-master-detail)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxMasterViewAcComponent](#luxmasterviewaccomponent)
    - [LuxMasterListAcComponent](#luxmasterlistaccomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
      - [ng-template-Bezeichner](#ng-template-bezeichner)
    - [LuxMasterHeaderAcComponent](#luxmasterheaderaccomponent)
    - [LuxMasterHeaderContentAcComponent](#luxmasterheadercontentaccomponent)
    - [LuxMasterFooterAcComponent](#luxmasterfooteraccomponent)
    - [LuxDetailViewAcComponent](#luxdetailviewaccomponent)
    - [LuxDetailHeaderAcComponent](#luxdetailheaderaccomponent)
  - [Beispiel](#beispiel)
  - [Zusatzinformationen](#zusatzinformationen)

## Overview / API

### Wichtigste Änderungen zum bisherigen Master-Detail

Das responsive Design wurde um eine Medium-Size-Variante ergänzt. In dieser teilen sich Master und Detail die Bildschirmbreite im Verhältnis 50-50.
In der Mobilen Ansicht ist der Button zum Wechseln von der Detail- zur Master-Ansicht nicht mehr im App-Header, sondern oben im Detail platziert. Das Swipen bei Touch-Displays ist noch wie vor möglich.
Die Desktop-Variante behält das Seiten-Verhältnis von 30%/70% zwischen Master und Detail bei, jedoch nur bis zu einer Max-Width von 500px für den Master. Der restliche Platz wird dem Detail zugesprochen.
Die lux-master-view-Component wurde entfernt. Es kann nur noch der Simple-Master genutzt werden.
Die Subcomponent lux-detail-header-ac wurde ergänzt. Diese wird in einer Standard-Variante immer angezeigt und kann durch eigenen Inhaht überschrieben werden.
Erhält die Masterliste den Focus (mit dem "Tab"-Key) wird jetzt direkt das selektierte Element oder das erste Listenelement, wenn nichts selektiert ist, fokussiert. Danach ist die Navigation durch die Liste-Elemente mit den Pfeiltasten weiterhin möglich. Mit einem weitern "Tab" wird die Liste verlassen.

### Allgemein

| Name     | Beschreibung         |
| -------- | -------------------- |
| selector | lux-master-detail-ac |

### @Input

| Name                   | Typ          | Beschreibung                                                                                                                                                                        |
| ---------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxEmptyIconMaster     | string       | Name des Icons welches genutzt wird, wenn kein Master-Element selektiert ist.                                                                                                       |
| luxEmptyIconMasterSize | string       | Größe des Icons, welches bei leerer Master-Liste angezeigt wird (reicht von 1x bis 5x).                                                                                             |
| luxEmptyLabelMaster    | string       | Label welches dargestellt werden soll, wenn kein Master-Element selektiert ist.                                                                                                     |
| luxEmptyIconDetail     | string       | Name des Icons welches genutzt wird, wenn kein Detail-Element selektiert ist.                                                                                                       |
| luxEmptyIconDetailSize | string       | Größe des Icons, welches bei leerem Detail-Element angezeigt wird (reicht von 1x bis 5x).                                                                                           |
| luxEmptyLabelDetail    | string       | Label welches dargestellt werden soll, wenn kein Detail-Element selektiert ist.                                                                                                     |
| luxCompareWith         | Function     | Funktion, welche zwei Objekte entgegen nimmt und von der Komponente zum Vergleich auf Gleichheit der einzelnen Master-Einträge verwendet wird. Löst den luxCompareParameterName ab. |
| luxSelectedDetail      | \<T \| null> | Enthält das aktuell selektierte Element aus der Master-Liste. Kann mithilfe von Two-Way-Binding von außen definiert werden.                                                         |
| luxMasterListLabel     | string       | Bestimmt das Aria-Label der Liste, welches für die Barrierefreiheit verwendet wird.                                                                                                 |
| luxMasterList          | []\<any>     | Enthält die aktuelle Master-Liste.                                                                                                                                                  |
| luxMasterSpinnerDelay  | number       | Die Zeitverzögerung in ms bis der Spinner angezeigt wird.                                                                                                                           |
| luxMasterIsLoading     | boolean      | Boolean-Flag der bestimmt, ob der Spinner angezeigt wird. Beim Setzen auf "true" wird die Verzögerung durch luxMasterSpinnerDelay berücksichtigt.                                   |
| luxTagIdMaster         | string       | [LUX-Tag-Id](luxTagId-v19#direkte-konfiguration) für die automatischen Tests.                                                                                                       |
| luxTagIdDetail         | string       | [LUX-Tag-Id](luxTagId-v19#direkte-konfiguration) für die automatischen Tests.                                                                                                       |
| luxTitleLineBreak      | boolean      | Boolean-Flag der bestimmt, ob die Titel und Untertitel in der Masteransicht überschreiten der Breite mit "..." verkürzt oder mit Umbrüchen angezeigt werden.                        |

### @Output

| Name                    | Typ                       | Beschreibung                                                                                                                                                                                                                                                                                    |
| ----------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxSelectedDetailChange | EventEmitter \<T \| null> | Output-Emitter der das Two-Way-Binding von luxSelectedDetail ermöglicht.                                                                                                                                                                                                                        |
| luxScrolled             | EventEmitter \<void>      | Output-Emitter der das Scroll-Event des Infinite-Scrolls auf der Master-Liste weitergibt. Wenn kein Infinite-Scrolling gewünscht ist, kann dieses Event einfach ignoriert werden, entsprechend sollte die Master-Liste direkt alle gewünschten Daten enthalten oder anderweitig befüllt werden. |

## Components

### LuxMasterViewAcComponent

Kapselnde Komponente für die Masterliste, kann eine LuxMasterSimpleComponent oder ein frei auswählbares Listenelement.

| Name     | Beschreibung       |
| -------- | ------------------ |
| selector | lux-master-view-ac |

### LuxMasterListAcComponent

Komponente die dem Nutzer das Erstellen von Masterlisten vereinfachen soll. (Zuvor LuxMasterSimpleComponent).
Wird von LuxMasterDetailAcComponent genutzt um die Liste zu generieren. Erwartet ein ng-template zur Generierung.

#### Allgemein

| Name     | Beschreibung       |
| -------- | ------------------ |
| selector | lux-master-list-ac |

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

### LuxMasterHeaderAcComponent

(Optionale) Komponente die oberhalb der Masterliste einen frei befüllbaren Header-Bereich einräumt. Diese sollte immer gesetzt werden z.B. mit einer Überschrift, damit der Button zum Schließen der Master-Liste richtig platziert wird

| Name     | Bescheibung          |
| -------- | -------------------- |
| selector | lux-master-header-ac |

### LuxMasterHeaderContentAcComponent

Diese Komponente ermöglicht es, in dem LuxMasterHeaderComponent einen Content zuzuweisen.

| Name     | Beschreibung                 |
| -------- | ---------------------------- |
| selector | lux-master-header-content-ac |

### LuxMasterFooterAcComponent

(Optionale) Komponente die unterhalb der Masterliste einen frei befüllbaren Footer-Bereich einräumt.

| Name     | Beschreibung         |
| -------- | -------------------- |
| selector | lux-master-footer-ac |

### LuxDetailViewAcComponent

Komponente die zur Generierung der jeweiligen Detail-Ansicht genutzt wird. Erwartet ein ng-template.

| Name     | Beschreibung       |
| -------- | ------------------ |
| selector | lux-detail-view-ac |

### LuxDetailHeaderAcComponent

Komponente die oberhalb der Detail-View platziert ist. Im Default wird der Inhalt des selektierten "List-Items" angezeigt.
Kann durch eigenen Inhalt überschrieben werden. Mit leerem Inhalt wird der Default ausgeblendet.

| Name     | Beschreibung       |
| -------- | ------------------ |
| selector | lux-detail-view-ac |

## Beispiel

Ts

```typescript
masterItems: any[] = [];
masterIsLoading = true;
masterSelected: any;

constructor() {
    this.fillList();
    this.masterSelected = this.masterItems[0];
}

// $event entspricht dem selektierten Objekt aus der Masterliste
loadData($event: any) {
    if ($event) {
      // etwas mit dem Objekt machen (z.B. weitere Daten laden)
      console.log('detail selected', $event);
    }
}

loadFurtherEntries() {
    if (this.masterItems.length < 30 && !this.masterIsLoading) {
      this.masterIsLoading = true;
      // Für das Beispiel simulieren wir hier das Laden der Elemente
      setTimeout(() => {
        // weitere Master-Elemente laden, weil der untere Scrollbereich erreicht wurde
        this.fillList();
        this.masterIsLoading = false;
      }, 2000);
    }
}

fillList() {
    for (let i = 0; i < 10; i++) {
      this.masterItems.push({
        id: this.masterItems.length,
        title: 'Neuer Eintrag #' + this.masterItems.length,
        icon: 'lux-interface-setting-cog',
        content: 'Lorem Ipsum Dolor Sit #' + this.masterItems.length
      });
    }
}
```

Html

```html
<lux-master-detail-ac
  class="lux-flex-auto lux-min-height-full lux-min-width-full"
  luxMasterListLabel="Meine Liste"
  [luxMasterSpinnerDelay]="500"
  luxEmptyIconDetail="lux-interface-edit-pencil"
  luxEmptyIconMaster="lux-interface-edit-pencil"
  luxEmptyLabelDetail="Kein Detail selektiert!"
  [luxMasterIsLoading]="masterIsLoading"
  luxEmptyLabelMaster="Keine Masterelemente gefunden!"
  [luxSelectedDetail]="masterSelected"
  [luxMasterList]="masterItems"
  (luxSelectedDetailChange)="loadData($event)"
  (luxScrolled)="loadFurtherEntries()"
>
  <lux-master-header-content-ac>
    <!-- empfohlen ist eine Überschrift einzusetzen, es kann jedoch mit einem Leeren Master-Header auch eine Box erzeugt werden, an der der Toggle-Button für die Masterlist platziert wird -->
    <h2>Master Header</h2>
  </lux-master-header-content-ac>

  <lux-master-list-ac luxTitleProp="title" luxSubTitleProp="subtitle">
    <!-- Zugriff auf jedes einzelne Master-Element ueber "master" -->
    <ng-template #luxSimpleIcon let-master>
      <lux-icon [luxIconName]="master.icon"></lux-icon>
    </ng-template>
    <ng-template #luxSimpleContent let-master> {{master.content}} </ng-template>
  </lux-master-list-ac>

  <lux-detail-view-ac>
    <!-- Zugriff auf das aktuell selektierte Element ueber "detail" -->
    <ng-template let-detail>
      <lux-card [luxTitle]="detail.title" class="lux-flex lux-flex-auto">
        <lux-card-content> {{ detail.content }} </lux-card-content>
      </lux-card>
    </ng-template>
  </lux-detail-view-ac>

  <lux-detail-header-ac>
    <!-- optionaler Custom-Header, ohne Inhalt wird der Default-Header ausgeblendet -->
    <lux-card luxTitle="Custom-Header">
      <lux-card-content>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit...
      </lux-card-content>
    </lux-card>
  </lux-detail-header-ac>

  <lux-master-footer-ac>
    <div>
      <h2>Master-Footer</h2>
    </div>
  </lux-master-footer-ac>
</lux-master-detail-ac>
```

## Zusatzinformationen

Die Master-Detail Komponente erlaubt das Erstellen einer kombinierten Ansicht, die aus einer Auflistung von Elementen auf der einen und einer frei definierbaren Detail-Ansicht auf anderen Seite besteht.

Es wird davon ausgegangen, dass die Master-Liste die vollständigen Elemente enthält, welche dann ausführlich in der Detail-Ansicht dargestellt werden. Für das evtl. anfallende nachträgliche "Befüllen" eines Listen-
eintrags wird ein Output-Event bei der Auswahl angeboten, dort kann das mitgegebene Element dann überschrieben werden.

Die Master-Detail Komponente ist Teil des LuxLayout-Moduls und wird über dieses exportiert, außerdem bietet sie optional das Infinite-Scrolling für die Masterliste an.

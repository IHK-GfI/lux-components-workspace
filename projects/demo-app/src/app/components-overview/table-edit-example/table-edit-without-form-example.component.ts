import { LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  LuxAriaLabelDirective,
  LuxButtonComponent,
  LuxInputAcComponent,
  LuxTableColumnComponent,
  LuxTableColumnContentComponent,
  LuxTableColumnFooterComponent,
  LuxTableColumnHeaderComponent,
  LuxTableComponent,
  LuxTooltipDirective
} from '@ihk-gfi/lux-components';

@Component({
  selector: 'app-table-edit-without-form-example',
  imports: [
    LuxTableColumnContentComponent,
    LuxTableColumnHeaderComponent,
    LuxTableColumnFooterComponent,
    LuxTableColumnComponent,
    LuxButtonComponent,
    LuxTableComponent,
    LuxTooltipDirective,
    LuxAriaLabelDirective,
    LuxInputAcComponent,
    LowerCasePipe
  ],
  templateUrl: './table-edit-without-form-example.component.html',
  styleUrl: './table-edit-without-form-example.component.scss'
})
export class TableEditWithoutFormExampleComponent {
  pagerTooltip = '';
  pagerDisabled = false;
  dataSource: any[] = [];

  constructor() {
    setTimeout(() => {
      this.loadData();
    });
  }

  loadData() {
    const data = [
      { name: 'Hydrogen', symbol: 'H', date: new Date(2017, 11, 24), disabled: false },
      { name: 'Helium', symbol: 'He', date: new Date(2017, 11, 22), disabled: false },
      { name: 'Lithium', symbol: 'Li', date: new Date(2018, 11, 21), disabled: false },
      { name: 'Beryllium', symbol: 'Be', date: new Date(2018, 11, 18), disabled: false },
      { name: 'Boron', symbol: 'B', date: new Date(2018, 10, 24), disabled: false },
      { name: 'carbon', symbol: 'C', date: new Date(2018, 11, 24), disabled: false },
      { name: 'Nitrogen', symbol: 'N', date: new Date(2018, 10, 24), disabled: false },
      { name: 'Öxygen', symbol: 'O', date: new Date(2018, 11, 24), disabled: false },
      { name: '', symbol: 'F', date: new Date(2018, 11, 24), disabled: false },
      { name: 'äeon', symbol: 'Ne', date: new Date(2018, 10, 24), disabled: false },
      { name: 'Sodium', symbol: 'Na', date: new Date(2018, 11, 24), disabled: false },
      { name: 'Magnesium', symbol: 'Mg', date: new Date(2018, 9, 24), disabled: false },
      { name: 'Dluminum', symbol: 'Al', date: new Date(2018, 11, 24), disabled: false },
      { name: 'Silicon', symbol: 'Si', date: new Date(2018, 9, 24), disabled: false },
      { name: 'Phosphorus', symbol: 'P', date: new Date(2018, 11, 24), disabled: false },
      { name: 'Sulfur', symbol: 'S', date: new Date(2018, 9, 24), disabled: false },
      { name: 'otto', symbol: 'S', date: new Date(2018, 11, 24), disabled: false },
      { name: null, symbol: null, date: new Date(2018, 9, 24), disabled: false },
      { name: undefined, symbol: undefined, date: new Date(2018, 11, 24), disabled: false },
      { name: 'ß', symbol: 'ß', date: new Date(2018, 11, 24), disabled: false },
      { name: 123, symbol: 'ß', date: new Date(2018, 2, 28), disabled: false },
      { name: 'Ä', symbol: 'ä', date: new Date(2018, 2, 1), disabled: false },
      { name: 'Ü', symbol: 'ü', date: new Date(2018, 2, 10), disabled: false },
      { name: 'Ö', symbol: 'ö', date: new Date(2018, 11, 13), disabled: false },
      { name: 234.56, symbol: '2', date: new Date(2018, 11, 7), disabled: false },
      { name: '234,56', symbol: '3', date: new Date(2018, 11, 5), disabled: false },
      { name: '2.234,56', symbol: '4', date: new Date(2017, 11, 1), disabled: false },
      { name: 'AA', symbol: '', date: new Date(2018, 11, 2), disabled: false },
      { name: 'Élite', symbol: 'é', date: new Date(2016, 1, 1), disabled: false },
      { name: 'Egon', symbol: 'e', date: new Date(2018, 6, 30), disabled: false }
    ];

    this.dataSource = data;
  }

  onEdit(element: any) {
    // Aktuelle Daten im Memento speichern, falls das Bearbeiten abgebrochen wird.
    element.memento = JSON.parse(JSON.stringify(element));

    // Das Element in den Editiermodus versetzen.
    element.editable = true;

    // Das Blättern deaktivieren und eine Begründung als Tooltip anzeigen.
    this.pagerDisabled = true;
    this.pagerTooltip = 'Es gibt noch ungespeicherte Änderungen!';
  }

  onSave(element: any) {
    // Die aktuellen Werte wurden bereits beim Editieren in das Element geschrieben.
    // Hier muss nur noch der alte Zustand gelöscht werden. Dieser wird nur beim
    // Abbrechen (siehe onCancel) benötigt.
    delete element.editable;
    delete element.memento;

    this.clearEditState();
  }

  onCancel(element: any) {
    // Den Orginalzustand (siehe onEdit) wiederherstellen.
    Object.assign(element, element.memento);
    delete element.editable;
    delete element.memento;

    this.clearEditState();
  }

  private isMinOneElementEditable() {
    return this.dataSource.find((element) => element.editable);
  }

  private clearEditState() {
    if (!this.isMinOneElementEditable()) {
      this.pagerDisabled = false;
      this.pagerTooltip = '';
    }
  }
}

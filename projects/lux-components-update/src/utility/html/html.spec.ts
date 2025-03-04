import { ATTR_NOT_PROCESSED, HtmlManipulator as Html } from './html-manipulator';
import {
  addAttrFn,
  appendAttrFn,
  removeAttrFn,
  removeElementFn,
  renameAttrFn,
  renameElementFn,
  updateAttrFn,
  updateAttrIfFn
} from './manipulator-functions';

describe('html', () => {
  describe('Not-Processed-Attribut', () => {
    it('Sollte das Not-Processed-Attribut setzen', () => {
      let content = templateNotProcessedAttr001;
      content = Html.prepare(content, 'lux-card');

      expect(content).toEqual(resultNotProcessedAttr001);
    });
  });

  describe('Count', () => {
    it('Sollte die korrekte Anzahl zurückliefern', () => {
      const content = templateCount001;

      expect(Html.count(content, 'lux-card')).toEqual(3);
    });
  });

  describe('renameSelector', () => {
    it('Sollte den Selector gelöscht haben', () => {
      let content = '<div><lux-app-header></lux-app-header></div>';
      content = Html.transform(content, 'lux-app-header', removeElementFn);
      content = Html.transform(content, 'div', removeElementFn);

      expect(content).toEqual('');
    });

    it('Sollte keinen Subselector löschen', () => {
      let content = '<div><lux-app-header></lux-app-header><lux-app-header-ac></lux-app-header-ac></div>';
      content = Html.transform(content, 'lux-app-header', removeElementFn);

      expect(content).toEqual('<div><lux-app-header-ac></lux-app-header-ac></div>');
    });

    it('Sollte den Selector ersetzen - Alles in einer Zeile - Ohne Attribute', () => {
      let content = '<lux-app-header></lux-app-header>';
      content = Html.transform(content, 'lux-app-header', renameElementFn('lux-app-header-ac'));

      expect(content).toEqual('<lux-app-header-ac></lux-app-header-ac>');
    });

    it('Sollte keine Subselectoren ersetzen', () => {
      let content = '<lux-app-header></lux-app-header>';
      content = Html.transform(content, 'lux-app', renameElementFn('lux-app'));

      expect(content).toEqual('<lux-app-header></lux-app-header>');
    });

    it('Sollte den Selector ersetzen - Alles in einer Zeile - Mit Attribut', () => {
      let content = '<lux-app-header luxTitle="Lorem ipsum"></lux-app-header>';
      content = Html.transform(content, 'lux-app-header', renameElementFn('lux-app-header-ac'));

      expect(content).toEqual('<lux-app-header-ac luxTitle="Lorem ipsum"></lux-app-header-ac>');
    });

    it('Sollte den Selector ersetzen - Alles in einer Zeile - Mit Leerzeichen', () => {
      let content = '<lux-app-header ></lux-app-header >';
      content = Html.transform(content, 'lux-app-header', renameElementFn('lux-app-header-ac'));

      expect(content).toEqual('<lux-app-header-ac ></lux-app-header-ac >');
    });

    it('Sollte den Selector ersetzen - Mehrere Zeilen - Ohne Leerzeichen', () => {
      let content = `<lux-app-header
></lux-app-header>`;
      content = Html.transform(content, 'lux-app-header', renameElementFn('lux-app-header-ac'));

      expect(content).toEqual(`<lux-app-header-ac
></lux-app-header-ac>`);
    });

    it('Sollte den Selector ersetzen - 2 Zeilen - Mit Leerzeichen', () => {
      let content = `<lux-app-header 
></lux-app-header>`;
      content = Html.transform(content, 'lux-app-header', renameElementFn('lux-app-header-ac'));

      expect(content).toEqual(`<lux-app-header-ac 
></lux-app-header-ac>`);
    });

    it('Sollte den Selector ersetzen - 3 Zeilen - Ohne Leerzeichen', () => {
      let content = `<lux-app-header
>
</lux-app-header>`;
      content = Html.transform(content, 'lux-app-header', renameElementFn('lux-app-header-ac'));

      expect(content).toEqual(`<lux-app-header-ac
>
</lux-app-header-ac>`);
    });
  });

  describe('addAttribute', () => {
    it('Sollte sollte das Attribut luxTest1..5 hinzufügen', () => {
      let result = templateAdd001;
      result = Html.transform(result, 'lux-table', addAttrFn('luxTest1', '123'));
      result = Html.transform(result, 'lux-table', addAttrFn('[luxTest2]', '123'));
      result = Html.transform(result, 'lux-table', addAttrFn('(luxTest3)', '123'));
      result = Html.transform(result, 'lux-table', addAttrFn('[(luxTest4)]', '123'));
      result = Html.transform(result, 'lux-table', addAttrFn('luxTest5', ''));

      expect(result).toContain('luxTest1="123"');
      expect(result).toContain('[luxTest2]="123"');
      expect(result).toContain('(luxTest3)="123"');
      expect(result).toContain('[(luxTest4)]="123"');
      expect(result).toContain('luxTest5=""');
      expect(result).not.toContain('let-element=""');
      expect(result).toContain('#testId\n');
      expect(result).not.toContain('#testId=""');
      expect(result).toContain('testDirective\n');
      expect(result).not.toContain('testDirective=""');
    });
  });

  describe('updateAttribute', () => {
    it('Sollte sollte das Attribut luxTest1..5 updaten', () => {
      let result = templateUpdate001;
      result = Html.transform(result, 'lux-file-list', updateAttrFn('luxTest1', 'abc'));
      result = Html.transform(result, 'lux-file-list', updateAttrFn('luxTest2', 'true'));
      result = Html.transform(result, 'lux-file-list', updateAttrFn('luxTest3', 'onNewClick($event, param1)'));
      result = Html.transform(result, 'lux-file-list', updateAttrFn('luxTest4', 'newValue4'));
      result = Html.transform(result, 'lux-file-list', updateAttrFn('luxTest5', ''));

      expect(result).toContain('luxTest1="abc"');
      expect(result).toContain('[luxTest2]="true"');
      expect(result).toContain('(luxTest3)="onNewClick($event, param1)"');
      expect(result).toContain('[(luxTest4)]="newValue4"');
      expect(result).toContain('[(luxTest5)]=""');
      expect(result).not.toContain('let-element=""');
      expect(result).toContain('#testId\n');
      expect(result).not.toContain('#testId=""');
      expect(result).toContain('testDirective\n');
      expect(result).not.toContain('testDirective=""');
    });
  });

  describe('updateIfAttribute', () => {
    it('Sollte sollte das Attribut luxTest1..5 updaten', () => {
      let result = templateUpdate002;
      result = Html.transform(result, '*[luxIconName]', updateAttrIfFn('luxIconName', 'fas fa-user', 'lux-interface-user-single'));

      expect(result).toContain('luxIconName="lux-interface-user-single"');
      expect(result).not.toContain('luxIconName="fas fa-user"');

      result = Html.transform(result, '*[luxIconName]', updateAttrIfFn('luxIconName', 'lux-interface-user-single', 'fas fa-user'));

      expect(result).toEqual(templateUpdate002);
    });

    it('Sollte die Attribute von geschachtelten Elemente ersetzen ', () => {
      let result = templateUpdate003;
      result = Html.transform(result, '*[luxIconName]', updateAttrIfFn('luxIconName', 'fas fa-user', 'lux-interface-user-single'));

      expect(result).toEqual(
        '<lux-icon luxIconName="lux-interface-user-single"><lux-icon luxIconName="lux-interface-user-single"></lux-icon></lux-icon>'
      );
    });
  });

  describe('appendAttribute', () => {
    it('Sollte sollte das Attribut luxTest1..5 ergänzen', () => {
      let result = templateAppend001;
      result = Html.transform(result, 'lux-file-list', appendAttrFn('luxTest1', '_suffix'));
      result = Html.transform(result, 'lux-file-list', appendAttrFn('luxTest2', '_suffix'));
      result = Html.transform(result, 'lux-file-list', appendAttrFn('luxTest3', '_suffix'));
      result = Html.transform(result, 'lux-file-list', appendAttrFn('luxTest4', '_suffix'));
      result = Html.transform(result, 'lux-file-list', appendAttrFn('luxTest5', '_suffix'));

      expect(result).toContain('luxTest1="value1_suffix"');
      expect(result).toContain('[luxTest2]="value2_suffix"');
      expect(result).toContain('(luxTest3)="value3_suffix"');
      expect(result).toContain('[(luxTest4)]="value4_suffix"');
      expect(result).toContain('[(luxTest5)]="_suffix"');
      expect(result).not.toContain('let-element=""');
      expect(result).toContain('#testId\n');
      expect(result).not.toContain('#testId=""');
      expect(result).toContain('testDirective\n');
      expect(result).not.toContain('testDirective=""');
    });
  });

  describe('renameAttribute', () => {
    it('Sollte sollte das Attribut luxTest1..5 umbenennen', () => {
      let result = templateRename001;
      result = Html.transform(result, 'mat-chip-list', renameAttrFn('luxTest1', 'luxTestNeu1'));
      result = Html.transform(result, 'mat-chip-list', renameAttrFn('luxTest2', 'luxTestNeu2'));
      result = Html.transform(result, 'mat-chip-list', renameAttrFn('luxTest3', 'luxTestNeu3'));
      result = Html.transform(result, 'mat-chip-list', renameAttrFn('luxTest4', 'luxTestNeu4'));
      result = Html.transform(result, 'mat-chip-list', renameAttrFn('luxTest5', 'luxTestNeu5'));

      expect(result).toContain('luxTestNeu1="123"');
      expect(result).not.toContain('luxTest1="123"');
      expect(result).toContain('[luxTestNeu2]="123"');
      expect(result).not.toContain('luxTest2="123"');
      expect(result).toContain('(luxTestNeu3)="123"');
      expect(result).not.toContain('luxTest3="123"');
      expect(result).toContain('[(luxTestNeu4)]="123"');
      expect(result).not.toContain('luxTest4="123"');
      expect(result).toContain('[(luxTestNeu5)]=""');
      expect(result).not.toContain('luxTest5=""');
      expect(result).toContain('#testId\n');
      expect(result).not.toContain('#testId=""');
      expect(result).toContain('testDirective\n');
      expect(result).not.toContain('testDirective=""');
      expect(result).not.toContain('></input>');
    });

    it('Sollte sollte keine End-Tags für Void-Elements hinzufügen', () => {
      const result = Html.transform(templateRename002, 'input', renameAttrFn('typeWrong', 'type'));

      expect(result).not.toContain('></input>');
      expect(result).not.toContain('></area>');
      expect(result).not.toContain('></base>');
      expect(result).not.toContain('></br>');
      expect(result).not.toContain('></col>');
      expect(result).not.toContain('></embed>');
      expect(result).not.toContain('></hr>');
      expect(result).not.toContain('></img>');
      expect(result).not.toContain('></link>');
      expect(result).not.toContain('></meta>');
      expect(result).not.toContain('></param>');
      expect(result).not.toContain('></source>');
      expect(result).not.toContain('></track>');
      expect(result).not.toContain('></wbr>');
    });
  });

  describe('removeAttribute', () => {
    it('Sollte sollte das Attribut luxTest1..5 entfernen', () => {
      let result = templateRemove001;
      result = Html.transform(result, 'lux-file-list', removeAttrFn('luxTest1'));
      result = Html.transform(result, 'lux-file-list', removeAttrFn('luxTest2'));
      result = Html.transform(result, 'lux-file-list', removeAttrFn('luxTest3'));
      result = Html.transform(result, 'lux-file-list', removeAttrFn('luxTest4'));
      result = Html.transform(result, 'lux-file-list', removeAttrFn('luxTest5'));

      expect(result).not.toContain('luxTest1');
      expect(result).not.toContain('luxTest2');
      expect(result).not.toContain('luxTest3');
      expect(result).not.toContain('luxTest4');
      expect(result).not.toContain('luxTest5');
      expect(result).toContain('testDirective\n');
      expect(result).not.toContain('testDirective=""');
      expect(result).toContain('#filelistexamplewithoutform\n');
      expect(result).not.toContain('#filelistexamplewithoutform=""');
      expect(result).toContain('[luxHint]=""');
    });
  });
});

const templateAdd001 = `
<example-base-structure
  exampleTitle="Tabelle"
  exampleIconName="fas fa-table"
  exampleDocumentationHref="https://github.com/IHK-GfI/lux-components/wiki/lux%E2%80%90table"
>
  <example-base-content>
    <div [ngStyle]="{ height: calculateProportions ? tableHeightPx + 'px' : 'unset' }" class="lux-table-example">
      <lux-table
        #testId
        testDirective
        [luxMinWidthPx]="minWidthPx"
        [luxData]="dataSource"
        [luxShowPagination]="pagination"
        [luxColWidthsPercent]="columnWidthOption"
        [luxShowFilter]="filter"
        [luxFilterText]="filterText"
        [luxPageSize]="pageSize"
        [luxClasses]="cssClass"
        [luxPageSizeOptions]="pageSizeOption"
        [luxMultiSelect]="multiSelect"
        [luxMultiSelectOnlyCheckboxClick]="multiSelectOnlyCheckboxClick"
        [luxNoDataText]="noDataText"
        [(luxSelected)]="selected"
        [luxCompareWith]="compareFn"
        (luxSelectedChange)="onSelectedChange($event)"
        [luxHideBorders]="hideBorders"
        [luxAutoPaginate]="autoPagination"
        [luxPagerDisabled]="pagerDisabled"
        [luxPagerTooltip]="pagerTooltip"
      >
        <lux-table-column
          luxColumnDef="name"
          [luxSortable]="nameConfig.sortable"
          [luxSticky]="nameConfig.sticky"
          [luxResponsiveAt]="nameConfig.responsiveAt"
          [luxResponsiveBehaviour]="nameConfig.responsiveBehaviour?.value"
        >
          <lux-table-column-header>
            <ng-template><span [luxTooltip]="'Tooltipp Spalte \\'Name\\''">Name</span></ng-template>
          </lux-table-column-header>
          <lux-table-column-content>
            <ng-template let-element>
              <span *ngIf="!element.editable">{{ element.name }}</span>
              <lux-input
                *ngIf="element.editable"
                luxAriaLabel="Name"
                luxTagId="table.row.control.name"
                class="lux-table-no-label"
                [(luxValue)]="element.name"
              ></lux-input>
            </ng-template>
          </lux-table-column-content>
          <lux-table-column-footer>
            <ng-template> Name Footer </ng-template>
          </lux-table-column-footer>
        </lux-table-column>
        <lux-table-column
          luxColumnDef="symbol"
          [luxSortable]="symbolConfig.sortable"
          [luxSticky]="symbolConfig.sticky"
          [luxResponsiveAt]="symbolConfig.responsiveAt"
          [luxResponsiveBehaviour]="symbolConfig.responsiveBehaviour?.value"
        >
          <lux-table-column-header>
            <ng-template>
              <span [luxTooltip]="'Tooltipp Spalte \\'Symbol\\''">Symbol</span>
            </ng-template>
          </lux-table-column-header>
          <lux-table-column-content>
            <ng-template let-element>
              <span *ngIf="!element.editable">{{ element.symbol | lowercase }}</span>
              <div fxLayout="row wrap">
                <lux-input
                  *ngIf="element.editable"
                  luxAriaLabel="Symbol"
                  luxTagId="table.row.control.symbol"
                  fxFlex="1 1 30%"
                  class="lux-table-no-label"
                  [(luxValue)]="element.symbol"
                ></lux-input>
              </div>
            </ng-template>
          </lux-table-column-content>
          <lux-table-column-footer>
            <ng-template> Symbol Footer </ng-template>
          </lux-table-column-footer>
        </lux-table-column>
        <lux-table-column
          *ngIf="!multiSelect || !multiSelectOnlyCheckboxClick"
          luxColumnDef="date"
          [luxSortable]="dateConfig.sortable"
          [luxSticky]="dateConfig.sticky"
          [luxResponsiveAt]="dateConfig.responsiveAt"
          [luxResponsiveBehaviour]="dateConfig.responsiveBehaviour?.value"
        >
          <lux-table-column-header>
            <ng-template>Datum</ng-template>
          </lux-table-column-header>
          <lux-table-column-content>
            <ng-template let-element
              ><span>{{ element.date | date: 'dd.MM.yyyy' }}</span></ng-template
            >
          </lux-table-column-content>
          <lux-table-column-footer>
            <ng-template> Datum Footer </ng-template>
          </lux-table-column-footer>
        </lux-table-column>
        <lux-table-column *ngIf="multiSelect && multiSelectOnlyCheckboxClick" luxColumnDef="Aktion" [luxSortable]="false">
          <lux-table-column-header>
            <ng-template>Aktion</ng-template>
          </lux-table-column-header>
          <lux-table-column-content>
            <ng-template let-element>
              <lux-button
                *ngIf="!element.editable"
                luxAriaLabel="Editieren"
                luxTagId="table.row.action.edit"
                class="lux-table-example"
                luxColor="primary"
                luxIconName="fas fa-edit"
                (luxClicked)="onEdit(element)"
              ></lux-button>
              <lux-button
                *ngIf="element.editable"
                luxAriaLabel="Speichern"
                luxTagId="table.row.action.save"
                class="lux-table-example"
                luxColor="primary"
                luxIconName="fas fa-save"
                (luxClicked)="onSave(element)"
              ></lux-button>
              <lux-button
                *ngIf="element.editable"
                luxAriaLabel="Abbrechen"
                luxTagId="table.row.action.cancel"
                class="lux-table-example"
                luxColor="primary"
                luxIconName="fas fa-undo"
                (luxClicked)="onCancel(element)"
              ></lux-button>
            </ng-template>
          </lux-table-column-content>
          <lux-table-column-footer>
            <ng-template> Aktion Footer </ng-template>
          </lux-table-column-footer>
        </lux-table-column>
      </lux-table>
    </div>
  </example-base-content>
  <example-base-simple-options>
    <table-example-simple-options [tableExample]="this"></table-example-simple-options>
  </example-base-simple-options>
  <example-base-advanced-options>
    <table-example-advanced-options [tableExample]="this"></table-example-advanced-options>
  </example-base-advanced-options>
  <example-base-options-actions>
    <lux-menu
      fxFlex="0 0 250px"
      luxMenuIconName="fas fa-ellipsis-v"
      [luxDisplayExtended]="true"
      [luxDisplayMenuLeft]="false"
      [luxMaximumExtended]="4"
    >
      <lux-menu-item
        luxLabel="Ersten 5 auswählen"
        [luxRaised]="true"
        [luxDisabled]="!multiSelect"
        (luxClicked)="preselect()"
        luxTagId="menu-select-5"
      >
      </lux-menu-item>
      <lux-menu-item
        luxLabel="Tabelle leeren"
        luxColor="warn"
        [luxDisabled]="dataSource.length === 0"
        [luxRaised]="true"
        (luxClicked)="clearData()"
        luxTagId="menu-clear"
      >
      </lux-menu-item>
      <lux-menu-item
        luxLabel="Tabelle befüllen (300)"
        luxColor="accent"
        (luxClicked)="loadData(true)"
        [luxRaised]="true"
        luxTagId="menu-fill-300"
      >
      </lux-menu-item>
      <lux-menu-item
        luxLabel="Tabelle befüllen (30)"
        luxColor="accent"
        (luxClicked)="loadData(false)"
        [luxRaised]="true"
        luxTagId="menu-fill-30"
      >
      </lux-menu-item>
    </lux-menu>
  </example-base-options-actions>
</example-base-structure>
        `;

const templateRename001 = `
<div class="lux-chips" fxLayout="column">
  <lux-form-control 
    testDirective
    [luxScalableHeight]="true"
    [luxFormComponent]="this"
    [luxHideBottomBorder]="!luxInputAllowed"
    [luxIgnoreDefaultLabel]="!luxInputAllowed"
  >
    <mat-chip-list
      [ngClass]="[
        luxOrientation.toLocaleLowerCase() === 'vertical' ? 'mat-chip-list-stacked' : 'mat-chip-list-horizontal',
        luxOrientation === 'horizontal' && luxInputAllowed ? 'lux-chips-list-offset' : 'lux-chips-list'
      ]"
      luxTest1="123"
      [luxTest2]="123"
      (luxTest3)="123"
      [(luxTest4)]="123"
      [(luxTest5)]=""
      [disabled]="luxDisabled"
      [aria-orientation]="luxOrientation"
      [multiple]="luxMultiple"
      #testId
    >
      <!-- Direkte Chip-Components -->
      <ng-container *ngFor="let chip of chipComponents; let i = index">
        <mat-chip
          class="lux-chip"
          [ngClass]="{ 'lux-chip-selected': chip.luxSelected, 'lux-chip-disabled': chip.luxDisabled }"
          [removable]="chip.luxRemovable"
          [disabled]="chip.luxDisabled"
          [selectable]="!chip.luxDisabled"
          [selected]="chip.luxSelected"
          [color]="chip.luxColor"
          (keydown.delete)="chip.remove(i)"
          (selectionChange)="chip.select($event.selected, i)"
          (click)="chip.click(i)"
        >
          <ng-template *ngTemplateOutlet="chip.templateRef"></ng-template>
          <lux-icon
            class="lux-chip-icon lux-chip-icon lux-cursor"
            [ngClass]="{ 'lux-chip-icon-selected': chip.luxSelected, 'lux-chip-icon-disabled': chip.luxDisabled }"
            matChipRemove
            luxIconName="cancel"
            luxMargin="0 0 0 6px"
            luxPadding="2px"
            (click)="chip.remove(i)"
            *ngIf="chip.luxRemovable"
          ></lux-icon>
        </mat-chip>
      </ng-container>

      <!-- Chips via ChipGroup-Components -->
      <ng-container *ngFor="let chipGroup of chipGroupComponents">
        <ng-container *ngFor="let label of chipGroup.luxLabels; let i = index">
          <mat-chip
            class="lux-chip"
            [ngClass]="{ 'lux-chip-selected': chipGroup.luxSelected, 'lux-chip-disabled': chipGroup.luxDisabled }"
            [removable]="chipGroup.luxRemovable"
            [disabled]="chipGroup.luxDisabled"
            [selectable]="!chipGroup.luxDisabled"
            [selected]="chipGroup.luxSelected"
            [color]="chipGroup.luxColor"
            (keydown.delete)="chipGroup.remove(i)"
            (selectionChange)="chipGroup.select($event.selected, i)"
            (click)="chipGroup.click(i)"
          >
            <ng-container
              *ngTemplateOutlet="chipGroup.tempRef ? chipGroup.tempRef : noTemplateRef; context: { $implicit: label }"
            ></ng-container>
            <lux-icon
              class="lux-chip-icon lux-chip-icon lux-cursor"
              [ngClass]="{ 'lux-chip-icon-selected': chipGroup.luxSelected, 'lux-chip-icon-disabled': chipGroup.luxDisabled }"
              matChipRemove
              luxIconName="cancel"
              luxMargin="0 0 0 6px"
              luxPadding="2px"
              (click)="chipGroup.remove(i)"
              *ngIf="chipGroup.luxRemovable"
            ></lux-icon>
          </mat-chip>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="luxInputAllowed">
        <input
          [id]="uid"
          [matChipInputFor]="testId"
          [matChipInputAddOnBlur]="true"
          [matAutocomplete]="auto"
          [attr.aria-labelledby]="uid + '-label'"
          [disabled]="luxDisabled"
          (matChipInputTokenEnd)="inputAdd(input)"
          (keyup)="inputChanged(input.value)"
          (click)="onAutocompleteClick()"
          type="text"
          fxFlex="1 1 auto"
          #input
        />
        <mat-autocomplete
          [class]="'lux-autocomplete-panel'"
          (optionSelected)="autoCompleteAdd(input, $event.option.value)"
          (opened)="onAutoCompleteOpened()"
          #auto="matAutocomplete"
        >
          <mat-option *ngFor="let option of filteredOptions" [value]="option">
            {{ option }}
          </mat-option>
        </mat-autocomplete>
      </ng-container>
    </mat-chip-list>
  </lux-form-control>
</div>

<ng-template #noTemplateRef let-label>
  {{ label }}
</ng-template>
        `;

const templateRename002 = `
<input typeWrong="text" />
<area />
<base />
<br />
<col />
<embed />
<hr />
<img />
<link />
<meta />
<param />
<source />
<track />
<wbr /> 

<input typeWrong="text">
<area>
<base>
<br>
<col>
<embed>
<hr>
<img>
<link>
<meta>
<param>
<source>
<track>
<wbr>
    `;

const templateRemove001 = `
<div fxFlex="auto" fxLayout="column">
      <h3>Ohne ReactiveForm</h3>
      <lux-file-list
        testDirective
        [luxLabel]="label"
        [luxDownloadActionConfig]="downloadActionConfig"
        [luxMaximumExtended]="maximumExtended"
        [luxCapture]="capture"
        [luxAccept]="accept"
        [luxHint]=""
        [luxHintShowOnlyOnFocus]="hintShowOnlyOnFocus"
        [luxDnDActive]="dndActive"
        [luxSelectedFiles]="selected"
        [luxContentsAsBlob]="contentAsBlob"
        [luxUploadReportProgress]="reportProgress"
        (luxSelectedFilesChange)="onSelectedChange($event)"
        luxTest1="true"
        [luxTest2]="true"
        (luxTest3)="true"
        [(luxTest4)]="true"
        [(luxTest5)]=""
        (luxFocusIn)="log(showOutputEvents, 'luxFocusIn', $event)"
        (luxFocusOut)="log(showOutputEvents, 'luxFocusOut', $event)"
        #filelistexamplewithoutform
      >
      </lux-file-list>
    </div>
        `;

const templateUpdate001 = `
<div fxFlex="auto" fxLayout="column">
      <h3>Ohne ReactiveForm</h3>
      <lux-file-list
        testDirective
        [luxLabel]="label"
        [luxDownloadActionConfig]="downloadActionConfig"
        [luxMaximumExtended]="maximumExtended"
        [luxCapture]="capture"
        [luxAccept]="accept"
        [luxHint]=""
        [luxHintShowOnlyOnFocus]="hintShowOnlyOnFocus"
        [luxDnDActive]="dndActive"
        [luxSelectedFiles]="selected"
        [luxContentsAsBlob]="contentAsBlob"
        [luxUploadReportProgress]="reportProgress"
        (luxSelectedFilesChange)="onSelectedChange($event)"
        luxTest1="value1"
        [luxTest2]="value2"
        (luxTest3)="onClick($event)"
        [(luxTest4)]="value4"
        [(luxTest5)]="value5"
        (luxFocusIn)="log(showOutputEvents, 'luxFocusIn', $event)"
        (luxFocusOut)="log(showOutputEvents, 'luxFocusOut', $event)"
        #testId
      >
      </lux-file-list>
    </div>
            `;

const templateUpdate002 = `
<lux-icon
  luxIconName="fas fa-user"
  [luxIconSize]="iconSize"
  [luxPadding]="padding"
  [luxMargin]="margin"
  [luxRounded]="rounded"
  [luxColor]="color"
  >
</lux-icon>
`;

const templateUpdate003 = `<lux-icon luxIconName="fas fa-user"><lux-icon luxIconName="fas fa-user"></lux-icon></lux-icon>`;

const templateAppend001 = `
<div fxFlex="auto" fxLayout="column">
      <h3>Ohne ReactiveForm</h3>
      <lux-file-list
        testDirective
        [luxLabel]="label"
        [luxDownloadActionConfig]="downloadActionConfig"
        [luxMaximumExtended]="maximumExtended"
        [luxCapture]="capture"
        [luxAccept]="accept"
        [luxHint]=""
        [luxHintShowOnlyOnFocus]="hintShowOnlyOnFocus"
        [luxDnDActive]="dndActive"
        [luxSelectedFiles]="selected"
        [luxContentsAsBlob]="contentAsBlob"
        [luxUploadReportProgress]="reportProgress"
        (luxSelectedFilesChange)="onSelectedChange($event)"
        luxTest1="value1"
        [luxTest2]="value2"
        (luxTest3)="value3"
        [(luxTest4)]="value4"
        [(luxTest5)]=""
        (luxFocusIn)="log(showOutputEvents, 'luxFocusIn', $event)"
        (luxFocusOut)="log(showOutputEvents, 'luxFocusOut', $event)"
        #testId
      >
      </lux-file-list>
    </div>
            `;

const templateNotProcessedAttr001 = `
<div><lux-card><lux-card-content>Lorem ipsum</lux-card-content></lux-card>
  <lux-card luxTitle="Test">
    <lux-card-content>
      <p>Lorem ipsum</p>
      <lux-card><lux-card-content>Lorem ipsum</lux-card-content></lux-card>
    </lux-card-content>
  </lux-card>
</div>
`;

const resultNotProcessedAttr001 = `
<div><lux-card ${ATTR_NOT_PROCESSED}><lux-card-content>Lorem ipsum</lux-card-content></lux-card>
  <lux-card ${ATTR_NOT_PROCESSED} luxTitle="Test">
    <lux-card-content>
      <p>Lorem ipsum</p>
      <lux-card ${ATTR_NOT_PROCESSED}><lux-card-content>Lorem ipsum</lux-card-content></lux-card>
    </lux-card-content>
  </lux-card>
</div>
`;

const templateCount001 = `
<div><lux-card><lux-card-content>Lorem ipsum</lux-card-content></lux-card>
  <lux-card luxTitle="Test">
    <lux-card-content>
      <p>Lorem ipsum</p>
      <lux-card><lux-card-content>Lorem ipsum</lux-card-content></lux-card>
    </lux-card-content>
  </lux-card>
</div>
`;

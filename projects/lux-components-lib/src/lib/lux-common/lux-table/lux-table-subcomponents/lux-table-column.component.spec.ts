import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTableColumnContentComponent } from './lux-table-column-content.component';
import { LuxTableColumnFooterComponent } from './lux-table-column-footer.component';
import { LuxTableColumnHeaderComponent } from './lux-table-column-header.component';
import { LuxTableColumnComponent } from './lux-table-column.component';

describe('LuxTableColumnComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));

  describe('Defaultwerte', () => {
    let component: DefaultTestComponent;
    let fixture: ComponentFixture<DefaultTestComponent>;
    let columnComponent: LuxTableColumnComponent;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(DefaultTestComponent);
      component = fixture.componentInstance;
      columnComponent = fixture.debugElement.query(By.directive(LuxTableColumnComponent)).componentInstance;
    }));

    it('sollte erstellt werden', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(columnComponent).toBeTruthy();
    });

    it('sollte die Defaultwerte der optionalen Inputs setzen', () => {
      fixture.detectChanges();
      expect(columnComponent.luxColumnDef()).toBe('c1');
      expect(columnComponent.luxConfigLabel()).toBeUndefined();
      expect(columnComponent.luxSortable()).toBeFalse();
      expect(columnComponent.luxSticky()).toBeFalse();
      expect(columnComponent.luxResponsiveBehaviour()).toBe('');
      expect(columnComponent.luxResponsiveAt()).toBe('');
    });

    it('sollte header, content und footer per ContentChild-Query auflösen', () => {
      fixture.detectChanges();
      expect(columnComponent.header()).toBeTruthy();
      expect(columnComponent.content()).toBeTruthy();
      expect(columnComponent.footer()).toBeTruthy();
    });

    it('sollte change$ beim initialen Setzen der Inputs einmal auslösen', () => {
      const emitSpy = jasmine.createSpy('emitSpy');
      const subscription = columnComponent.change$.subscribe(emitSpy);
      fixture.detectChanges();
      expect(emitSpy).toHaveBeenCalled();
      subscription.unsubscribe();
    });
  });

  describe('Geänderte Inputs', () => {
    let component: ConfiguredTestComponent;
    let fixture: ComponentFixture<ConfiguredTestComponent>;
    let columnComponent: LuxTableColumnComponent;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(ConfiguredTestComponent);
      component = fixture.componentInstance;
      columnComponent = fixture.debugElement.query(By.directive(LuxTableColumnComponent)).componentInstance;
      fixture.detectChanges();
    }));

    it('sollte die gebundenen Inputs übernehmen', () => {
      expect(columnComponent.luxColumnDef()).toBe('c1');
      expect(columnComponent.luxConfigLabel()).toBe('Spalte 1');
      expect(columnComponent.luxSortable()).toBeTrue();
      expect(columnComponent.luxSticky()).toBeTrue();
      expect(columnComponent.luxResponsiveBehaviour()).toBe('c2');
      expect(columnComponent.luxResponsiveAt()).toBe('lux-xs');
    });

    it('sollte change$ auslösen, wenn sich ein Input ändert', () => {
      const emitSpy = jasmine.createSpy('emitSpy');
      const subscription = columnComponent.change$.subscribe(emitSpy);
      emitSpy.calls.reset();

      component.sortable.set(false);
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalled();
      subscription.unsubscribe();
    });
  });

  it('sollte einen Fehler werfen, wenn luxColumnDef nicht gesetzt wird', () => {
    expect(() => {
      const fixture = TestBed.createComponent(MissingColumnDefTestComponent);
      fixture.detectChanges();
    }).toThrowError();
  });
});

@Component({
  template: `
    <lux-table-column luxColumnDef="c1">
      <lux-table-column-header>
        <ng-template>C1</ng-template>
      </lux-table-column-header>
      <lux-table-column-content>
        <ng-template let-element>{{ element.c1 }}</ng-template>
      </lux-table-column-content>
      <lux-table-column-footer>
        <ng-template>C1 Footer</ng-template>
      </lux-table-column-footer>
    </lux-table-column>
  `,
  imports: [LuxTableColumnComponent, LuxTableColumnHeaderComponent, LuxTableColumnContentComponent, LuxTableColumnFooterComponent]
})
class DefaultTestComponent {}

@Component({
  template: `
    <lux-table-column
      luxColumnDef="c1"
      luxConfigLabel="Spalte 1"
      [luxSortable]="sortable()"
      [luxSticky]="sticky()"
      luxResponsiveBehaviour="c2"
      luxResponsiveAt="lux-xs"
    >
      <lux-table-column-content>
        <ng-template let-element>{{ element.c1 }}</ng-template>
      </lux-table-column-content>
    </lux-table-column>
  `,
  imports: [LuxTableColumnComponent, LuxTableColumnContentComponent]
})
class ConfiguredTestComponent {
  sortable = signal(true);
  sticky = signal(true);
}

@Component({
  template: `
    <lux-table-column>
      <lux-table-column-content>
        <ng-template let-element>{{ element.c1 }}</ng-template>
      </lux-table-column-content>
    </lux-table-column>
  `,
  imports: [LuxTableColumnComponent, LuxTableColumnContentComponent]
})
class MissingColumnDefTestComponent {}

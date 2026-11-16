import { Component, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTableColumnHeaderComponent } from './lux-table-column-header.component';

describe('LuxTableColumnHeaderComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));

  describe('Mit ng-template', () => {
    let fixture: ComponentFixture<DefaultTestComponent>;
    let headerComponent: LuxTableColumnHeaderComponent;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(DefaultTestComponent);
      headerComponent = fixture.debugElement.query(By.directive(LuxTableColumnHeaderComponent)).componentInstance;
    }));

    it('sollte erstellt werden', () => {
      fixture.detectChanges();
      expect(headerComponent).toBeTruthy();
    });

    it('sollte die tempRef per ContentChild-Query auflösen', () => {
      fixture.detectChanges();
      expect(headerComponent.tempRef()).toBeInstanceOf(TemplateRef);
    });
  });

  it('sollte einen Fehler werfen, wenn kein ng-template übergeben wird', () => {
    expect(() => {
      const fixture = TestBed.createComponent(MissingTemplateTestComponent);
      fixture.detectChanges();
    }).toThrowError();
  });
});

@Component({
  template: `
    <lux-table-column-header>
      <ng-template>Header</ng-template>
    </lux-table-column-header>
  `,
  imports: [LuxTableColumnHeaderComponent]
})
class DefaultTestComponent {}

@Component({
  template: `<lux-table-column-header></lux-table-column-header>`,
  imports: [LuxTableColumnHeaderComponent]
})
class MissingTemplateTestComponent {}

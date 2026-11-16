import { Component, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTableColumnFooterComponent } from './lux-table-column-footer.component';

describe('LuxTableColumnFooterComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));

  describe('Mit ng-template', () => {
    let fixture: ComponentFixture<DefaultTestComponent>;
    let footerComponent: LuxTableColumnFooterComponent;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(DefaultTestComponent);
      footerComponent = fixture.debugElement.query(By.directive(LuxTableColumnFooterComponent)).componentInstance;
    }));

    it('sollte erstellt werden', () => {
      fixture.detectChanges();
      expect(footerComponent).toBeTruthy();
    });

    it('sollte die tempRef per ContentChild-Query auflösen', () => {
      fixture.detectChanges();
      expect(footerComponent.tempRef()).toBeInstanceOf(TemplateRef);
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
    <lux-table-column-footer>
      <ng-template>Footer</ng-template>
    </lux-table-column-footer>
  `,
  imports: [LuxTableColumnFooterComponent]
})
class DefaultTestComponent {}

@Component({
  template: `<lux-table-column-footer></lux-table-column-footer>`,
  imports: [LuxTableColumnFooterComponent]
})
class MissingTemplateTestComponent {}

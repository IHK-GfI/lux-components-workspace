import { Component, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTableColumnContentComponent } from './lux-table-column-content.component';

describe('LuxTableColumnContentComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({}).compileComponents();
  }));

  describe('Mit ng-template', () => {
    let fixture: ComponentFixture<DefaultTestComponent>;
    let contentComponent: LuxTableColumnContentComponent;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(DefaultTestComponent);
      contentComponent = fixture.debugElement.query(By.directive(LuxTableColumnContentComponent)).componentInstance;
    }));

    it('sollte erstellt werden', () => {
      fixture.detectChanges();
      expect(contentComponent).toBeTruthy();
    });

    it('sollte die tempRef per ContentChild-Query auflösen', () => {
      fixture.detectChanges();
      expect(contentComponent.tempRef()).toBeInstanceOf(TemplateRef);
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
    <lux-table-column-content>
      <ng-template let-element>{{ element.c1 }}</ng-template>
    </lux-table-column-content>
  `,
  imports: [LuxTableColumnContentComponent]
})
class DefaultTestComponent {}

@Component({
  template: `<lux-table-column-content></lux-table-column-content>`,
  imports: [LuxTableColumnContentComponent]
})
class MissingTemplateTestComponent {}

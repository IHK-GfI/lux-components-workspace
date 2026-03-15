import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LuxSelectVisibleOptionCountDirective } from './lux-select-visible-option-count.directive';

@Component({
  template: ` <mat-select [luxSelectVisibleOptionCount]="visibleOptionCount"></mat-select> `,
  standalone: true,
  imports: [MatSelectModule, LuxSelectVisibleOptionCountDirective]
})
class VisibleOptionCountHostComponent {
  visibleOptionCount: number | null = 2;
}

describe('LuxSelectVisibleOptionCountDirective', () => {
  let fixture: ComponentFixture<VisibleOptionCountHostComponent>;
  let directive: LuxSelectVisibleOptionCountDirective;
  let matSelect: MatSelect;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, VisibleOptionCountHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VisibleOptionCountHostComponent);
    fixture.detectChanges();

    const debugElement = fixture.debugElement.query((el) => el.injector.get(LuxSelectVisibleOptionCountDirective, null) !== null);
    directive = debugElement.injector.get(LuxSelectVisibleOptionCountDirective);
    matSelect = debugElement.injector.get(MatSelect);
  });

  it('wendet die Panelhöhe auch dann an, wenn das Overlay erst verzögert verfügbar ist', fakeAsync(() => {
    const access = directive as unknown as {
      schedulePanelSizing(): void;
      matSelect: MatSelect;
      panelAttachTimeout?: ReturnType<typeof setTimeout>;
    };
    const panel = document.createElement('div');
    const option = document.createElement('div');
    option.classList.add('mat-mdc-option');
    option.getBoundingClientRect = () => ({ height: 20 }) as DOMRect;
    panel.appendChild(option);

    spyOnProperty(matSelect, 'panelOpen', 'get').and.returnValue(true);
    access.matSelect.panel = undefined as unknown as ElementRef<HTMLElement>;

    access.schedulePanelSizing();
    expect(access.panelAttachTimeout).toBeDefined();

    access.matSelect.panel = new ElementRef(panel);
    tick();

    expect(panel.style.maxHeight).toBe('40px');
  }));

  it('verwendet die Default-Option-Höhe, wenn keine sichtbare Option gemessen werden kann', () => {
    const access = directive as unknown as {
      applyPanelSizing(panel: HTMLElement): void;
    };
    const panel = document.createElement('div');
    const filterHost = document.createElement('lux-select-panel-filter');
    filterHost.getBoundingClientRect = () => ({ height: 10 }) as DOMRect;
    panel.appendChild(filterHost);

    access.applyPanelSizing(panel);

    expect(panel.style.maxHeight).toBe('106px');
  });

  it('räumt einen geplanten Retry beim Destroy wieder auf', fakeAsync(() => {
    const access = directive as unknown as {
      schedulePanelSizing(): void;
      matSelect: MatSelect;
      panelAttachTimeout?: ReturnType<typeof setTimeout>;
    };

    spyOnProperty(matSelect, 'panelOpen', 'get').and.returnValue(true);
    access.matSelect.panel = undefined as unknown as ElementRef<HTMLElement>;

    access.schedulePanelSizing();
    expect(access.panelAttachTimeout).toBeDefined();

    directive.ngOnDestroy();
    tick();

    expect(access.panelAttachTimeout).toBeUndefined();
  }));
});

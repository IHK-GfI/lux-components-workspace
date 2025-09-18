import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxCardActionAlignType, LuxCardActionsComponent } from './lux-card-actions.component';

describe('LuxCardActionsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function containerDiv(): HTMLElement {
    return fixture.debugElement.query(By.css('.lux-card-actions-container'))!.nativeElement as HTMLElement;
  }

  it('sollte erstellt werden', () => {
    expect(host).toBeTruthy();
  });

  it('sollte default rechts ausrichten', () => {
    const div = containerDiv();
    expect(div.classList.contains('lux-justify-end')).toBeTrue();
    expect(div.classList.contains('lux-justify-start')).toBeFalse();
  });

  it('sollte links ausrichten wenn luxAlign="left"', () => {
    host.align = 'left';
    fixture.detectChanges();
    const div = containerDiv();
    expect(div.classList.contains('lux-justify-start')).toBeTrue();
    expect(div.classList.contains('lux-justify-end')).toBeFalse();
  });

  it('sollte Content projizieren', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);
  });
});

@Component({
  template: `
    <lux-card-actions [luxAlign]="align">
      <button class="btn-a">A</button>
      <button class="btn-b">B</button>
    </lux-card-actions>
  `,
  imports: [LuxCardActionsComponent]
})
class HostComponent {
  align: LuxCardActionAlignType = 'right';
}

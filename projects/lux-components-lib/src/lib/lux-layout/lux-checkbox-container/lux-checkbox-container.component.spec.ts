import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LuxCheckboxContainerComponent } from './lux-checkbox-container.component';

describe('LuxCheckboxContainerComponent', () => {
  let component: LuxCheckboxContainerComponent;
  let fixture: ComponentFixture<LuxCheckboxContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LuxCheckboxContainerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxCheckboxContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('luxShowRequiredMarker', () => {
    it('sollte das Pflichtfeld-Sternchen nicht anzeigen, wenn luxShowRequiredMarker false ist', () => {
      fixture.componentRef.setInput('luxLabel', 'Test');
      fixture.componentRef.setInput('luxShowRequiredMarker', false);
      fixture.detectChanges();

      const marker = fixture.nativeElement.querySelector('.lux-label-container span[aria-hidden]');
      expect(marker).toBeNull();
    });

    it('sollte das Pflichtfeld-Sternchen anzeigen, wenn luxShowRequiredMarker true ist', () => {
      fixture.componentRef.setInput('luxLabel', 'Test');
      fixture.componentRef.setInput('luxShowRequiredMarker', true);
      fixture.detectChanges();

      const marker = fixture.nativeElement.querySelector('.lux-label-container span[aria-hidden]');
      expect(marker).not.toBeNull();
      expect(marker.textContent).toContain('*');
    });

    it('sollte das Pflichtfeld-Sternchen nicht anzeigen, wenn kein Label gesetzt ist', () => {
      fixture.componentRef.setInput('luxLabel', '');
      fixture.componentRef.setInput('luxShowRequiredMarker', true);
      fixture.detectChanges();

      const labelContainer = fixture.nativeElement.querySelector('.lux-label-container');
      expect(labelContainer).toBeNull();
    });
  });
});

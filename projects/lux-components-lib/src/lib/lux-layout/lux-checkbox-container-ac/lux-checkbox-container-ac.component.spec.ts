import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LuxCheckboxContainerAcComponent } from './lux-checkbox-container-ac.component';

describe('LuxCheckboxContainerComponent', () => {
  let component: LuxCheckboxContainerAcComponent;
  let fixture: ComponentFixture<LuxCheckboxContainerAcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LuxCheckboxContainerAcComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxCheckboxContainerAcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('luxShowRequiredMarker', () => {
    it('sollte das Pflichtfeld-Sternchen nicht anzeigen, wenn luxShowRequiredMarker false ist', () => {
      component.luxLabel = 'Test';
      component.luxShowRequiredMarker = false;
      fixture.detectChanges();

      const marker = fixture.nativeElement.querySelector('.lux-label-container span[aria-hidden]');
      expect(marker).toBeNull();
    });

    it('sollte das Pflichtfeld-Sternchen anzeigen, wenn luxShowRequiredMarker true ist', () => {
      component.luxLabel = 'Test';
      component.luxShowRequiredMarker = true;
      fixture.detectChanges();

      const marker = fixture.nativeElement.querySelector('.lux-label-container span[aria-hidden]');
      expect(marker).not.toBeNull();
      expect(marker.textContent).toContain('*');
    });

    it('sollte das Pflichtfeld-Sternchen nicht anzeigen, wenn kein Label gesetzt ist', () => {
      component.luxLabel = '';
      component.luxShowRequiredMarker = true;
      fixture.detectChanges();

      const labelContainer = fixture.nativeElement.querySelector('.lux-label-container');
      expect(labelContainer).toBeNull();
    });
  });
});

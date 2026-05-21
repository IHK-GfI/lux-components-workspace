import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LuxImageComponent } from './lux-image.component';

describe('LuxImageComponent', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
  });

  it('Sollte den Bild-Pfad auf /assets umleiten', () => {
    // Given
    component.href = '/png/example.png';
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp.luxImageSrc).toEqual('assets/png/example.png');
  });

  it('Sollte den externen Http-Link nicht verändern', () => {
    // Given
    component.href = 'http://png/example.png';
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp.luxImageSrc).toEqual('http://png/example.png');
  });

  it('Sollte den externen Https-Link nicht verändern', () => {
    // Given
    component.href = 'https://png/example.png';
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp.luxImageSrc).toEqual('https://png/example.png');
  });

  it('Sollte mehrfache und anführende Schrägstriche entfernen', () => {
    // Given
    component.href = '/assets///////png//example.png';
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp.luxImageSrc).toEqual('assets/png/example.png');
  });

  it('Sollte den Pfad zum Bild enthalten', fakeAsync(() => {
    // Given
    component.href = 'assets/png/example.png';
    // When
    fixture.detectChanges();
    const imageEl = fixture.debugElement.query(By.css('.lux-image'));
    // Then
    expect(imageEl.nativeElement.src).toContain('assets/png/example.png');
  }));

  it('Sollte den Pfad ohne Bearbeitung anzeigen [luxRawSrc]', fakeAsync(() => {
    // Given
    component.href = '/fb/myimage.png';
    component.raw = true;
    // When
    fixture.detectChanges();
    const imageEl = fixture.debugElement.query(By.css('.lux-image'));
    // Then
    expect(imageEl.nativeElement.src).toContain('/fb/myimage.png');
  }));

  it('Sollte luxImageError Event emittieren bei Fehler', () => {
    // Given
    component.href = 'assets/png/example.png';
    // When
    fixture.detectChanges();
    const imageEl = fixture.debugElement.query(By.css('.lux-image'));
    const spy = spyOn(component.imageCmp.luxImageError, 'emit');
    imageEl.nativeElement.dispatchEvent(new Event('error'));
    // Then
    expect(spy).toHaveBeenCalled();
  });
});

@Component({
  selector: 'lux-mock-component',
  template: ` <lux-image [luxImageSrc]="href" [luxRawSrc]="raw"></lux-image> `,
  imports: [LuxImageComponent]
})
class MockComponent {
  href?: string;
  raw?: boolean;
  @ViewChild(LuxImageComponent) imageCmp!: LuxImageComponent;
}

import { describe, it, beforeEach, expect } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
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
    component.href.set('/png/example.png');
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp().resolvedImageSrc()).toEqual('assets/png/example.png');
  });

  it('Sollte den externen Http-Link nicht verändern', () => {
    // Given
    component.href.set('http://png/example.png');
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp().resolvedImageSrc()).toEqual('http://png/example.png');
  });

  it('Sollte den externen Http-Link mit großem Schema nicht verändern', () => {
    // Given
    component.href.set('HTTP://png/example.png');
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp().resolvedImageSrc()).toEqual('HTTP://png/example.png');
  });

  it('Sollte den externen Https-Link nicht verändern', () => {
    // Given
    component.href.set('https://png/example.png');
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp().resolvedImageSrc()).toEqual('https://png/example.png');
  });

  it('Sollte den externen Blob-Link nicht verändern', () => {
    // Given
    component.href.set('blob:https://example.org/1234-5678');
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp().resolvedImageSrc()).toEqual('blob:https://example.org/1234-5678');
  });

  it('Sollte den externen Data-Link nicht verändern', () => {
    // Given
    component.href.set('data:image/png;base64,abc123');
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp().resolvedImageSrc()).toEqual('data:image/png;base64,abc123');
  });

  it('Sollte den protokoll-relativen Link nicht verändern', () => {
    // Given
    component.href.set('//cdn.example.org/example.png');
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp().resolvedImageSrc()).toEqual('//cdn.example.org/example.png');
  });

  it('Sollte unbekannte URI-Schemata nicht als extern behandeln', () => {
    // Given
    component.href.set('javascript:alert(1)');
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp().resolvedImageSrc()).toEqual('assets/javascript:alert(1)');
  });

  it('Sollte mehrfache und anführende Schrägstriche entfernen', () => {
    // Given
    component.href.set('/assets///////png//example.png');
    // When
    fixture.detectChanges();
    // Then
    expect(component.imageCmp().resolvedImageSrc()).toEqual('assets/png/example.png');
  });

  it('Sollte den Pfad zum Bild enthalten', async () => {
    // Given
    component.href.set('assets/png/example.png');
    // When
    fixture.detectChanges();
    const imageEl = fixture.debugElement.query(By.css('.lux-image'));
    // Then
    expect(imageEl.nativeElement.src).toContain('assets/png/example.png');
  });

  it('Sollte den Pfad ohne Bearbeitung anzeigen [luxRawSrc]', async () => {
    // Given
    component.href.set('/fb/myimage.png');
    component.raw.set(true);
    // When
    fixture.detectChanges();
    const imageEl = fixture.debugElement.query(By.css('.lux-image'));
    // Then
    expect(imageEl.nativeElement.src).toContain('/fb/myimage.png');
  });

  it('Sollte luxImageError Event emittieren bei Fehler', () => {
    // Given
    component.href.set('assets/png/example.png');
    // When
    fixture.detectChanges();
    const imageEl = fixture.debugElement.query(By.css('.lux-image'));
    const spy = vi.spyOn(component.imageCmp().luxImageError, 'emit').mockReturnValue(undefined);
    imageEl.nativeElement.dispatchEvent(new Event('error'));
    // Then
    expect(spy).toHaveBeenCalled();
  });

  it('Sollte ohne luxClicked-Listener nicht klickbar dargestellt werden', () => {
    // Given
    component.href.set('assets/png/example.png');
    // When
    fixture.detectChanges();
    const imageEl = fixture.debugElement.query(By.css('.lux-image')).nativeElement as HTMLImageElement;
    // Then
    expect(imageEl.classList.contains('lux-clickable')).toBe(false);
    expect(imageEl.getAttribute('tabindex')).toBeNull();
  });

  it('Sollte mit luxClicked-Listener klickbar dargestellt werden und luxClicked emittieren', () => {
    // Given
    const clickableFixture = TestBed.createComponent(MockClickableComponent);
    // When
    clickableFixture.detectChanges();
    const imageEl = clickableFixture.debugElement.query(By.css('.lux-image')).nativeElement as HTMLImageElement;
    imageEl.click();
    // Then
    expect(imageEl.classList.contains('lux-clickable')).toBe(true);
    expect(imageEl.getAttribute('tabindex')).toEqual('0');
    expect(clickableFixture.componentInstance.clicked).toBe(1);
  });
});

@Component({
  selector: 'lux-mock-component',
  template: ` <lux-image [luxImageSrc]="href()" [luxRawSrc]="raw()"></lux-image> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxImageComponent]
})
class MockComponent {
  readonly imageCmp = viewChild.required(LuxImageComponent);

  readonly href = signal('');
  readonly raw = signal(false);
}

@Component({
  selector: 'lux-mock-clickable-component',
  template: `<lux-image luxImageSrc="assets/png/example.png" (luxClicked)="clicked = clicked + 1" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxImageComponent]
})
class MockClickableComponent {
  clicked = 0;
}

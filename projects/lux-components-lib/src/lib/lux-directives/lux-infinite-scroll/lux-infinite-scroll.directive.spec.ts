// noinspection DuplicatedCode

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxInfiniteScrollDirective } from './lux-infinite-scroll.directive';

describe('LuxInfiniteScrollDirective', () => {
  const WAIT_TIME = LuxInfiniteScrollDirective.SCROLL_DEBOUNCE_TIME + 50;

  const scrollTo = async (px: number, src: HTMLElement, componentFixture: ComponentFixture<any>) => {
    src.scrollTop = px;

    let scrollEvent;

    // Workaround, da der IE "new Event()" nicht supportet
    if (typeof Event === 'function') {
      scrollEvent = new Event('scroll');
    } else {
      scrollEvent = document.createEvent('Event');
      scrollEvent.initEvent('scroll', true, true);
    }

    vi.spyOn(scrollEvent, 'target', 'get').mockReturnValue(src);
    document.dispatchEvent(scrollEvent);

    await LuxTestHelper.wait(componentFixture, WAIT_TIME);
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  describe('Mit Scrollbar', () => {
    let fixture: ComponentFixture<MockComponent>;
    let mockComp: MockComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(MockComponent);
      mockComp = fixture.componentInstance;

      // jsdom hat keine Layout-Engine: scrollHeight/clientHeight liefern immer 0, wodurch nie eine
      // Scrollbar erkannt würde. Die Werte werden hier auf ein plausibles Szenario (Inhalt größer als
      // sichtbarer Bereich) gesetzt, um das reale Browser-Verhalten unter Karma nachzubilden.
      const el = fixture.debugElement.query(By.css('#toggleMasterFocus-element')).nativeElement;
      Object.defineProperty(el, 'clientHeight', { configurable: true, value: 50 });
      Object.defineProperty(el, 'scrollHeight', { configurable: true, value: 500 });
    });

    it('Sollte erstellt werden', () => {
      expect(mockComp).toBeTruthy();
      fixture.detectChanges();
    });

    it('Sollte luxScrolled nach Initialisierung emitten', async () => {
      const spy = vi.spyOn(mockComp, 'onMockEvent').mockReturnValue(undefined);
      await LuxTestHelper.wait(fixture);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Sollte luxScrolled ein zweites Mal emitten, wenn weit genug gescrollt worden ist', async () => {
      // Vorbedingungen testen
      const el = fixture.debugElement.query(By.css('#toggleMasterFocus-element'));
      const spy = vi.spyOn(mockComp, 'onMockEvent').mockReturnValue(undefined);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);

      // Änderungen durchführen
      await scrollTo(50, el.nativeElement, fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('Sollte luxScrolled nicht emitten, wenn nach oben gescrollt worden ist', async () => {
      // Vorbedingungen testen
      const el = fixture.debugElement.query(By.css('#toggleMasterFocus-element'));
      const spy = vi.spyOn(mockComp, 'onMockEvent').mockReturnValue(undefined);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);

      // Änderungen durchführen
      await LuxTestHelper.wait(fixture, WAIT_TIME);
      await scrollTo(1000, el.nativeElement, fixture);

      await LuxTestHelper.wait(fixture, WAIT_TIME);
      await scrollTo(0, el.nativeElement, fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('Sollte luxScrolled nicht emitten, wenn luxImmediateCallback = false ist', async () => {
      // Vorbedingungen testen
      mockComp.immediateCallback.set(false);
      const spy = vi.spyOn(mockComp, 'onMockEvent').mockReturnValue(undefined);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      await LuxTestHelper.wait(fixture, WAIT_TIME);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('Sollte luxScrolled nicht emitten, wenn luxImmediateCallback = true und luxIsLoading = true ist', async () => {
      // Vorbedingungen testen
      mockComp.immediateCallback.set(true);
      mockComp.isLoading.set(true);
      const spy = vi.spyOn(mockComp, 'onMockEvent').mockReturnValue(undefined);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      await LuxTestHelper.wait(fixture, WAIT_TIME);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('Sollte luxScrolled nicht emitten, wenn nach unten gescrollt wird und luxIsLoading = true ist', async () => {
      // Vorbedingungen testen
      mockComp.immediateCallback.set(true);
      const el = fixture.debugElement.query(By.css('#toggleMasterFocus-element'));
      const spy = vi.spyOn(mockComp, 'onMockEvent').mockReturnValue(undefined);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture, WAIT_TIME);

      expect(spy).toHaveBeenCalledTimes(1);

      // Änderungen durchführen
      mockComp.isLoading.set(true);
      await LuxTestHelper.wait(fixture, WAIT_TIME);
      await scrollTo(50, el.nativeElement, fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Ohne Scrollbar', () => {
    let fixture: ComponentFixture<MockWithoutScrollBarAndImmediateCallbackComponent>;
    let mockComp: MockWithoutScrollBarAndImmediateCallbackComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(MockWithoutScrollBarAndImmediateCallbackComponent);
      mockComp = fixture.componentInstance;
    });

    it('Sollte luxScrolled nicht emitten wenn luxImmediateCallback = true ist', async () => {
      // Vorbedingungen testen
      const el = fixture.debugElement.query(By.css('#toggleMasterFocus-element'));
      const spy = vi.spyOn(mockComp, 'onMockEvent').mockReturnValue(undefined);

      await LuxTestHelper.wait(fixture, WAIT_TIME);
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      await scrollTo(50, el.nativeElement, fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('Sollte luxScrolled nicht emitten wenn luxImmediateCallback = false ist', async () => {
      // Vorbedingungen testen
      mockComp.immediateCallback.set(false);
      const el = fixture.debugElement.query(By.css('#toggleMasterFocus-element'));
      const spy = vi.spyOn(mockComp, 'onMockEvent').mockReturnValue(undefined);

      await LuxTestHelper.wait(fixture, WAIT_TIME);
      expect(spy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      await scrollTo(50, el.nativeElement, fixture);

      // Nachbedingungen prüfen
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});

/* Mock-Klassen */

@Component({
  selector: 'lux-mock-component',
  template: `<div
    style="overflow-y: scroll; height: 50px;"
    id="toggleMasterFocus-element"
    luxInfiniteScroll
    (luxScrolled)="onMockEvent()"
    [luxScrollPercent]="1"
    [luxImmediateCallback]="immediateCallback()"
    [luxIsLoading]="isLoading()"
  >
    Text
    <ul>
      @for (testText of testArr; track testText) {
        <li>{{ testText }}</li>
      }
    </ul>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxInfiniteScrollDirective]
})
class MockComponent {
  // Wird benutzt, um einen Y-Overflow und damit eine Scrollbar im Testelement zu forcieren
  testArr: string[] = [];
  readonly immediateCallback = signal(true);
  readonly isLoading = signal(false);

  constructor() {
    for (let i = 1; i <= 10; i++) {
      this.testArr.push('Test ' + i);
    }
  }

  public onMockEvent() {}
}

@Component({
  selector: 'lux-mock-component-without-scrollbar',
  template: `<div
    id="toggleMasterFocus-element"
    luxInfiniteScroll
    (luxScrolled)="onMockEvent()"
    [luxImmediateCallback]="immediateCallback()"
  ></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxInfiniteScrollDirective]
})
class MockWithoutScrollBarAndImmediateCallbackComponent {
  readonly immediateCallback = signal(true);

  public onMockEvent() {}
}

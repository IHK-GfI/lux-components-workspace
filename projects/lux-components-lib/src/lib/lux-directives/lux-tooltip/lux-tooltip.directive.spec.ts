import { FocusMonitor } from '@angular/cdk/a11y';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, DebugElement, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, fakeAsync, flushMicrotasks, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { TooltipPosition } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxTooltipDirective } from './lux-tooltip.directive';

describe('LuxTooltipDirective', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let focusMonitor: FocusMonitor;

  let fixture: ComponentFixture<MockComponent>;
  let mockComp: MockComponent;
  let tooltipSpanDebug: DebugElement;
  let tooltipSpan: HTMLElement;
  let tooltip: LuxTooltipDirective;

  const showTooltip = (wait = 500) => {
    tooltip.show(mockComp.showDelay);
    LuxTestHelper.wait(fixture, wait);
  };

  const hideTooltip = (wait = 500) => {
    tooltip.hide(mockComp.hideDelay);
    LuxTestHelper.wait(fixture, wait);
    flushMicrotasks();
  };

  // Der Truncation-Watcher plant beim connect() eine erste Messung via setTimeout(0).
  // In fakeAsync muss dieser Timer geleert werden, bevor deterministisch gemessen wird.
  const flushTruncationWatch = () => tick(0);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()]
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(MockComponent);
    mockComp = fixture.componentInstance;
    fixture.detectChanges();

    tooltipSpanDebug = fixture.debugElement.query(By.css('span'));
    tooltipSpan = tooltipSpanDebug.nativeElement as HTMLElement;
    tooltip = tooltipSpanDebug.injector.get<LuxTooltipDirective>(LuxTooltipDirective);

    inject([OverlayContainer, FocusMonitor], (oc: OverlayContainer, fm: FocusMonitor) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      focusMonitor = fm;
    })();
  }));

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    // Since we're resetting the testing module in some tests,
    // we can potentially have multiple overlay containers.
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  it('should create an instance', () => {
    expect(mockComp).toBeTruthy();
    expect(tooltip).toBeTruthy();
  });

  it('should show the correct message', fakeAsync(() => {
    // Given
    mockComp.message = 'DEMO';
    fixture.detectChanges();
    // When
    showTooltip();
    // Then
    expect(tooltip._isTooltipVisible()).toBe(true);
    expect(overlayContainerElement.textContent).toEqual('DEMO');

    // When
    hideTooltip(500);
    LuxTestHelper.wait(fixture, 500); // Zusatz, weil sonst der Tooltip noch nicht entfernt wurde
    // Then
    expect(tooltip._isTooltipVisible()).toBe(false);
    expect(overlayContainerElement.textContent).toEqual('');
    expect(overlayContainerElement.childElementCount).toBe(0);
  }));

  it('should be disabled', fakeAsync(() => {
    // Given
    mockComp.message = 'DEMO';
    mockComp.disabled = true;
    fixture.detectChanges();
    // When
    showTooltip();
    // Then
    expect(tooltip._isTooltipVisible()).toBe(false);
    expect(overlayContainerElement.textContent).toEqual('');
    expect(overlayContainerElement.childElementCount).toBe(0);
  }));

  it('should toggle the tooltip when the host text switches between fitting and truncated', fakeAsync(() => {
    // Given
    mockComp.message = 'DEMO';
    mockComp.ifTruncated = true;
    mockComp.hostWidth = 200;
    mockComp.label = 'Kurz';
    fixture.detectChanges();
    flushTruncationWatch();
    const watcher = (tooltip as any).truncationWatcher;
    Object.defineProperty(tooltipSpan, 'clientWidth', { configurable: true, value: 200 });

    // When the text overflows the host (fits -> truncated)
    Object.defineProperty(tooltipSpan, 'scrollWidth', { configurable: true, value: 260 });
    watcher.refresh();

    // Then the tooltip becomes enabled
    expect(tooltip.disabled).toBe(false);

    // When the text fits again (truncated -> fits)
    Object.defineProperty(tooltipSpan, 'scrollWidth', { configurable: true, value: 180 });
    watcher.refresh();

    // Then the tooltip is disabled again
    expect(tooltip.disabled).toBe(true);

    // When it overflows once more, the tooltip actually shows on hover
    Object.defineProperty(tooltipSpan, 'scrollWidth', { configurable: true, value: 260 });
    watcher.refresh();
    showTooltip();

    // Then
    expect(tooltip._isTooltipVisible()).toBe(true);
    expect(overlayContainerElement.textContent).toEqual('DEMO');
  }));

  it('should enable the tooltip when the text is truncated vertically (line-clamp)', fakeAsync(() => {
    // Given
    mockComp.message = 'DEMO';
    mockComp.ifTruncated = true;
    fixture.detectChanges();
    flushTruncationWatch();
    const watcher = (tooltip as any).truncationWatcher;
    // Kein horizontaler Überlauf (line-clamp kürzt nur vertikal)
    Object.defineProperty(tooltipSpan, 'clientWidth', { configurable: true, value: 200 });
    Object.defineProperty(tooltipSpan, 'scrollWidth', { configurable: true, value: 200 });
    Object.defineProperty(tooltipSpan, 'clientHeight', { configurable: true, value: 40 });

    // When the text overflows vertically (fits -> truncated)
    Object.defineProperty(tooltipSpan, 'scrollHeight', { configurable: true, value: 60 });
    watcher.refresh();

    // Then the tooltip becomes enabled
    expect(tooltip.disabled).toBe(false);

    // When the text fits again (truncated -> fits)
    Object.defineProperty(tooltipSpan, 'scrollHeight', { configurable: true, value: 40 });
    watcher.refresh();

    // Then the tooltip is disabled again
    expect(tooltip.disabled).toBe(true);
  }));

  it('should keep the tooltip disabled when explicit disable is set', fakeAsync(() => {
    // Given
    mockComp.message = 'DEMO';
    mockComp.ifTruncated = true;
    mockComp.disabled = true;
    mockComp.hostWidth = 80;
    mockComp.label = 'Ein deutlich längerer Text, der sicher gekürzt wird';
    fixture.detectChanges();
    LuxTestHelper.wait(fixture);

    // When
    showTooltip();

    // Then
    expect(tooltip.disabled).toBe(true);
    expect(tooltip._isTooltipVisible()).toBe(false);
    expect(overlayContainerElement.textContent).toEqual('');
  }));

  it('should show after delay', fakeAsync(() => {
    // Given
    mockComp.message = 'DEMO';
    mockComp.showDelay = 1000;
    fixture.detectChanges();
    // When
    showTooltip(500);
    // Then
    expect(tooltip.showDelay).toBe(1000);
    expect(tooltip._isTooltipVisible()).toBe(false);

    // When
    tick(500);
    // Then
    expect(tooltip._isTooltipVisible()).toBe(true);
  }));

  it('should hide after delay', fakeAsync(() => {
    // Given
    mockComp.message = 'DEMO';
    mockComp.hideDelay = 1000;
    fixture.detectChanges();
    // When
    showTooltip(0);
    // Then
    expect(tooltip._isTooltipVisible()).toBe(true);

    // When
    hideTooltip(500);
    // Then
    expect(tooltip._isTooltipVisible()).toBe(true);

    // When
    tick(500);
    // Then
    expect(tooltip._isTooltipVisible()).toBe(false);
  }));
});

/* Mock-Klassen */

@Component({
  selector: 'lux-mock-component',
  template: `<span
    [style.display]="'block'"
    [style.width.px]="hostWidth"
    [style.overflow]="'hidden'"
    [style.white-space]="'nowrap'"
    [style.text-overflow]="'ellipsis'"
    [luxTooltip]="message"
    [luxTooltipHideDelay]="hideDelay"
    [luxTooltipShowDelay]="showDelay"
    [luxTooltipPosition]="position"
    [luxTooltipDisabled]="disabled"
    [luxTooltipIfTruncated]="ifTruncated"
    >{{ label }}</span
  >`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LuxTooltipDirective]
})
class MockComponent {
  message?: string;
  hideDelay?: number;
  showDelay?: number;
  position: TooltipPosition = 'above';
  disabled?: boolean;
  ifTruncated = false;
  hostWidth = 200;
  label = 'Ich bin ein Demotext';

  constructor() {}
}

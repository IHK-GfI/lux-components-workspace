import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { FocusMonitor } from '@angular/cdk/a11y';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
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

  const showTooltip = async (delay = 0) => {
    tooltip.show(mockComp.showDelay());
    await LuxTestHelper.wait(fixture, delay);
  };

  const hideTooltip = async (delay = 0) => {
    tooltip.hide(mockComp.hideDelay());
    await LuxTestHelper.wait(fixture, delay);
  };

  // Der Truncation-Watcher plant beim connect() eine erste Messung via setTimeout(0).
  // Dieser Timer muss geleert werden, bevor deterministisch gemessen wird. Bei aktiven
  // Vitest-Fake-Timern wird dazu die virtuelle Zeit um 0ms vorgespult, statt auf einen
  // echten setTimeout-Tick zu warten (der bei Fake-Timern sonst nie feuern würde).
  const flushTruncationWatch = async () => {
    await vi.advanceTimersByTimeAsync(0);
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()]
    }).compileComponents();
  });

  beforeEach(async () => {
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
  });

  afterEach(inject([OverlayContainer], async (currentOverlayContainer: OverlayContainer) => {
    // Ausstehende Fake-Timer noch im Fake-Modus abarbeiten, bevor die Overlays zerstört und auf
    // echte Timer zurückgeschaltet wird - sonst kann ein von ngOnDestroy() ausgelöstes
    // clearTimeout() auf eine Fake-Timer-ID treffen, während bereits die echte Timer-Implementierung
    // aktiv ist, und ein verwaister Timer feuert später in einem fremden Test.
    if (vi.isFakeTimers()) {
      await vi.runAllTimersAsync();
    }
    // Since we're resetting the testing module in some tests,
    // we can potentially have multiple overlay containers.
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
    vi.useRealTimers();
  }));

  it('should create an instance', () => {
    expect(mockComp).toBeTruthy();
    expect(tooltip).toBeTruthy();
  });

  it('should show the correct message', async () => {
    // Given
    mockComp.message.set('DEMO');
    fixture.detectChanges();
    // When
    await showTooltip();
    // Then
    expect(tooltip._isTooltipVisible()).toBe(true);
    expect(overlayContainerElement.textContent).toEqual('DEMO');

    // When
    await hideTooltip(500);
    await LuxTestHelper.wait(fixture, 500); // Zusatz, weil sonst der Tooltip noch nicht entfernt wurde
    // Then
    expect(tooltip._isTooltipVisible()).toBe(false);
    expect(overlayContainerElement.textContent).toEqual('');
    expect(overlayContainerElement.childElementCount).toBe(0);
  });

  it('should be disabled', async () => {
    // Given
    mockComp.message.set('DEMO');
    mockComp.disabled.set(true);
    fixture.detectChanges();
    // When
    await showTooltip();
    // Then
    expect(tooltip._isTooltipVisible()).toBe(false);
    expect(overlayContainerElement.textContent).toEqual('');
    expect(overlayContainerElement.childElementCount).toBe(0);
  });

  it('should toggle the tooltip when the host text switches between fitting and truncated', async () => {
    // Given
    mockComp.message.set('DEMO');
    mockComp.ifTruncated.set(true);
    mockComp.hostWidth.set(200);
    mockComp.label.set('Kurz');
    fixture.detectChanges();
    await flushTruncationWatch();
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
    await showTooltip();

    // Then
    expect(tooltip._isTooltipVisible()).toBe(true);
    expect(overlayContainerElement.textContent).toEqual('DEMO');
  });

  it('should enable the tooltip when the text is truncated vertically (line-clamp)', async () => {
    // Given
    mockComp.message.set('DEMO');
    mockComp.ifTruncated.set(true);
    fixture.detectChanges();
    await flushTruncationWatch();
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
  });

  it('should keep the tooltip disabled when explicit disable is set', async () => {
    // Given
    mockComp.message.set('DEMO');
    mockComp.ifTruncated.set(true);
    mockComp.disabled.set(true);
    mockComp.hostWidth.set(80);
    mockComp.label.set('Ein deutlich längerer Text, der sicher gekürzt wird');
    fixture.detectChanges();

    // When
    await showTooltip();

    // Then
    expect(tooltip.disabled).toBe(true);
    expect(tooltip._isTooltipVisible()).toBe(false);
    expect(overlayContainerElement.textContent).toEqual('');
  });

  it('should show after delay', async () => {
    // Given
    mockComp.message.set('DEMO');
    mockComp.showDelay.set(1000);
    fixture.detectChanges();
    // When
    await showTooltip(500);
    // Then
    expect(tooltip.showDelay).toBe(1000);
    expect(tooltip._isTooltipVisible()).toBe(false);

    // When
    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();
    // Then
    expect(tooltip._isTooltipVisible()).toBe(true);
  });

  it('should hide after delay', async () => {
    // Given
    mockComp.message.set('DEMO');
    mockComp.hideDelay.set(1000);
    fixture.detectChanges();
    // When
    await showTooltip(0);
    // Then
    expect(tooltip._isTooltipVisible()).toBe(true);

    // When
    await hideTooltip(500);
    // Then
    expect(tooltip._isTooltipVisible()).toBe(true);

    // When
    await vi.advanceTimersByTimeAsync(500);
    fixture.detectChanges();
    // Then
    expect(tooltip._isTooltipVisible()).toBe(false);
  });
});

/* Mock-Klassen */

@Component({
  selector: 'lux-mock-component',
  template: `<span
    [style.display]="'block'"
    [style.width.px]="hostWidth()"
    [style.overflow]="'hidden'"
    [style.white-space]="'nowrap'"
    [style.text-overflow]="'ellipsis'"
    [luxTooltip]="message()"
    [luxTooltipHideDelay]="hideDelay()"
    [luxTooltipShowDelay]="showDelay()"
    [luxTooltipPosition]="position()"
    [luxTooltipDisabled]="disabled()"
    [luxTooltipIfTruncated]="ifTruncated()"
    >{{ label() }}</span
  >`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTooltipDirective]
})
class MockComponent {
  readonly message = signal<string>('???');
  readonly hideDelay = signal<number>(0);
  readonly showDelay = signal<number>(0);
  readonly position = signal<TooltipPosition>('above');
  readonly disabled = signal<boolean>(false);
  readonly ifTruncated = signal(false);
  readonly hostWidth = signal(200);
  readonly label = signal('Ich bin ein Demotext');

  constructor() {}
}

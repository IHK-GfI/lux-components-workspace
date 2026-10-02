import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxMediaQueryObserverService } from '@ihk-gfi/lux-components';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { LuxA11yTestHelper } from '../../../test-utils/src/test-utils/lux-a11y-test-helper';
import { LuxTestHelper } from '../../../test-utils/src/test-utils/lux-test-helper';
import { LuxAccordionAriaComponent } from '../lux-accordion-aria/lux-accordion-aria.component';
import { LuxPanelAriaContentComponent } from './lux-panel-aria-subcomponents/lux-panel-aria-content.component';
import { LuxPanelAriaHeaderCustomComponent } from './lux-panel-aria-subcomponents/lux-panel-aria-header-custom.component';
import { LuxPanelAriaHeaderDescriptionComponent } from './lux-panel-aria-subcomponents/lux-panel-aria-header-description.component';
import { LuxPanelAriaHeaderTitleComponent } from './lux-panel-aria-subcomponents/lux-panel-aria-header-title.component';
import { LuxPanelAriaComponent } from './lux-panel-aria.component';
import { MockMediaObserverService } from '../../../src/lib/lux-util/testing/mock-media-observer.service';

describe('LuxPanelAriaComponent', () => {
  let fixture: ComponentFixture<LuxPanelAriaTestComponent>;
  let testComponent: LuxPanelAriaTestComponent;
  let mediaQueryService: MockMediaObserverService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        LuxPanelAriaComponent,
        LuxPanelAriaHeaderTitleComponent,
        LuxPanelAriaContentComponent,
        LuxPanelAriaHeaderCustomComponent,
        LuxPanelAriaTestComponent
      ],
      providers: [{ provide: LuxMediaQueryObserverService, useClass: MockMediaObserverService }]
    });

    fixture = TestBed.createComponent(LuxPanelAriaTestComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    mediaQueryService = TestBed.inject(LuxMediaQueryObserverService) as unknown as MockMediaObserverService;
    await LuxTestHelper.wait(fixture);
    fixture.detectChanges();
  });

  it('sollte erstellt werden', () => {
    expect(testComponent).toBeTruthy();
  });

  it('sollte initial kollabiert sein', () => {
    const content = fixture.debugElement.query(By.css('.lux-expansion-panel-content'));
    expect(content).toBeNull();
    const panel = fixture.debugElement.query(By.css('[ngAccordionPanel]'));
    expect(panel.nativeElement.getAttribute('role')).toBe('region');
    expect(panel.nativeElement.hasAttribute('inert')).toBe(true);
  });

  it('sollte Panel-Inhalt nach dem Öffnen anzeigen', async () => {
    const headerButton = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));

    headerButton.nativeElement.click();
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);
    await LuxTestHelper.wait(fixture);
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('.lux-expansion-panel-content'));
    expect(content).toBeTruthy();
    expect(fixture.debugElement.query(By.css('[ngAccordionPanel]')).nativeElement.hasAttribute('inert')).toBe(false);
    expect(content.nativeElement.textContent).toContain('Content');
  });

  it('sollte bei Header-Klick expandieren und schließen', async () => {
    const headerButton = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));

    headerButton.nativeElement.click();
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    expect(testComponent.expandedEvents).toContain(true);

    headerButton.nativeElement.click();
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    expect(testComponent.expandedEvents).toContain(false);
  });

  it('sollte bei Enter expandieren und schließen', async () => {
    const headerButton = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));

    headerButton.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    expect(testComponent.expandedEvents).toContain(true);

    headerButton.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    expect(testComponent.expandedEvents).toContain(false);
  });

  it('sollte bei Leertaste expandieren und schließen', async () => {
    const headerButton = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));

    headerButton.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: ' ' }));
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    expect(testComponent.expandedEvents).toContain(true);

    headerButton.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: ' ' }));
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    expect(testComponent.expandedEvents).toContain(false);
  });

  it('sollte Toggle-Position before rendern', async () => {
    testComponent.togglePosition.set('before');
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const header = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));
    expect(header.nativeElement.classList.contains('lux-expansion-toggle-indicator-before')).toBe(true);
  });

  it('sollte den Indikator bei luxHideToggle ausblenden', async () => {
    testComponent.hideToggle.set(true);
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const indicators = fixture.debugElement.queryAll(By.css('.lux-expansion-indicator'));
    expect(indicators.length).toBe(0);
  });

  it('sollte den Indikator bei einem deaktivierten Panel ausblenden', async () => {
    testComponent.disabled.set(true);
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const indicators = fixture.debugElement.queryAll(By.css('.lux-expansion-indicator'));
    expect(indicators.length).toBe(0);
  });

  it('sollte bei luxDynamicHeaderHeight keine feste Header-Hoehe setzen', async () => {
    testComponent.dynamicHeaderHeight.set(true);
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const header = fixture.debugElement.query(By.css('.lux-expansion-panel-header'));
    expect(header.nativeElement.style.height).toBe('');
  });

  it('sollte den Header bei luxStickyHeader als sticky markieren', async () => {
    testComponent.stickyHeader.set(true);
    testComponent.stickyHeaderOffset.set('48px');
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const panel = fixture.debugElement.query(By.css('.lux-panel'));
    expect(panel.nativeElement.classList.contains('lux-panel-sticky-header')).toBe(true);
    expect(panel.nativeElement.style.getPropertyValue('--lux-panel-sticky-header-offset')).toBe('48px');
  });

  it('sollte ein sticky Panel beim Scrollen geöffnet lassen', async () => {
    testComponent.stickyHeader.set(true);
    testComponent.expanded.set(true);
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);
    fixture.detectChanges();

    const panelContent = fixture.debugElement.query(By.css('.lux-expansion-panel-content-wrapper')).nativeElement as HTMLElement;
    document.documentElement.dispatchEvent(new Event('scroll'));
    await LuxTestHelper.wait(fixture);
    fixture.detectChanges();

    expect(testComponent.expandedEvents).toEqual([true]);
    expect(panelContent.hasAttribute('inert')).toBe(false);
  });

  it('sollte luxColor auch ohne umgebendes Accordion auf das Panel anwenden', async () => {
    const standaloneFixture = TestBed.createComponent(LuxPanelAriaStandaloneTestComponent);
    standaloneFixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const panel = standaloneFixture.debugElement.query(By.css('.lux-panel'));
    expect(panel.nativeElement.classList.contains('lux-warn')).toBe(true);
  });

  it('sollte bei luxTruncated Titel und Beschreibung abschneiden', async () => {
    testComponent.truncated.set(true);
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const title = fixture.debugElement.query(By.css('.lux-expansion-panel-header-title'));
    const description = fixture.debugElement.query(By.css('.lux-expansion-panel-header-description'));

    expect(title.nativeElement.classList.contains('lux-crop')).toBe(true);
    expect(title.nativeElement.classList.contains('lux-hyphenate')).toBe(false);
    expect(title.nativeElement.style.display).toBe('block');
    expect(title.nativeElement.hasAttribute('tabindex')).toBe(false);

    expect(description.nativeElement.classList.contains('lux-crop')).toBe(true);
    expect(description.nativeElement.classList.contains('lux-hyphenate')).toBe(false);
    expect(description.nativeElement.style.display).toBe('block');
    expect(description.nativeElement.hasAttribute('tabindex')).toBe(false);
  });

  it('sollte deaktiviertes Panel nicht öffnen', async () => {
    testComponent.disabled.set(true);
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const header = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));
    header.nativeElement.click();
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const content = fixture.debugElement.query(By.css('.lux-expansion-panel-content'));
    expect(header.nativeElement.getAttribute('aria-disabled')).toBe('true');
    expect(content).toBeNull();
  });

  it('sollte luxClickNotAllowed bei Klick auf ein deaktiviertes Panel emittieren', async () => {
    testComponent.disabled.set(true);
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const header = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));
    header.nativeElement.click();
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    expect(testComponent.clickNotAllowedEvents.length).toBe(1);
    expect(testComponent.expandedEvents).not.toContain(true);
  });

  it('sollte luxClickNotAllowed bei Tastatureingabe auf ein deaktiviertes Panel emittieren', async () => {
    testComponent.disabled.set(true);
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const header = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));
    header.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    expect(testComponent.clickNotAllowedEvents.length).toBe(1);
    expect(testComponent.expandedEvents).not.toContain(true);
  });

  it('sollte luxClickNotAllowed bei einem aktiven Panel nicht emittieren', async () => {
    const header = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));
    header.nativeElement.click();
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    expect(testComponent.clickNotAllowedEvents.length).toBe(0);
    expect(testComponent.expandedEvents).toContain(true);
  });

  it('sollte den Custom-Header-Inhalt bei luxDisabled ausblenden', async () => {
    const actions = fixture.debugElement.query(By.css('.lux-expansion-panel-header-custom'));
    expect(actions.nativeElement.style.display).toBe('');

    testComponent.disabled.set(true);
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    expect(actions.nativeElement.style.display).toBe('none');

    testComponent.disabled.set(false);
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    expect(actions.nativeElement.style.display).toBe('');
  });

  it('sollte den Custom-Header nur mobil in eine zweite Zeile verschieben', () => {
    const panel = fixture.debugElement.query(By.css('.lux-panel'));
    const panelComponent = panel.componentInstance as LuxPanelAriaComponent;

    testComponent.secondRowForMobile.set(true);
    panelComponent.mobile.set(false);
    fixture.detectChanges();
    expect(panel.nativeElement.classList).not.toContain('lux-panel-second-row-for-mobile');

    panelComponent.mobile.set(true);
    fixture.detectChanges();
    expect(panel.nativeElement.classList).toContain('lux-panel-second-row-for-mobile');
  });

  it('sollte die Mobile-Klasse nach einer Media-Query-Aenderung von aussen aktualisieren (OnPush-Regression)', async () => {
    const panel = fixture.debugElement.query(By.css('.lux-panel'));
    testComponent.secondRowForMobile.set(true);
    fixture.detectChanges();
    expect(panel.nativeElement.classList).not.toContain('lux-panel-mobile');

    mediaQueryService.emitMediaQuery('xs');
    await LuxTestHelper.wait(fixture);

    expect(panel.nativeElement.classList).toContain('lux-panel-mobile');
    expect(panel.nativeElement.classList).toContain('lux-panel-second-row-for-mobile');
  });

  it('sollte Tastatureingaben in Custom-Header-Actions nicht verhindern', () => {
    const actionButton = fixture.debugElement.query(By.css('.lux-expansion-panel-header-custom button'));
    const keydownEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' });

    const eventWasNotPrevented = actionButton.nativeElement.dispatchEvent(keydownEvent);

    expect(eventWasNotPrevented).toBe(true);
    expect(keydownEvent.defaultPrevented).toBe(false);
  });

  it('sollte auch nicht-geslotteten Inhalt im Content-Bereich anzeigen', async () => {
    const plainFixture = TestBed.createComponent(LuxPanelAriaPlainContentTestComponent);
    plainFixture.detectChanges();
    await LuxTestHelper.wait(fixture);
    await LuxTestHelper.wait(fixture);
    plainFixture.detectChanges();

    const headerButton = plainFixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));
    headerButton.nativeElement.click();
    plainFixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    const content = plainFixture.debugElement.query(By.css('.lux-expansion-panel-content'));
    expect(content).toBeTruthy();
    expect(content.nativeElement.textContent).toContain('Fallback Content');
  });
});

describe('LuxPanelAriaComponent A11y', () => {
  let fixture: ComponentFixture<LuxPanelAriaTestComponent>;
  let testComponent: LuxPanelAriaTestComponent;

  beforeAll(() => {
    LuxA11yTestHelper.addA11yMatchers();
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        LuxAccordionAriaComponent,
        LuxPanelAriaComponent,
        LuxPanelAriaHeaderTitleComponent,
        LuxPanelAriaHeaderDescriptionComponent,
        LuxPanelAriaHeaderCustomComponent,
        LuxPanelAriaContentComponent,
        LuxPanelAriaTestComponent
      ]
    });

    fixture = TestBed.createComponent(LuxPanelAriaTestComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    await LuxTestHelper.wait(fixture);
    fixture.detectChanges();
  });

  it('Panel (kollabiert) hat keine Barrierefreiheitsverletzungen', async () => {
    await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
  });

  it('Panel (expandiert) hat keine Barrierefreiheitsverletzungen', async () => {
    const headerButton = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));
    headerButton.nativeElement.click();
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);
    await LuxTestHelper.wait(fixture);
    fixture.detectChanges();

    await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
  });

  it('Panel (disabled) hat keine Barrierefreiheitsverletzungen', async () => {
    testComponent.disabled.set(true);
    fixture.detectChanges();
    await LuxTestHelper.wait(fixture);

    await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
  });
});

@Component({
  selector: 'lux-panel-aria-test',
  standalone: true,
  imports: [
    LuxAccordionAriaComponent,
    LuxPanelAriaComponent,
    LuxPanelAriaHeaderTitleComponent,
    LuxPanelAriaHeaderDescriptionComponent,
    LuxPanelAriaHeaderCustomComponent,
    LuxPanelAriaContentComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lux-accordion-aria luxTogglePosition="before">
      <lux-panel-aria
        [luxExpanded]="expanded()"
        [luxDisabled]="disabled()"
        [luxHideToggle]="hideToggle()"
        [luxDynamicHeaderHeight]="dynamicHeaderHeight()"
        [luxSecondRowForMobile]="secondRowForMobile()"
        [luxTogglePosition]="togglePosition()"
        [luxStickyHeader]="stickyHeader()"
        [luxStickyHeaderOffset]="stickyHeaderOffset()"
        (luxExpandedChange)="expandedEvents.push($event)"
        (luxClickNotAllowed)="clickNotAllowedEvents.push($event)"
      >
        <lux-panel-aria-header-title [luxTruncated]="truncated()" [luxTruncatedTooltip]="truncatedTooltip"
          >Titel</lux-panel-aria-header-title
        >
        <lux-panel-aria-header-description [luxTruncated]="truncated()" [luxTruncatedTooltip]="truncatedTooltip"
          >Beschreibung</lux-panel-aria-header-description
        >
        <lux-panel-aria-header-custom>
          <button type="button">Aktion</button>
        </lux-panel-aria-header-custom>
        <lux-panel-aria-content>Content</lux-panel-aria-content>
      </lux-panel-aria>
    </lux-accordion-aria>
  `
})
class LuxPanelAriaTestComponent {
  expanded = signal(false);
  disabled = signal(false);
  hideToggle = signal(false);
  dynamicHeaderHeight = signal(false);
  secondRowForMobile = signal(false);
  stickyHeader = signal(false);
  stickyHeaderOffset = signal<string | undefined>(undefined);
  truncated = signal(false);
  truncatedTooltip = 'Tooltip';
  togglePosition = signal<'before' | 'after'>('after');
  expandedEvents: boolean[] = [];
  clickNotAllowedEvents: Event[] = [];
}

@Component({
  selector: 'lux-panel-aria-plain-content-test',
  standalone: true,
  imports: [LuxAccordionAriaComponent, LuxPanelAriaComponent, LuxPanelAriaHeaderTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lux-accordion-aria>
      <lux-panel-aria>
        <lux-panel-aria-header-title>Titel</lux-panel-aria-header-title>
        <p>Fallback Content</p>
      </lux-panel-aria>
    </lux-accordion-aria>
  `
})
class LuxPanelAriaPlainContentTestComponent {}

@Component({
  selector: 'lux-panel-aria-standalone-test',
  standalone: true,
  imports: [LuxPanelAriaComponent, LuxPanelAriaHeaderTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lux-panel-aria luxColor="warn">
      <lux-panel-aria-header-title>Titel</lux-panel-aria-header-title>
    </lux-panel-aria>
  `
})
class LuxPanelAriaStandaloneTestComponent {}

@Component({
  selector: 'lux-panel-aria-custom-header-test',
  standalone: true,
  imports: [
    LuxAccordionAriaComponent,
    LuxPanelAriaComponent,
    LuxPanelAriaHeaderTitleComponent,
    LuxPanelAriaHeaderCustomComponent,
    LuxPanelAriaContentComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lux-accordion-aria>
      <lux-panel-aria [luxTogglePosition]="'after'">
        <lux-panel-aria-header-title>Titel</lux-panel-aria-header-title>
        <lux-panel-aria-header-custom>
          <button type="button">Aktion</button>
        </lux-panel-aria-header-custom>
        <lux-panel-aria-content>Content</lux-panel-aria-content>
      </lux-panel-aria>
    </lux-accordion-aria>
  `
})
class LuxPanelAriaCustomHeaderTestComponent {}

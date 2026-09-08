// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxCardActionsComponent } from './lux-card-subcomponents/lux-card-actions.component';
import { LuxCardContentExpandedComponent } from './lux-card-subcomponents/lux-card-content-expanded.component';
import { LuxCardContentComponent } from './lux-card-subcomponents/lux-card-content.component';
import { LuxCardInfoComponent } from './lux-card-subcomponents/lux-card-info.component';
import { LuxCardComponent } from './lux-card.component';

describe('LuxCardComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  });

  describe('Attribut "luxExpanded"', () => {
    let fixture: ComponentFixture<LuxContentExpandedComponent>;
    let component: LuxContentExpandedComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxContentExpandedComponent);
      await LuxTestHelper.wait(fixture);
      component = fixture.componentInstance;
    });

    it('Two-Way-Binding testen', async () => {
      // Vorbedingungen testen
      expect(component.expanded).toBeFalsy();

      // Änderungen durchführen
      const toggleEl = fixture.debugElement.query(By.css('.lux-expanded-button button'));
      toggleEl.nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(component.expanded).toBeTruthy();

      // Änderungen durchführen
      toggleEl.nativeElement.click();

      // Nachbedingungen testen
      expect(component.expanded).toBeFalsy();
    });

    it('Event testen', async () => {
      // Vorbedingungen testen
      expect(component.expanded).toBeFalsy();
      const onExpandedSpy = vi.spyOn(component, 'onExpanded');

      // Änderungen durchführen
      const toggleEl = fixture.debugElement.query(By.css('.lux-expanded-button button'));
      toggleEl.nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(onExpandedSpy).toHaveBeenCalledTimes(1);

      // Änderungen durchführen
      toggleEl.nativeElement.click();

      // Nachbedingungen testen
      expect(onExpandedSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Ohne Card Action', () => {
    let fixture: ComponentFixture<NoCardActionComponent>;
    let testComponent: NoCardActionComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(NoCardActionComponent);
      await LuxTestHelper.wait(fixture);
      testComponent = fixture.componentInstance;
    });

    it('Style lux-cursor-pointer darf nicht gesetzt sein', async () => {
      const card = fixture.debugElement.query(By.css('.lux-cursor-pointer'));
      expect(card).toBeNull();
    });
  });

  describe('Mit Card Action', () => {
    let fixture: ComponentFixture<CardActionComponent>;
    let testComponent: CardActionComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(CardActionComponent);
      await LuxTestHelper.wait(fixture);
      testComponent = fixture.componentInstance;
    });

    it('Style lux-cursor-pointer muss gesetzt sein', async () => {
      const card = fixture.debugElement.query(By.css('.lux-cursor-pointer'));
      expect(card).not.toBeNull();
    });
  });

  describe('Erweiterbare Card mit einer Card-Action', () => {
    let fixture: ComponentFixture<ExpandedClickableCardComponent>;
    let component: ExpandedClickableCardComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(ExpandedClickableCardComponent);
      await LuxTestHelper.wait(fixture);
      component = fixture.componentInstance;
    });

    it('Click auf Toggle darf die Card-Action nicht auslösen', async () => {
      // Vorbedingungen testen
      const cardActionSpy = vi.spyOn(component, 'onCardClickedTest').mockReturnValue(undefined);
      const toggleEl = fixture.debugElement.query(By.css('.lux-expanded-button button'));
      expect(toggleEl).not.toBeNull();

      // Änderungen durchführen
      // 1. Durchlauf: Aufklappen
      toggleEl.nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(cardActionSpy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      // 2. Durchlauf: Zuklappen
      toggleEl.nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(cardActionSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('Card auf- und zuklappen', () => {
    let fixture: ComponentFixture<ExpandedCardComponent>;
    let component: ExpandedCardComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(ExpandedCardComponent);
      await LuxTestHelper.wait(fixture);
      component = fixture.componentInstance;
    });

    it('Card über die Component auf- und zuklappen', async () => {
      // Vorbedingungen testen
      let contentEl = fixture.debugElement.query(By.directive(LuxCardContentComponent));
      let expandedEl = fixture.debugElement.query(By.directive(LuxCardContentExpandedComponent));
      let toggleEl = fixture.debugElement.query(By.css('.lux-expanded-button'));
      expect(component.card().luxExpanded()).toBeFalsy();
      expect(contentEl).not.toBeNull();
      expect(contentEl.nativeElement.innerHTML).toEqual('Lorem ipsum');
      expect(expandedEl).toBeNull();
      expect(toggleEl.nativeElement.innerHTML).toContain('lux-interface-arrows-button-down');

      // Änderungen durchführen
      component.card().luxExpanded.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      contentEl = fixture.debugElement.query(By.directive(LuxCardContentComponent));
      expandedEl = fixture.debugElement.query(By.directive(LuxCardContentExpandedComponent));
      toggleEl = fixture.debugElement.query(By.css('.lux-expanded-button'));
      expect(component.card().luxExpanded()).toBeTruthy();
      expect(contentEl).not.toBeNull();
      expect(expandedEl).not.toBeNull();
      expect(expandedEl.nativeElement.innerHTML).toEqual('Lorem ipsum expanded');
      expect(toggleEl.nativeElement.innerHTML).toContain('lux-interface-arrows-button-up');

      // Änderungen durchführen
      component.card().luxExpanded.set(false);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      contentEl = fixture.debugElement.query(By.directive(LuxCardContentComponent));
      expandedEl = fixture.debugElement.query(By.directive(LuxCardContentExpandedComponent));
      toggleEl = fixture.debugElement.query(By.css('.lux-expanded-button'));
      expect(component.card().luxExpanded()).toBeFalsy();
      expect(contentEl.nativeElement.innerHTML).toEqual('Lorem ipsum');
      expect(expandedEl).toBeNull();
      expect(toggleEl.nativeElement.innerHTML).toContain('lux-interface-arrows-button-down');
    });

    it('Card über den Button auf- und zuklappen', async () => {
      // Vorbedingungen testen
      let contentEl = fixture.debugElement.query(By.directive(LuxCardContentComponent));
      let expandedEl = fixture.debugElement.query(By.directive(LuxCardContentExpandedComponent));
      let toggleEl = fixture.debugElement.query(By.css('.lux-expanded-button button'));
      expect(component.card().luxExpanded()).toBeFalsy();
      expect(contentEl).not.toBeNull();
      expect(contentEl.nativeElement.innerHTML).toEqual('Lorem ipsum');
      expect(expandedEl).toBeNull();
      expect(toggleEl.nativeElement.innerHTML).toContain('lux-interface-arrows-button-down');

      // Änderungen durchführen
      toggleEl.nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      contentEl = fixture.debugElement.query(By.directive(LuxCardContentComponent));
      expandedEl = fixture.debugElement.query(By.directive(LuxCardContentExpandedComponent));
      toggleEl = fixture.debugElement.query(By.css('.lux-expanded-button button'));
      expect(component.card().luxExpanded()).toBeTruthy();
      expect(contentEl).not.toBeNull();
      expect(expandedEl).not.toBeNull();
      expect(expandedEl.nativeElement.innerHTML).toEqual('Lorem ipsum expanded');
      expect(toggleEl.nativeElement.innerHTML).toContain('lux-interface-arrows-button-up');

      // Änderungen durchführen
      toggleEl.nativeElement.click();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      contentEl = fixture.debugElement.query(By.directive(LuxCardContentComponent));
      expandedEl = fixture.debugElement.query(By.directive(LuxCardContentExpandedComponent));
      toggleEl = fixture.debugElement.query(By.css('.lux-expanded-button'));
      expect(component.card().luxExpanded()).toBeFalsy();
      expect(contentEl.nativeElement.innerHTML).toEqual('Lorem ipsum');
      expect(expandedEl).toBeNull();
      expect(toggleEl.nativeElement.innerHTML).toContain('lux-interface-arrows-button-down');
    });
  });

  describe('Grundaufbau', () => {
    let fixture: ComponentFixture<MockCardComponent>;
    let component: MockCardComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(MockCardComponent);
      await LuxTestHelper.wait(fixture);
      component = fixture.componentInstance;
    });

    it('Sollte luxTitle und luxSubTitle darstellen', async () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.css('mat-card-header'))).toBeNull();

      // Änderungen durchführen
      component.title.set('Hallo');
      component.subTitle.set('Welt');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('mat-card-header'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('.lux-card-title')).nativeElement.textContent.trim()).toEqual('Hallo');
      expect(fixture.debugElement.query(By.css('.lux-card-subtitle')).nativeElement.textContent.trim()).toEqual('Welt');
    });

    it('Sollte mat-card-header nicht rendern, wenn luxTitle auf undefined gesetzt wird', async () => {
      // Vorbedingungen testen
      component.title.set('Hallo');
      await LuxTestHelper.wait(fixture);
      expect(fixture.debugElement.query(By.css('lux-card-heading h2.lux-display-none-important'))).toBeNull();
      expect(fixture.debugElement.query(By.css('lux-card-heading h2')).nativeElement.textContent.trim()).toEqual('Hallo');

      // Änderungen durchführen
      component.title.set(undefined);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('mat-card-header'))).toBeNull();
    });

    it('Sollte lux-card-title nicht ausblenden, wenn luxTitle undefined aber lux-card-info gesetzt ist', async () => {
      // Vorbedingungen testen
      component.title.set('Hallo');
      await LuxTestHelper.wait(fixture);
      expect(fixture.debugElement.query(By.css('lux-card-heading h2.lux-display-none-important'))).toBeNull();
      expect(fixture.debugElement.query(By.css('lux-card-heading h2')).nativeElement.textContent.trim()).toEqual('Hallo');

      // Änderungen durchführen
      component.testShowInfo.set(true);
      component.title.set(undefined);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('lux-card-heading h2.lux-display-none-important'))).toBeNull();
      expect(fixture.debugElement.query(By.css('lux-card-heading h2')).nativeElement.textContent.trim()).toEqual('');
    });

    it('Sollte mat-card-header nicht rendern, wenn luxSubTitle auf undefined gesetzt wird', async () => {
      // Vorbedingungen testen
      component.subTitle.set('Hallo');
      await LuxTestHelper.wait(fixture);
      expect(fixture.debugElement.query(By.css('.lux-card-subtitle.lux-display-none-important'))).toBeNull();

      // Änderungen durchführen
      component.subTitle.set(undefined);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('mat-card-header'))).toBeNull();
    });

    it('Sollte mat-card-actions ausblenden, wenn keine Actions gesetzt sind', async () => {
      // Vorbedingungen testen
      component.testShowAction.set(true);
      await LuxTestHelper.wait(fixture);
      expect(fixture.debugElement.query(By.css('.mat-mdc-card-actions.lux-display-none-important'))).toBeNull();

      // Änderungen durchführen
      component.testShowAction.set(false);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('.mat-mdc-card-actions.lux-display-none-important'))).not.toBeNull();
    });

    it('Sollte mat-card-header nicht rendern, wenn kein Header-Inhalt vorhanden ist', async () => {
      // Vorbedingungen testen
      component.title.set(undefined);
      component.subTitle.set(undefined);
      component.testShowIcon.set(false);
      component.testShowInfo.set(false);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('mat-card-header'))).toBeNull();
    });

    it('Sollte mat-card-header rendern, wenn luxTitle gesetzt ist', async () => {
      // Vorbedingungen testen
      expect(fixture.debugElement.query(By.css('mat-card-header'))).toBeNull();

      // Änderungen durchführen
      component.title.set('Titel');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(fixture.debugElement.query(By.css('mat-card-header'))).not.toBeNull();
    });

    it('Sollte Click-Events deaktivieren (luxDisabled)', async () => {
      // Vorbedingungen testen
      const spy = vi.spyOn(component, 'cardClicked').mockReturnValue(undefined);
      fixture.debugElement.query(By.css('mat-card')).nativeElement.click();
      await LuxTestHelper.wait(fixture);
      expect(spy).toHaveBeenCalledTimes(1);

      // Änderungen durchführen
      component.disabled.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      fixture.debugElement.query(By.css('mat-card')).nativeElement.click();
      await LuxTestHelper.wait(fixture);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});

@Component({
  template: `
    <lux-card luxTitle="Lorem ipsum">
      <lux-card-content> Lorem ipsum </lux-card-content>
    </lux-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxCardComponent, LuxCardContentComponent]
})
class NoCardActionComponent {}

@Component({
  template: `
    <lux-card luxTitle="Lorem ipsum" [luxClickable]="true" (luxClicked)="test()">
      <lux-card-content> Lorem ipsum </lux-card-content>
    </lux-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxCardComponent, LuxCardContentComponent]
})
class CardActionComponent {
  test() {}
}

@Component({
  template: `
    <lux-card luxTitle="Lorem ipsum">
      <lux-card-content>Lorem ipsum</lux-card-content>
      <lux-card-content-expanded>Lorem ipsum expanded</lux-card-content-expanded>
    </lux-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxCardComponent, LuxCardContentComponent, LuxCardContentExpandedComponent]
})
class ExpandedCardComponent {
  readonly card = viewChild.required(LuxCardComponent);
}

@Component({
  template: `
    <lux-card luxTitle="Lorem ipsum" (luxClicked)="onCardClickedTest()">
      <lux-card-content>Lorem ipsum</lux-card-content>
      <lux-card-content-expanded>Lorem ipsum expanded</lux-card-content-expanded>
    </lux-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxCardComponent, LuxCardContentComponent, LuxCardContentExpandedComponent]
})
class ExpandedClickableCardComponent {
  readonly card = viewChild.required(LuxCardComponent);

  onCardClickedTest() {}
}

@Component({
  template: `
    <lux-card luxTitle="Lorem ipsum" [(luxExpanded)]="expanded" (luxExpandedChange)="onExpanded($event)">
      <lux-card-content>Lorem ipsum</lux-card-content>
      <lux-card-content-expanded>Lorem ipsum expanded</lux-card-content-expanded>
    </lux-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxCardComponent, LuxCardContentComponent, LuxCardContentExpandedComponent]
})
class LuxContentExpandedComponent {
  expanded = false;

  readonly card = viewChild.required(LuxCardComponent);

  onExpanded(expanded: boolean) {}
}

@Component({
  template: `
    <lux-card [luxTitle]="title()" [luxSubTitle]="subTitle()" [luxDisabled]="disabled()" (luxClicked)="cardClicked()">
      @if (testShowIcon()) {
        <lux-icon luxIconName="lux-interface-validation-check"></lux-icon>
      }
      @if (testShowInfo()) {
        <lux-card-info>
          <span class="test-card-info">Card-Info</span>
        </lux-card-info>
      }
      <lux-card-content>
        <span class="test-card-content">Card-Content</span>
      </lux-card-content>
      @if (testShowAction()) {
        <lux-card-actions>
          <span class="test-card-action"></span>
        </lux-card-actions>
      }
    </lux-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxCardComponent, LuxCardContentComponent, LuxCardActionsComponent, LuxCardInfoComponent, LuxIconComponent]
})
class MockCardComponent {
  title = signal<string | undefined>(undefined);
  subTitle = signal<string | undefined>(undefined);
  disabled = signal<boolean | undefined>(undefined);

  testShowIcon = signal(false);
  testShowAction = signal(false);
  testShowInfo = signal(false);

  cardClicked() {}
}

import { Component } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxButtonComponent } from './lux-button.component';

describe('LuxButtonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLuxTranslocoTesting()]
    }).compileComponents();
  });

  describe('Attribut "luxClicked"', () => {
    let fixture: ComponentFixture<MockButtonComponent>;
    let testComponent: MockButtonComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockButtonComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Button (normal) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxClicked(fixture);
    }));

    it('Button (raised) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = true;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxClicked(fixture);
    }));

    it('Button (round)" anklicken', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = true;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxClicked(fixture);
    }));

    it('Button (flat) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = true;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxClicked(fixture);
    }));

    it('Button (stroked) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = true;
      fixture.detectChanges();

      Checker.checkLuxClicked(fixture);
    }));

    it('Button (stroked & rounded) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = true;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = true;
      fixture.detectChanges();

      Checker.checkLuxClicked(fixture);
    }));
  });

  describe('Attribut "luxDisabled"', () => {
    let fixture: ComponentFixture<MockButtonComponent>;
    let testComponent: MockButtonComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockButtonComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Button (normal) anklicken', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxDisabled(fixture);
    }));

    it('Button (raised) anklicken', fakeAsync(() => {
      fixture.componentInstance.raised = true;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxDisabled(fixture);
    }));

    it('Button (round) anklicken', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = true;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxDisabled(fixture);
    }));

    it('Button (flat) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = true;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxDisabled(fixture);
    }));

    it('Button (outlined) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = true;
      fixture.detectChanges();

      Checker.checkLuxDisabled(fixture);
    }));

    it('Button (outlined + rounded) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = true;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = true;
      fixture.detectChanges();

      Checker.checkLuxDisabled(fixture);
    }));
  });

  describe('Attribut "luxDisabledAria"', () => {
    let fixture: ComponentFixture<MockButtonComponent>;
    let testComponent: MockButtonComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockButtonComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('setzt aria-disabled nur bei Aktivierung', fakeAsync(() => {
      fixture.componentInstance.disabledAria = false;
      fixture.detectChanges();

      let buttonEl = fixture.debugElement.query(By.css('button'));
      expect(buttonEl.nativeElement.getAttribute('aria-disabled')).toBeNull();

      fixture.componentInstance.disabledAria = true;
      fixture.detectChanges();

      buttonEl = fixture.debugElement.query(By.css('button'));
      expect(buttonEl.nativeElement.getAttribute('aria-disabled')).toBe('true');
    }));

    it('emittiert luxClickNotAllowed und kein luxClicked', fakeAsync(() => {
      const onClickSpy = spyOn(fixture.componentInstance, 'onClick');
      const onClickNotAllowedSpy = spyOn(fixture.componentInstance, 'onClickNotAllowed');
      fixture.componentInstance.disabledAria = true;
      fixture.detectChanges();

      const buttonEl = fixture.debugElement.query(By.css('button'));
      buttonEl.nativeElement.click();
      fixture.detectChanges();

      expect(onClickSpy).not.toHaveBeenCalled();
      expect(onClickNotAllowedSpy).toHaveBeenCalled();
      discardPeriodicTasks();
    }));
  });

  describe('Attribut "luxLabel"', () => {
    let fixture: ComponentFixture<MockButtonLabelComponent>;
    let testComponent: MockButtonLabelComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockButtonLabelComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Button (normal)"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxLabel(fixture);
    }));

    it('Button (raised)"', fakeAsync(() => {
      fixture.componentInstance.raised = true;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxLabel(fixture);
    }));

    // Rounded Buttons haben keine Label mehr

    it('Button (flat) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = true;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxLabel(fixture);
    }));

    it('Button (outlined) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = true;
      fixture.detectChanges();

      Checker.checkLuxLabel(fixture);
    }));
  });

  describe('Attribut "luxLoading"', () => {
    let fixture: ComponentFixture<MockButtonLoadingComponent>;
    let testComponent: MockButtonLoadingComponent;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(MockButtonLoadingComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('Button (normal) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxLoading(fixture);
    }));

    it('Button (raised) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = true;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxLoading(fixture);
    }));

    it('Button (round)" anklicken', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = true;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxLoading(fixture);
    }));

    it('Button (flat) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = true;
      fixture.componentInstance.outlined = false;
      fixture.detectChanges();

      Checker.checkLuxLoading(fixture);
    }));

    it('Button (stroked) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = false;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = true;
      fixture.detectChanges();

      Checker.checkLuxLoading(fixture);
    }));

    it('Button (stroked & rounded) anklicken"', fakeAsync(() => {
      fixture.componentInstance.raised = false;
      fixture.componentInstance.round = true;
      fixture.componentInstance.flat = false;
      fixture.componentInstance.outlined = true;
      fixture.detectChanges();

      Checker.checkLuxLoading(fixture);
    }));
  });
});

class Checker {
  static checkLuxLabel(fixture: ComponentFixture<MockButtonLabelComponent>) {
    // Vorbedingungen testen
    const expectedLabel = 'Testbutton 123';
    expect(fixture.componentInstance.label).toEqual('');

    // Änderungen durchführen
    fixture.componentInstance.label = expectedLabel;
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('span[class~="lux-button-label"]'));
    fixture.detectChanges();

    // Nachbedingungen testen
    expect(fixture.componentInstance.label).toEqual(expectedLabel);
    expect(labelEl.nativeElement.innerHTML.trim()).toEqual(expectedLabel);
  }

  static checkLuxClicked(fixture: ComponentFixture<MockButtonComponent>) {
    // Vorbedingungen testen
    const onClickSpy = spyOn(fixture.componentInstance, 'onClick');
    expect(fixture.componentInstance.disabled).toBeFalse();

    // Änderungen durchführen
    fixture.componentInstance.disabled = false;
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();

    // Nachbedingungen testen
    expect(fixture.componentInstance.disabled).toBeFalsy();
    expect(buttonEl.nativeElement.disabled).toBeFalsy();
    expect(buttonEl.nativeElement.getAttribute('aria-label')).toContain('Lorem ipsum 4711');
    expect(onClickSpy).toHaveBeenCalled();
    discardPeriodicTasks();
  }

  static checkLuxDisabled(fixture: ComponentFixture<MockButtonComponent>) {
    // Vorbedingungen testen
    const onClickSpy = spyOn(fixture.componentInstance, 'onClick');
    expect(fixture.componentInstance.disabled).toBeFalse();

    // Änderungen durchführen
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();

    // Nachbedingungen testen
    expect(fixture.componentInstance.disabled).toBeTruthy();
    expect(buttonEl.nativeElement.disabled).toBeTruthy();
    expect(buttonEl.nativeElement.getAttribute('aria-label')).toContain('Lorem ipsum 4711');
    expect(onClickSpy).not.toHaveBeenCalled();
  }

  static checkLuxLoading(fixture: ComponentFixture<MockButtonLoadingComponent>) {
    // Vorbedingungen testen
    const onClickSpy = spyOn(fixture.componentInstance, 'onClick');
    const buttonLoadingEl = fixture.debugElement.query(By.css('lux-progress'));
    expect(buttonLoadingEl).toBeNull();

    // Änderungen durchführen
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();

    // Nachbedingungen testen
    const buttonLoadingChangeEl = fixture.debugElement.query(By.css('lux-progress'));
    expect(buttonLoadingChangeEl).not.toBeNull();
    expect(onClickSpy).toHaveBeenCalled();
    discardPeriodicTasks();
  }
}

@Component({
  template: `
    <lux-button
      luxLabel="Lorem ipsum 4711"
      [luxDisabled]="disabled"
      [luxDisabledAria]="disabledAria"
      (luxClicked)="onClick()"
      (luxClickNotAllowed)="onClickNotAllowed()"
      [luxRounded]="round"
      [luxRaised]="raised"
      [luxFlat]="flat"
      [luxStroked]="outlined"
    ></lux-button>
  `,
  imports: [LuxButtonComponent]
})
class MockButtonComponent {
  disabled = false;
  disabledAria = false;
  round = false;
  raised = false;
  flat = false;
  outlined = false;

  onClick() {}
  onClickNotAllowed() {}
}

@Component({
  template: `
    <lux-button
      [luxLabel]="label"
      [luxDisabled]="disabled"
      (luxClicked)="onClick()"
      [luxRounded]="round"
      [luxRaised]="raised"
      [luxFlat]="flat"
      [luxStroked]="outlined"
    ></lux-button>
  `,
  imports: [LuxButtonComponent]
})
class MockButtonLabelComponent {
  disabled = false;
  round = false;
  raised = false;
  label = '';
  flat = false;
  outlined = false;

  onClick() {}
}

@Component({
  template: `
    <lux-button
      [luxLabel]="label"
      [luxDisabled]="disabled"
      (luxClicked)="onClick()"
      [luxRounded]="round"
      [luxRaised]="raised"
      [luxFlat]="flat"
      [luxStroked]="outlined"
      [luxLoading]="loading"
    ></lux-button>
  `,
  imports: [LuxButtonComponent]
})
class MockButtonLoadingComponent {
  disabled = false;
  round = false;
  raised = false;
  label = '';
  flat = false;
  outlined = false;
  loading = false;

  onClick() {}
}

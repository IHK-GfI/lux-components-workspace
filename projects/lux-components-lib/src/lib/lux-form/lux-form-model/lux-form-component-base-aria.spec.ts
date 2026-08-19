import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxFormLabelComponent } from '../lux-form-control/lux-form-control-subcomponents/lux-form-label.component';
import { LuxInputAcComponent } from '../lux-input-ac/lux-input-ac.component';

describe('LuxFormComponentBase - Namenskaskade (labelledBy)', () => {
  let fixture: ComponentFixture<AriaBaseTestComponent>;
  let testComponent: AriaBaseTestComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AriaBaseTestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('liefert luxAriaLabelledby, wenn gesetzt (höchste Priorität)', () => {
    testComponent.input.luxAriaLabelledby = 'externes-label-id';
    testComponent.input.luxAriaLabel = 'Suche';
    expect(testComponent.input.labelledBy()).toBe('externes-label-id');
  });

  it('liefert undefined, wenn nur luxAriaLabel gesetzt ist (aria-label soll greifen)', () => {
    testComponent.input.luxAriaLabel = 'Suche';
    expect(testComponent.input.labelledBy()).toBeUndefined();
  });

  it('liefert uid + "-label", wenn nur luxLabel gesetzt ist', () => {
    expect(testComponent.input.labelledBy()).toBe(testComponent.input.uid + '-label');
  });

  it('liefert undefined, wenn weder Label noch Aria-Inputs gesetzt sind', () => {
    testComponent.input.luxLabel = '';
    expect(testComponent.input.labelledBy()).toBeUndefined();
  });

  it('liefert uid + "-label" bei projiziertem lux-form-label ohne luxLabel/Aria-Inputs', () => {
    const projectedFixture = TestBed.createComponent(ProjectedLabelOnlyTestComponent);
    projectedFixture.detectChanges();
    const input = projectedFixture.componentInstance.input;

    expect(input.labelledBy()).toBe(input.uid + '-label');
  });
});

@Component({
  imports: [LuxInputAcComponent],
  template: `<lux-input-ac luxLabel="Nachname"></lux-input-ac>`
})
class AriaBaseTestComponent {
  @ViewChild(LuxInputAcComponent, { static: true }) input!: LuxInputAcComponent;
}

@Component({
  imports: [LuxInputAcComponent, LuxFormLabelComponent],
  template: `<lux-input-ac><lux-form-label>Nachname</lux-form-label></lux-input-ac>`
})
class ProjectedLabelOnlyTestComponent {
  @ViewChild(LuxInputAcComponent, { static: true }) input!: LuxInputAcComponent;
}

describe('LuxFormComponentBase - Dev-Warnungen (checkA11yName)', () => {
  let warnSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    const consoleService = TestBed.inject(LuxConsoleService);
    warnSpy = jasmine.createSpy('warn');
    spyOnProperty(consoleService, 'warn', 'get').and.returnValue(warnSpy);
  });

  it('warnt, wenn ein Control keinerlei zugänglichen Namen hat', fakeAsync(() => {
    const fixture = TestBed.createComponent(NoNameTestComponent);
    fixture.detectChanges();
    tick();

    expect(warnSpy).toHaveBeenCalledWith(jasmine.stringContaining('keinen zugänglichen Namen'));
  }));

  it('warnt bei sichtbarem Label plus abweichendem luxAriaLabel (WCAG 2.5.3)', fakeAsync(() => {
    const fixture = TestBed.createComponent(ConflictingNameTestComponent);
    fixture.detectChanges();
    tick();

    expect(warnSpy).toHaveBeenCalledWith(jasmine.stringContaining('2.5.3'));
  }));

  it('warnt nicht, wenn luxLabel gesetzt ist', fakeAsync(() => {
    const fixture = TestBed.createComponent(AriaBaseTestComponent);
    fixture.detectChanges();
    tick();

    expect(warnSpy).not.toHaveBeenCalled();
  }));

  it('warnt nicht, wenn nur luxAriaLabel gesetzt ist', fakeAsync(() => {
    const fixture = TestBed.createComponent(AriaOnlyTestComponent);
    fixture.detectChanges();
    tick();

    expect(warnSpy).not.toHaveBeenCalled();
  }));

  it('warnt nicht bei projiziertem lux-form-label plus luxAriaLabel (Text hier nicht auslesbar)', fakeAsync(() => {
    const fixture = TestBed.createComponent(ProjectedLabelTestComponent);
    fixture.detectChanges();
    tick();

    expect(warnSpy).not.toHaveBeenCalled();
  }));
});

@Component({
  imports: [LuxInputAcComponent],
  template: `<lux-input-ac></lux-input-ac>`
})
class NoNameTestComponent {}

@Component({
  imports: [LuxInputAcComponent],
  template: `<lux-input-ac luxLabel="Nachname" luxAriaLabel="Familienname"></lux-input-ac>`
})
class ConflictingNameTestComponent {}

@Component({
  imports: [LuxInputAcComponent],
  template: `<lux-input-ac luxAriaLabel="Suchbegriff eingeben"></lux-input-ac>`
})
class AriaOnlyTestComponent {}

@Component({
  imports: [LuxInputAcComponent, LuxFormLabelComponent],
  template: `<lux-input-ac luxAriaLabel="Familienname"><lux-form-label>Nachname</lux-form-label></lux-input-ac>`
})
class ProjectedLabelTestComponent {}

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';
import { LuxLinkComponent } from './lux-link.component';

describe('LuxLinkComponent', () => {
  let fixture: ComponentFixture<MockLinkComponent>;
  let component: MockLinkComponent;
  let linkComponent: LuxLinkComponent;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(MockLinkComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    linkComponent = fixture.debugElement.query(By.directive(LuxLinkComponent)).componentInstance;
    router = TestBed.inject(Router);
  });

  it('Sollte erstellt werden', async () => {
    expect(component).toBeDefined();
  });

  it('Sollte das Label darstellen', async () => {
    // Vorbedingungen testen
    let label = fixture.debugElement.query(By.css('.lux-button-label'));
    expect(label).toBeNull();

    // Änderungen durchführen
    component.label.set('Ein Label sie zu knechten');
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    label = fixture.debugElement.query(By.css('.lux-button-label'));
    expect(label.nativeElement.textContent.trim()).toEqual('Ein Label sie zu knechten');
  });

  it('Sollte das Icon darstellen', async () => {
    // Vorbedingungen testen
    let icon = fixture.debugElement.query(By.css('lux-icon'));
    expect(icon).toBeNull();

    // Änderungen durchführen
    component.iconName.set('lux-programming-bug');
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    icon = fixture.debugElement.query(By.css('lux-icon'));
    expect(icon).not.toBeNull();
  });

  it('Sollte deaktiviert werden', async () => {
    // Vorbedingungen testen
    let disabled = fixture.debugElement.query(By.css('a[disabled="true"]'));
    expect(disabled).toBeNull();

    // Änderungen durchführen
    component.disabled.set(true);
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    disabled = fixture.debugElement.query(By.css('a[disabled="true"]'));
    expect(disabled).not.toBeNull();
  });

  it('Sollte raised dargestellt werden', async () => {
    // Vorbedingungen testen
    let raised = fixture.debugElement.query(By.css('.mat-mdc-raised-button'));
    expect(raised).toBeNull();

    // Änderungen durchführen
    component.raised.set(true);
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    raised = fixture.debugElement.query(By.css('.mat-mdc-raised-button'));
    expect(raised).not.toBeNull();
  });

  it('Sollte den (internen) href aufrufen', async () => {
    // Vorbedingungen testen
    const spy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(false));
    expect(spy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen
    component.href.set('/mock-route');
    await LuxTestHelper.wait(fixture);

    const link = fixture.debugElement.query(By.css('a'));
    link.triggerEventHandler('click', { preventDefault: () => {} });
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/mock-route']);
  });

  it('Sollte den (internen) href per Enter-Taste aufrufen', async () => {
    // Vorbedingungen testen
    const spy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(false));
    expect(spy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen
    component.href.set('/mock-route');
    await LuxTestHelper.wait(fixture);

    const link = fixture.debugElement.query(By.css('a'));
    link.triggerEventHandler('keydown.enter', new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/mock-route']);
  });

  it('Sollte bei deaktiviertem Link per Enter-Taste nicht navigieren', async () => {
    // Vorbedingungen testen
    const spy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(false));
    const clickedSpy = vi.fn().mockName('luxClicked');
    expect(spy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen
    component.href.set('/mock-route');
    component.disabled.set(true);
    await LuxTestHelper.wait(fixture);

    const sub = linkComponent.luxClicked.subscribe(clickedSpy);
    const link = fixture.debugElement.query(By.css('a'));
    link.triggerEventHandler('keydown.enter', new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen: kein Navigate, kein luxClicked
    expect(spy).toHaveBeenCalledTimes(0);
    expect(clickedSpy).toHaveBeenCalledTimes(0);

    sub.unsubscribe();
  });

  it('Sollte bei deaktiviertem Link per Space-Taste nicht navigieren', async () => {
    // Vorbedingungen testen
    const spy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(false));
    const clickedSpy = vi.fn().mockName('luxClicked');
    expect(spy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen
    component.href.set('/mock-route');
    component.disabled.set(true);
    await LuxTestHelper.wait(fixture);

    const sub = linkComponent.luxClicked.subscribe(clickedSpy);
    const link = fixture.debugElement.query(By.css('a'));
    link.triggerEventHandler('keydown.space', new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen: kein Navigate, kein luxClicked
    expect(spy).toHaveBeenCalledTimes(0);
    expect(clickedSpy).toHaveBeenCalledTimes(0);

    sub.unsubscribe();
  });

  it('Sollte den (externen) href aufrufen', async () => {
    // Vorbedingungen testen
    const spy = vi.spyOn(window, 'open').mockReturnValue(null).mockClear();
    expect(spy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen [mit HTTP]
    component.href.set('http://mock-route');
    await LuxTestHelper.wait(fixture);

    const link = fixture.debugElement.query(By.css('a'));
    link.triggerEventHandler('click', { preventDefault: () => {} });
    await LuxTestHelper.wait(fixture, LuxComponentsConfigService.DEFAULT_CONFIG.buttonConfiguration.throttleTimeMs);

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('http://mock-route', '_self');

    // Änderungen durchführen [mit HTTPS]
    component.href.set('https://mock-route');
    await LuxTestHelper.wait(fixture);

    link.triggerEventHandler('click', { preventDefault: () => {} });
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('http://mock-route', '_self');
  });

  it('Sollte den (externen) href in einem neuen Tab aufrufen', async () => {
    // Vorbedingungen testen
    // mockClear() zusätzlich zu vi.restoreAllMocks() (test-setup.ts): unter isolate:false (Default
    // dieses Vitest-Runners, siehe Angular-Builder) kann window.open bereits durch einen anderen
    // Test wieder gemockt worden sein, bevor dessen eigener Klick-Handler tatsächlich feuert.
    const spy = vi
      .spyOn(window, 'open')
      .mockImplementation(() => null)
      .mockClear();
    expect(spy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen
    component.blank.set(true);
    component.href.set('http://mock-route');
    await LuxTestHelper.wait(fixture);

    const link = fixture.debugElement.query(By.css('a'));
    link.triggerEventHandler('click', new MouseEvent('click', { bubbles: true, cancelable: true }));
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('http://mock-route', '_blank', 'noopener,noreferrer');
  });

  it('Sollte den (internen) href in einem neuen Tab ohne Opener-Referenz aufrufen', async () => {
    // Vorbedingungen testen
    const spy = vi
      .spyOn(window, 'open')
      .mockImplementation(() => null)
      .mockClear();
    expect(spy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen
    component.blank.set(true);
    component.href.set('/mock-route');
    await LuxTestHelper.wait(fixture);

    const link = fixture.debugElement.query(By.css('a'));
    link.triggerEventHandler('click', new MouseEvent('click', { bubbles: true, cancelable: true }));
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/\/mock-route$/), '_blank', 'noopener,noreferrer');
  });

  it('Sollte bei luxBlank das rel-Attribut "noopener noreferrer" am Anker setzen', async () => {
    // Vorbedingungen testen
    let link = fixture.debugElement.query(By.css('a'));
    expect(link.nativeElement.getAttribute('rel')).toBeNull();

    // Änderungen durchführen
    component.blank.set(true);
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    link = fixture.debugElement.query(By.css('a'));
    expect(link.nativeElement.getAttribute('rel')).toEqual('noopener noreferrer');
  });

  it('Sollte die Farbe anpassen', async () => {
    // Vorbedingungen testen
    let color = fixture.debugElement.query(By.css('a.mat-unthemed'));
    expect(color).not.toBeNull();

    // Änderungen durchführen
    component.color.set('primary');
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    color = fixture.debugElement.query(By.css('a.mat-primary'));
    expect(color).not.toBeNull();

    // Änderungen durchführen
    component.color.set('warn');
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    color = fixture.debugElement.query(By.css('a.mat-warn'));
    expect(color).not.toBeNull();

    // Änderungen durchführen
    component.color.set('accent');
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    color = fixture.debugElement.query(By.css('a.mat-accent'));
    expect(color).not.toBeNull();
  });
});

@Component({
  selector: 'lux-mock-link',
  imports: [LuxLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lux-link
      [luxLabel]="label()"
      [luxRaised]="raised()"
      [luxIconName]="iconName()"
      [luxDisabled]="disabled()"
      [luxBlank]="blank()"
      [luxHref]="href()"
      [luxColor]="color()"
    >
    </lux-link>
  `
})
class MockLinkComponent {
  label = signal('');
  raised = signal(false);
  iconName = signal('');
  disabled = signal(false);
  blank = signal(false);
  href = signal('');
  color = signal<LuxThemePalette | undefined>(undefined);
}

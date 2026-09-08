import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';
import { LuxLinkPlainComponent } from './lux-link-plain.component';

describe('LuxLinkPlainComponent', () => {
  let fixture: ComponentFixture<MockLinkPlainComponent>;
  let component: MockLinkPlainComponent;
  let linkComponent: LuxLinkPlainComponent;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(MockLinkPlainComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    linkComponent = fixture.debugElement.query(By.directive(LuxLinkPlainComponent)).componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Sollte das Label darstellen', async () => {
    // Vorbedingungen prüfen
    let label = fixture.debugElement.query(By.css('.lux-link-plain-text'));
    expect(label.nativeElement.textContent.trim()).toEqual('');

    // Änderungen durchführen
    component.label.set('Ein Label sie zu knechten');
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    label = fixture.debugElement.query(By.css('.lux-link-plain-text'));
    expect(label.nativeElement.textContent.trim()).toEqual('Ein Label sie zu knechten');
  });

  it('Sollte das Icon darstellen', async () => {
    // Vorbedingungen prüfen
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
    // Vorbedingungen prüfen
    let disabled = fixture.debugElement.query(By.css('.lux-disabled'));
    expect(disabled).toBeNull();

    // Änderungen durchführen
    component.disabled.set(true);
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    disabled = fixture.debugElement.query(By.css('.lux-disabled'));
    expect(disabled).not.toBeNull();
  });

  it('Sollte den (internen) href aufrufen', async () => {
    // Vorbedingungen prüfen
    const spy = vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(false));
    expect(spy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen
    component.href.set('/mock-route');
    await LuxTestHelper.wait(fixture);

    const link = fixture.debugElement.query(By.css('.link-wrapper'));
    link.triggerEventHandler('click', new MouseEvent('click', { bubbles: true, cancelable: true }));
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['/mock-route']);
  });

  it('Sollte den (externen) href aufrufen', async () => {
    // Vorbedingungen prüfen
    const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
    expect(spy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen  [mit HTTP]
    component.href.set('http://mock-route');
    await LuxTestHelper.wait(fixture);

    const link = fixture.debugElement.query(By.css('.link-wrapper'));
    link.triggerEventHandler('click', new MouseEvent('click', { bubbles: true, cancelable: true }));
    await LuxTestHelper.wait(fixture, LuxComponentsConfigService.DEFAULT_CONFIG.buttonConfiguration.throttleTimeMs);

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('http://mock-route', '_self');

    // Änderungen durchführen [mit HTTPS]
    component.href.set('https://mock-route');
    await LuxTestHelper.wait(fixture);

    link.triggerEventHandler('click', new MouseEvent('click', { bubbles: true, cancelable: true }));
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('http://mock-route', '_self');
  });

  it('Sollte den (externen) href in einem neuen Tab aufrufen', async () => {
    // Vorbedingungen prüfen
    const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
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
    // Vorbedingungen prüfen
    const spy = vi.spyOn(window, 'open').mockImplementation(() => null);
    expect(spy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen
    component.blank.set(true);
    component.href.set('/mock-route');
    await LuxTestHelper.wait(fixture);

    const link = fixture.debugElement.query(By.css('.link-wrapper'));
    link.triggerEventHandler('click', new MouseEvent('click', { bubbles: true, cancelable: true }));
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/\/mock-route$/), '_blank', 'noopener,noreferrer');
  });

  it('Sollte bei luxBlank das rel-Attribut "noopener noreferrer" am Anker setzen', async () => {
    // Vorbedingungen prüfen
    let link = fixture.debugElement.query(By.css('.link-wrapper'));
    expect(link.nativeElement.getAttribute('rel')).toBeNull();

    // Änderungen durchführen
    component.blank.set(true);
    await LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    link = fixture.debugElement.query(By.css('.link-wrapper'));
    expect(link.nativeElement.getAttribute('rel')).toEqual('noopener noreferrer');
  });
});

@Component({
  template: `
    <lux-link-plain
      [luxLabel]="label()"
      [luxIconName]="iconName()"
      [luxDisabled]="disabled()"
      [luxBlank]="blank()"
      [luxHref]="href()"
      [luxColor]="color()"
    >
    </lux-link-plain>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxLinkPlainComponent]
})
class MockLinkPlainComponent {
  label = signal('');
  raised = signal(false);
  iconName = signal('');
  disabled = signal(false);
  blank = signal(false);
  href = signal('');
  color = signal<LuxThemePalette | undefined>(undefined);
}

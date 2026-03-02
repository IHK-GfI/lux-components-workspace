import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuxBreadcrumbComponent } from './lux-breadcrumb.component';

describe('LuxBreadcrumbComponent', () => {
  let component: LuxBreadcrumbComponent;
  let fixture: ComponentFixture<LuxBreadcrumbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LuxBreadcrumbComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(LuxBreadcrumbComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`luxEntries has default value`, () => {
    expect(component.luxEntries).toEqual([]);
  });

  it('renders all entries by default', () => {
    component.luxEntries = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(3);
    expect(fixture.nativeElement.textContent).toContain('A');
    expect(fixture.nativeElement.textContent).toContain('B');
    expect(fixture.nativeElement.textContent).toContain('C');
  });

  it('adds wrap class when luxWrap is true', () => {
    component.luxWrap = true;
    component.luxEntries = [{ name: 'A' }, { name: 'B' }];
    fixture.detectChanges();

    const container: HTMLElement | null = fixture.nativeElement.querySelector('ol.lux-breadcrumb-container');
    expect(container).toBeTruthy();
    expect(container!.classList.contains('lux-breadcrumb-container-wrap')).toBeTrue();
  });

  it('collapses middle entries when luxShowOnlyFirstAndLast is true', () => {
    component.luxShowOnlyFirstAndLast = true;
    component.luxEntries = [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }];
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(4);

    expect(fixture.nativeElement.textContent).toContain('A');
    expect(fixture.nativeElement.textContent).toContain('D');
    expect(fixture.nativeElement.textContent).not.toContain('B');
    expect(fixture.nativeElement.textContent).not.toContain('C');

    const dottedLinks: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('.lux-breadcrumb-item-dotted a');
    expect(dottedLinks.length).toBe(2);
    expect(dottedLinks[0].textContent?.trim()).toBe('...');
    expect(dottedLinks[0].getAttribute('aria-label')).toBe('B');
    expect(dottedLinks[1].textContent?.trim()).toBe('...');
    expect(dottedLinks[1].getAttribute('aria-label')).toBe('C');

    expect(fixture.nativeElement.querySelector('.lux-breadcrumb-ellipsis-item')).toBeNull();

    const icons = fixture.nativeElement.querySelectorAll('lux-icon');
    expect(icons.length).toBe(3);
  });

  it('emits click for the first entry in collapsed mode', () => {
    component.luxShowOnlyFirstAndLast = true;
    component.luxEntries = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
    fixture.detectChanges();

    const spy = spyOn(component.luxClicked, 'emit');
    const firstLink: HTMLElement | null = fixture.nativeElement.querySelector('.lux-breadcrumb-item a');
    expect(firstLink).toBeTruthy();

    firstLink!.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ name: 'A' });
    expect(fixture.nativeElement.querySelector('.lux-breadcrumb-ellipsis-item')).toBeNull();
  });

  it('emits click for a middle entry in collapsed mode', () => {
    component.luxShowOnlyFirstAndLast = true;
    component.luxEntries = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
    fixture.detectChanges();

    const spy = spyOn(component.luxClicked, 'emit');
    const dottedLink: HTMLElement | null = fixture.nativeElement.querySelector('.lux-breadcrumb-item-dotted a');
    expect(dottedLink).toBeTruthy();

    dottedLink!.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ name: 'B' });
  });
});

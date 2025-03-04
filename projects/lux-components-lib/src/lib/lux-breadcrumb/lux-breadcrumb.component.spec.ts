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
});

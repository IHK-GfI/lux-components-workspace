import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  LuxActionModule,
  LuxAppFooterButtonService,
  LuxAppFooterLinkService,
  LuxComponentsConfigModule,
  LuxComponentsConfigParameters,
  LuxFormModule,
  LuxLayoutModule,
  LuxStorageService
} from '@ihk-gfi/lux-components';

import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  const luxComponentsConfig: LuxComponentsConfigParameters = {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent],
      imports: [
        LuxLayoutModule,
        LuxActionModule,
        LuxFormModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        LuxComponentsConfigModule.forRoot(luxComponentsConfig),
        NoopAnimationsModule
      ],
      providers: [LuxAppFooterButtonService, LuxAppFooterLinkService, LuxStorageService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

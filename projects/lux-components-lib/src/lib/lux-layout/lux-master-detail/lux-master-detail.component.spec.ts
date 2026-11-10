import { describe, it, beforeEach, expect } from 'vitest';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxDetailViewComponent } from './lux-detail-view/lux-detail-view.component';
import { LuxMasterDetailComponent } from './lux-master-detail.component';

@Component({
  template: `
    <lux-master-detail [luxMasterIsLoading]="loading()">
      <lux-detail-view>
        <ng-template>Detail</ng-template>
      </lux-detail-view>
    </lux-master-detail>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxMasterDetailComponent, LuxDetailViewComponent]
})
class MockMasterDetailComponent {
  readonly loading = signal(false);
}

describe('LuxMasterDetailComponent', () => {
  let fixture: ComponentFixture<MockMasterDetailComponent>;

  // Über die Query statt das DOM, weil lux-list den Spinner bei leerer Liste nicht einhängt.
  const spinnerContainer = (): HTMLElement =>
    fixture.debugElement.query(By.directive(LuxMasterDetailComponent)).componentInstance.masterSpinnerCard().nativeElement;

  const setLoading = async (loading: boolean) => {
    fixture.componentInstance.loading.set(loading);
    await LuxTestHelper.wait(fixture);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting(), provideLuxTranslocoTesting()]
    });
    fixture = TestBed.createComponent(MockMasterDetailComponent);
  });

  describe('Einblenden des Lade-Spinners', () => {
    it('Sollte beim ersten Rendern mit luxMasterIsLoading=true nicht einblenden', async () => {
      await setLoading(true);

      expect(spinnerContainer().classList).not.toContain('lux-spinner-hidden');
      expect(spinnerContainer().classList).not.toContain('lux-spinner-fade-in');
    });

    it('Sollte beim Wechsel von false auf true einblenden', async () => {
      await setLoading(false);
      expect(spinnerContainer().classList).toContain('lux-spinner-hidden');

      await setLoading(true);

      expect(spinnerContainer().classList).not.toContain('lux-spinner-hidden');
      expect(spinnerContainer().classList).toContain('lux-spinner-fade-in');
    });

    it('Sollte nach dem Laden wieder ausblenden', async () => {
      await setLoading(false);
      await setLoading(true);

      await setLoading(false);

      expect(spinnerContainer().classList).toContain('lux-spinner-hidden');
      expect(spinnerContainer().classList).not.toContain('lux-spinner-fade-in');
    });
  });
});

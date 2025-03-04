// noinspection DuplicatedCode

import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { LuxTestHelper } from '../lux-util/testing/lux-test-helper';
import { LUX_FILE_PREVIEW_DATA } from './lux-file-preview-config';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LuxFilePreviewRef } from '../lux-file-preview/lux-file-preview-ref';
import { LuxFilePreviewComponent } from './lux-file-preview.component';
import { LuxFilePreviewService } from './lux-file-preview.service';

describe('LuxFilePreviewComponent', () => {
  let component: LuxFilePreviewComponent;
  let fixture: ComponentFixture<LuxFilePreviewComponent>;
  const previewData = { fileComponent: null, fileObject: { type: 'application/pdf' } };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule, PortalModule, LuxFilePreviewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        LuxFilePreviewService,
        { provide: LUX_FILE_PREVIEW_DATA, useValue: previewData },
        { provide: LuxFilePreviewRef, useClass: MockLuxFilePreviewRef }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuxFilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', inject([OverlayContainer, Platform], () => {
    expect(component).toBeTruthy();
  }));

  it('Sollte den PDF-Viewer anzeigen', fakeAsync(
    inject([LuxFilePreviewService, OverlayContainer, Platform], (previewService: LuxFilePreviewService, oc: OverlayContainer) => {
      // Vorbedingungen testen
      expect(oc.getContainerElement().querySelector('lux-file-preview')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-pdfviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-imgviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-notsupportedviewer')).toBeNull();

      // Änderungen durchführen
      const previewRef = previewService.open({
        previewData: {
          fileComponent: undefined,
          fileObject: { name: 'testfile.pdf', content: 'data:application/pdf;base64,abc', type: 'application/pdf' }
        }
      });
      LuxTestHelper.wait(fixture);

      expect(oc.getContainerElement().querySelector('lux-file-preview')).toBeDefined();
      expect(oc.getContainerElement().querySelector('lux-file-preview-pdfviewer')).toBeDefined();
      expect(oc.getContainerElement().querySelector('lux-file-preview-imgviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-notsupportedviewer')).toBeNull();

      previewRef.close();
      LuxTestHelper.wait(fixture);
      flush();

      // Nachbedingungen testen
      expect(oc.getContainerElement().querySelector('lux-file-preview')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-pdfviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-imgviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-notsupportedviewer')).toBeNull();
    })
  ));

  it('Sollte den Img-Viewer anzeigen', fakeAsync(
    inject([LuxFilePreviewService, OverlayContainer, Platform], (previewService: LuxFilePreviewService, oc: OverlayContainer) => {
      // Vorbedingungen testen
      expect(oc.getContainerElement().querySelector('lux-file-preview')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-pdfviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-imgviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-notsupportedviewer')).toBeNull();

      // Änderungen durchführen
      const previewRef = previewService.open({
        previewData: {
          fileComponent: undefined,
          fileObject: { name: 'testfile.png', content: 'data:image/png;base64,abc', type: 'image/png' }
        }
      });
      LuxTestHelper.wait(fixture);

      expect(oc.getContainerElement().querySelector('lux-file-preview')).toBeDefined();
      expect(oc.getContainerElement().querySelector('lux-file-preview-pdfviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-imgviewer')).toBeDefined();
      expect(oc.getContainerElement().querySelector('lux-file-preview-notsupportedviewer')).toBeNull();

      previewRef.close();
      LuxTestHelper.wait(fixture);
      flush();

      // Nachbedingungen testen
      expect(oc.getContainerElement().querySelector('lux-file-preview')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-pdfviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-imgviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-notsupportedviewer')).toBeNull();
    })
  ));

  it('Sollte den NotSupported-Viewer anzeigen', fakeAsync(
    inject([LuxFilePreviewService, OverlayContainer, Platform], (previewService: LuxFilePreviewService, oc: OverlayContainer) => {
      // Vorbedingungen testen
      expect(oc.getContainerElement().querySelector('lux-file-preview')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-pdfviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-imgviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-notsupportedviewer')).toBeNull();

      // Änderungen durchführen
      const previewRef = previewService.open({
        previewData: {
          fileComponent: undefined,
          fileObject: { name: 'testfile.abc', content: 'data:ne/abc;base64,abc', type: 'ne/abc' }
        }
      });
      LuxTestHelper.wait(fixture);

      expect(oc.getContainerElement().querySelector('lux-file-preview')).toBeDefined();
      expect(oc.getContainerElement().querySelector('lux-file-preview-pdfviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-imgviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-notsupportedviewer')).toBeDefined();

      previewRef.close();
      LuxTestHelper.wait(fixture);
      flush();

      // Nachbedingungen testen
      expect(oc.getContainerElement().querySelector('lux-file-preview')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-pdfviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-imgviewer')).toBeNull();
      expect(oc.getContainerElement().querySelector('lux-file-preview-notsupportedviewer')).toBeNull();
    })
  ));
});

class MockLuxFilePreviewRef {
  close() {}
}

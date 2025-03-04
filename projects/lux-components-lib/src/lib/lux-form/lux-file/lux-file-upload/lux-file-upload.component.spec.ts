import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuxConsoleService } from '../../../lux-util/lux-console.service';
import { LuxStorageService } from '../../../lux-util/lux-storage.service';
import { LuxFileUploadComponent } from './lux-file-upload.component';

describe('LuxFileUploadComponent', () => {
  let component: LuxFileUploadComponent;
  let fixture: ComponentFixture<LuxFileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        LuxConsoleService,
        {
          provide: LuxStorageService,
          useClass: MockStorage
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LuxFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class MockStorage {
  getItem(key: string): string {
    return '';
  }

  setItem(key: string, value: string, sensitive: boolean) {}
}

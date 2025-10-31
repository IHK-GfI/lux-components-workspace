import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, Injectable } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxLookupParameters } from '../lux-lookup-model/lux-lookup-parameters';
import { LuxLookupHandlerService } from '../lux-lookup-service/lux-lookup-handler.service';
import { LuxLookupService } from '../lux-lookup-service/lux-lookup.service';
import { LuxLookupLabelComponent } from './lux-lookup-label.component';

describe('LuxLookupLabelComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        provideLuxTranslocoTesting(),
        LuxLookupHandlerService,
        LuxConsoleService,
        { provide: LuxLookupService, useClass: MockLuxLookupLabelService }
      ]
    }).compileComponents();
  }));

  describe('Außerhalb einer Form', () => {
    let fixture: ComponentFixture<LuxNoFormComponent>;
    let lookupLabel: LuxLookupLabelComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxNoFormComponent);
      lookupLabel = fixture.debugElement.query(By.directive(LuxLookupLabelComponent)).componentInstance;
      fixture.detectChanges();
    });

    it('Sollte den Kurztext des Schlüssels anzeigen', fakeAsync(() => {
      const myComponent = fixture.debugElement.query(By.css('lux-lookup-label > span'));

      expect(myComponent).toBeDefined();
      expect(myComponent.nativeElement.innerHTML).toEqual('Jungholz (ausl. Adresse)');
      (TestBed.inject(LuxLookupService) as MockLuxLookupLabelService).changeTableValue();
      TestBed.inject(LuxLookupHandlerService).reloadData('meineId');

      fixture.detectChanges();

      expect(myComponent.nativeElement.innerHTML).toEqual('Altholz (inl. Adresse)');
    }));
  });

  describe('Aktualisierungen', () => {
    let fixture: ComponentFixture<LuxTable500212Component>;
    let component: LuxTable500212Component;
    let lookupLabel: LuxLookupLabelComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(LuxTable500212Component);
      component = fixture.componentInstance;
      lookupLabel = fixture.debugElement.query(By.directive(LuxLookupLabelComponent)).componentInstance;
      fixture.detectChanges();
    });

    it('Sollte den korrekten Wert des TableKeys laden (tableKey changed)', fakeAsync(() => {
      const myComponent = fixture.debugElement.query(By.css('lux-lookup-label > span'));

      expect(myComponent.nativeElement.innerHTML).toEqual('Lorem ipsum 212/110');

      component.tableKey = '111';
      fixture.detectChanges();

      expect(myComponent.nativeElement.innerHTML).toEqual('Lorem ipsum 212/111');
    }));

    it('Sollte den korrekten Wert des TableKeys laden (tableNo changed)', fakeAsync(() => {
      const myComponent = fixture.debugElement.query(By.css('lux-lookup-label > span'));

      expect(myComponent.nativeElement.innerHTML).toEqual('Lorem ipsum 212/110');

      component.tableNo = '500213';
      fixture.detectChanges();

      expect(myComponent.nativeElement.innerHTML).toEqual('Lorem ipsum 213/110');
    }));
  });
});

@Component({
  template: `
    <lux-lookup-label luxLookupId="meineId" luxLookupKnr="101" [luxTableNo]="tableNo" [luxTableKey]="tableKey"> </lux-lookup-label>
  `,
  imports: [LuxLookupLabelComponent]
})
class LuxNoFormComponent {
  tableNo = '500211';
  tableKey = '110';
  value?: any;
}

@Component({
  selector: 'lux-table-500-212-component',
  template: `
    <lux-lookup-label luxLookupId="meineId" luxLookupKnr="101" [luxTableNo]="tableNo" [luxTableKey]="tableKey"> </lux-lookup-label>
  `,
  imports: [LuxLookupLabelComponent]
})
class LuxTable500212Component {
  tableNo = '500212';
  tableKey = '110';
  value?: any;
}

@Injectable()
class MockLuxLookupLabelService extends LuxLookupService {
  changeTableValue() {
    mockResult500211[0] = {
      key: '110',
      kurzText: 'Altholz (inl. Adresse)',
      gueltigkeitVon: '20090814'
    };
  }

  override getLookupTable(luxTableNo: string, lookupParameters: LuxLookupParameters, url: string) {
    let mockResult;

    if (luxTableNo === '500211') {
      mockResult = mockResult500211;
    } else if (luxTableNo === '500212') {
      mockResult = mockResult500212;
    } else if (luxTableNo === '500213') {
      mockResult = mockResult500213;
    } else {
      throw Error('Mock result not found!');
    }

    return of([mockResult.find((entry) => entry.key === lookupParameters.keys[0])]);
  }
}

const mockResult500211: any[] = [
  {
    key: '110',
    kurzText: 'Jungholz (ausl. Adresse)',
    gueltigkeitVon: '20090814'
  },
  {
    key: '111',
    kurzText: 'Altholz (inl. Adresse)',
    gueltigkeitVon: '20090814'
  }
];

const mockResult500212: any[] = [
  {
    key: '110',
    kurzText: 'Lorem ipsum 212/110',
    gueltigkeitVon: '20090814'
  },
  {
    key: '111',
    kurzText: 'Lorem ipsum 212/111',
    gueltigkeitVon: '20090814'
  }
];

const mockResult500213: any[] = [
  {
    key: '110',
    kurzText: 'Lorem ipsum 213/110',
    gueltigkeitVon: '20090814'
  },
  {
    key: '111',
    kurzText: 'Lorem ipsum 213/111',
    gueltigkeitVon: '20090814'
  }
];

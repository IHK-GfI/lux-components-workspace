import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxTagIdDirective } from './lux-tag-id.directive';

describe('LuxTagIdDirective', () => {
  let fixture: ComponentFixture<MockComponent>;
  let mockComp: MockComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LuxComponentsConfigService,
          useClass: MockConfigService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(MockComponent);
    mockComp = fixture.componentInstance;
  }));

  it('Sollte die Tag-ID generieren', () => {
    const spy = spyOn(console, 'warn');
    mockComp.tagId = 'tagid-demo';
    fixture.detectChanges();

    const tagId = fixture.debugElement.query(By.css('lux-component[data-luxtagid="lux-component#tagid-demo"]'));
    expect(tagId).not.toBeNull();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});

@Component({
  selector: 'lux-mock-component',
  template: ` <lux-component luxTagIdHandler [luxTagId]="tagId"></lux-component> `,
  imports: [LuxTagIdDirective]
})
class MockComponent {
  tagId: string | null = null;
}

@Component({
  selector: 'lux-component',
  template: ` <ng-content></ng-content> `,
  imports: []
})
class MockLuxComponent {}

class MockConfigService {
  config = of({
    generateLuxTagIds: true
  });
}

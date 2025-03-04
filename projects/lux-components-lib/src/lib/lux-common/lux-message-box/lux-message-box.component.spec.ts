import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '../../lux-util/testing/lux-test-helper';
import { ILuxMessageChangeEvent } from './lux-message-box-model/lux-message-events.interface';
import { ILuxMessage } from './lux-message-box-model/lux-message.interface';
import { LuxMessageComponent } from './lux-message-box-subcomponents/lux-message.component';
import { LuxMessageBoxComponent } from './lux-message-box.component';

describe('LuxMessageBoxComponent', () => {
  let component: MockMessageBoxComponent;
  let fixture: ComponentFixture<MockMessageBoxComponent>;
  let messageBoxComponent: LuxMessageBoxComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideNoopAnimations()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockMessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    messageBoxComponent = fixture.debugElement.query(By.directive(LuxMessageBoxComponent)).componentInstance;
  });

  it('Sollte erzeugt werden', () => {
    expect(component).toBeTruthy();
  });

  it('Sollte die Nachrichten anzeigen', fakeAsync(() => {
    // Vorbedingungen testen
    let messageContainer = fixture.debugElement.query(By.css('.lux-message-container'));
    let messageText = fixture.debugElement.query(By.css('.lux-message-text'));
    let messageIcon = fixture.debugElement.query(By.css('.lux-message-icon'));

    expect(messageContainer).not.toBeNull();
    expect(messageText).not.toBeNull();
    expect(messageText.nativeElement.textContent.trim()).toEqual('Msg 1');
    expect(messageIcon).not.toBeNull();

    // Änderungen durchführen
    component.messages = [];
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    messageContainer = fixture.debugElement.query(By.css('.lux-message-container'));
    messageText = fixture.debugElement.query(By.css('.lux-message-text'));
    messageIcon = fixture.debugElement.query(By.css('.lux-message-icon'));

    expect(messageContainer).toBeNull();
    expect(messageText).toBeNull();
    expect(messageIcon).toBeNull();

    LuxTestHelper.wait(fixture);
    flush();
  }));

  it('Sollte mehrere Nachrichtenboxen untereinander anzeigen', fakeAsync(() => {
    // Vorbedingungen testen
    let singleMessages = fixture.debugElement.queryAll(By.directive(LuxMessageComponent));

    expect(singleMessages.length).toBe(1);

    // Änderungen durchführen
    component.maxDisplayed = 2;
    component.messages = [...component.messages];
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    singleMessages = fixture.debugElement.queryAll(By.directive(LuxMessageComponent));

    expect(singleMessages.length).toBe(2);

    // Änderungen durchführen
    component.maxDisplayed = 3;
    const newMessages: ILuxMessage[] = [
      { text: 'Msg 3', iconName: 'lux-programming-bug', color: 'green' },
      { text: 'Msg 4', iconName: 'lux-programming-bug', color: 'blue' }
    ];
    component.messages = [...component.messages, ...newMessages];
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    singleMessages = fixture.debugElement.queryAll(By.directive(LuxMessageComponent));

    expect(singleMessages.length).toBe(3);

    LuxTestHelper.wait(fixture);
    flush();
  }));

  it('Sollte zur speziellen Nachricht springen und fehlerhafte Eingaben abfangen', fakeAsync(() => {
    // Vorbedingungen testen
    let messageText = fixture.debugElement.query(By.css('.lux-message-text'));

    expect(messageText).not.toBeNull();
    expect(messageText.nativeElement.textContent).toEqual('Msg 1');

    // Änderungen durchführen
    component.index = 1;
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    messageText = fixture.debugElement.query(By.css('.lux-message-text'));

    expect(messageText).not.toBeNull();
    expect(messageText.nativeElement.textContent).toEqual('Msg 2');

    // Änderungen durchführen [Sollte negative Werte abfangen]
    component.index = -100;
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    messageText = fixture.debugElement.query(By.css('.lux-message-text'));

    expect(messageText).not.toBeNull();
    expect(messageText.nativeElement.textContent).toEqual('Msg 1');

    // Änderungen durchführen [Sollte zu hohe positive Werte abfangen]
    component.index = 100;
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    messageText = fixture.debugElement.query(By.css('.lux-message-text'));

    expect(messageText).not.toBeNull();
    expect(messageText.nativeElement.textContent).toEqual('Msg 2');
  }));

  it('Sollte die Nachrichten wechseln und das Event ausgeben', fakeAsync(() => {
    // Vorbedingungen testen
    let messageText = fixture.debugElement.query(By.css('.lux-message-text'));
    const changeSpy = spyOn(component, 'changed').and.callThrough();
    const matPaginator: MatPaginator = fixture.debugElement.query(By.directive(MatPaginator)).componentInstance;

    expect(messageText.nativeElement.textContent.trim()).toEqual('Msg 1');
    expect(component.eventObject).toBeUndefined();

    // Änderungen durchführen [NACH VORNE STEPPEN]
    matPaginator.nextPage();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    messageText = fixture.debugElement.query(By.css('.lux-message-text'));

    expect(messageText.nativeElement.textContent.trim()).toEqual('Msg 2');
    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(component.eventObject).toBeDefined();
    expect(component.eventObject!.previousPage.index).toBe(0);
    expect(component.eventObject!.currentPage.index).toBe(1);

    // Änderungen durchführen [NACH HINTEN STEPPEN]
    matPaginator.previousPage();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    messageText = fixture.debugElement.query(By.css('.lux-message-text'));

    expect(messageText.nativeElement.textContent.trim()).toEqual('Msg 1');
    expect(changeSpy).toHaveBeenCalledTimes(2);
    expect(component.eventObject).toBeDefined();
    expect(component.eventObject!.previousPage.index).toBe(1);
    expect(component.eventObject!.currentPage.index).toBe(0);
  }));

  it('Sollte die Nachrichten schließen und das Event ausgeben', fakeAsync(() => {
    // Vorbedingungen testen
    let messageContainer = fixture.debugElement.query(By.css('.lux-message-container'));
    const changeSpy = spyOn(component, 'closed').and.callThrough();

    expect(messageContainer).not.toBeNull();
    expect(changeSpy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen
    component.messages = [];
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    messageContainer = fixture.debugElement.query(By.css('.lux-message-container'));
    expect(messageContainer).toBeNull();
    expect(changeSpy).toHaveBeenCalledTimes(1);

    LuxTestHelper.wait(fixture);
    flush();
  }));
});

@Component({
  selector: 'lux-mock-message-box',
  template: `<lux-message-box
    (luxMessageBoxClosed)="closed()"
    (luxMessageChanged)="changed($event)"
    [luxMessages]="messages"
    [luxIndex]="index"
    [luxMaximumDisplayed]="maxDisplayed"
  ></lux-message-box>`,
  imports: [LuxMessageBoxComponent]
})
class MockMessageBoxComponent {
  messages: ILuxMessage[] = [
    { text: 'Msg 1', iconName: 'lux-programming-bug', color: 'green' },
    { text: 'Msg 2', iconName: 'lux-programming-bug', color: 'blue' }
  ];

  eventObject?: ILuxMessageChangeEvent;
  index = 0;
  maxDisplayed = 1;

  constructor() {}

  closed() {}

  changed(messageChangeEvent: ILuxMessageChangeEvent) {
    this.eventObject = messageChangeEvent;
  }
}

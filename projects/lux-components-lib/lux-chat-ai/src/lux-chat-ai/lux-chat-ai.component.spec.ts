import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LuxChatAiComponent } from './lux-chat-ai.component';

describe('LuxChatComponent', () => {
  let component: LuxChatAiComponent;
  let fixture: ComponentFixture<LuxChatAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatAiComponent],
      providers: [provideLuxTranslocoTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxChatAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  
});

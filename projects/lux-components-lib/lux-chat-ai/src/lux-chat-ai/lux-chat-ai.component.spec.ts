import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxChatAiComponent } from './lux-chat-ai.component';
import { provideHttpClient } from '@angular/common/http';

describe('LuxChatAiComponent', () => {
  let component: LuxChatAiComponent;
  let fixture: ComponentFixture<LuxChatAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatAiComponent],
      providers:[
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuxChatAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxChatAiComponent } from './lux-chat-ai.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LuxChatAiComponent', () => {
  let component: LuxChatAiComponent;
  let fixture: ComponentFixture<LuxChatAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatAiComponent],
      providers:[
        provideHttpClientTesting()
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

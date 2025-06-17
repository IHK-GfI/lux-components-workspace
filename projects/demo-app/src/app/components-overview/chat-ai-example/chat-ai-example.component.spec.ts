import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAiExampleComponent } from './chat-ai-example.component';

describe('ChatAiExampleComponent', () => {
  let component: ChatAiExampleComponent;
  let fixture: ComponentFixture<ChatAiExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAiExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatAiExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

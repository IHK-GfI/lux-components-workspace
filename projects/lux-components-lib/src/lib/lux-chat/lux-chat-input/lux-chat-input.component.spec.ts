import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxChatInputComponent } from './lux-chat-input.component';

describe('LuxChatInputComponent', () => {
  let component: LuxChatInputComponent;
  let fixture: ComponentFixture<LuxChatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuxChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

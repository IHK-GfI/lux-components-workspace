import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxChatComponent } from './lux-chat.component';

describe('LuxChatComponent', () => {
  let component: LuxChatComponent;
  let fixture: ComponentFixture<LuxChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuxChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

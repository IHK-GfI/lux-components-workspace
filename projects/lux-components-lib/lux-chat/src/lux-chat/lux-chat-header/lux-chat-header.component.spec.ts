import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxChatHeaderComponent } from './lux-chat-header.component';

describe('LuxChatHeaderComponent', () => {
  let component: LuxChatHeaderComponent;
  let fixture: ComponentFixture<LuxChatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuxChatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxChatEntryActionsComponent } from './lux-chat-entry-actions.component';

describe('LuxChatEntryActionsComponent', () => {
  let component: LuxChatEntryActionsComponent;
  let fixture: ComponentFixture<LuxChatEntryActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatEntryActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuxChatEntryActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxChatEntryComponent } from './lux-chat-entry.component';

describe('LuxChatEntryComponent', () => {
  let component: LuxChatEntryComponent;
  let fixture: ComponentFixture<LuxChatEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuxChatEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

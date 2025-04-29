import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxChatEntryContentComponent } from './lux-chat-entry-content.component';

describe('LuxChatEntryContentComponent', () => {
  let component: LuxChatEntryContentComponent;
  let fixture: ComponentFixture<LuxChatEntryContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatEntryContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuxChatEntryContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

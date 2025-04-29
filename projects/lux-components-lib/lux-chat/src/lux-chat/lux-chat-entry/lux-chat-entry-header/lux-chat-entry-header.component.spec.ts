import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxChatEntryHeaderComponent } from './lux-chat-entry-header.component';

describe('LuxChatEntryHeaderComponent', () => {
  let component: LuxChatEntryHeaderComponent;
  let fixture: ComponentFixture<LuxChatEntryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatEntryHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuxChatEntryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

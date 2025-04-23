import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxChatEntryFooterComponent } from './lux-chat-entry-footer.component';

describe('LuxChatEntryFooterComponent', () => {
  let component: LuxChatEntryFooterComponent;
  let fixture: ComponentFixture<LuxChatEntryFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatEntryFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuxChatEntryFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

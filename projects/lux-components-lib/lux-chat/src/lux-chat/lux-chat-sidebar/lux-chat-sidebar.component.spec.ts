import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxChatSidebarComponent } from './lux-chat-sidebar.component';

describe('LuxChatSidebarComponent', () => {
  let component: LuxChatSidebarComponent;
  let fixture: ComponentFixture<LuxChatSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuxChatSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

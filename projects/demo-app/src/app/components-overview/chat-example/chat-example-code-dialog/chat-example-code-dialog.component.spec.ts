import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatExampleCodeDialogComponent } from './chat-example-code-dialog.component';

describe('ChatExampleCodeDialogComponent', () => {
  let component: ChatExampleCodeDialogComponent;
  let fixture: ComponentFixture<ChatExampleCodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatExampleCodeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatExampleCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { describe, it, beforeEach, expect } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxTextboxComponent } from './lux-textbox.component';

describe('LuxTextboxComponent', () => {
  let component: LuxTextboxComponent;
  let fixture: ComponentFixture<LuxTextboxComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [LuxTextboxComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

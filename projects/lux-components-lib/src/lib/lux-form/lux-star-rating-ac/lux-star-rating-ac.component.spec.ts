import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LuxStarRatingAcComponent } from './lux-star-rating-ac.component';

describe('LuxStarRatingAcComponent', () => {
  let component: LuxStarRatingAcComponent;
  let fixture: ComponentFixture<LuxStarRatingAcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxStarRatingAcComponent, ReactiveFormsModule, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxStarRatingAcComponent);
    component = fixture.componentInstance;
    
    // Set up form group
    component.formGroup = new FormGroup({
      control: new FormControl()
    });
    component.luxControlBinding = 'control';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.luxMaxStars).toBe(5);
    expect(component.luxSize).toBe('large');
    expect(component.luxShowResetButton).toBe(false);
    expect(component.luxValue).toBe(0);
  });

  it('should render correct number of stars', () => {
    component.luxMaxStars = 3;
    fixture.detectChanges();

    const stars = fixture.debugElement.queryAll(By.css('.lux-star-rating-star'));
    expect(stars.length).toBe(3);
  });

  it('should display filled stars based on value', () => {
    component.luxValue = 3;
    fixture.detectChanges();

    const filledStars = fixture.debugElement.queryAll(By.css('.lux-star-rating-star-filled'));
    const emptyStars = fixture.debugElement.queryAll(By.css('.lux-star-rating-star-empty'));
    
    expect(filledStars.length).toBe(3);
    expect(emptyStars.length).toBe(2);
  });

  it('should emit change event when star is clicked', () => {
    spyOn(component.luxChange, 'emit');
    
    const thirdStar = fixture.debugElement.queryAll(By.css('.lux-star-rating-star'))[2];
    thirdStar.nativeElement.click();
    
    expect(component.luxChange.emit).toHaveBeenCalledWith(3);
    expect(component.luxValue).toBe(3);
  });

  it('should reset to 0 when clicking the same star again', () => {
    component.luxValue = 3;
    fixture.detectChanges();
    
    spyOn(component.luxChange, 'emit');
    
    const thirdStar = fixture.debugElement.queryAll(By.css('.lux-star-rating-star'))[2];
    thirdStar.nativeElement.click();
    
    expect(component.luxChange.emit).toHaveBeenCalledWith(0);
    expect(component.luxValue).toBe(0);
  });

  it('should show reset button when luxShowResetButton is true and value > 0', () => {
    component.luxShowResetButton = true;
    component.luxValue = 3;
    fixture.detectChanges();

    const resetButton = fixture.debugElement.query(By.css('.lux-star-rating-reset'));
    expect(resetButton).toBeTruthy();
  });

  it('should not show reset button when value is 0', () => {
    component.luxShowResetButton = true;
    component.luxValue = 0;
    fixture.detectChanges();

    const resetButton = fixture.debugElement.query(By.css('.lux-star-rating-reset'));
    expect(resetButton).toBeFalsy();
  });

  it('should reset value when reset button is clicked', () => {
    component.luxShowResetButton = true;
    component.luxValue = 3;
    fixture.detectChanges();
    
    spyOn(component.luxChange, 'emit');
    
    const resetButton = fixture.debugElement.query(By.css('.lux-star-rating-reset'));
    resetButton.nativeElement.click();
    
    expect(component.luxChange.emit).toHaveBeenCalledWith(0);
    expect(component.luxValue).toBe(0);
  });

  it('should not respond to clicks when readonly', () => {
    component.luxReadonly = true;
    fixture.detectChanges();
    
    spyOn(component.luxChange, 'emit');
    
    const firstStar = fixture.debugElement.queryAll(By.css('.lux-star-rating-star'))[0];
    firstStar.nativeElement.click();
    
    expect(component.luxChange.emit).not.toHaveBeenCalled();
    expect(component.luxValue).toBe(0);
  });

  it('should not respond to clicks when disabled', () => {
    component.luxDisabled = true;
    fixture.detectChanges();
    
    spyOn(component.luxChange, 'emit');
    
    const firstStar = fixture.debugElement.queryAll(By.css('.lux-star-rating-star'))[0];
    firstStar.nativeElement.click();
    
    expect(component.luxChange.emit).not.toHaveBeenCalled();
    expect(component.luxValue).toBe(0);
  });

  it('should handle keyboard navigation', () => {
    spyOn(component.luxChange, 'emit');
    
    // Arrow Right should increase value
    const rightEvent = new KeyboardEvent('keydown', { code: 'ArrowRight' });
    component.onKeyDown(rightEvent);
    expect(component.luxValue).toBe(1);
    
    // Arrow Right again should increase to 2
    component.onKeyDown(rightEvent);
    expect(component.luxValue).toBe(2);
    
    // Arrow Left should decrease value
    const leftEvent = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    component.onKeyDown(leftEvent);
    expect(component.luxValue).toBe(1);
  });

  it('should handle number key input', () => {
    // Simulate pressing "3" key directly
    const event = new KeyboardEvent('keydown', { code: 'Digit3' });
    spyOn(component.luxChange, 'emit');
    
    component.onKeyDown(event);
    expect(component.luxValue).toBe(3);
    
    // Simulate pressing "5" key
    const event2 = new KeyboardEvent('keydown', { code: 'Digit5' });
    component.onKeyDown(event2);
    expect(component.luxValue).toBe(5);
  });

  it('should reset value with Delete key', () => {
    component.luxValue = 3;
    fixture.detectChanges();
    
    spyOn(component.luxChange, 'emit');
    
    const event = new KeyboardEvent('keydown', { code: 'Delete' });
    component.onKeyDown(event);
    expect(component.luxValue).toBe(0);
  });

  it('should not exceed maxStars value', () => {
    component.luxMaxStars = 3;
    spyOn(component.luxChange, 'emit');
    
    // Try to set value to 5 when max is 3
    const event = new KeyboardEvent('keydown', { code: 'Digit5' });
    component.onKeyDown(event);
    expect(component.luxValue).toBe(3);
  });

  it('should display correct rating text', () => {
    expect(component.currentRatingText).toBe('Keine Bewertung');
    
    component.luxValue = 1;
    expect(component.currentRatingText).toBe('1 Stern');
    
    component.luxValue = 3;
    expect(component.currentRatingText).toBe('3 Sterne');
  });

  it('should apply correct size class', () => {
    component.luxSize = 'small';
    fixture.detectChanges();
    
    const container = fixture.debugElement.query(By.css('.lux-star-rating-container'));
    expect(container.nativeElement.classList).toContain('lux-star-rating-small');
    
    component.luxSize = 'large';
    fixture.detectChanges();
    
    expect(container.nativeElement.classList).toContain('lux-star-rating-large');
  });

  it('should update hover state correctly', () => {
    const secondStar = fixture.debugElement.queryAll(By.css('.lux-star-rating-star'))[1];
    
    // Hover over second star
    secondStar.triggerEventHandler('mouseenter', null);
    expect(component.hoveredStar).toBe(2);
    
    // Check that first two stars are shown as filled
    expect(component.isStarFilled(1)).toBe(true);
    expect(component.isStarFilled(2)).toBe(true);
    expect(component.isStarFilled(3)).toBe(false);
    
    // Leave hover
    const starsContainer = fixture.debugElement.query(By.css('.lux-star-rating-stars'));
    starsContainer.triggerEventHandler('mouseleave', null);
    expect(component.hoveredStar).toBe(0);
  });
});
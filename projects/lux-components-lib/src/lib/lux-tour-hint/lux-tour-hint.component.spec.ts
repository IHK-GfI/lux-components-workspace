import { TestBed } from '@angular/core/testing';
import { LuxTourHintComponent } from './lux-tour-hint.component';

describe('LuxTourHintComponent', () => {
  let component: any;

  beforeEach(() => {
    component = TestBed.createComponent(LuxTourHintComponent).componentInstance;
  });

  function calculatePositions(
    win: { width: number; height: number },
    hint: { width: number; height: number },
    target: { left: number; right: number; top: number; bottom: number }
  ) {
    component.tourHintContainer = { nativeElement: { getBoundingClientRect: () => hint } };
    component.calculatePositions(win.width, win.height, {
      ...target,
      midX: (target.left + target.right) / 2,
      midY: (target.top + target.bottom) / 2
    });
  }

  it('Sollte die sichtbare Fläche ohne die Scrollbars der Seite verwenden', () => {
    spyOnProperty(document.documentElement, 'clientWidth', 'get').and.returnValue(625);
    spyOnProperty(document.documentElement, 'clientHeight', 'get').and.returnValue(135);
    const calculateSpy = spyOn(component, 'calculatePositions');
    spyOn(component.cdr, 'detectChanges');
    component._luxTarget = document.createElement('div');

    component.updateTargetAndPositions();

    expect(calculateSpy).toHaveBeenCalledOnceWith(625, 135, jasmine.anything());
  });

  it('Sollte den Hinweis auf der Seite mit dem meisten Platz anzeigen', () => {
    calculatePositions({ width: 1200, height: 800 }, { width: 300, height: 200 }, { left: 100, right: 200, top: 380, bottom: 420 });

    expect(component.arrowClass).toEqual('left');
    expect(component.arrowVisible).toBeTrue();
    expect(component.tourHintPosLeft).toBe(216);
    expect(component.tourHintPosTop).toBe(368);
  });

  it('Sollte den Pfeil zum Ziel verschieben, wenn der Hinweis am rechten Rand begrenzt wird', () => {
    calculatePositions({ width: 350, height: 800 }, { width: 340, height: 300 }, { left: 300, right: 340, top: 100, bottom: 140 });

    expect(component.arrowClass).toEqual('top');
    expect(component.arrowVisible).toBeTrue();
    expect(component.tourHintPosLeft).toBe(10);
    expect(component.tourHintPosTop).toBe(156);
    expect(component.dynamicArrowStyle['--arrowOffsetX']).toEqual('-276px');
  });

  it('Sollte den Pfeil zum Ziel verschieben, wenn der Hinweis am unteren Rand begrenzt wird', () => {
    calculatePositions({ width: 1200, height: 300 }, { width: 300, height: 200 }, { left: 100, right: 200, top: 260, bottom: 290 });

    expect(component.arrowClass).toEqual('left');
    expect(component.arrowVisible).toBeTrue();
    expect(component.tourHintPosLeft).toBe(216);
    expect(component.tourHintPosTop).toBe(100);
    expect(component.dynamicArrowStyle['--arrowOffsetY']).toEqual('-136px');
  });

  it('Sollte den Hinweis im Viewport über dem Ziel anzeigen und den Pfeil ausblenden, wenn keine Seite passt', () => {
    calculatePositions({ width: 350, height: 640 }, { width: 340, height: 500 }, { left: 100, right: 250, top: 280, bottom: 320 });

    expect(component.arrowVisible).toBeFalse();
    expect(component.tourHintPosLeft).toBe(10);
    expect(component.tourHintPosTop).toBe(140);
  });

  it('Sollte ohne passende Seite nur oben oder unten verwenden', () => {
    //Rechts wäre mit 0px am meisten Platz, das reicht aber nicht für den Hinweis mit Pfeil
    calculatePositions({ width: 350, height: 400 }, { width: 340, height: 300 }, { left: 5, right: 10, top: 170, bottom: 210 });

    expect(component.arrowClass).toEqual('top');
    expect(component.tourHintPosLeft).toBe(0);
    expect(component.tourHintPosTop).toBe(100);
  });

  it('Sollte einen Hinweis, der größer als der Viewport ist, oben links anzeigen', () => {
    calculatePositions({ width: 350, height: 640 }, { width: 350, height: 900 }, { left: 100, right: 250, top: 280, bottom: 320 });

    expect(component.arrowVisible).toBeFalse();
    expect(component.tourHintPosLeft).toBe(0);
    expect(component.tourHintPosTop).toBe(0);
  });
});

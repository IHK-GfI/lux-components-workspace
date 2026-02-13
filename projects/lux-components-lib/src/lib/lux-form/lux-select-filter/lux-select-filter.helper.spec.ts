import { ElementRef } from '@angular/core';
import { LuxSelectFilterHelper } from './lux-select-filter.helper';

describe('LuxSelectFilterHelper', () => {
  it('buildFilteredIndexSet liefert alle Indizes bei leerem Filter', () => {
    const helper = new LuxSelectFilterHelper();
    const indexes = helper.buildFilteredIndexSet(['A', 'B', 'C'], (value) => value);

    expect(Array.from(indexes.values())).toEqual([0, 1, 2]);
  });

  it('matchesFilter arbeitet case-insensitive', () => {
    const helper = new LuxSelectFilterHelper();
    helper.filterValue = 'deu';

    expect(helper.matchesFilter('Deutschland')).toBeTrue();
    expect(helper.matchesFilter('Belgien')).toBeFalse();
  });

  it('handleFilterKeydown schliesst bei Escape', () => {
    const helper = new LuxSelectFilterHelper();
    const closeSpy = jasmine.createSpy('close');
    const keydownSpy = jasmine.createSpy('_handleKeydown');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');

    helper.handleFilterKeydown(event, {
      panelOpen: true,
      close: closeSpy,
      _handleKeydown: keydownSpy
    } as any);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
    expect(keydownSpy).not.toHaveBeenCalled();
  });

  it('handleFilterKeydown leitet ArrowDown an MatSelect weiter', () => {
    const helper = new LuxSelectFilterHelper();
    const closeSpy = jasmine.createSpy('close');
    const keydownSpy = jasmine.createSpy('_handleKeydown');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');

    helper.handleFilterKeydown(event, {
      panelOpen: true,
      close: closeSpy,
      _handleKeydown: keydownSpy
    } as any);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(keydownSpy).toHaveBeenCalledWith(event);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('focusFilterInput fokussiert und selektiert mit Timeout', (done) => {
    const helper = new LuxSelectFilterHelper();
    const focusSpy = jasmine.createSpy('focus');
    const selectSpy = jasmine.createSpy('select');
    const elementRef = {
      nativeElement: {
        focus: focusSpy,
        select: selectSpy
      }
    } as unknown as ElementRef<HTMLInputElement>;

    helper.focusFilterInput(elementRef);

    setTimeout(() => {
      expect(focusSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalled();
      done();
    });
  });
});

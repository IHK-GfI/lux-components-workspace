import { LuxSelectFilterDirective } from './lux-select-filter.directive';
import { LuxSelectPanelFilterComponent } from './lux-select-panel-filter.component';

describe('LuxSelectPanelFilterComponent', () => {
  let component: LuxSelectPanelFilterComponent;

  beforeEach(() => {
    component = new LuxSelectPanelFilterComponent();
  });

  function createDirectiveMock(handled: boolean): LuxSelectFilterDirective<unknown> {
    const mock: Pick<
      LuxSelectFilterDirective<unknown>,
      'handleKeydown' | 'onFilterInput' | 'setFilterInputRef' | 'filterValue'
    > = {
      handleKeydown: jasmine.createSpy('handleKeydown').and.returnValue(handled),
      onFilterInput: jasmine.createSpy('onFilterInput'),
      setFilterInputRef: jasmine.createSpy('setFilterInputRef'),
      filterValue: ''
    };

    return mock as LuxSelectFilterDirective<unknown>;
  }

  function createKeyboardEvent(key: string): KeyboardEvent {
    return {
      key,
      stopPropagation: jasmine.createSpy('stopPropagation')
    } as unknown as KeyboardEvent;
  }

  it('sollte behandelte Keydowns aus dem Filter-Input stoppen', () => {
    component.filterDirective = createDirectiveMock(true);
    const event = createKeyboardEvent('ArrowDown');

    component.onKeydown(event);

    expect(component.filterDirective.handleKeydown).toHaveBeenCalledWith(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('sollte Escape ungefiltert zu MatSelect durchlassen, wenn die Directive den Key nicht behandelt', () => {
    component.filterDirective = createDirectiveMock(false);
    const event = createKeyboardEvent('Escape');

    component.onKeydown(event);

    expect(component.filterDirective.handleKeydown).toHaveBeenCalledWith(event);
    expect(event.stopPropagation).not.toHaveBeenCalled();
  });

  it('sollte unbehandelte Nicht-Escape-Keys weiter isolieren', () => {
    component.filterDirective = createDirectiveMock(false);
    const event = createKeyboardEvent('a');

    component.onKeydown(event);

    expect(component.filterDirective.handleKeydown).toHaveBeenCalledWith(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });
});

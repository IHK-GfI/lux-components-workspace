import { ElementRef } from '@angular/core';
import { LuxSelectFilterDirective } from './lux-select-filter.directive';
import { LuxSelectPanelFilterComponent } from './lux-select-panel-filter.component';

describe('LuxSelectPanelFilterComponent', () => {
  let component: LuxSelectPanelFilterComponent;
  let directive: LuxSelectFilterDirective<unknown>;

  beforeEach(() => {
    component = new LuxSelectPanelFilterComponent();
    directive = createDirectiveMock(true);
    component.filterDirective = directive;
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

  it('sollte Eingaben direkt an die Directive weiterleiten', () => {
    component.onInput('deu');

    expect(directive.onFilterInput).toHaveBeenCalledWith('deu');
  });

  it('sollte den Filter beim Clear leeren und das Input erneut fokussieren', () => {
    const focusSpy = jasmine.createSpy('focus');
    const stopPropagation = jasmine.createSpy('stopPropagation');
    component.filterInputComponent = {
      inputElement: { nativeElement: { focus: focusSpy } }
    } as unknown as LuxSelectPanelFilterComponent['filterInputComponent'];

    component.onClear({ stopPropagation } as unknown as Event);

    expect(stopPropagation).toHaveBeenCalled();
    expect(directive.onFilterInput).toHaveBeenCalledWith('');
    expect(focusSpy).toHaveBeenCalled();
  });

  it('sollte die Filter-Input-Referenz an die Directive binden', () => {
    const nativeElement = document.createElement('input');
    component.filterInputComponent = {
      inputElement: new (class extends ElementRef<HTMLInputElement> {
        constructor() {
          super(nativeElement);
        }
      })()
    } as unknown as LuxSelectPanelFilterComponent['filterInputComponent'];

    component.ngAfterViewInit();

    expect(directive.setFilterInputRef).toHaveBeenCalled();
  });
});

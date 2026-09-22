import { describe, it, beforeEach, expect, vi } from 'vitest';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxSelectFilterDirective } from './lux-select-filter.directive';
import { LuxSelectPanelFilterComponent } from './lux-select-panel-filter.component';

describe('LuxSelectPanelFilterComponent', () => {
  let fixture: ComponentFixture<LuxSelectPanelFilterComponent>;
  let component: LuxSelectPanelFilterComponent;
  let directive: LuxSelectFilterDirective<unknown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxSelectPanelFilterComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();

    directive = createDirectiveMock(true);

    fixture = TestBed.createComponent(LuxSelectPanelFilterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('filterDirective', directive);
    fixture.detectChanges();
  });

  function createDirectiveMock(handled: boolean): LuxSelectFilterDirective<unknown> {
    const mock: Pick<LuxSelectFilterDirective<unknown>, 'handleKeydown' | 'onFilterInput' | 'setFilterInputRef' | 'filterValue'> = {
      handleKeydown: vi.fn().mockName('handleKeydown').mockReturnValue(handled),
      onFilterInput: vi.fn().mockName('onFilterInput'),
      setFilterInputRef: vi.fn().mockName('setFilterInputRef'),
      filterValue: ''
    };

    return mock as LuxSelectFilterDirective<unknown>;
  }

  function createKeyboardEvent(key: string): KeyboardEvent {
    return {
      key,
      stopPropagation: vi.fn().mockName('stopPropagation')
    } as unknown as KeyboardEvent;
  }

  it('sollte behandelte Keydowns aus dem Filter-Input stoppen', () => {
    const event = createKeyboardEvent('ArrowDown');

    component.onKeydown(event);

    expect(component.filterDirective().handleKeydown).toHaveBeenCalledWith(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('sollte Escape ungefiltert zu MatSelect durchlassen, wenn die Directive den Key nicht behandelt', () => {
    fixture.componentRef.setInput('filterDirective', createDirectiveMock(false));
    fixture.detectChanges();
    const event = createKeyboardEvent('Escape');

    component.onKeydown(event);

    expect(component.filterDirective().handleKeydown).toHaveBeenCalledWith(event);
    expect(event.stopPropagation).not.toHaveBeenCalled();
  });

  it('sollte unbehandelte Nicht-Escape-Keys weiter isolieren', () => {
    fixture.componentRef.setInput('filterDirective', createDirectiveMock(false));
    fixture.detectChanges();
    const event = createKeyboardEvent('a');

    component.onKeydown(event);

    expect(component.filterDirective().handleKeydown).toHaveBeenCalledWith(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('sollte Eingaben direkt an die Directive weiterleiten', () => {
    component.onInput('deu');

    expect(directive.onFilterInput).toHaveBeenCalledWith('deu');
  });

  it('sollte den Filter beim Clear leeren und das Input erneut fokussieren', () => {
    const stopPropagation = vi.fn().mockName('stopPropagation');
    const focusSpy = vi.spyOn(component.filterInput()!.nativeElement, 'focus').mockReturnValue(undefined);

    component.onClear({ stopPropagation } as unknown as Event);

    expect(stopPropagation).toHaveBeenCalled();
    expect(directive.onFilterInput).toHaveBeenCalledWith('');
    expect(focusSpy).toHaveBeenCalled();
  });

  it('sollte die Filter-Input-Referenz an die Directive binden', () => {
    expect(directive.setFilterInputRef).toHaveBeenCalledWith(component.filterInput()!);
  });
});

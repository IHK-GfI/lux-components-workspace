import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LuxSelectFilterDirective } from './lux-select-filter.directive';
import { LuxSelectFilterUtils } from './lux-select-filter.utils';

@Component({
  selector: 'lux-test-component',
  template: `
    <mat-select
      [luxSelectFilter]="enableFilter"
      [luxFilterLabelFn]="labelFn"

      (luxFilterActiveChange)="onFilterActiveChange($event)"
    >
      @for (item of items; track item) {
        <mat-option [value]="item">{{ item }}</mat-option>
      }
    </mat-select>
  `,
  standalone: true,
  imports: [MatSelectModule, LuxSelectFilterDirective]
})
class TestComponent {
  enableFilter = true;
  items = ['Deutschland', 'Belgien', 'Frankreich'];
  labelFn = (item: string) => item;
  filteredIndexes = new Set<number>();
  filteredItems = new Set<string>();
  filterActive = false;

  onFilteredIndexesChange(indexes: Set<number>) {
    this.filteredIndexes = indexes;
  }

  onFilteredItemsChange(items: Set<string>) {
    this.filteredItems = items;
  }

  onFilterActiveChange(active: boolean) {
    this.filterActive = active;
  }
}

describe('LuxSelectFilterDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: LuxSelectFilterDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const matSelect = fixture.debugElement.query((el) => el.componentInstance instanceof MatSelect);
    directive = matSelect?.injector.get(LuxSelectFilterDirective);
  });

  it('sollte erstellt werden', () => {
    expect(directive).toBeTruthy();
  });

  it('sollte Items setzen können', () => {
    directive.setItems(['A', 'B', 'C']);
    expect(directive.filteredIndexes.size).toBe(3);
  });

  it('sollte filtern wenn filterValue gesetzt wird', () => {
    directive.setItems(['Deutschland', 'Belgien', 'Frankreich']);
    directive.onFilterInput('deu');

    expect(directive.filteredItems.size).toBe(1);
    expect(directive.filteredItems.has('Deutschland')).toBeTrue();
  });

  it('sollte case-insensitive filtern', () => {
    directive.setItems(['Deutschland', 'Belgien', 'Frankreich']);
    directive.onFilterInput('DEU');

    expect(directive.filteredItems.has('Deutschland')).toBeTrue();
  });

  it('sollte alle Items zurückgeben bei leerem Filter', () => {
    directive.setItems(['Deutschland', 'Belgien', 'Frankreich']);
    directive.onFilterInput('');

    expect(directive.filteredItems.size).toBe(3);
  });

  it('sollte isFilterActive korrekt zurückgeben', () => {
    directive.filterValue = '';
    expect(directive.isFilterActive()).toBeFalse();

    directive.filterValue = 'test';
    expect(directive.isFilterActive()).toBeTrue();

    directive.filterValue = '   ';
    expect(directive.isFilterActive()).toBeFalse();
  });

  it('sollte isItemVisible korrekt prüfen', () => {
    directive.setItems(['Deutschland', 'Belgien']);
    directive.onFilterInput('deu');

    expect(directive.isItemVisible('Deutschland')).toBeTrue();
    expect(directive.isItemVisible('Belgien')).toBeFalse();
  });

  it('sollte isIndexVisible korrekt prüfen', () => {
    directive.setItems(['Deutschland', 'Belgien']);
    directive.onFilterInput('deu');

    expect(directive.isIndexVisible(0)).toBeTrue();
    expect(directive.isIndexVisible(1)).toBeFalse();
  });

  it('sollte bei ArrowDown im Filter fortlaufend durch sichtbare Optionen navigieren', () => {
    const keyManager = {
      activeItemIndex: -1,
      destroy: jasmine.createSpy('destroy'),
      setActiveItem: jasmine.createSpy('setActiveItem').and.callFake((index: number) => {
        keyManager.activeItemIndex = index;
      })
    };
    const firstOptionElement = document.createElement('div');
    const secondOptionElement = document.createElement('div');

    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = jasmine.createSpy('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () =>
        [
          { _getHostElement: () => firstOptionElement },
          { _getHostElement: () => secondOptionElement }
        ] as any[]
    };

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(0);
    expect(keyManager.setActiveItem).toHaveBeenCalledWith(1);
    expect(keyManager.setActiveItem).toHaveBeenCalledWith(1);
  });

  it('sollte bei ArrowUp im Filter fortlaufend nach oben navigieren', () => {
    const keyManager = {
      activeItemIndex: -1,
      destroy: jasmine.createSpy('destroy'),
      setActiveItem: jasmine.createSpy('setActiveItem').and.callFake((index: number) => {
        keyManager.activeItemIndex = index;
      })
    };
    const firstOptionElement = document.createElement('div');
    const secondOptionElement = document.createElement('div');

    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = jasmine.createSpy('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () =>
        [
          { _getHostElement: () => firstOptionElement },
          { _getHostElement: () => secondOptionElement }
        ] as any[]
    };

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(1);
    expect(keyManager.setActiveItem).toHaveBeenCalledWith(0);
    expect(keyManager.setActiveItem).toHaveBeenCalledWith(0);
  });

  it('sollte bei Filteränderung aktive unsichtbare Option auf erste sichtbare setzen', () => {
    const keyManager = {
      activeItemIndex: 2,
      destroy: jasmine.createSpy('destroy'),
      setActiveItem: jasmine.createSpy('setActiveItem').and.callFake((index: number) => {
        keyManager.activeItemIndex = index;
      })
    };
    const hiddenOption = document.createElement('div');
    const visibleOption = document.createElement('div');
    const secondHiddenOption = document.createElement('div');
    hiddenOption.style.display = 'none';
    secondHiddenOption.style.display = 'none';

    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = jasmine.createSpy('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () =>
        [
          { _getHostElement: () => hiddenOption },
          { _getHostElement: () => visibleOption },
          { _getHostElement: () => secondHiddenOption }
        ] as any[]
    };

    directive.setItems(['A', 'B', 'C']);
    directive.onFilterInput('b');

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(1);
  });

  it('sollte Enter im Input die erste sichtbare Option selektieren', () => {
    const keyManager = {
      activeItemIndex: 0,
      destroy: jasmine.createSpy('destroy'),
      setActiveItem: jasmine.createSpy('setActiveItem').and.callFake((index: number) => {
        keyManager.activeItemIndex = index;
      })
    };
    const hiddenOption = document.createElement('div');
    hiddenOption.style.display = 'none';
    const visibleOption = { _getHostElement: () => document.createElement('div'), _selectViaInteraction: jasmine.createSpy('_selectViaInteraction') };
    const closeSpy = jasmine.createSpy('close');

    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect.close = closeSpy;
    (directive as any).matSelect.options = {
      toArray: () =>
        [
          { _getHostElement: () => hiddenOption },
          visibleOption
        ] as any[]
    };

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(1);
    expect(visibleOption._selectViaInteraction).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('sollte Enter im Panel die aktive sichtbare Option selektieren und im Single-Select schließen', () => {
    const keyManager = {
      activeItemIndex: 1,
      destroy: jasmine.createSpy('destroy'),
      setActiveItem: jasmine.createSpy('setActiveItem').and.callFake((index: number) => {
        keyManager.activeItemIndex = index;
      })
    };
    const firstOption = { _getHostElement: () => document.createElement('div'), _selectViaInteraction: jasmine.createSpy('_selectViaInteraction') };
    const secondOption = { _getHostElement: () => document.createElement('div'), _selectViaInteraction: jasmine.createSpy('_selectViaInteraction') };
    const closeSpy = jasmine.createSpy('close');

    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect.close = closeSpy;
    (directive as any).matSelect.options = {
      toArray: () => [firstOption, secondOption] as any[]
    };

    directive.handleOptionKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(1);
    expect(secondOption._selectViaInteraction).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('sollte bei initial aktiver erster Option mit ArrowDown direkt zur nächsten navigieren', () => {
    const keyManager = {
      activeItemIndex: 0,
      destroy: jasmine.createSpy('destroy'),
      setActiveItem: jasmine.createSpy('setActiveItem').and.callFake((index: number) => {
        keyManager.activeItemIndex = index;
      })
    };
    const firstOptionElement = document.createElement('div');
    const secondOptionElement = document.createElement('div');

    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = jasmine.createSpy('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () =>
        [
          { _getHostElement: () => firstOptionElement },
          { _getHostElement: () => secondOptionElement }
        ] as any[]
    };

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(1);
  });

  it('sollte bei Arrow-Navigation den Fokus im Filter-Input lassen', () => {
    const keyManager = {
      activeItemIndex: 0,
      destroy: jasmine.createSpy('destroy'),
      setActiveItem: jasmine.createSpy('setActiveItem').and.callFake((index: number) => {
        keyManager.activeItemIndex = index;
      })
    };
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    directive.setFilterInputRef(new ElementRef(input));

    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = jasmine.createSpy('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () =>
        [
          { _getHostElement: () => document.createElement('div') },
          { _getHostElement: () => document.createElement('div') }
        ] as any[]
    };

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(document.activeElement).toBe(input);
    document.body.removeChild(input);
  });

  it('sollte bei ArrowDown im Option-Fokus nur sichtbare Optionen ansteuern', () => {
    const keyManager = {
      activeItemIndex: 0,
      destroy: jasmine.createSpy('destroy'),
      setActiveItem: jasmine.createSpy('setActiveItem').and.callFake((index: number) => {
        keyManager.activeItemIndex = index;
      })
    };
    const firstVisibleOption = document.createElement('div');
    const hiddenOption = document.createElement('div');
    const thirdVisibleOption = document.createElement('div');
    firstVisibleOption.tabIndex = -1;
    hiddenOption.style.display = 'none';
    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = jasmine.createSpy('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () =>
        [
          { _getHostElement: () => firstVisibleOption },
          { _getHostElement: () => hiddenOption },
          { _getHostElement: () => thirdVisibleOption }
        ] as any[]
    };

    directive.handleOptionKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(2);
  });

  it('sollte Tab aus dem Filter-Input behandeln und schließen', fakeAsync(() => {
    const closeSpy = jasmine.createSpy('close');
    const focusNextSpy = spyOn(LuxSelectFilterUtils, 'focusNextFocusableElement');
    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect.close = closeSpy;
    (directive as any).matSelect._elementRef = new ElementRef(document.createElement('div'));

    const fromInput = directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
    (directive as any).onPanelClose();
    tick();

    expect(fromInput).toBeTrue();
    expect(closeSpy).toHaveBeenCalled();
    expect(focusNextSpy).toHaveBeenCalled();
  }));

  it('sollte Shift+Tab aus dem Filter-Input rückwärts behandeln und schließen', fakeAsync(() => {
    const closeSpy = jasmine.createSpy('close');
    const focusPreviousSpy = spyOn(LuxSelectFilterUtils, 'focusPreviousFocusableElement');
    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect.close = closeSpy;
    (directive as any).matSelect._elementRef = new ElementRef(document.createElement('div'));

    const fromInput = directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));
    (directive as any).onPanelClose();
    tick();

    expect(fromInput).toBeTrue();
    expect(closeSpy).toHaveBeenCalled();
    expect(focusPreviousSpy).toHaveBeenCalled();
  }));

  it('sollte Tab aus dem Panel nativ unbehandelt lassen', () => {
    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    const fromPanel = directive.handleOptionKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));

    expect(fromPanel).toBeFalse();
  });

  it('sollte nach nativem Tab aus dem Panel keinen Trigger-Fokus erzwingen', fakeAsync(() => {
    const focusSpy = jasmine.createSpy('focus');
    (directive as any).matSelect.focus = focusSpy;
    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);

    directive.handleOptionKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
    (directive as any).onPanelClose();
    tick();

    expect(focusSpy).not.toHaveBeenCalled();
  }));

  it('sollte Escape nativ unbehandelt lassen', () => {
    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);

    const handled = directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(handled).toBeFalse();
  });

  it('sollte beim Schließen den Trigger fokussieren, wenn der Fokus verloren ging', fakeAsync(() => {
    const focusSpy = jasmine.createSpy('focus');
    (directive as any).matSelect.focus = focusSpy;

    (directive as any).onPanelClose();
    tick();

    expect(focusSpy).toHaveBeenCalled();
  }));

  it('sollte nach Tab-basiertem Schließen keinen Trigger-Fokus erzwingen', fakeAsync(() => {
    const focusSpy = jasmine.createSpy('focus');
    (directive as any).matSelect.focus = focusSpy;
    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
    (directive as any).onPanelClose();
    tick();

    expect(focusSpy).not.toHaveBeenCalled();
  }));

  it('sollte Zeichen im Panel nicht in den Filter umleiten', () => {
    const keyManager = {
      activeItemIndex: 0,
      destroy: jasmine.createSpy('destroy'),
      setActiveItem: jasmine.createSpy('setActiveItem')
    };
    directive.filterValue = 'ab';

    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect._keyManager = keyManager;

    const handled = directive.handleOptionKeydown(new KeyboardEvent('keydown', { key: 'c' }));

    expect(handled).toBeFalse();
    expect(directive.filterValue).toBe('ab');
  });

  it('sollte Tab-Navigation am aktiven Element ausrichten, wenn der Select-Host nicht fokussierbar ist', fakeAsync(() => {
    const closeSpy = jasmine.createSpy('close');
    const focusNextSpy = spyOn(LuxSelectFilterUtils, 'focusNextFocusableElement');
    const activeAnchor = document.createElement('button');
    document.body.appendChild(activeAnchor);
    activeAnchor.focus();

    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect.close = closeSpy;
    (directive as any).matSelect._elementRef = new ElementRef(document.createElement('div'));

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
    (directive as any).onPanelClose();
    tick();

    expect(closeSpy).toHaveBeenCalled();
    expect(focusNextSpy).toHaveBeenCalledWith(activeAnchor);

    document.body.removeChild(activeAnchor);
  }));

  it('sollte geplante Tab-Navigation bei Destroy abbrechen', fakeAsync(() => {
    const closeSpy = jasmine.createSpy('close');
    const focusNextSpy = spyOn(LuxSelectFilterUtils, 'focusNextFocusableElement');
    const activeAnchor = document.createElement('button');
    document.body.appendChild(activeAnchor);
    activeAnchor.focus();

    spyOnProperty((directive as any).matSelect, 'panelOpen', 'get').and.returnValue(true);
    (directive as any).matSelect.close = closeSpy;
    (directive as any).matSelect._elementRef = new ElementRef(document.createElement('div'));

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
    (directive as any).onPanelClose();
    directive.ngOnDestroy();
    tick();

    expect(closeSpy).toHaveBeenCalled();
    expect(focusNextSpy).not.toHaveBeenCalled();

    document.body.removeChild(activeAnchor);
  }));
});

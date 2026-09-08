import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxSelectFilterDirective } from './lux-select-filter.directive';
import { LuxSelectFilterUtils } from './lux-select-filter.utils';

@Component({
  selector: 'lux-test-component',
  template: `
    <mat-select [luxSelectFilter]="enableFilter" [luxFilterLabelFn]="labelFn" (luxFilterActiveChange)="onFilterActiveChange($event)">
      @for (item of items; track item) {
        <mat-option [value]="item">{{ item }}</mat-option>
      }
    </mat-select>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    await LuxTestHelper.wait(fixture);

    const matSelect = fixture.debugElement.query((el) => el.componentInstance instanceof MatSelect);
    directive = matSelect?.injector.get(LuxSelectFilterDirective);
  });

  afterEach(() => {
    // Mehrere Tests planen über handleKeydown('Tab') einen verzögerten Fokuswechsel
    // (setTimeout). Ohne explizites Zerstören der Fixture bleibt dieser Timer aktiv und kann
    // während eines späteren Tests feuern und dort auf LuxSelectFilterUtils.focusNextFocusableElement
    // gespotte Aufrufe verfälschen (isolate:false teilt den Ausführungskontext über Testdateien
    // hinweg, siehe Vitest-Runner-Default).
    fixture?.destroy();
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
    expect(directive.filteredItems.has('Deutschland')).toBe(true);
  });

  it('sollte case-insensitive filtern', () => {
    directive.setItems(['Deutschland', 'Belgien', 'Frankreich']);
    directive.onFilterInput('DEU');

    expect(directive.filteredItems.has('Deutschland')).toBe(true);
  });

  it('sollte alle Items zurückgeben bei leerem Filter', () => {
    directive.setItems(['Deutschland', 'Belgien', 'Frankreich']);
    directive.onFilterInput('');

    expect(directive.filteredItems.size).toBe(3);
  });

  it('sollte isFilterActive korrekt zurückgeben', () => {
    directive.filterValue = '';
    expect(directive.isFilterActive()).toBe(false);

    directive.filterValue = 'test';
    expect(directive.isFilterActive()).toBe(true);

    directive.filterValue = '   ';
    expect(directive.isFilterActive()).toBe(false);
  });

  it('sollte isItemVisible korrekt prüfen', () => {
    directive.setItems(['Deutschland', 'Belgien']);
    directive.onFilterInput('deu');

    expect(directive.isItemVisible('Deutschland')).toBe(true);
    expect(directive.isItemVisible('Belgien')).toBe(false);
  });

  it('sollte isIndexVisible korrekt prüfen', () => {
    directive.setItems(['Deutschland', 'Belgien']);
    directive.onFilterInput('deu');

    expect(directive.isIndexVisible(0)).toBe(true);
    expect(directive.isIndexVisible(1)).toBe(false);
  });

  it('sollte bei ArrowDown im Filter fortlaufend durch sichtbare Optionen navigieren', () => {
    const keyManager = {
      activeItemIndex: -1,
      destroy: vi.fn().mockName('destroy'),
      setActiveItem: vi
        .fn()
        .mockName('setActiveItem')
        .mockImplementation((index: number) => {
          keyManager.activeItemIndex = index;
        })
    };
    const firstOptionElement = document.createElement('div');
    const secondOptionElement = document.createElement('div');

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = vi.fn().mockName('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () => [{ _getHostElement: () => firstOptionElement }, { _getHostElement: () => secondOptionElement }] as any[]
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
      destroy: vi.fn().mockName('destroy'),
      setActiveItem: vi
        .fn()
        .mockName('setActiveItem')
        .mockImplementation((index: number) => {
          keyManager.activeItemIndex = index;
        })
    };
    const firstOptionElement = document.createElement('div');
    const secondOptionElement = document.createElement('div');

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = vi.fn().mockName('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () => [{ _getHostElement: () => firstOptionElement }, { _getHostElement: () => secondOptionElement }] as any[]
    };

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(1);
    expect(keyManager.setActiveItem).toHaveBeenCalledWith(0);
    expect(keyManager.setActiveItem).toHaveBeenCalledWith(0);
  });

  it('sollte bei PageDown ohne aktive Option material-konform ans sichtbare Ende springen', () => {
    const keyManager = {
      activeItemIndex: -1,
      destroy: vi.fn().mockName('destroy'),
      setActiveItem: vi
        .fn()
        .mockName('setActiveItem')
        .mockImplementation((index: number) => {
          keyManager.activeItemIndex = index;
        })
    };

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = vi.fn().mockName('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () =>
        Array.from({ length: 5 }, () => ({
          _getHostElement: () => document.createElement('div')
        })) as any[]
    };

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'PageDown' }));

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(4);
  });

  it('sollte bei PageUp ohne aktive Option material-konform an den sichtbaren Anfang springen', () => {
    const keyManager = {
      activeItemIndex: -1,
      destroy: vi.fn().mockName('destroy'),
      setActiveItem: vi
        .fn()
        .mockName('setActiveItem')
        .mockImplementation((index: number) => {
          keyManager.activeItemIndex = index;
        })
    };

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = vi.fn().mockName('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () =>
        Array.from({ length: 5 }, () => ({
          _getHostElement: () => document.createElement('div')
        })) as any[]
    };

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'PageUp' }));

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(0);
  });

  it('sollte bei Home und End zu den sichtbaren Grenzen navigieren', () => {
    const keyManager = {
      activeItemIndex: -1,
      destroy: vi.fn().mockName('destroy'),
      setActiveItem: vi
        .fn()
        .mockName('setActiveItem')
        .mockImplementation((index: number) => {
          keyManager.activeItemIndex = index;
        })
    };

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = vi.fn().mockName('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () =>
        Array.from({ length: 5 }, () => ({
          _getHostElement: () => document.createElement('div')
        })) as any[]
    };

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'End' }));
    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Home' }));

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(4);
    expect(keyManager.setActiveItem).toHaveBeenCalledWith(0);
  });

  it('sollte bei Filteränderung aktive unsichtbare Option auf erste sichtbare setzen', () => {
    const keyManager = {
      activeItemIndex: 2,
      destroy: vi.fn().mockName('destroy'),
      setActiveItem: vi
        .fn()
        .mockName('setActiveItem')
        .mockImplementation((index: number) => {
          keyManager.activeItemIndex = index;
        })
    };
    const hiddenOption = document.createElement('div');
    const visibleOption = document.createElement('div');
    const secondHiddenOption = document.createElement('div');
    hiddenOption.style.display = 'none';
    secondHiddenOption.style.display = 'none';

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = vi.fn().mockName('scrollOptionIntoView');
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
      destroy: vi.fn().mockName('destroy'),
      setActiveItem: vi
        .fn()
        .mockName('setActiveItem')
        .mockImplementation((index: number) => {
          keyManager.activeItemIndex = index;
        })
    };
    const hiddenOption = document.createElement('div');
    hiddenOption.style.display = 'none';
    const visibleOption = {
      _getHostElement: () => document.createElement('div'),
      _selectViaInteraction: vi.fn().mockName('_selectViaInteraction')
    };
    const closeSpy = vi.fn().mockName('close');

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect.close = closeSpy;
    (directive as any).matSelect.options = {
      toArray: () => [{ _getHostElement: () => hiddenOption }, visibleOption] as any[]
    };

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(1);
    expect(visibleOption._selectViaInteraction).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('sollte Enter im Panel die aktive sichtbare Option selektieren und im Single-Select schließen', () => {
    const keyManager = {
      activeItemIndex: 1,
      destroy: vi.fn().mockName('destroy'),
      setActiveItem: vi
        .fn()
        .mockName('setActiveItem')
        .mockImplementation((index: number) => {
          keyManager.activeItemIndex = index;
        })
    };
    const firstOption = {
      _getHostElement: () => document.createElement('div'),
      _selectViaInteraction: vi.fn().mockName('_selectViaInteraction')
    };
    const secondOption = {
      _getHostElement: () => document.createElement('div'),
      _selectViaInteraction: vi.fn().mockName('_selectViaInteraction')
    };
    const closeSpy = vi.fn().mockName('close');

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
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
      destroy: vi.fn().mockName('destroy'),
      setActiveItem: vi
        .fn()
        .mockName('setActiveItem')
        .mockImplementation((index: number) => {
          keyManager.activeItemIndex = index;
        })
    };
    const firstOptionElement = document.createElement('div');
    const secondOptionElement = document.createElement('div');

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = vi.fn().mockName('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () => [{ _getHostElement: () => firstOptionElement }, { _getHostElement: () => secondOptionElement }] as any[]
    };

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(1);
  });

  it('sollte bei Arrow-Navigation den Fokus im Filter-Input lassen', () => {
    const keyManager = {
      activeItemIndex: 0,
      destroy: vi.fn().mockName('destroy'),
      setActiveItem: vi
        .fn()
        .mockName('setActiveItem')
        .mockImplementation((index: number) => {
          keyManager.activeItemIndex = index;
        })
    };
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    directive.setFilterInputRef(new ElementRef(input));

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = vi.fn().mockName('scrollOptionIntoView');
    (directive as any).matSelect.options = {
      toArray: () =>
        [{ _getHostElement: () => document.createElement('div') }, { _getHostElement: () => document.createElement('div') }] as any[]
    };

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(document.activeElement).toBe(input);
    document.body.removeChild(input);
  });

  it('sollte bei ArrowDown im Option-Fokus nur sichtbare Optionen ansteuern', () => {
    const keyManager = {
      activeItemIndex: 0,
      destroy: vi.fn().mockName('destroy'),
      setActiveItem: vi
        .fn()
        .mockName('setActiveItem')
        .mockImplementation((index: number) => {
          keyManager.activeItemIndex = index;
        })
    };
    const firstVisibleOption = document.createElement('div');
    const hiddenOption = document.createElement('div');
    const thirdVisibleOption = document.createElement('div');
    firstVisibleOption.tabIndex = -1;
    hiddenOption.style.display = 'none';
    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect._keyManager = keyManager;
    (directive as any).matSelect._scrollOptionIntoView = vi.fn().mockName('scrollOptionIntoView');
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

  it('sollte Tab aus dem Filter-Input behandeln und schließen', async () => {
    const closeSpy = vi.fn().mockName('close');
    const focusNextSpy = vi.spyOn(LuxSelectFilterUtils, 'focusNextFocusableElement').mockReturnValue(undefined);
    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect.close = closeSpy;
    (directive as any).matSelect._elementRef = new ElementRef(document.createElement('div'));

    const fromInput = directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
    (directive as any).onPanelClose();
    await LuxTestHelper.wait(fixture);

    expect(fromInput).toBe(true);
    expect(closeSpy).toHaveBeenCalled();
    expect(focusNextSpy).toHaveBeenCalled();
  });

  it('sollte Shift+Tab aus dem Filter-Input rückwärts behandeln und schließen', async () => {
    const closeSpy = vi.fn().mockName('close');
    const focusPreviousSpy = vi.spyOn(LuxSelectFilterUtils, 'focusPreviousFocusableElement').mockReturnValue(undefined);
    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect.close = closeSpy;
    (directive as any).matSelect._elementRef = new ElementRef(document.createElement('div'));

    const fromInput = directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));
    (directive as any).onPanelClose();
    await LuxTestHelper.wait(fixture);

    expect(fromInput).toBe(true);
    expect(closeSpy).toHaveBeenCalled();
    expect(focusPreviousSpy).toHaveBeenCalled();
  });

  it('sollte Tab aus dem Panel nativ unbehandelt lassen', () => {
    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    const fromPanel = directive.handleOptionKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));

    expect(fromPanel).toBe(false);
  });

  it('sollte nach nativem Tab aus dem Panel keinen Trigger-Fokus erzwingen', async () => {
    const focusSpy = vi.fn().mockName('focus');
    (directive as any).matSelect.focus = focusSpy;
    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);

    directive.handleOptionKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
    (directive as any).onPanelClose();
    await LuxTestHelper.wait(fixture);

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('sollte Escape nativ unbehandelt lassen', () => {
    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);

    const handled = directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(handled).toBe(false);
  });

  it('sollte beim Schließen den Trigger fokussieren, wenn der Fokus verloren ging', async () => {
    const focusSpy = vi.fn().mockName('focus');
    (directive as any).matSelect.focus = focusSpy;

    (directive as any).onPanelClose();
    await LuxTestHelper.wait(fixture);

    expect(focusSpy).toHaveBeenCalled();
  });

  it('sollte externen Fokus beim Schließen nicht überschreiben', async () => {
    const focusSpy = vi.fn().mockName('focus');
    const externalButton = document.createElement('button');
    document.body.appendChild(externalButton);
    externalButton.focus();
    (directive as any).matSelect.focus = focusSpy;

    (directive as any).onPanelClose();
    await LuxTestHelper.wait(fixture);

    expect(document.activeElement).toBe(externalButton);
    expect(focusSpy).not.toHaveBeenCalled();

    document.body.removeChild(externalButton);
  });

  it('sollte nach Tab-basiertem Schließen keinen Trigger-Fokus erzwingen', async () => {
    const focusSpy = vi.fn().mockName('focus');
    (directive as any).matSelect.focus = focusSpy;
    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
    (directive as any).onPanelClose();
    await LuxTestHelper.wait(fixture);

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('sollte Zeichen im Panel nicht in den Filter umleiten', () => {
    const keyManager = {
      activeItemIndex: 0,
      destroy: vi.fn().mockName('destroy'),
      setActiveItem: vi.fn().mockName('setActiveItem')
    };
    directive.filterValue = 'ab';

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect._keyManager = keyManager;

    const handled = directive.handleOptionKeydown(new KeyboardEvent('keydown', { key: 'c' }));

    expect(handled).toBe(false);
    expect(directive.filterValue).toBe('ab');
  });

  it('sollte Tab-Navigation am aktiven Element ausrichten, wenn der Select-Host nicht fokussierbar ist', async () => {
    const closeSpy = vi.fn().mockName('close');
    const focusNextSpy = vi.spyOn(LuxSelectFilterUtils, 'focusNextFocusableElement').mockReturnValue(undefined);
    const activeAnchor = document.createElement('button');
    document.body.appendChild(activeAnchor);
    activeAnchor.focus();

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect.close = closeSpy;
    (directive as any).matSelect._elementRef = new ElementRef(document.createElement('div'));

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
    (directive as any).onPanelClose();
    await LuxTestHelper.wait(fixture);

    expect(closeSpy).toHaveBeenCalled();
    // Per Referenzgleichheit statt toHaveBeenCalledWith(): unter isolate:false könnten mehrere
    // strukturell identische <button>-Elemente aus anderen Tests im Spiel sein, die
    // toHaveBeenCalledWith() sonst fälschlich als Treffer werten würde.
    const calledWithOwnAnchor = focusNextSpy.mock.calls.some((call) => call[0] === activeAnchor);
    expect(calledWithOwnAnchor).toBe(true);

    document.body.removeChild(activeAnchor);
  });

  it('sollte geplante Tab-Navigation bei Destroy abbrechen', async () => {
    const closeSpy = vi.fn().mockName('close');
    const focusNextSpy = vi.spyOn(LuxSelectFilterUtils, 'focusNextFocusableElement').mockReturnValue(undefined);
    const activeAnchor = document.createElement('button');
    document.body.appendChild(activeAnchor);
    activeAnchor.focus();

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect.close = closeSpy;
    (directive as any).matSelect._elementRef = new ElementRef(document.createElement('div'));

    directive.handleKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
    (directive as any).onPanelClose();
    directive.ngOnDestroy();
    await LuxTestHelper.wait(fixture);

    expect(closeSpy).toHaveBeenCalled();
    // Gezielt per Referenzgleichheit auf den eigenen Anchor dieses Tests prüfen statt "gar nicht
    // aufgerufen" bzw. toHaveBeenCalledWith(): unter isolate:false (Default dieses Vitest-Runners)
    // teilen sich alle Spec-Dateien einen Ausführungskontext, wodurch andere (nicht per
    // fixture.destroy() aufgeräumte) Tests ebenfalls verzögerte Aufrufe auf dieser statischen
    // Utility-Funktion planen können - inklusive strukturell identischer (aber anderer) <button>-
    // Elemente, die toHaveBeenCalledWith() sonst fälschlich als Treffer werten würde.
    const calledWithOwnAnchor = focusNextSpy.mock.calls.some((call) => call[0] === activeAnchor);
    expect(calledWithOwnAnchor).toBe(false);

    document.body.removeChild(activeAnchor);
  });

  it('sollte bei Outside-Click keinen Trigger-Fokus erzwingen', async () => {
    const focusSpy = vi.fn().mockName('focus');
    const selectHost = document.createElement('div');
    const panel = document.createElement('div');
    const externalButton = document.createElement('button');
    document.body.appendChild(selectHost);
    document.body.appendChild(panel);
    document.body.appendChild(externalButton);

    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    (directive as any).matSelect.focus = focusSpy;
    (directive as any).matSelect.panel = new ElementRef(panel);
    (directive as any).matSelect._elementRef = new ElementRef(selectHost);

    (directive as any).registerPanelKeydownListener();
    externalButton.focus();
    externalButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    (directive as any).onPanelClose();
    await LuxTestHelper.wait(fixture);

    expect(document.activeElement).toBe(externalButton);
    expect(focusSpy).not.toHaveBeenCalled();

    directive.ngOnDestroy();
    document.body.removeChild(externalButton);
    document.body.removeChild(panel);
    document.body.removeChild(selectHost);
  });

  it('sollte im geöffneten Multiselect nach Mausklick auf eine Option wieder das Filter-Input fokussieren', async () => {
    const input = document.createElement('input');
    const panel = document.createElement('div');
    const option = document.createElement('div');
    option.classList.add('mat-mdc-option');
    panel.appendChild(option);
    document.body.appendChild(input);
    document.body.appendChild(panel);

    directive.setFilterInputRef(new ElementRef(input));
    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    vi.spyOn((directive as any).matSelect, 'multiple', 'get').mockReturnValue(true);
    (directive as any).matSelect.panel = new ElementRef(panel);

    (directive as any).registerPanelKeydownListener();
    option.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await LuxTestHelper.wait(fixture);

    expect(document.activeElement).toBe(input);

    directive.ngOnDestroy();
    document.body.removeChild(panel);
    document.body.removeChild(input);
  });

  it('sollte den Refokus nach Multiselect-Klick ohne Scrollen ausführen', async () => {
    const input = document.createElement('input');
    const focusSpy = vi.spyOn(input, 'focus');
    const panel = document.createElement('div');
    const option = document.createElement('div');
    option.classList.add('mat-mdc-option');
    panel.appendChild(option);
    document.body.appendChild(input);
    document.body.appendChild(panel);

    directive.setFilterInputRef(new ElementRef(input));
    vi.spyOn((directive as any).matSelect, 'panelOpen', 'get').mockReturnValue(true);
    vi.spyOn((directive as any).matSelect, 'multiple', 'get').mockReturnValue(true);
    (directive as any).matSelect.panel = new ElementRef(panel);

    (directive as any).registerPanelKeydownListener();
    option.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await LuxTestHelper.wait(fixture);

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });

    directive.ngOnDestroy();
    document.body.removeChild(panel);
    document.body.removeChild(input);
  });
});

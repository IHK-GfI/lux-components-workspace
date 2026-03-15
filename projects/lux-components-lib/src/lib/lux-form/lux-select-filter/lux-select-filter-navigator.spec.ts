import { ElementRef } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import {
  InternalKeyManager,
  LuxSelectFilterNavigator,
  MatSelectInternal
} from './lux-select-filter-navigator';

describe('LuxSelectFilterNavigator', () => {
  function createOption(
    config: {
      host?: HTMLElement;
      select?: jasmine.Spy;
      selectViaInteraction?: jasmine.Spy;
    } = {}
  ): MatOption {
    return {
      _getHostElement: config.host ? () => config.host as HTMLElement : undefined,
      select: config.select ?? jasmine.createSpy('select'),
      _selectViaInteraction: config.selectViaInteraction
    } as unknown as MatOption;
  }

  function createMatSelect(options: MatOption[], config: { panel?: HTMLElement; multiple?: boolean } = {}): MatSelect {
    return {
      options: { toArray: () => options },
      panel: config.panel ? new ElementRef(config.panel) : undefined,
      multiple: config.multiple ?? false,
      close: jasmine.createSpy('close')
    } as unknown as MatSelect;
  }

  function createKeyManager(overrides: Partial<InternalKeyManager> = {}): InternalKeyManager {
    return {
      activeItemIndex: -1,
      setActiveItem: jasmine.createSpy('setActiveItem'),
      ...overrides
    };
  }

  it('setzt bei unsichtbaren Optionen das aktive Item auf -1 zurück', () => {
    const hiddenHost = document.createElement('div');
    hiddenHost.style.display = 'none';
    const keyManager = createKeyManager({ updateActiveItem: jasmine.createSpy('updateActiveItem') });
    const matSelect = createMatSelect([createOption({ host: hiddenHost })]);
    const navigator = new LuxSelectFilterNavigator(matSelect, { _keyManager: keyManager }, () => 0);

    navigator.syncActiveItemToVisibleOptions();

    expect(keyManager.updateActiveItem).toHaveBeenCalledWith(-1);
  });

  it('ermittelt die aktive Option auch über activeItem, wenn activeItemIndex fehlt', () => {
    const firstHost = document.createElement('div');
    const secondHost = document.createElement('div');
    const thirdHost = document.createElement('div');
    const options = [createOption({ host: firstHost }), createOption({ host: secondHost }), createOption({ host: thirdHost })];
    const keyManager = createKeyManager({
      activeItem: options[1],
      setActiveItem: jasmine.createSpy('setActiveItem')
    });
    const matSelect = createMatSelect(options);
    const navigator = new LuxSelectFilterNavigator(matSelect, { _keyManager: keyManager }, () => 0);

    navigator.moveActiveVisibleOption(1);

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(2);
  });

  it('fällt im Multiselect auf option.select zurück und fokussiert danach wieder den Filterfluss', () => {
    const hiddenHost = document.createElement('div');
    hiddenHost.style.display = 'none';
    const visibleHost = document.createElement('div');
    const selectSpy = jasmine.createSpy('select');
    const options = [createOption({ host: hiddenHost }), createOption({ host: visibleHost, select: selectSpy })];
    const keyManager = createKeyManager({
      setActiveItem: jasmine.createSpy('setActiveItem').and.callFake((index: number) => {
        keyManager.activeItemIndex = index;
      })
    });
    const matSelect = createMatSelect(options, { multiple: true });
    const continueFilteringSpy = jasmine.createSpy('continueFiltering');
    const navigator = new LuxSelectFilterNavigator(matSelect, { _keyManager: keyManager }, () => 0);

    navigator.selectActiveOrFirstVisibleOption(continueFilteringSpy);

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(1);
    expect(selectSpy).toHaveBeenCalled();
    expect(continueFilteringSpy).toHaveBeenCalled();
    expect(matSelect.close).not.toHaveBeenCalled();
  });

  it('korrigiert den Scrollbereich, wenn die aktive Option unter dem Sticky-Filter landen würde', () => {
    const panel = document.createElement('div');
    Object.defineProperty(panel, 'scrollTop', { value: 100, writable: true, configurable: true });
    panel.getBoundingClientRect = () =>
      ({
        top: 0,
        bottom: 200
      }) as DOMRect;

    const optionHost = document.createElement('div');
    optionHost.getBoundingClientRect = () =>
      ({
        top: 10,
        bottom: 30
      }) as DOMRect;

    const option = createOption({ host: optionHost });
    const keyManager = createKeyManager({
      setActiveItem: jasmine.createSpy('setActiveItem').and.callFake((index: number) => {
        keyManager.activeItemIndex = index;
      })
    });
    const internalSelect: MatSelectInternal = {
      _keyManager: keyManager,
      _scrollOptionIntoView: jasmine.createSpy('_scrollOptionIntoView')
    };
    const matSelect = createMatSelect([option], { panel });
    const navigator = new LuxSelectFilterNavigator(matSelect, internalSelect, () => 40);

    navigator.moveToVisibleBoundary('start');

    expect(keyManager.setActiveItem).toHaveBeenCalledWith(0);
    expect(panel.scrollTop).toBe(70);
  });
});

import { LuxSelectFilterUtils } from './lux-select-filter.utils';

describe('LuxSelectFilterUtils', () => {
  describe('normalize', () => {
    it('sollte einen String zu lowercase konvertieren', () => {
      expect(LuxSelectFilterUtils.normalize('DEUTSCHLAND')).toBe('deutschland');
      expect(LuxSelectFilterUtils.normalize('BeLgIeN')).toBe('belgien');
    });

    it('sollte null und undefined handhaben', () => {
      expect(LuxSelectFilterUtils.normalize(null)).toBe('');
      expect(LuxSelectFilterUtils.normalize(undefined)).toBe('');
    });

    it('sollte Zahlen zu String konvertieren', () => {
      expect(LuxSelectFilterUtils.normalize(123)).toBe('123');
    });
  });

  describe('focus navigation helpers', () => {
    it('sollte auf das nächste fokussierbare Element springen', () => {
      const host = document.createElement('div');
      const first = document.createElement('button');
      const second = document.createElement('button');
      host.appendChild(first);
      host.appendChild(second);
      document.body.appendChild(host);

      first.focus();
      LuxSelectFilterUtils.focusNextFocusableElement(first);

      expect(document.activeElement).toBe(second);
      document.body.removeChild(host);
    });

    it('sollte auf das vorherige fokussierbare Element springen', () => {
      const host = document.createElement('div');
      const first = document.createElement('button');
      const second = document.createElement('button');
      host.appendChild(first);
      host.appendChild(second);
      document.body.appendChild(host);

      second.focus();
      LuxSelectFilterUtils.focusPreviousFocusableElement(second);

      expect(document.activeElement).toBe(first);
      document.body.removeChild(host);
    });

    it('sollte versteckte Fokusziele aus der Navigation ausschließen', () => {
      const host = document.createElement('div');
      const first = document.createElement('button');
      const hidden = document.createElement('button');
      const second = document.createElement('button');
      hidden.style.display = 'none';

      host.appendChild(first);
      host.appendChild(hidden);
      host.appendChild(second);
      document.body.appendChild(host);

      first.focus();
      LuxSelectFilterUtils.focusNextFocusableElement(first);

      expect(document.activeElement).toBe(second);
      document.body.removeChild(host);
    });
  });

});

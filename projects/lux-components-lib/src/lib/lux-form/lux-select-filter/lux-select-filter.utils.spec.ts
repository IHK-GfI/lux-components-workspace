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

  describe('matches', () => {
    it('sollte case-insensitive matchen', () => {
      expect(LuxSelectFilterUtils.matches('Deutschland', 'deu')).toBeTrue();
      expect(LuxSelectFilterUtils.matches('DEUTSCHLAND', 'deu')).toBeTrue();
      expect(LuxSelectFilterUtils.matches('deutschland', 'DEU')).toBeTrue();
    });

    it('sollte false zurückgeben wenn nicht matched', () => {
      expect(LuxSelectFilterUtils.matches('Belgien', 'deu')).toBeFalse();
    });

    it('sollte true zurückgeben bei leerem Filter', () => {
      expect(LuxSelectFilterUtils.matches('Belgien', '')).toBeTrue();
      expect(LuxSelectFilterUtils.matches('Belgien', '   ')).toBeTrue();
    });
  });

  describe('sortWithSelectedFirst', () => {
    it('sollte selektierte Items zuerst sortieren', () => {
      const items = ['A', 'B', 'C', 'D'];
      const selected = new Set(['C', 'A']);

      const result = LuxSelectFilterUtils.sortWithSelectedFirst(items, selected);

      expect(result).toEqual(['A', 'C', 'B', 'D']);
    });

    it('sollte die ursprüngliche Reihenfolge beibehalten', () => {
      const items = ['A', 'B', 'C', 'D'];
      const selected = new Set<string>();

      const result = LuxSelectFilterUtils.sortWithSelectedFirst(items, selected);

      expect(result).toEqual(['A', 'B', 'C', 'D']);
    });
  });

  describe('sortIndexesWithSelectedFirst', () => {
    it('sollte selektierte Indizes zuerst sortieren', () => {
      const selected = new Set([2, 0]);
      const result = LuxSelectFilterUtils.sortIndexesWithSelectedFirst(4, selected);

      expect(result).toEqual([0, 2, 1, 3]);
    });

    it('sollte alle Indizes zurückgeben wenn keine selektiert', () => {
      const selected = new Set<number>();
      const result = LuxSelectFilterUtils.sortIndexesWithSelectedFirst(3, selected);

      expect(result).toEqual([0, 1, 2]);
    });
  });

  describe('findSelectedIndexes', () => {
    it('sollte selektierte Indizes finden', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const selected = [{ id: 2 }, { id: 3 }];
      const compareFn = (a: any, b: any) => a.id === b.id;

      const result = LuxSelectFilterUtils.findSelectedIndexes(items, selected, compareFn);

      expect(result).toEqual(new Set([1, 2]));
    });

    it('sollte mit einzelnem Wert funktionieren', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const selected = { id: 2 };
      const compareFn = (a: any, b: any) => a.id === b.id;

      const result = LuxSelectFilterUtils.findSelectedIndexes(items, selected, compareFn);

      expect(result).toEqual(new Set([1]));
    });
  });

  describe('findSelectedIndexesByPickValue', () => {
    it('sollte selektierte Indizes via PickValue finden', () => {
      const pickValues = [1, 2, 3, 4];
      const selected = [2, 4];

      const result = LuxSelectFilterUtils.findSelectedIndexesByPickValue(pickValues, selected);

      expect(result).toEqual(new Set([1, 3]));
    });

    it('sollte mit einzelnem Wert funktionieren', () => {
      const pickValues = [1, 2, 3, 4];
      const selected = 3;

      const result = LuxSelectFilterUtils.findSelectedIndexesByPickValue(pickValues, selected);

      expect(result).toEqual(new Set([2]));
    });
  });
});

import { LuxUtil } from './lux-util';

// Die Erwartungen werden über toISOString() bzw. die UTC-Getter geprüft
// und sind damit unabhängig von der Zeitzone, in der die Tests laufen.
describe('LuxUtil', () => {
  describe('parseISO8601AsUTC', () => {
    it('Sollte einen ISO-String ohne Zeitzoneninfo als UTC interpretieren', () => {
      expect(LuxUtil.parseISO8601AsUTC('2027-03-13T00:00:00').toISOString()).toEqual('2027-03-13T00:00:00.000Z');
      expect(LuxUtil.parseISO8601AsUTC('2027-03-13T23:30:15').toISOString()).toEqual('2027-03-13T23:30:15.000Z');
    });

    it('Sollte Nachkommastellen ohne Zeitzoneninfo übernehmen', () => {
      expect(LuxUtil.parseISO8601AsUTC('2027-03-13T14:30:15.5').toISOString()).toEqual('2027-03-13T14:30:15.500Z');
      expect(LuxUtil.parseISO8601AsUTC('2027-03-13T14:30:15.1234567').toISOString()).toEqual('2027-03-13T14:30:15.123Z');
    });

    it('Sollte einen ISO-String mit Zeitzoneninfo unverändert interpretieren', () => {
      expect(LuxUtil.parseISO8601AsUTC('2027-03-13T00:00:00Z').toISOString()).toEqual('2027-03-13T00:00:00.000Z');
      expect(LuxUtil.parseISO8601AsUTC('2027-03-13T00:00:00.000Z').toISOString()).toEqual('2027-03-13T00:00:00.000Z');
      expect(LuxUtil.parseISO8601AsUTC('2027-03-13T01:00:00+01:00').toISOString()).toEqual('2027-03-13T00:00:00.000Z');
      expect(LuxUtil.parseISO8601AsUTC('2027-03-12T19:00:00-05:00').toISOString()).toEqual('2027-03-13T00:00:00.000Z');
    });

    it('Sollte ein kleines "t" bzw. "z" akzeptieren', () => {
      expect(LuxUtil.parseISO8601AsUTC('2027-03-13t00:00:00').toISOString()).toEqual('2027-03-13T00:00:00.000Z');
      expect(LuxUtil.parseISO8601AsUTC('2027-03-13T00:00:00z').toISOString()).toEqual('2027-03-13T00:00:00.000Z');
    });

    it('Sollte die Jahre 0-99 nicht auf 1900-1999 abbilden', () => {
      // z.B. DateTime.MinValue aus .NET-Backends
      const date = LuxUtil.parseISO8601AsUTC('0001-01-01T00:00:00');

      expect(date.getUTCFullYear()).toEqual(1);
      expect(date.getUTCMonth()).toEqual(0);
      expect(date.getUTCDate()).toEqual(1);
    });

    it('Sollte für ungültige Datums- bzw. Zeitbestandteile ein ungültiges Datum liefern', () => {
      expect(LuxUtil.isDate(LuxUtil.parseISO8601AsUTC('2027-13-01T00:00:00'))).toBeFalse();
      expect(LuxUtil.isDate(LuxUtil.parseISO8601AsUTC('2027-01-32T00:00:00'))).toBeFalse();
      expect(LuxUtil.isDate(LuxUtil.parseISO8601AsUTC('2027-01-01T25:00:00'))).toBeFalse();
      expect(LuxUtil.isDate(LuxUtil.parseISO8601AsUTC('2027-01-01T10:60:00'))).toBeFalse();
    });

    it('Sollte für einen String, der kein ISO-String ist, ein ungültiges Datum liefern', () => {
      expect(LuxUtil.isDate(LuxUtil.parseISO8601AsUTC('abc'))).toBeFalse();
    });
  });

  describe('isISO8601WithoutTimezone', () => {
    it('Sollte ISO-Strings ohne Zeitzoneninfo erkennen', () => {
      expect(LuxUtil.isISO8601WithoutTimezone('2027-03-13T00:00:00')).toBeTrue();
      expect(LuxUtil.isISO8601WithoutTimezone('2027-03-13T00:00:00.1234567')).toBeTrue();
      expect(LuxUtil.isISO8601WithoutTimezone('2027-03-13t00:00:00')).toBeTrue();
    });

    it('Sollte ISO-Strings mit Zeitzoneninfo nicht erkennen', () => {
      expect(LuxUtil.isISO8601WithoutTimezone('2027-03-13T00:00:00Z')).toBeFalse();
      expect(LuxUtil.isISO8601WithoutTimezone('2027-03-13T00:00:00.000z')).toBeFalse();
      expect(LuxUtil.isISO8601WithoutTimezone('2027-03-13T00:00:00+01:00')).toBeFalse();
      expect(LuxUtil.isISO8601WithoutTimezone('2027-03-13T00:00:00-05:00')).toBeFalse();
    });

    it('Sollte andere Werte nicht erkennen', () => {
      expect(LuxUtil.isISO8601WithoutTimezone('2027-03-13')).toBeFalse();
      expect(LuxUtil.isISO8601WithoutTimezone('13.03.2027')).toBeFalse();
      expect(LuxUtil.isISO8601WithoutTimezone('')).toBeFalse();
      expect(LuxUtil.isISO8601WithoutTimezone(null)).toBeFalse();
      expect(LuxUtil.isISO8601WithoutTimezone(undefined)).toBeFalse();
      expect(LuxUtil.isISO8601WithoutTimezone(new Date())).toBeFalse();
    });
  });
});

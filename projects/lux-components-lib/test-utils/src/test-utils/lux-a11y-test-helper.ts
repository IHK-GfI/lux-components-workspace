import axe, { type AxeResults } from 'axe-core';
import { expect } from 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> {
    /** Erwartet, dass ein axe-core-Scanergebnis keine Barrierefreiheitsverletzungen enthält. */
    toHaveNoViolations(): T;
  }
  interface AsymmetricMatchersContaining {
    /** Erwartet, dass ein axe-core-Scanergebnis keine Barrierefreiheitsverletzungen enthält. */
    toHaveNoViolations(): void;
  }
}

let matcherRegistered = false;

export class LuxA11yTestHelper {
  /**
   * Registriert den `toHaveNoViolations`-Matcher für axe-core-Ergebnisse. Muss einmal pro Testdatei
   * (z.B. in einem `beforeAll`) aufgerufen werden, bevor `expectNoA11yViolations` genutzt wird.
   * Mehrfache Aufrufe sind unschädlich.
   */
  public static addA11yMatchers(): void {
    if (matcherRegistered) {
      return;
    }
    matcherRegistered = true;

    expect.extend({
      toHaveNoViolations(received: AxeResults) {
        const violations = received?.violations ?? [];
        const pass = violations.length === 0;
        return {
          pass,
          message: () =>
            pass
              ? 'Es wurden keine Barrierefreiheitsverletzungen erwartet, aber auch keine gefunden.'
              : `Es wurden ${violations.length} Barrierefreiheitsverletzung(en) gefunden:\n` +
                violations.map((v) => `- [${v.id}] ${v.help} (${v.helpUrl})`).join('\n')
        };
      }
    });
  }

  /**
   * Führt einen axe-core-Scan auf dem übergebenen Element aus und erwartet, dass keine Barrierefreiheitsverletzungen vorliegen.
   * Setzt voraus, dass zuvor `addA11yMatchers()` aufgerufen wurde.
   * @param element
   */
  public static async expectNoA11yViolations(element: Element): Promise<void> {
    const results = await axe.run(element);
    expect(results).toHaveNoViolations();
  }
}

import { AxeResults } from 'axe-core';
import { axe, toHaveNoViolations } from 'jasmine-axe';

export class LuxA11yTestHelper {
  /**
   * Registriert die jasmine-axe-Matcher. Muss einmal pro Testdatei (z.B. in einem `beforeAll`) aufgerufen werden,
   * bevor `expectNoA11yViolations` genutzt wird.
   */
  public static addA11yMatchers() {
    jasmine.addMatchers(toHaveNoViolations);
  }

  /**
   * Führt einen axe-core-Scan auf dem übergebenen Element aus und erwartet, dass keine Barrierefreiheitsverletzungen vorliegen.
   * Setzt voraus, dass zuvor `addA11yMatchers()` aufgerufen wurde.
   * @param element
   */
  public static async expectNoA11yViolations(element: Element) {
    expect((await axe(element)) as AxeResults).toHaveNoViolations();
  }
}

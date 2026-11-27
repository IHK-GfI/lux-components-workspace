// Manuelle Ausnahmen zur Token-Tabelle (Token-Umbenennung.csv), gelesen von scripts/generate-tokens.mjs und scripts/check-tokens.mjs.
// Jede Ausnahme braucht eine Begründung. Die Tabelle selbst wird nicht von Hand geändert (Quelle: Doku-Repository design-system).

export default {
  // Alte Namen ohne Alias: Zusammenführung mit verschiedenen Werten. Der alte Name bleibt eigenständig und ist @deprecated.
  noAlias: {
    '--lux-focus-state-layer-color':
      'primary mit 12 %, das Base Token --lux-base-focus-state-layer-color nutzt die Option-Schicht (secondary-container mit 12 %)',
    '--lux-theme-panel-option-selected-state-layer-color':
      'Green: color-mix 12 %, das Base Token --lux-base-selected-background-color hat wie --lux-theme-selected-bg-color #e3ebf5'
  },

  // Alias-Ziel je Theme, wenn die Themes verschiedene Stufen brauchen. Primitives haben keine Modi,
  // deshalb zeigt der alte Name je Theme auf die Stufe mit seinem bisherigen Wert.
  themeAliases: {
    authentic: {
      '--lux-theme-radius-lg': '--lux-primitive-radius-4',
      '--lux-theme-radius-xl': '--lux-primitive-radius-6'
    },
    green: {
      '--lux-theme-radius-lg': '--lux-primitive-radius-4-5',
      '--lux-theme-radius-xl': '--lux-primitive-radius-5'
    }
  },

  // Neue Namen aus der Tabelle, die es im Code bewusst nicht gibt (Präfix oder genauer Name).
  notInCode: {
    '--lux-primitive-font-style-': 'Schriftschnitt als Text (z. B. "Semibold"), laut Tabelle nur Figma; im Code gilt font-weight'
  },

  // Bestandsnamen, die in der Tabelle fehlen. Sie gehören nicht zu primitive/base und bleiben bis zur Ergänzung der Tabelle unverändert.
  unmapped: {
    '--lux-theme-snackbar-border-radius': 'mit Issue #386 neu (nach dem Token-Inventar), fehlt in Token-Umbenennung.csv',
    '--lux-theme-snackbar-width': 'mit Issue #386 neu (nach dem Token-Inventar), fehlt in Token-Umbenennung.csv'
  }
};

// @ts-check
const tseslint = require('typescript-eslint');
const rootConfig = require('../../eslint.config.js');

module.exports = tseslint.config(
  ...rootConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'lux',
          style: 'camelCase'
        }
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'lux',
          style: 'kebab-case'
        }
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },
  {
    // style-Attribute (statisch oder per [attr.style]) werden per setAttribute gesetzt und von einer
    // strikten CSP (style-src-attr ohne 'unsafe-inline') blockiert. [style]/[style.x]/[ngStyle] sind
    // unkritisch, da Angular sie per CSSOM setzt.
    files: ['**/*.html'],
    // Inline-Templates werden als virtuelle Dateien "<datei>.ts/<n>.html" geprüft; Specs laufen nie unter CSP.
    ignores: ['**/*.spec.ts/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "TextAttribute[name='style']",
          message: 'Keine statischen style-Attribute verwenden (CSP). CSS-Klassen oder [style.x]-/[ngStyle]-Bindings nutzen.'
        },
        {
          selector: "BoundAttribute[keySpan.details='attr.style']",
          message: 'Kein [attr.style]-Binding verwenden (CSP). CSS-Klassen oder [style.x]-/[ngStyle]-Bindings nutzen.'
        }
      ]
    }
  }
);

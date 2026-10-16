import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Die Schematics werden zur Laufzeit per require() aus der collection.json geladen.
// Deshalb laufen die Tests gegen die kompilierten Dateien in dist/updater (siehe "test" in der package.json).
export default defineConfig({
  test: {
    root: fileURLToPath(new URL('../../dist/updater', import.meta.url)),
    include: ['**/*.spec.js'],
    exclude: ['**/node_modules/**'],
    globals: true,
    environment: 'node',
    restoreMocks: true
  }
});

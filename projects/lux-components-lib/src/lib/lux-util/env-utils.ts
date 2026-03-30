export function isTestEnv(): boolean {
  const testGlobals = globalThis as typeof globalThis & {
    jasmine?: unknown;
    __karma__?: unknown;
    process?: {
      env?: Record<string, string | undefined>;
    };
  };

  return (
    typeof testGlobals.jasmine !== 'undefined' ||
    typeof testGlobals.__karma__ !== 'undefined' ||
    typeof testGlobals.process?.env?.['JEST_WORKER_ID'] !== 'undefined' ||
    typeof testGlobals.process?.env?.['KARMA_WORKER_ID'] !== 'undefined'
  );
}

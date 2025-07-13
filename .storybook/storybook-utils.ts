export const getAttributes = (attr: Record<string, unknown>): string => {
  const attrs = Object.keys(attr).map((prop) => {
    const value = attr[prop];
    if (
      value === undefined ||
      value === '' ||
      value === false ||
      typeof value === 'function'
    ) {
      return undefined;
    }
    if (typeof value === 'object' && value !== null) {
      return `[${prop}]='${JSON.stringify(value)}'`;
    }
    if (typeof value === 'string') {
      return `[${prop}]="'${value}'"`;
    }
    return `[${prop}]="${value}"`;
  });
  return attrs.filter(Boolean).join(' ');
};

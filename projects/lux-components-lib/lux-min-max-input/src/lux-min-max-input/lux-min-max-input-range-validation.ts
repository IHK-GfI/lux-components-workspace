import { LuxMinMaxType } from './lux-min-max-input-types';

/** Validation error keys produced by the range logic (internal, not part of the public API). */
export type LuxMinMaxRangeErrorKey = 'range' | 'belowMin' | 'aboveMax' | 'outOfBounds';

const isEmpty = (raw: unknown): boolean => raw === null || raw === undefined || raw === '';

/** Converts a raw field value of the given type to a comparable number; undefined for empty, null for invalid. */
export function toComparable(raw: unknown, type: LuxMinMaxType): number | undefined | null {
  if (isEmpty(raw)) {
    return undefined;
  }
  const result = type === 'date' ? (typeof raw === 'number' ? raw : Date.parse(String(raw))) : Number(raw);
  return Number.isNaN(result) ? null : result;
}

/** Validation errors of one side against the other side and the bounds. */
export function rangeErrors(
  side: 'min' | 'max',
  own: number | undefined,
  other: number | undefined,
  bounds: { min?: number; max?: number }
): Partial<Record<LuxMinMaxRangeErrorKey, true>> | null {
  if (own === undefined) {
    return null;
  }
  const errors: Partial<Record<LuxMinMaxRangeErrorKey, true>> = {};
  if (other !== undefined && (side === 'min' ? own > other : own < other)) {
    errors.range = true;
  }
  const below = bounds.min !== undefined && own < bounds.min;
  const above = bounds.max !== undefined && own > bounds.max;
  if (below || above) {
    if (bounds.min !== undefined && bounds.max !== undefined) {
      errors.outOfBounds = true;
    } else if (below) {
      errors.belowMin = true;
    } else {
      errors.aboveMax = true;
    }
  }
  return Object.keys(errors).length > 0 ? errors : null;
}

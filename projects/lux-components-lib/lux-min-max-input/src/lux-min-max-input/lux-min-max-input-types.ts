/** Field type rendered for both sides of the range. */
export type LuxMinMaxType = 'number' | 'date';

/** Range value; a missing key means no limit on that side. */
export interface LuxMinMaxValue<T extends number | string = number> {
  min?: T;
  max?: T;
}

/** Allowed range in the value type of the field; a missing key means unbounded on that side. */
export type LuxMinMaxBounds<T extends number | string = number> = LuxMinMaxValue<T>;

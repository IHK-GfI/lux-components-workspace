export const PAGE_NAVIGATION_DELTA = 10;

export type VisibleBoundary = 'start' | 'end';

export function getAdjacentVisiblePosition(currentVisiblePos: number, visibleCount: number, step: 1 | -1): number {
  if (currentVisiblePos < 0) {
    return step === 1 ? 0 : visibleCount - 1;
  }

  return clampVisiblePosition(currentVisiblePos + step, visibleCount);
}

export function getPageVisiblePosition(currentVisiblePos: number, visibleCount: number, direction: 1 | -1): number {
  if (currentVisiblePos < 0) {
    return clampVisiblePosition(direction === 1 ? PAGE_NAVIGATION_DELTA - 1 : 0, visibleCount);
  }

  return clampVisiblePosition(currentVisiblePos + direction * PAGE_NAVIGATION_DELTA, visibleCount);
}

export function getBoundaryVisiblePosition(visibleCount: number, boundary: VisibleBoundary): number {
  return boundary === 'start' ? 0 : visibleCount - 1;
}

export function clampVisiblePosition(position: number, visibleCount: number): number {
  return Math.max(0, Math.min(position, visibleCount - 1));
}

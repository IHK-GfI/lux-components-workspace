export enum DemoMarkerType {
  New = 'new',
  Updated = 'updated'
}

export interface DemoNavigationComponentEntry {
  onclick: () => void;
  label: string;
  icon: string;
  moduleName?: string;
  markerType?: DemoMarkerType;
  themes?: string[];
  useImage?: boolean;
}

type DemoMarkerColor = 'blue' | 'green';

const DEMO_MARKER_LABELS: Record<DemoMarkerType, string> = {
  [DemoMarkerType.New]: 'neu',
  [DemoMarkerType.Updated]: 'update'
};

const DEMO_MARKER_COLORS: Record<DemoMarkerType, DemoMarkerColor> = {
  [DemoMarkerType.New]: 'green',
  [DemoMarkerType.Updated]: 'blue'
};

export function getDemoMarkerLabel(markerType?: DemoMarkerType): string {
  return markerType ? DEMO_MARKER_LABELS[markerType] : '';
}

export function getDemoMarkerColor(markerType: DemoMarkerType): DemoMarkerColor {
  return DEMO_MARKER_COLORS[markerType];
}

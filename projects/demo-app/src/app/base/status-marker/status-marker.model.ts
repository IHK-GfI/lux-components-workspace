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

const DEMO_MARKER_LABELS: Record<DemoMarkerType, string> = {
  [DemoMarkerType.New]: 'neu',
  [DemoMarkerType.Updated]: 'aktualisiert'
};

export function getDemoMarkerLabel(markerType?: DemoMarkerType): string {
  return markerType ? DEMO_MARKER_LABELS[markerType] : '';
}

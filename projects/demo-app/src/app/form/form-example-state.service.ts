import { Injectable, signal } from '@angular/core';

export type FormExampleStateKey = 'common' | 'single' | 'dual' | 'three';

export interface FormExampleSnapshot<T> {
  rawValue: T;
  dirty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FormExampleStateService {
  private readonly snapshots = signal<Partial<Record<FormExampleStateKey, FormExampleSnapshot<unknown>>>>({});

  get<T extends FormExampleSnapshot<unknown>>(key: FormExampleStateKey): T | null {
    return (this.snapshots()[key] as T | undefined) ?? null;
  }

  save<T extends FormExampleSnapshot<unknown>>(key: FormExampleStateKey, snapshot: T): void {
    this.snapshots.update((snapshots) => ({ ...snapshots, [key]: snapshot }));
  }

  markPristine(key: FormExampleStateKey): void {
    const snapshot = this.snapshots()[key];

    if (snapshot) {
      this.snapshots.update((snapshots) => ({ ...snapshots, [key]: { ...snapshot, dirty: false } }));
    }
  }
}

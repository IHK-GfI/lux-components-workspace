import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LuxButtonComponent, LuxFormHintComponent, LuxInputAcComponent, LuxRadioAcComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { LuxSkeletonComponent, LuxSkeletonVariant } from '@ihk-gfi/lux-components/lux-skeleton';
import { Subject, switchMap, tap, timer } from 'rxjs';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

const LOAD_DURATION_MS = 2000;

interface ExamplePerson {
  initials: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-skeleton-example',
  templateUrl: './skeleton-example.component.html',
  styleUrls: ['./skeleton-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxButtonComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxRadioAcComponent,
    LuxSkeletonComponent,
    LuxToggleAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class SkeletonExampleComponent {
  protected readonly variantOptions: LuxSkeletonVariant[] = ['text', 'rect', 'circle'];
  protected readonly loadDurationSeconds = LOAD_DURATION_MS / 1000;

  protected readonly variant = signal<LuxSkeletonVariant>('text');
  protected readonly width = signal<string | null>('');
  protected readonly height = signal<string | null>('');
  protected readonly count = signal(1);
  protected readonly animated = signal(true);

  protected readonly loading = signal(false);
  protected readonly persons: ExamplePerson[] = [
    { initials: 'AM', name: 'Anna Muster', description: 'Sachbearbeitung Ausbildung' },
    { initials: 'BB', name: 'Bernd Beispiel', description: 'Teamleitung Weiterbildung' },
    { initials: 'CT', name: 'Clara Test', description: 'Prüfungsorganisation' }
  ];

  private readonly reloadTrigger = new Subject<void>();

  constructor() {
    this.reloadTrigger
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap(() => timer(LOAD_DURATION_MS)),
        takeUntilDestroyed()
      )
      .subscribe(() => this.loading.set(false));
  }

  onCountChange(value: number | string | null) {
    this.count.set(Number(value) || 0);
  }

  reload() {
    this.reloadTrigger.next();
  }
}

import { DestroyRef, Directive, OnDestroy, OnInit, effect, inject, input, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelect } from '@angular/material/select';

@Directive({
  selector: 'mat-select[luxSelectVisibleOptionCount]',
  standalone: true
})
export class LuxSelectVisibleOptionCountDirective implements OnInit, OnDestroy {
  private static readonly DEFAULT_OPTION_HEIGHT = 48;

  private readonly matSelect = inject(MatSelect);
  private readonly destroyRef = inject(DestroyRef);
  private panelAttachTimeout?: ReturnType<typeof setTimeout>;

  readonly luxSelectVisibleOptionCount = input<number | null | undefined>(undefined);

  constructor() {
    effect(() => {
      this.luxSelectVisibleOptionCount();

      untracked(() => {
        if (this.matSelect.panelOpen) {
          this.schedulePanelSizing();
        }
      });
    });
  }

  ngOnInit(): void {
    this.matSelect.openedChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((open) => {
      if (open) {
        this.schedulePanelSizing();
      } else {
        this.clearPanelSizing();
      }
    });
  }

  ngOnDestroy(): void {
    this.clearPanelSizing();
  }

  private schedulePanelSizing(): void {
    this.clearPanelAttachTimeout();

    const tryApplySizing = () => {
      if (!this.matSelect.panelOpen) {
        return;
      }

      const panel = this.matSelect.panel?.nativeElement as HTMLElement | undefined;
      if (!panel) {
        this.panelAttachTimeout = setTimeout(() => {
          this.panelAttachTimeout = undefined;
          tryApplySizing();
        });
        return;
      }

      this.applyPanelSizing(panel);
    };

    tryApplySizing();
  }

  private applyPanelSizing(panel: HTMLElement): void {
    const visibleOptionCount = this.getVisibleOptionCount();
    if (!visibleOptionCount) {
      panel.style.maxHeight = '';
      return;
    }

    const optionHeight = this.measureOptionHeight(panel);
    const filterHeight = this.measureFilterHeight(panel);
    panel.style.maxHeight = `${filterHeight + optionHeight * visibleOptionCount}px`;
  }

  private getVisibleOptionCount(): number | undefined {
    const count = Math.trunc(Number(this.luxSelectVisibleOptionCount()));
    if (!Number.isFinite(count) || count <= 0) {
      return undefined;
    }

    return count;
  }

  private measureOptionHeight(panel: HTMLElement): number {
    const options = Array.from(panel.querySelectorAll<HTMLElement>('.mat-mdc-option'));
    const visibleOption = options.find((option) => this.isElementVisible(option)) ?? options[0];
    if (!visibleOption) {
      return LuxSelectVisibleOptionCountDirective.DEFAULT_OPTION_HEIGHT;
    }

    const optionHeight = visibleOption.getBoundingClientRect().height;
    return optionHeight > 0 ? optionHeight : LuxSelectVisibleOptionCountDirective.DEFAULT_OPTION_HEIGHT;
  }

  private measureFilterHeight(panel: HTMLElement): number {
    const filterHost = panel.querySelector<HTMLElement>('lux-select-panel-filter');
    if (!filterHost || !this.isElementVisible(filterHost)) {
      return 0;
    }

    return filterHost.getBoundingClientRect().height;
  }

  private isElementVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  private clearPanelSizing(): void {
    this.clearPanelAttachTimeout();
    const panel = this.matSelect.panel?.nativeElement as HTMLElement | undefined;
    if (panel) {
      panel.style.maxHeight = '';
    }
  }

  private clearPanelAttachTimeout(): void {
    if (!this.panelAttachTimeout) {
      return;
    }

    clearTimeout(this.panelAttachTimeout);
    this.panelAttachTimeout = undefined;
  }
}

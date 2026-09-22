import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LuxIconColor } from '../../lux-util/lux-colors.enum';
import { LuxIconRegistryService } from './lux-icon-registry.service';

@Component({
  selector: 'lux-icon',
  templateUrl: './lux-icon.component.html',
  styleUrls: ['./lux-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.margin]': 'luxMargin()',
    '[class.lux-icon-rounded]': 'luxRounded()'
  },
  imports: [MatIcon, NgStyle, NgClass]
})
export class LuxIconComponent {
  readonly luxColor = input<LuxIconColor | undefined>(undefined);
  readonly luxRounded = input(false);

  // standard margin Werte z.B. '5px 4px 3px 2px'
  readonly luxMargin = input('0');

  // standard padding Werte z.B. '5px 4px 3px 2px'
  readonly luxPadding = input('');

  readonly luxIconSize = input<string | undefined, string | undefined>('', {
    transform: (iconSizeValue) => this.normalizeIconSize(iconSizeValue)
  });

  readonly luxIconName = input<string | undefined>('');

  private readonly iconReg = inject(LuxIconRegistryService);
  private readonly notFoundIconName = 'lux-interface-alert-warning-diamond';

  // Registriert das Icon als Seiteneffekt der Namensauflösung, da das svgIcon synchron zur Template-Auswertung benötigt wird.
  protected readonly resolvedIconName = computed(() => this.registerIcon(this.luxIconName()));

  private normalizeIconSize(iconSizeValue: string | undefined): string | undefined {
    if (iconSizeValue && iconSizeValue.length === 2 && iconSizeValue.endsWith('x')) {
      return iconSizeValue.slice(0, 1) + 'em';
    }
    return iconSizeValue;
  }

  private registerIcon(iconName: string | undefined): string {
    if (!iconName) {
      return '';
    }

    try {
      this.iconReg.registerIcon(iconName);
      return iconName;
    } catch (error) {
      console.warn(
        `Das Icon "${iconName}" konnte nicht gefunden werden. Stattdessen wird das Icon "${this.notFoundIconName}" verwendet. Bitte anpassen!`
      );
      return this.notFoundIconName;
    }
  }
}

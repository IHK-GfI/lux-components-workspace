import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

type SizeUnit = 'B' | 'KB' | 'KiB' | 'MB' | 'MiB';

@Pipe({
  name: 'bytesToLabel'
})
export class LuxBytesToLabelPipe implements PipeTransform {
  private transloco = inject(TranslocoService);

  /**
   * Transform bytes into a size string with specified unit.
   * @param bytes - The size in bytes
   * @param unit - The target unit: 'B', 'KB', 'KiB', 'MB', 'MiB' (default: 'MiB')
   * @param decimals - Number of decimal places to show (default: 2)
   * @param legacyLabels - If true, binary units are displayed with SI labels (KiB→KB, MiB→MB),
   *                       matching the Windows File Explorer convention (default: false)
   */
  transform(bytes: number | null | undefined, unit: SizeUnit = 'MiB', decimals = 2, legacyLabels = false): string {
    if (bytes == null || isNaN(Number(bytes))) {
      return '';
    }

    const b = Number(bytes);

    if (b === 0) {
      const displayUnit = legacyLabels ? unit.replace('KiB', 'KB').replace('MiB', 'MB') : unit;
      return `0 ${displayUnit}`;
    }

    if (b < 0) {
      return '';
    }

    const units: Record<SizeUnit, number> = {
      B: 1,
      KB: 1000,
      KiB: 1024,
      MB: 1000 * 1000,
      MiB: 1024 * 1024,
    };

    let currentUnit = unit;
    let divisor = units[unit];
    let value = b / divisor;

    // For MB/MiB, show smaller files in KB/KiB if < 1
    if (value < 1) {
      if (unit === 'MB') {
        currentUnit = 'KB';
        divisor = units['KB'];
        value = b / divisor;
      } else if (unit === 'MiB') {
        currentUnit = 'KiB';
        divisor = units['KiB'];
        value = b / divisor;
      }
    }

    // Bytes, KB, and KiB should not have decimal places
    const decimalPlaces = ['B', 'KB', 'KiB'].includes(currentUnit) ? 0 : decimals;

    // Format with thousand separator using current Transloco locale
    const factor = Math.pow(10, decimalPlaces);
    let truncated = Math.floor(value * factor) / factor;

    // For KB and KiB, use minimum value of 1 for non-zero sizes
    if ((currentUnit === 'KB' || currentUnit === 'KiB') && truncated === 0 && b > 0) {
      truncated = 1;
    }

    const locale = this.transloco.getActiveLang();
    const formatted = truncated.toLocaleString(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });

    const displayUnit = legacyLabels ? currentUnit.replace('KiB', 'KB').replace('MiB', 'MB') : currentUnit;

    return `${formatted} ${displayUnit}`;
  }
}

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { LuxPanelContentComponent } from './lux-panel-subcomponents/lux-panel-content.component';
import { LuxPanelHeaderTitleComponent } from './lux-panel-subcomponents/lux-panel-header-title.component';
import { LuxPanelComponent } from './lux-panel.component';

describe('LuxPanelComponent', () => {
  describe('Attribut "luxStickyHeader"', () => {
    let fixture: ComponentFixture<LuxPanelStickyHeaderComponent>;

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxPanelStickyHeaderComponent);
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('Sticky-Klasse und Offset-Variable prüfen', async () => {
      // Vorbedingungen testen
      const panelEl = fixture.debugElement.query(By.css('.mat-expansion-panel'));
      expect(panelEl.classes['lux-panel-sticky-header']).toBeFalsy();

      // Änderungen durchführen
      fixture.componentInstance.sticky.set(true);
      fixture.componentInstance.offset.set('64px');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(panelEl.classes['lux-panel-sticky-header']).toBeTruthy();
      expect(panelEl.nativeElement.style.getPropertyValue('--lux-panel-sticky-header-offset')).toBe('64px');

      // Änderungen durchführen
      fixture.componentInstance.sticky.set(false);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(panelEl.classes['lux-panel-sticky-header']).toBeFalsy();

      // Änderungen durchführen
      fixture.componentInstance.offset.set(undefined);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen testen
      expect(panelEl.nativeElement.style.getPropertyValue('--lux-panel-sticky-header-offset')).toBe('');
    });
  });
});

@Component({
  template: `
    <lux-panel [luxExpanded]="true" [luxStickyHeader]="sticky()" [luxStickyHeaderOffset]="offset()">
      <lux-panel-header-title>Titel 1</lux-panel-header-title>
      <lux-panel-content>Inhalt</lux-panel-content>
    </lux-panel>
  `,
  imports: [LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
class LuxPanelStickyHeaderComponent {
  sticky = signal(false);
  offset = signal<string | undefined>(undefined);
}

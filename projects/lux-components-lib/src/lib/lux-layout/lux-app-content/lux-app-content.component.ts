import { Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaRoleDirective } from '../../lux-directives/lux-aria/lux-aria-role.directive';
import { LuxThemeService } from '../../lux-theme/lux-theme.service';
import { LuxAppService } from '../../lux-util/lux-app.service';
import { LuxAppFooterFixedService } from '../lux-app-footer/lux-app-footer-fixed.service';

@Component({
  selector: 'lux-app-content',
  templateUrl: './lux-app-content.component.html',
  styleUrls: ['./lux-app-content.component.scss'],
  imports: [LuxAriaRoleDirective, LuxAriaLabelDirective, RouterOutlet, TranslocoPipe]
})
export class LuxAppContentComponent implements OnDestroy {
  private elementRef = inject(ElementRef);
  private appService = inject(LuxAppService);
  private footerService = inject(LuxAppFooterFixedService);
  themeService = inject(LuxThemeService);

  @Input() luxAriaRoleMainLabel = '';

  @HostListener('window:resize') windowResize() {
    this.appService.onResize();
  }

  @HostBinding('class.lux-app-footer-no-fixed') get getNoStickModeClass() {
    return !this.fixedMode;
  }

  fixedMode: boolean;
  themeName: string;
  subscriptions: Subscription[] = [];

  constructor() {
    this.appService.appContentEl = this.elementRef.nativeElement;

    this.fixedMode = this.footerService.fixedMode;
    this.subscriptions.push(
      this.footerService.fixedModeAsObservable.subscribe((fixedMode) => {
        this.fixedMode = fixedMode;
      })
    );

    this.themeName = this.themeService.getTheme().name;
    this.subscriptions.push(
      this.themeService.getThemeAsObservable().subscribe((theme) => {
        this.themeName = theme.name;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

import { Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { LuxThemeService } from '../../lux-theme/lux-theme.service';
import { LuxAppService } from '../../lux-util/lux-app.service';
import { LuxAppFooterFixedService } from '../lux-app-footer/lux-app-footer-fixed.service';

@Component({
  selector: 'lux-app-content',
  templateUrl: './lux-app-content.component.html',
  styleUrls: ['./lux-app-content.component.scss'],
  imports: [RouterOutlet]
})
export class LuxAppContentComponent implements OnInit, OnDestroy {
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

  @HostBinding('attr.role') role?: string;
  @HostBinding('attr.aria-label') label?: string;

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

  ngOnInit(): void {
    if (this.luxAriaRoleMainLabel) {
      this.role = 'main';
      this.label = this.luxAriaRoleMainLabel;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

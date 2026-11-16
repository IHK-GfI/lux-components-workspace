import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { LuxThemeService } from '../../lux-theme/lux-theme.service';
import { LuxAppService } from '../../lux-util/lux-app.service';
import { LuxAppFooterFixedService } from '../lux-app-footer/lux-app-footer-fixed.service';

@Component({
  selector: 'lux-app-content',
  templateUrl: './lux-app-content.component.html',
  styleUrls: ['./lux-app-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'windowResize()',
    '[class.lux-app-footer-no-fixed]': 'getNoStickModeClass',
    '[attr.role]': 'role()',
    '[attr.aria-label]': 'label()'
  },
  imports: [RouterOutlet]
})
export class LuxAppContentComponent implements OnInit, OnDestroy {
  readonly luxAriaRoleMainLabel = input('');

  themeService = inject(LuxThemeService);

  role = signal<string | undefined>(undefined);
  label = signal<string | undefined>(undefined);

  fixedMode = signal(false);
  themeName = signal('');
  subscriptions: Subscription[] = [];

  get getNoStickModeClass() {
    return !this.fixedMode();
  }

  private elementRef = inject(ElementRef);
  private appService = inject(LuxAppService);
  private footerService = inject(LuxAppFooterFixedService);

  constructor() {
    this.appService.appContentEl = this.elementRef.nativeElement;

    this.fixedMode.set(this.footerService.fixedMode);
    this.subscriptions.push(
      this.footerService.fixedModeAsObservable.subscribe((fixedMode) => {
        this.fixedMode.set(fixedMode);
      })
    );

    this.themeName.set(this.themeService.getTheme().name);
    this.subscriptions.push(
      this.themeService.getThemeAsObservable().subscribe((theme) => {
        this.themeName.set(theme.name);
      })
    );
  }

  ngOnInit(): void {
    if (this.luxAriaRoleMainLabel()) {
      this.role.set('main');
      this.label.set(this.luxAriaRoleMainLabel());
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  windowResize() {
    this.appService.onResize();
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LuxCardComponent, LuxCardContentComponent } from '@ihk-gfi/lux-components';
import { ImpressumContentService } from './impressum-content.service';

@Component({
  selector: 'lux-impressum',
  templateUrl: './impressum.component.html',
  imports: [LuxCardContentComponent, LuxCardComponent],
  styles: [':host { display: flex; align-items: start; justify-content: center; flex: 1 1 auto;}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImpressumComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private impressumContent = inject(ImpressumContentService);
  private cdr = inject(ChangeDetectorRef);

  @Input() fullWidth = false;

  @Input()
  public content?: string;

  async ngOnInit() {
    if (!this.content) {
      this.content = this.route.snapshot.data['content'];
    }

    if (!this.content) {
      this.content = await this.impressumContent.load();
    }

    if (typeof this.content === 'string' && this.content.includes('<html') && this.content.includes('</html')) {
      this.content = 'In der lokalen Demo wird kein Impressum angezeigt.';
    }

    this.cdr.markForCheck();
  }
}

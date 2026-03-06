import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LuxCardComponent, LuxCardContentComponent } from '@ihk-gfi/lux-components';
import { DseContentService } from './dse-content.service';

@Component({
  selector: 'lux-dse',
  templateUrl: './dse.component.html',
  imports: [LuxCardContentComponent, LuxCardComponent],
  styles: [':host { display: flex; align-items: start; justify-content: center; flex: 1 1 auto;}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dseContent = inject(DseContentService);
  private cdr = inject(ChangeDetectorRef);

  @Input()
  public content?: string;

  async ngOnInit() {
    if (!this.content) {
      this.content = this.route.snapshot.data['content'];
    }

    if (!this.content) {
      this.content = await this.dseContent.load();
    }

    if (typeof this.content === 'string' && this.content.includes('<html') && this.content.includes('</html')) {
      this.content = 'In der lokalen Demo wird kein Datenschutzhinweis angezeigt.';
    }

    this.cdr.markForCheck();
  }
}

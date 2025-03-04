import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { LuxUtil } from '../../../lux-util/lux-util';

@Component({
  selector: 'lux-detail-wrapper-ac',
  template: '<ng-container *ngTemplateOutlet="luxDetailTemplate; context: luxDetailContext"></ng-container>',
  imports: [NgTemplateOutlet]
})
export class LuxDetailWrapperAcComponent implements OnInit, AfterViewInit {
  private _luxDetailTemplate!: TemplateRef<any>;

  @Output() luxDetailRendered = new EventEmitter<void>();

  @Input() luxDetailContext: any;

  @Input() set luxDetailTemplate(ref: TemplateRef<any>) {
    this._luxDetailTemplate = ref;
  }

  get luxDetailTemplate(): TemplateRef<any> {
    return this._luxDetailTemplate;
  }

  constructor() {}

  ngOnInit() {
    LuxUtil.assertNonNull('_luxDetailTemplate', this._luxDetailTemplate);
  }

  ngAfterViewInit() {
    this.luxDetailRendered.emit();
  }
}

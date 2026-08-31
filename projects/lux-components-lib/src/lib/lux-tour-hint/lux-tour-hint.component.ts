import { NgClass, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  signal,
  viewChild
} from '@angular/core';
import { LuxTourHintRef } from './lux-tour-hint-model/lux-tour-hint-ref.class';

@Component({
  selector: 'lux-tour-hint',
  templateUrl: './lux-tour-hint.component.html',
  styleUrls: ['./lux-tour-hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle, NgClass]
})
export class LuxTourHintComponent implements OnInit, AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  private element = inject(ElementRef);
  tourHintRef = inject(LuxTourHintRef);

  //The element which is the target of the hint or tour
  private readonly _luxTarget = signal<any>(undefined);

  set luxTarget(luxTarget: any) {
    this._luxTarget.set(luxTarget);

    //Needs a timeout or the content will not be rendered and so the bounds cannot be read corretly
    setTimeout(() => {
      this.updateTargetAndPositions();
    });
  }

  get luxTarget(): any {
    return this._luxTarget();
  }

  //CSS Class for the arrow where to point
  protected readonly arrowClass = signal('top');

  //Constants which are also used in scss but can't directly be read from here
  private arrowLength = 16;
  private shadowPadding = 5;

  //Positions of the tour-hint modal
  protected readonly tourHintPosLeft = signal(0);
  protected readonly tourHintPosTop = signal(0);

  //Positions / Sizes of the tour-hint shadows
  protected readonly bgTopSize = signal(0);
  protected readonly bgBottomSize = signal(0);
  protected readonly bgLeftSize = signal(0);
  protected readonly bgRightSize = signal(0);
  protected readonly bgContentHeight = signal(0);

  //Style variables for the rendering of a dynamic 'Modal-Arrow'
  protected readonly dynamicArrowStyle = signal({});

  private readonly tourHintContainer = viewChild('tourHintContainer', { read: ElementRef });

  ngOnInit(): void {
    //When resizing / min- / maximizing window update all positions
    addEventListener('resize', () => {
      this.updateTargetAndPositions();
    });
  }

  ngAfterViewInit(): void {
    //Focus after loaded so we can navigate the tour with arrow keys
    this.updateTargetAndPositions();
    this.tourHintContainer()?.nativeElement.focus();
  }

  private updateTargetAndPositions() {
    const target = this._luxTarget();
    if (!target) return;

    //Scrolls the element into view
    //TODO: In some cases scroll 'feels' wrong and target element is not centered on screen.
    target.scrollIntoView({
      block: 'center',
      inline: 'center'
    });

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const bounds = this.getSurroundingBounds(target);

    this.calculatePositions(windowWidth, windowHeight, bounds);

    //Css variables, positions and styles were changesd so we need to rerender
    this.cdr.detectChanges();
  }

  private calculatePositions(winWidth: number, winHeight: number, bounds: any) {
    const tourHintContainer = this.tourHintContainer();
    if (tourHintContainer) {
      //Calculate where the tour-hint should be shown
      const calculatedComponentBounds = tourHintContainer.nativeElement.getBoundingClientRect();
      const calculatedWidth = calculatedComponentBounds.width;
      const calculatedHeight = calculatedComponentBounds.height;

      const spaceTop = bounds.top - calculatedHeight;
      const spaceBottom = winHeight - bounds.bottom - calculatedHeight;
      const spaceLeft = bounds.left - calculatedWidth;
      const spaceRight = winWidth - bounds.right - calculatedWidth;
      const spaceMax = Math.max(spaceTop, spaceBottom, spaceLeft, spaceRight);

      const neededWidth = calculatedWidth + this.arrowLength;
      const neededHeight = calculatedHeight + this.arrowLength;

      const showTop = spaceTop === spaceMax;
      const showBottom = spaceBottom === spaceMax;
      const showLeft = spaceLeft === spaceMax;
      const showRight = spaceRight === spaceMax;

      //Min value for offsetting the arrow when tour-hint is at an edge of the screen
      const arrowOffset = this.arrowLength * 4;

      //Offsets for modal and arrow so when target is outside screen it will be handled correctly
      let baseOffX = 0;
      let baseOffY = 0;
      let arrowOffX = 0;
      let arrowOffY = 0;

      let tourHintPosLeft = 0;
      let tourHintPosTop = 0;

      if (showTop || showBottom) {
        //Top OR Bottom
        tourHintPosLeft = bounds.midX - this.arrowLength * 2;
        if (tourHintPosLeft < 0) tourHintPosLeft = 0;

        baseOffX = tourHintPosLeft + neededWidth - winWidth;
        arrowOffX = baseOffX;
        baseOffY = 0;
        arrowOffY = 0;

        if (baseOffX < 0) {
          baseOffX = 0;
          arrowOffX = 0;
        } else if (baseOffX >= calculatedWidth - arrowOffset) arrowOffX = calculatedWidth - arrowOffset;

        if (showTop) {
          //Show on top
          this.arrowClass.set('bottom');
          tourHintPosTop = bounds.top - neededHeight;
        } else {
          //Show on bottom
          this.arrowClass.set('top');
          tourHintPosTop = bounds.bottom + this.arrowLength;
        }

        if (tourHintPosTop < 0) tourHintPosTop = 0;
      } else {
        //Left OR Right
        tourHintPosTop = bounds.midY - this.arrowLength * 2;
        if (tourHintPosTop < 0) tourHintPosTop = 0;

        baseOffX = 0;
        arrowOffX = 0;
        baseOffY = tourHintPosTop + neededHeight - winHeight;
        arrowOffY = baseOffY;

        if (baseOffY < 0) {
          baseOffY = 0;
          arrowOffY = 0;
        } else if (baseOffY >= calculatedHeight - arrowOffset) arrowOffY = calculatedHeight - arrowOffset;

        if (showLeft) {
          //Show on left side
          this.arrowClass.set('right');
          tourHintPosLeft = bounds.left - neededWidth;
        } else {
          //Show on right side
          this.arrowClass.set('left');
          tourHintPosLeft = bounds.right + this.arrowLength;
        }

        if (tourHintPosLeft < 0) tourHintPosLeft = 0;
      }

      this.tourHintPosLeft.set(tourHintPosLeft);
      this.tourHintPosTop.set(tourHintPosTop);

      this.dynamicArrowStyle.set({
        '--baseOffsetX': -baseOffX + 'px',
        '--baseOffsetY': -baseOffY + 'px',
        '--arrowOffsetX': -arrowOffX + 'px',
        '--arrowOffsetY': -arrowOffY + 'px'
      });

      //Calculate shadows for the highlight
      this.bgTopSize.set(Math.max(0, bounds.top - this.shadowPadding));
      this.bgBottomSize.set(Math.max(0, winHeight - (bounds.bottom + this.shadowPadding)));
      this.bgLeftSize.set(Math.max(0, bounds.left - this.shadowPadding));
      this.bgRightSize.set(Math.max(0, winWidth - (bounds.right + this.shadowPadding)));

      this.bgContentHeight.set(winHeight - (this.bgTopSize() + this.bgBottomSize()));
    }
  }

  //Calculates the 'surrounding bounds' of an element so the element and all its children are contained.
  //This is needed because sometimes elements dont have a width / height but the children define the bounds.
  private getSurroundingBounds(el: any, bounds: any = {}) {
    const myBounds = el.getBoundingClientRect();

    if (myBounds.left !== undefined && (bounds.left === undefined || myBounds.left < bounds.left)) {
      bounds.left = myBounds.left;
    }

    if (myBounds.right !== undefined && (bounds.right === undefined || myBounds.right > bounds.right)) {
      bounds.right = myBounds.right;
    }

    if (myBounds.top !== undefined && (bounds.top === undefined || myBounds.top < bounds.top)) {
      bounds.top = myBounds.top;
    }

    if (myBounds.bottom !== undefined && (bounds.bottom === undefined || myBounds.bottom > bounds.bottom)) {
      bounds.bottom = myBounds.bottom;
    }

    if (!myBounds.width || !myBounds.height) {
      const children = el.children;
      for (const child of children) {
        this.getSurroundingBounds(child, bounds);
      }
    }

    bounds.midX = (bounds.left + bounds.right) / 2;
    bounds.midY = (bounds.top + bounds.bottom) / 2;

    return bounds;
  }

  public close() {
    this.element.nativeElement.remove();
  }
}

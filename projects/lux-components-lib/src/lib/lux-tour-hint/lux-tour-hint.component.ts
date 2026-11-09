import { NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { LuxTourHintRef } from './lux-tour-hint-model/lux-tour-hint-ref.class';

@Component({
  selector: 'lux-tour-hint',
  templateUrl: './lux-tour-hint.component.html',
  styleUrls: ['./lux-tour-hint.component.scss'],
  imports: [NgStyle, NgClass]
})
export class LuxTourHintComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  private element = inject(ElementRef);
  tourHintRef = inject(LuxTourHintRef);

  //The element which is the target of the hint or tour
  private _luxTarget: any;

  set luxTarget(luxTarget: any) {
    this._luxTarget = luxTarget;

    //Needs a timeout or the content will not be rendered and so the bounds cannot be read corretly
    setTimeout(() => {
      this.updateTargetAndPositions();
    });
  }

  get luxTarget(): any {
    return this._luxTarget;
  }

  //CSS Class for the arrow where to point
  public arrowClass = 'top';

  //The arrow is hidden if the tour-hint had to be placed on top of the target
  public arrowVisible = true;

  //Called after closing so the creator of this component can clean up
  public onClosed?: () => void;

  //Constants which are also used in scss but can't directly be read from here
  private arrowLength = 16;
  private shadowPadding = 5;

  //Positions of the tour-hint modal
  public tourHintPosLeft = 0;
  public tourHintPosTop = 0;

  //Positions / Sizes of the tour-hint shadows
  public bgTopSize = 0;
  public bgBottomSize = 0;
  public bgLeftSize = 0;
  public bgRightSize = 0;
  public bgContentHeight = 0;

  //Style variables for the rendering of a dynamic 'Modal-Arrow'
  public dynamicArrowStyle = {};

  @ViewChild('tourHintContainer', { read: ElementRef })
  private tourHintContainer!: ElementRef;

  //When resizing / min- / maximizing window update all positions
  @HostListener('window:resize') windowResize() {
    this.updateTargetAndPositions();
  }

  ngAfterViewInit(): void {
    //Focus after loaded so we can navigate the tour with arrow keys
    this.updateTargetAndPositions();
    this.tourHintContainer.nativeElement.focus();
  }

  private updateTargetAndPositions() {
    if (!this.luxTarget) return;

    //Scrolls the element into view
    //TODO: In some cases scroll 'feels' wrong and target element is not centered on screen.
    this.luxTarget.scrollIntoView({
      block: 'center',
      inline: 'center'
    });

    //Unlike window.innerWidth / innerHeight this is the visible area without the scrollbars of the page
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    const bounds = this.getSurroundingBounds(this.luxTarget);

    this.calculatePositions(windowWidth, windowHeight, bounds);

    //Css variables, positions and styles were changesd so we need to rerender
    this.cdr.detectChanges();
  }

  private calculatePositions(winWidth: number, winHeight: number, bounds: any) {
    if (this.tourHintContainer) {
      //Calculate where the tour-hint should be shown
      const calculatedComponentBounds = this.tourHintContainer.nativeElement.getBoundingClientRect();
      const calculatedWidth = calculatedComponentBounds.width;
      const calculatedHeight = calculatedComponentBounds.height;

      const spaceTop = bounds.top - calculatedHeight;
      const spaceBottom = winHeight - bounds.bottom - calculatedHeight;
      const spaceLeft = bounds.left - calculatedWidth;
      const spaceRight = winWidth - bounds.right - calculatedWidth;

      //A side is only usable if the whole tour-hint including the arrow fits next to the target
      const fitting = [
        { side: 'top', space: spaceTop },
        { side: 'bottom', space: spaceBottom },
        { side: 'left', space: spaceLeft },
        { side: 'right', space: spaceRight }
      ].filter((candidate) => candidate.space >= this.arrowLength);

      //Without enough space on any side (e.g. small screens), the tour-hint is shown above or below the target
      const candidates = fitting.length
        ? fitting
        : [
            { side: 'top', space: spaceTop },
            { side: 'bottom', space: spaceBottom }
          ];
      const spaceMax = Math.max(...candidates.map((candidate) => candidate.space));
      const side = candidates.find((candidate) => candidate.space === spaceMax)!.side;

      //The tour-hint is always kept inside the viewport
      const maxLeft = Math.max(0, winWidth - calculatedWidth);
      const maxTop = Math.max(0, winHeight - calculatedHeight);

      //Min value for offsetting the arrow when tour-hint is at an edge of the screen
      const arrowOffset = this.arrowLength * 4;

      //Offset of the arrow so it points to the target even if the tour-hint was moved into the viewport
      let arrowOffX = 0;
      let arrowOffY = 0;

      if (side === 'top' || side === 'bottom') {
        const desiredLeft = bounds.midX - this.arrowLength * 2;
        this.tourHintPosLeft = Math.min(Math.max(desiredLeft, 0), maxLeft);
        arrowOffX = Math.min(Math.max(desiredLeft - this.tourHintPosLeft, 0), Math.max(0, calculatedWidth - arrowOffset));

        if (side === 'top') {
          this.arrowClass = 'bottom';
          this.tourHintPosTop = bounds.top - calculatedHeight - this.arrowLength;
        } else {
          this.arrowClass = 'top';
          this.tourHintPosTop = bounds.bottom + this.arrowLength;
        }

        this.tourHintPosTop = Math.min(Math.max(this.tourHintPosTop, 0), maxTop);
      } else {
        const desiredTop = bounds.midY - this.arrowLength * 2;
        this.tourHintPosTop = Math.min(Math.max(desiredTop, 0), maxTop);
        arrowOffY = Math.min(Math.max(desiredTop - this.tourHintPosTop, 0), Math.max(0, calculatedHeight - arrowOffset));

        if (side === 'left') {
          this.arrowClass = 'right';
          this.tourHintPosLeft = bounds.left - calculatedWidth - this.arrowLength;
        } else {
          this.arrowClass = 'left';
          this.tourHintPosLeft = bounds.right + this.arrowLength;
        }

        this.tourHintPosLeft = Math.min(Math.max(this.tourHintPosLeft, 0), maxLeft);
      }

      this.arrowVisible = !(
        this.tourHintPosLeft < bounds.right &&
        this.tourHintPosLeft + calculatedWidth > bounds.left &&
        this.tourHintPosTop < bounds.bottom &&
        this.tourHintPosTop + calculatedHeight > bounds.top
      );

      this.dynamicArrowStyle = {
        '--arrowOffsetX': -arrowOffX + 'px',
        '--arrowOffsetY': -arrowOffY + 'px'
      };

      //Calculate shadows for the highlight
      this.bgTopSize = Math.max(0, bounds.top - this.shadowPadding);
      this.bgBottomSize = Math.max(0, winHeight - (bounds.bottom + this.shadowPadding));
      this.bgLeftSize = Math.max(0, bounds.left - this.shadowPadding);
      this.bgRightSize = Math.max(0, winWidth - (bounds.right + this.shadowPadding));

      this.bgContentHeight = winHeight - (this.bgTopSize + this.bgBottomSize);
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
    //Without a target a still pending position update does nothing
    this._luxTarget = undefined;
    this.element.nativeElement.remove();
    this.onClosed?.();
  }
}

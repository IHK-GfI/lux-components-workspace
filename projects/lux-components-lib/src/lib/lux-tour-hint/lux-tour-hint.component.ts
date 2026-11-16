import { NgClass, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  signal,
  viewChild
} from '@angular/core';

@Component({
  selector: 'lux-tour-hint',
  templateUrl: './lux-tour-hint.component.html',
  styleUrls: ['./lux-tour-hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle, NgClass]
})
export class LuxTourHintComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly tourHintContainer = viewChild('tourHintContainer', { read: ElementRef });

  set luxTarget(luxTarget: any) {
    this._luxTarget.set(luxTarget);

    //Needs a timeout or the content will not be rendered and so the bounds cannot be read correctly
    setTimeout(() => {
      this.updateTargetAndPositions();
    });
  }

  get luxTarget(): any {
    return this._luxTarget();
  }

  protected readonly arrowClass = signal('top');
  //The arrow is hidden if the tour-hint had to be placed on top of the target
  protected readonly arrowVisible = signal(true);
  protected readonly tourHintPosLeft = signal(0);
  protected readonly tourHintPosTop = signal(0);
  protected readonly bgTopSize = signal(0);
  protected readonly bgBottomSize = signal(0);
  protected readonly bgLeftSize = signal(0);
  protected readonly bgRightSize = signal(0);
  protected readonly bgContentHeight = signal(0);

  //Style variables for the rendering of a dynamic 'Modal-Arrow'
  protected readonly dynamicArrowStyle = signal({});

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly element = inject(ElementRef);
  private readonly _luxTarget = signal<any>(undefined);

  //Constants which are also used in scss but can't directly be read from here
  private readonly arrowLength = 16;
  private readonly shadowPadding = 5;

  private readonly onWindowResize = () => this.updateTargetAndPositions();

  ngOnInit(): void {
    //When resizing / min- / maximizing window update all positions
    addEventListener('resize', this.onWindowResize);
  }

  ngAfterViewInit(): void {
    //Focus after loaded so we can navigate the tour with arrow keys
    this.updateTargetAndPositions();
    this.tourHintContainer()?.nativeElement.focus();
  }

  ngOnDestroy(): void {
    removeEventListener('resize', this.onWindowResize);
  }

  public close() {
    //Without a target a still pending position update does nothing
    this._luxTarget.set(undefined);
    this.element.nativeElement.remove();
  }

  private updateTargetAndPositions() {
    const target = this._luxTarget();
    if (!target) return;

    //TODO: In some cases scroll 'feels' wrong and target element is not centered on screen.
    target.scrollIntoView({
      block: 'center',
      inline: 'center'
    });

    //Unlike window.innerWidth / innerHeight this is the visible area without the scrollbars of the page
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    const bounds = this.getSurroundingBounds(target);

    this.calculatePositions(windowWidth, windowHeight, bounds);

    //Css variables, positions and styles were changed so we need to rerender
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

      let tourHintPosLeft: number;
      let tourHintPosTop: number;

      if (side === 'top' || side === 'bottom') {
        const desiredLeft = bounds.midX - this.arrowLength * 2;
        tourHintPosLeft = Math.min(Math.max(desiredLeft, 0), maxLeft);
        arrowOffX = Math.min(Math.max(desiredLeft - tourHintPosLeft, 0), Math.max(0, calculatedWidth - arrowOffset));

        if (side === 'top') {
          this.arrowClass.set('bottom');
          tourHintPosTop = bounds.top - calculatedHeight - this.arrowLength;
        } else {
          this.arrowClass.set('top');
          tourHintPosTop = bounds.bottom + this.arrowLength;
        }

        tourHintPosTop = Math.min(Math.max(tourHintPosTop, 0), maxTop);
      } else {
        const desiredTop = bounds.midY - this.arrowLength * 2;
        tourHintPosTop = Math.min(Math.max(desiredTop, 0), maxTop);
        arrowOffY = Math.min(Math.max(desiredTop - tourHintPosTop, 0), Math.max(0, calculatedHeight - arrowOffset));

        if (side === 'left') {
          this.arrowClass.set('right');
          tourHintPosLeft = bounds.left - calculatedWidth - this.arrowLength;
        } else {
          this.arrowClass.set('left');
          tourHintPosLeft = bounds.right + this.arrowLength;
        }

        tourHintPosLeft = Math.min(Math.max(tourHintPosLeft, 0), maxLeft);
      }

      this.tourHintPosLeft.set(tourHintPosLeft);
      this.tourHintPosTop.set(tourHintPosTop);

      this.arrowVisible.set(
        !(
          tourHintPosLeft < bounds.right &&
          tourHintPosLeft + calculatedWidth > bounds.left &&
          tourHintPosTop < bounds.bottom &&
          tourHintPosTop + calculatedHeight > bounds.top
        )
      );

      this.dynamicArrowStyle.set({
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
}

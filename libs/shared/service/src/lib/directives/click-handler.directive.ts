import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { buffer, debounceTime, filter, map, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[libClickHandler]',
  standalone: true
})
export class ClickHandlerDirective implements OnInit, OnDestroy {
  @Output() singleClick = new EventEmitter<MouseEvent>();
  @Output() doubleClick = new EventEmitter<MouseEvent>();

  private destroy$ = new Subject<void>();

  // Configure timing (in ms)
  private readonly DOUBLE_CLICK_DELAY = 250;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    // Create a stream of click events
    const click$ = fromEvent<MouseEvent>(this.element.nativeElement, 'click');

    // Buffer clicks within the double click delay window
    const bufferedClicks$ = click$.pipe(
      buffer(click$.pipe(debounceTime(this.DOUBLE_CLICK_DELAY))),
      map((clicks) => ({ clicks, timestamp: Date.now() })),
      takeUntil(this.destroy$)
    );

    // Handle double clicks
    bufferedClicks$
      .pipe(filter(({ clicks }) => clicks.length === 2))
      .subscribe(({ clicks }) => {
        this.doubleClick.emit(clicks[1]);
      });

    // Handle single clicks
    bufferedClicks$
      .pipe(filter(({ clicks }) => clicks.length === 1))
      .subscribe(({ clicks }) => {
        this.singleClick.emit(clicks[0]);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

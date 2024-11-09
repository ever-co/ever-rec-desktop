import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { IResizeEvent } from '@ever-co/shared-utils';
import { Subject } from 'rxjs';

@Directive({
  selector: '[libResize]',
  standalone: true,
})
export class ResizeDirective implements OnInit, OnDestroy {
  @Output() changeSize = new EventEmitter<IResizeEvent>();
  private destroy$ = new Subject<void>();
  private resizeObserver: ResizeObserver;

  constructor(private elementRef: ElementRef) {
    this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
  }

  ngOnInit(): void {
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onResize(entries: ResizeObserverEntry[]): void {
    const entry = entries[0];
    if (entry) {
      this.changeSize.emit({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    }
  }
}

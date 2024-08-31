import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { debounceTime, fromEvent, Subscription, tap } from 'rxjs';

@Directive({
  selector: '[libInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Input() threshold = 0.9;
  @Input() debounceTime = 300; // Debounce time in milliseconds
  @Output() scrolled = new EventEmitter<void>();

  private scrollSubscription = new Subscription();

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.scrollSubscription = fromEvent(this.el.nativeElement, 'scroll')
      .pipe(
        debounceTime(this.debounceTime),
        tap((event) => this.checkScroll(event as Event))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  private checkScroll<T extends Event>(event: T): void {
    const target = event.target as HTMLElement;
    const position = target.scrollTop + target.clientHeight;
    const height = target.scrollHeight;
    const threshold = this.threshold * height;

    if (position >= threshold) {
      this.scrolled.emit();
    }
  }
}

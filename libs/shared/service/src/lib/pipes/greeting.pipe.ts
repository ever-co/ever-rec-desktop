import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, takeUntil } from 'rxjs/operators';

interface TimeRange {
  start: number;
  end: number;
  greeting: string;
}

@Pipe({
  name: 'greeting',
  pure: true,
  standalone: true,
})
export class GreetingPipe implements PipeTransform, OnDestroy {
  private static readonly TIME_RANGES: TimeRange[] = [
    { start: 5, end: 12, greeting: 'Good morning 👋' },
    { start: 12, end: 17, greeting: 'Good afternoon 🗿' },
    { start: 17, end: 21, greeting: 'Good evening 🎭' },
    { start: 21, end: 5, greeting: 'Good night 💤' },
  ];

  private readonly destroy$ = new Subject<void>();
  private readonly locale$ = new BehaviorSubject<string>('en');
  private readonly greeting$: Observable<string>;

  constructor() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    const initialDelay = nextHour.getTime() - now.getTime();

    this.greeting$ = timer(0, initialDelay).pipe(
      map(() => this.getCurrentHourGreeting()),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      shareReplay(1)
    );
  }

  /**
   * @param name Optional name for personalization
   * @param locale Optional locale
   */
  transform(nameOrLocale?: string, locale = 'en'): Observable<string> {
    let name: string | undefined;

    if (locale) {
      // both name and locale provided
      name = nameOrLocale;
    } else {
      // only locale provided
      locale = nameOrLocale ?? 'en';
    }

    if (this.locale$.value !== locale) {
      this.locale$.next(locale);
    }

    return this.greeting$.pipe(
      map(greeting => this.formatGreeting(greeting, name))
    );
  }

  private formatGreeting(base: string, name?: string): string {
    const cleanName = name?.trim();
    return cleanName ? `${base}, ${cleanName}` : base;
  }

  private getCurrentHourGreeting(): string {
    const hour = new Date().getHours();
    return this.getGreetingForHour(hour);
  }

  private getGreetingForHour(hour: number): string {
    const range = GreetingPipe.TIME_RANGES.find(({ start, end }) =>
      this.isHourInRange(hour, start, end)
    );

    return range?.greeting ?? 'Hello 👋';
  }

  private isHourInRange(hour: number, start: number, end: number): boolean {
    return end > start
      ? hour >= start && hour < end
      : hour >= start || hour < end;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.locale$.complete();
  }
}

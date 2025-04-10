import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  datePickerActions,
  HumanizeDateRangePipe,
  selectDatePickerState,
} from '@ever-co/shared-service';
import { IRange, moment } from '@ever-co/shared-utils';
import { selectSettingStorageState } from '@ever-co/web-setting-data-access';
import { Store } from '@ngrx/store';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
    selector: 'lib-date-picker',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        HumanizeDateRangePipe,
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './date-picker.component.html',
    styleUrl: './date-picker.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Use strongly typed FormGroup with IRange interface
  public readonly range = new FormGroup({
    start: new FormControl<IRange['start']>(''),
    end: new FormControl<IRange['end']>(''),
  });

  constructor(private store: Store, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.getFirstDayOfWeek = () =>
      moment().startOf('week').isoWeekday();
  }

  ngOnInit(): void {
    // Select and patch initial value from store
    this.store
      .select(selectDatePickerState)
      .pipe(
        filter(Boolean), // Ensure truthy value
        tap(({ selectedRange }) =>
          this.range.patchValue(selectedRange, { emitEvent: false })
        ), // Don't trigger valueChanges on patch
        takeUntil(this.destroy$) // Cleanup on destroy
      )
      .subscribe();

    // Listen for changes and dispatch action
    this.range.valueChanges
      .pipe(
        map((range) => this.rangeAdapter(range as IRange)),
        debounceTime(300), // Debounce to avoid multiple quick changes
        distinctUntilChanged(this.deepComparaison), // Only emit if the value actually changed
        tap((range) =>
          this.store.dispatch(datePickerActions.selectRange(range))
        ),
        takeUntil(this.destroy$) // Cleanup on destroy
      )
      .subscribe();
  }

  public deepComparaison(prev: IRange, curr: IRange): boolean {
    return (
      moment(prev.start).isSame(curr.start) && moment(prev.end).isSame(curr.end)
    );
  }

  public rangeAdapter({ start, end }: IRange): IRange {
    if (moment(start).isSame(end)) {
      return {
        start: moment(start).startOf('day').toISOString(),
        end: moment(start).endOf('day').toISOString(),
      };
    }

    if (end) {
      const duration = moment(end).diff(moment(start), 'days');
      return {
        start: moment(start).startOf('day').toISOString(),
        end: moment(start).add(duration, 'days').endOf('day').toISOString(),
      };
    }
    return {
      start: moment(start).startOf('day').toISOString(),
      end: moment(end).endOf('day').toISOString(),
    };
  }

  public get range$(): Observable<IRange> {
    return this.store.select(selectDatePickerState).pipe(
      filter(Boolean),
      map(({ selectedRange }) => selectedRange),
      takeUntil(this.destroy$)
    );
  }

  public get maxDate(): Date {
    return moment().endOf('day').toDate();
  }

  public get minDate$(): Observable<Date | null> {
    return this.store.select(selectSettingStorageState).pipe(
      map(({ retention }) =>
        retention === -1
          ? null
          : moment(this.maxDate).subtract(retention, 'days').toDate()
      ),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    // Trigger cleanup
    this.destroy$.next();
    this.destroy$.complete();
  }
}

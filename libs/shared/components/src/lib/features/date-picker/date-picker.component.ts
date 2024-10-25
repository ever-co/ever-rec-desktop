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
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  datePickerActions,
  HumanizeDateRangePipe,
  selectDatePickerState,
} from '@ever-co/shared-service';
import { IRange } from '@ever-co/shared-utils';
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
  standalone: true,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private selectedRange!: IRange;

  // Use strongly typed FormGroup with IRange interface
  public readonly range = new FormGroup({
    start: new FormControl<IRange['start']>(''),
    end: new FormControl<IRange['end']>(''),
  });

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Select and patch initial value from store
    this.store
      .select(selectDatePickerState)
      .pipe(
        filter(Boolean), // Ensure truthy value
        tap(({ selectedRange }) => {
          this.selectedRange = selectedRange;
          this.range.patchValue(selectedRange, { emitEvent: false });
        }), // Don't trigger valueChanges on patch
        takeUntil(this.destroy$) // Cleanup on destroy
      )
      .subscribe();

    // Listen for changes and dispatch action
    this.range.valueChanges
      .pipe(
        filter((range) => this.deepComparaison(range)),
        debounceTime(300), // Debounce to avoid multiple quick changes
        distinctUntilChanged(), // Only emit if the value actually changed
        tap((selectedRange) => {
          this.selectedRange = selectedRange as IRange;
          this.store.dispatch(
            datePickerActions.selectRange(this.selectedRange)
          );
        }),
        takeUntil(this.destroy$) // Cleanup on destroy
      )
      .subscribe();
  }

  public deepComparaison<T>(range: T): boolean {
    return JSON.stringify(range) !== JSON.stringify(this.selectedRange);
  }

  public get range$(): Observable<IRange> {
    return this.store.select(selectDatePickerState).pipe(
      filter(Boolean),
      map(({ selectedRange }) => selectedRange),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    // Trigger cleanup
    this.destroy$.next();
    this.destroy$.complete();
  }
}

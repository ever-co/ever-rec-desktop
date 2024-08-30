import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { selectGenerateVideoState } from '@ever-capture/convert-video-data-access';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'lib-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent implements OnInit {
  public error$!: Observable<string>;
  private store = inject(Store);

  ngOnInit(): void {
    this.error$ = this.store
      .select(selectGenerateVideoState)
      .pipe(map((state) => state.error));
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { hydrationActions } from '@ever-co/shared-service';
import { Store } from '@ngrx/store';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Continues Recording';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(hydrationActions.hydrateState());
  }
}

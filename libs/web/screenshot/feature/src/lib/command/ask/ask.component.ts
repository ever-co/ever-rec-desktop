import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { screenshotActions } from '@ever-capture/screenshot-data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-ask',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ask.component.html',
  styleUrl: './ask.component.scss',
})
export class AskComponent {
  public request!: string;
  private store = inject(Store);

  onChange() {
    this.store.dispatch(screenshotActions.ask({ request: this.request }));
  }
}

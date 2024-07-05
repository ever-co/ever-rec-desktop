import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { screenshotActions } from '@prototype/web/screenshot/data-access';

@Component({
  selector: 'lib-ask',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ask.component.html',
  styleUrl: './ask.component.scss',
})
export class AskComponent implements OnInit {
  public askForm!: FormGroup;
  private store = inject(Store);
  ngOnInit(): void {
    this.askForm = new FormGroup({
      request: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.askForm.valid) {
      this.store.dispatch(screenshotActions.ask(this.askForm.value));
      this.askForm.reset();
    } else {
      this.askForm.markAllAsTouched();
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-screenshot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './screenshot.component.html',
  styleUrl: './screenshot.component.scss',
})
export class ScreenshotComponent {
  constructor(private readonly store: Store, private readonly router: Router) {}
}

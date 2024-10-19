import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-no-data',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss',
})
export class NoDataComponent {
  @Input()
  message = 'Please try again later.';
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NoDataComponent } from '@ever-co/shared-components';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, NoDataComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}

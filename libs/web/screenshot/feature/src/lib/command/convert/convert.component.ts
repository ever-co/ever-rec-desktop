import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-convert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convert.component.html',
  styleUrl: './convert.component.scss',
})
export class ConvertComponent {
  private readonly router = inject(Router);

  public async navigateToVideo(): Promise<void> {
    await this.router.navigate(['convert']);
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NoDataComponent } from '@ever-co/shared-components';

@Component({
  selector: 'lib-video-gallery',
  standalone: true,
  imports: [CommonModule, NoDataComponent],
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.scss',
})
export class VideoGalleryComponent {}

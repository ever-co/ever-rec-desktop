import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StartComponent } from '../command/start/start.component';
import { StopComponent } from '../command/stop/stop.component';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [CommonModule, StartComponent, StopComponent, GalleryComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}

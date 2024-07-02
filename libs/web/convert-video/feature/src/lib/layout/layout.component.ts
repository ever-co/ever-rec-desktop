import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SettingComponent } from '../setting/setting.component';
import { VideoComponent } from '../video/video.component';

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [CommonModule, SettingComponent, VideoComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}

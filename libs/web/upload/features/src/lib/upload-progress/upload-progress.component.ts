import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HumanizeBytesPipe } from '@ever-co/shared-service';
import { IUploadItem } from '@ever-co/upload-data-access';

@Component({
  selector: 'lib-upload-progress',
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatIconModule,
    HumanizeBytesPipe,
  ],
  templateUrl: './upload-progress.component.html',
  styleUrl: './upload-progress.component.scss',
})
export class UploadProgressComponent {
  @Input() item!: IUploadItem;
}

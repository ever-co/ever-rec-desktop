import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IAudio } from '@ever-co/shared-utils';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  HumanizePipe,
  HumanizeBytesPipe,
  SampleRatePipe,
  CopyToClipboardDirective,
} from '@ever-co/shared-service';

@Component({
  selector: 'lib-audio-metadata',
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    HumanizePipe,
    HumanizeBytesPipe,
    SampleRatePipe,
    CopyToClipboardDirective,
  ],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataComponent {
  @Input() audio!: IAudio | null;
  @Input() showDetailedInfo = false;
  @Input() hideTimeLogAction = false;

  @Output() viewVideo = new EventEmitter<string>();
  @Output() viewTimeLog = new EventEmitter<string>();
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'lib-timeline-controls',
    imports: [CommonModule],
    templateUrl: './timeline-controls.component.html',
    styleUrl: './timeline-controls.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineControlsComponent {}

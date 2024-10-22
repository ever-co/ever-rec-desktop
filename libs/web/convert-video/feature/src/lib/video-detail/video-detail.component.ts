import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { ConvertVideoElectronService } from '@ever-co/convert-video-data-access';
import { NoDataComponent, VideoComponent } from '@ever-co/shared-components';
import { HumanizeBytesPipe, UtcToLocalTimePipe } from '@ever-co/shared-service';
import { IVideo } from '@ever-co/shared-utils';
import { concatMap, filter, Observable } from 'rxjs';

@Component({
  selector: 'lib-video-detail',
  standalone: true,
  imports: [
    CommonModule,
    NoDataComponent,
    VideoComponent,
    MatChipsModule,
    UtcToLocalTimePipe,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    MatIconModule,
    HumanizeBytesPipe
  ],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss',
})
export class VideoDetailComponent implements OnInit {
  public video$!: Observable<IVideo | null>;
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly videoService: ConvertVideoElectronService
  ) {}
  ngOnInit(): void {
    this.video$ = this.activatedRoute.params.pipe(
      filter(Boolean),
      concatMap(async (params) => {
        if (params['id']) {
          return this.videoService.getOneVideo({
            where: {
              id: params['id'],
            },
            relations: ['metadata'],
          });
        } else {
          await this.router.navigate(['/dashboard']);
          return null;
        }
      })
    );
  }
}

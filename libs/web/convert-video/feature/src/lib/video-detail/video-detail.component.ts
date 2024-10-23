import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConvertVideoElectronService,
  generateVideoActions,
} from '@ever-co/convert-video-data-access';
import { NoDataComponent, VideoComponent } from '@ever-co/shared-components';
import { HumanizeBytesPipe, UtcToLocalTimePipe } from '@ever-co/shared-service';
import { IVideo } from '@ever-co/shared-utils';
import { Store } from '@ngrx/store';
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
    HumanizeBytesPipe,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.scss',
})
export class VideoDetailComponent implements OnInit {
  public video$!: Observable<IVideo | null>;
  protected readonly value = signal('');

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly videoService: ConvertVideoElectronService,
    private readonly store: Store
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

  public async deleteVideo(video: IVideo): Promise<void> {
    this.store.dispatch(generateVideoActions.deleteVideo(video));
    await this.router.navigate(['/', 'library', 'screenshots']);
  }

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
    console.log(this.value())
  }
}

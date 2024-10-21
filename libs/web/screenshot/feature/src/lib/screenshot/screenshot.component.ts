import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenshotElectronService } from '@ever-co/screenshot-data-access';
import { NoDataComponent, VideoComponent } from '@ever-co/shared-components';
import { UtcToLocalTimePipe } from '@ever-co/shared-service';
import { IScreenshot } from '@ever-co/shared-utils';
import { concatMap, filter, Observable } from 'rxjs';

@Component({
  selector: 'lib-screenshot',
  standalone: true,
  imports: [CommonModule, NoDataComponent, UtcToLocalTimePipe, MatCardModule, MatIconModule, MatChipsModule, VideoComponent],
  templateUrl: './screenshot.component.html',
  styleUrl: './screenshot.component.scss',
})
export class ScreenshotComponent implements OnInit {
  public screenshot$!: Observable<IScreenshot | null>;
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly screenshotService: ScreenshotElectronService
  ) {}
  ngOnInit(): void {
    this.screenshot$ = this.activatedRoute.params.pipe(
      filter(Boolean),
      concatMap(async (params) => {
        if (params['id']) {
          return this.screenshotService.getOneScreenshot({
            where: {
              id: params['id'],
            },
            relations: ['metadata', 'video']
          });
        } else {
          await this.router.navigate(['/dashboard']);
          return null;
        }
      })
    );
  }
}

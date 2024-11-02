// resolution.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { resolutionMapper } from '@ever-co/shared-utils';

@Pipe({
  name: 'resolution',
  standalone: true,
})
export class ResolutionPipe implements PipeTransform {
  public transform(resolution: string): string {
    return resolutionMapper[resolution] || resolution;
  }
}

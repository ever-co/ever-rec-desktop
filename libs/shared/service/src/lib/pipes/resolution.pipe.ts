// resolution.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { iconMapper, resolutionMapper } from '@ever-co/shared-utils';

@Pipe({
  name: 'resolution',
  standalone: true,
})
export class ResolutionPipe implements PipeTransform {
  public transform(
    resolution: string | undefined | null,
    type: 'label' | 'icon' = 'label'
  ): string {
    if (!resolution) return 'N/A';
    const label = resolutionMapper[resolution] || resolution;
    const icon = iconMapper[label] || 'help';
    return type === 'icon' ? icon : label;
  }
}

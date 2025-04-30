import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sampleRate',
  standalone: true,
})
export class SampleRatePipe implements PipeTransform {
  /**
   * Transforms a sample rate in Hz to a human-readable format (kHz)
   * @param rate - Sample rate in Hz
   * @param decimals - Number of decimal places to include
   * @returns Formatted sample rate string
   */
  transform(rate: number | undefined, decimals: number = 1): string {
    if (rate === undefined || rate === null || isNaN(rate)) {
      return 'Unknown';
    }

    // Convert Hz to kHz
    const kHz = rate / 1000;

    return `${kHz.toFixed(decimals)} kHz`;
  }
}

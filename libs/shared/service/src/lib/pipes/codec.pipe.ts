// codec-description.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { FfmpegVideoCodec } from '@ever-co/shared-utils';

@Pipe({
  name: 'codecDescription',
})
export class CodecPipe implements PipeTransform {
  private readonly codecMap = new Map<string, string>([
    [FfmpegVideoCodec.H264, 'H.264 / AVC (libx264)'],
    [FfmpegVideoCodec.H264_NATIVE, 'H.264 / AVC (native)'],
    [FfmpegVideoCodec.H265, 'H.265 / HEVC (libx265)'],
    [FfmpegVideoCodec.HEVC_NATIVE, 'H.265 / HEVC (native)'],
    [FfmpegVideoCodec.MPEG4, 'MPEG-4 Part 2'],
    [FfmpegVideoCodec.VP9, 'VP9 (libvpx-vp9)'],
    [FfmpegVideoCodec.AV1, 'AV1 (libaom-av1)'],
    [FfmpegVideoCodec.MPEG2, 'MPEG-2 Video'],
  ]);

  transform(codec: string): string {
    return this.codecMap.get(codec) ?? `Unknown codec: ${codec}`;
  }
}

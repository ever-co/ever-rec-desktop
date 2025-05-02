import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAudio } from '@ever-co/shared-utils';

export type AudioPlayerMode = 'host' | 'inline' | 'card' | 'player';

@Component({
  template: '',
})
export abstract class BasePlayerComponent {
  @Input({ required: true }) audio!: IAudio;
  @Input() isPlaying: boolean | null = false;
  @Input() progress: number | null = 0;
  @Input() currentTime: string | null = '0:00';
  @Input() duration: string | null = '0:00';
  @Input() remainingTime: string | null = '0:00';
  @Input() volume: number | null = 1;
  @Input() isMuted: boolean | null = false;

  @Output() playPause = new EventEmitter<void>();
  @Output() seek = new EventEmitter<number>();
  @Output() skipForward = new EventEmitter<void>();
  @Output() skipBack = new EventEmitter<void>();
  @Output() volumeChange = new EventEmitter<number>();
  @Output() muteToggle = new EventEmitter<void>();

  public get name(): string {
    return this.audio?.metadata?.name || 'Unknown Track';
  }
}

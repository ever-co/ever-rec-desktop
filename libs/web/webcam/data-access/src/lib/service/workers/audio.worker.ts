/// <reference lib="webworker" />

import { AudioChunkManager } from './concretes/audio-chunk-manager';
import { AudioWorker } from './concretes/audio-worker';
import { WebmAudioProcessor } from './concretes/webm-audio.processor';
import { WorkerMessage } from './interfaces/audio-worker.interface';

// Dependency injection and worker initialization
const chunkManager = new AudioChunkManager();
const audioProcessor = new WebmAudioProcessor();
const audioWorker = new AudioWorker(chunkManager, audioProcessor);

// Open/Closed Principle - New message types can be added without modifying this
addEventListener('message', async ({ data }: { data: WorkerMessage }) => {
  await audioWorker.handleMessage(data);
});

/// <reference lib="webworker" />

import { HeatMapDataWorker } from './heat-map-data-worker';
import { WorkerMessage } from './interfaces/data.interface';

const heatMapDataWorker = new HeatMapDataWorker();
// Open/Closed Principle - New message types can be added without modifying this
addEventListener('message', ({ data }: { data: WorkerMessage }) => {
  heatMapDataWorker.handleMessage(data);
});

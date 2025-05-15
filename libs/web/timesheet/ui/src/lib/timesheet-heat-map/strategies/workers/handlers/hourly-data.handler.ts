import {
  DataProcessor,
  HeatMapDataMessage,
  HeatMapDataMessageHandler,
  MessageType,
  ProcessHourlyHeatMapDataMessage,
} from '../interfaces/data.interface';

export class HourlyDataHandler
  implements HeatMapDataMessageHandler<ProcessHourlyHeatMapDataMessage>
{
  public readonly messageType = MessageType.PROCESS_HOURLY_DATA;

  constructor(private readonly processor: DataProcessor) {}

  public canHandle(
    message: HeatMapDataMessage,
  ): message is ProcessHourlyHeatMapDataMessage {
    return message.type === MessageType.PROCESS_HOURLY_DATA;
  }

  public handle(message: ProcessHourlyHeatMapDataMessage): void {
    const points = this.processor.execute(message.data);
    postMessage({ type: MessageType.PROCESSED, points });
  }
}

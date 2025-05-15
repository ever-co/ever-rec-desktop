import {
  DataProcessor,
  HeatMapDataMessage,
  HeatMapDataMessageHandler,
  MessageType,
  ProcessDailyHeatMapDataMessage,
} from '../interfaces/data.interface';

export class DailyDataHandler
  implements HeatMapDataMessageHandler<ProcessDailyHeatMapDataMessage>
{
  public readonly messageType = MessageType.PROCESS_DAILY_DATA;

  constructor(private readonly processor: DataProcessor) {}

  public canHandle(
    message: HeatMapDataMessage,
  ): message is ProcessDailyHeatMapDataMessage {
    return message.type === MessageType.PROCESS_DAILY_DATA;
  }

  public handle(message: ProcessDailyHeatMapDataMessage): void {
    const points = this.processor.execute(message.data);
    postMessage({ type: MessageType.PROCESSED, points });
  }
}

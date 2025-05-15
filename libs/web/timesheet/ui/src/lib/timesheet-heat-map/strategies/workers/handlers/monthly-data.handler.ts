import {
  DataProcessor,
  HeatMapDataMessage,
  HeatMapDataMessageHandler,
  MessageType,
  ProcessMonthlyHeatMapDataMessage,
} from '../interfaces/data.interface';

export class MonthlyDataHandler
  implements HeatMapDataMessageHandler<ProcessMonthlyHeatMapDataMessage>
{
  public readonly messageType = MessageType.PROCESS_MONTHLY_DATA;

  constructor(private readonly processor: DataProcessor) {}

  public canHandle(
    message: HeatMapDataMessage,
  ): message is ProcessMonthlyHeatMapDataMessage {
    return message.type === MessageType.PROCESS_MONTHLY_DATA;
  }

  public handle(message: ProcessMonthlyHeatMapDataMessage): void {
    const points = this.processor.execute(message.data);
    postMessage({ type: MessageType.PROCESSED, points });
  }
}

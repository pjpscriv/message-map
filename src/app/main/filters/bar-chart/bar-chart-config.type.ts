import {Message} from '../../../types/message.interface';
import {ScaleLinear} from 'd3';

export type BarChartConfig = {
  id: string
  name: string
  getData: (m: Message) => any
  messagesDimension?: any
  chartsDimension?: any
  getLabel: (v: any) => string
  scale: ScaleLinear<any, any>
  clicked: Set<any>
  numberOfBars?: number
  ordering?: any
};

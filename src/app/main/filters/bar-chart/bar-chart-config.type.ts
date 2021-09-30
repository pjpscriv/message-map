import {Message} from '../../../types/message.interface';
import {ScaleLinear} from 'd3';

export type BarChartConfig = {
  id: string
  name: string
  getData: (m: Message) => any
  scale: ScaleLinear<any, any>,
  numberOfBars: any
};

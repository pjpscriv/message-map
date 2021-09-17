import {Message} from '../../../types/message.interface';

export type BarChart = {
  name: string
  getData: (m: Message) => any
};

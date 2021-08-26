import * as d3 from 'd3';
import {Axis, ScaleTime} from 'd3';
import * as fc from 'd3fc';

const SECONDS_PER_DAY = 86400;

export function dayLimitedAxis(scale: ScaleTime<any, any>): Axis<any>  {
  const tickSeconds = (scale.ticks()[1]?.getTime() - scale.ticks()[0]?.getTime()) / 1000;
  if (tickSeconds < SECONDS_PER_DAY) {
    return fc.axisBottom(scale)
      .tickValues(createDayTicks(scale.domain()))
      .tickCenterLabel(true);
  } else {
    return fc.axisLabelRotate(fc.axisBottom(scale));
  }
}

function createDayTicks(domain: Array<any>): Array<Date> {
  const date = d3.timeDay.ceil(domain[0]);
  const EndDate = d3.timeDay.ceil(domain[1]);
  const dates = [];
  while (date < EndDate) {
    dates.push(new Date(+date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}


// TODO: Use normal D3 Tick function except for midnight and midday
export function timeTickFormat(x: Date): string {
  // let s = new DatePipe('en-US').transform(x as Date, 'haaaaa\'m\'') as string;
  // s = s === '12am' ? 'midnight' : s === '12pm' ? 'midday' : s;
  return 'Whoop!';
}

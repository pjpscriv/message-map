import * as d3 from 'd3';
import {Axis, ScaleTime} from 'd3';
// import * as fc from 'd3fc';

const SECONDS_PER_DAY = 86400;

export function dayLimitedAxis(scale: ScaleTime<any, any>): Axis<any>  {
  const tickSeconds = (scale.ticks()[1]?.getTime() - scale.ticks()[0]?.getTime()) / 1000;

  // TODO: figure out how to get d3fc to play nice with Angular 12
  return d3.axisBottom(scale);

  // if (tickSeconds < SECONDS_PER_DAY) {
  //   return fc.axisBottom(scale)
  //     .tickValues(createDayTicks(scale.domain()))
  //     .tickCenterLabel(true);
  // } else {
  //   return fc.axisLabelRotate(fc.axisBottom(scale));
  // }
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

const formatSecond = d3.timeFormat(':%S');
const formatMinute = d3.timeFormat('%I:%M');
const formatHour = d3.timeFormat('%I %p');
const BIG_HOURS = new Set([10, 11, 12, 22, 23, 0]);

export function timeTickFormat(time: any): string {
  // console.log(`This is the thing: ${time}`);
  if (time.getSeconds() !== 0 ) {
    return formatSecond(time);
  } else if (time.getMinutes() !== 0 && BIG_HOURS.has(time.getHours())) {
    return formatMinute(time);
  } else if (time.getMinutes() !== 0) {
    return formatMinute(time).slice(1);
  } else if (time.getHours() === 0) {
    return 'midnight';
  } else if (time.getHours() === 12) {
    return 'midday';
  } else if (BIG_HOURS.has(time.getHours())) {
    return formatHour(time).toLowerCase();
  } else {
    return formatHour(time).toLowerCase().slice(1);
  }
}

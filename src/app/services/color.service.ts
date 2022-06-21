import { Injectable } from '@angular/core';
import * as d3 from 'd3';

export enum COLOR_ENUM {
  None,
  ThreadsColored,
  BarChartColored
}

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private coloredState = COLOR_ENUM.None;
  private colorScale = d3.scaleOrdinal().range(([
    '#009688',
    '#8bc34a',
    '#ffeb3b',
    '#ff9800',
    '#f44336',
    '#ff66cc',
    '#9c27b0',
    '#673ab7',
    '#704880',
    '#795548']));

  constructor() { }

  public getColoredState(): COLOR_ENUM {
    return this.coloredState;
  }

  public setColoredState(value: COLOR_ENUM): void {
    this.coloredState = value;
  }

  // tslint:disable:no-bitwise
  public stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }

  public randomColor(): string {
    return `#${Math.random().toString(16).slice(-6)}`;
  }
}

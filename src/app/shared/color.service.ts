import { Injectable } from '@angular/core';

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

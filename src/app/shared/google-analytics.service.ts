import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  public dataLayer: any[] = [];

  constructor() {
    // window.dataLayer = window?.dataLayer || [];
  }

  public gtag(...args: any[]): void {
    this.dataLayer.push(args);
  }

  public run(): void {
    this.gtag('js', new Date());
    this.gtag('config', 'UA-115468223-1');
  }
}

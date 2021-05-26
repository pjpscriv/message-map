import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  public dataLayer: any[] = [];

  constructor() {
    // window.dataLayer = window?.dataLayer || [];
  }

  public gtag(...args: any[]) {
    this.dataLayer.push(args);
  }

  run() {
    this.gtag('js', new Date());
    this.gtag('config', 'UA-115468223-1');
  }
}

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public updateViewports(viewport: {
    isMobile: boolean;
    isTablet: boolean;
    isExpanded: boolean;
  }) {
    this.isMobileView.set(viewport.isMobile);
    this.isTabletView.set(viewport.isTablet);
    this.isExpanded.set(viewport.isExpanded);
  }
  public isExpanded = signal<boolean>(false);
  public isMobileView = signal<boolean>(false);
  public isTabletView = signal<boolean>(false);
}

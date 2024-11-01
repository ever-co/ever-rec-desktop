import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  public isExpanded = signal<boolean>(false);
  public isMobileView = signal<boolean>(false);
  public isTabletView = signal<boolean>(false);
}

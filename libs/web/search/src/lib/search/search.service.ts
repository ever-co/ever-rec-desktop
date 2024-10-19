import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public overlayOpen = signal(false);
  public search = signal<any[]>([]);
  public searchTerm = signal<string>('')
}

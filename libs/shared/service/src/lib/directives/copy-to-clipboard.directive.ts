import { Clipboard } from '@angular/cdk/clipboard';
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[libCopyToClipboard]',
  standalone: true,
})
export class CopyToClipboardDirective implements OnInit, OnDestroy {
  @Input('libCopyToClipboard') text: string | undefined = '';
  @Input() showIcon = true;

  private iconElement: HTMLElement | null = null;
  private timeoutId: number | null = null;

  constructor(
    private clipboard: Clipboard,
    private el: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.setupUI();
  }

  ngOnDestroy() {
    this.clearTimeout();
  }

  private setupUI(): void {
    this.renderer.addClass(this.el.nativeElement, 'relative');
    this.renderer.addClass(this.el.nativeElement, 'inline-flex');
    this.renderer.addClass(this.el.nativeElement, 'items-center');
    this.renderer.addClass(this.el.nativeElement, 'cursor-pointer');

    if (this.showIcon) {
      this.iconElement = this.renderer.createElement('mat-icon');
      this.renderer.setProperty(
        this.iconElement,
        'textContent',
        'content_copy'
      );
      this.renderer.addClass(this.iconElement, 'ml-2');
      this.renderer.addClass(this.iconElement, 'text-gray-400');
      this.renderer.addClass(this.iconElement, 'text-sm');
      this.renderer.appendChild(this.el.nativeElement, this.iconElement);
    }
  }

  @HostListener('click')
  onClick(): void {
    const textToCopy = this.text || this.el.nativeElement.innerText;

    if (this.clipboard.copy(textToCopy)) {
      this.animateCopySuccess();
    }
  }

  private animateCopySuccess(): void {
    this.clearTimeout(); // Clear any existing timeout

    if (this.iconElement) {
      // Change icon to check and color to green
      this.renderer.setProperty(
        this.iconElement,
        'textContent',
        'check'
      );
      this.renderer.removeClass(this.iconElement, 'text-gray-400');
      this.renderer.addClass(this.iconElement, 'text-green-500');

      // Revert back after 1.5 seconds
      this.setTimeoutSafely(() => {
        this.renderer.setProperty(
          this.iconElement,
          'textContent',
          'content_copy'
        );
        this.renderer.removeClass(this.iconElement, 'text-green-500');
        this.renderer.addClass(this.iconElement, 'text-gray-400');
      }, 1500);
    } else {
      // If no icon, add a temporary success message
      const successElement = this.renderer.createElement('span');
      this.renderer.setProperty(successElement, 'textContent', 'Copied!');
      this.renderer.addClass(successElement, 'ml-2');
      this.renderer.addClass(successElement, 'text-green-500');
      this.renderer.addClass(successElement, 'text-sm');
      this.renderer.appendChild(this.el.nativeElement, successElement);

      // Remove the success message after 1.5 seconds
      this.setTimeoutSafely(() => {
        this.renderer.removeChild(this.el.nativeElement, successElement);
      }, 1500);
    }
  }

  private setTimeoutSafely(fn: () => void, delay: number): void {
    this.clearTimeout(); // Clear any existing timeout
    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.ngZone.run(fn);
      }, delay) as unknown as number;
    });
  }

  private clearTimeout(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

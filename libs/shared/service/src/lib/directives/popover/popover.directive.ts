import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import {
  ComponentPortal,
  ComponentType,
  TemplatePortal,
} from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[libPopover]',
  standalone: true,
})
export class PopoverDirective<T = any> implements OnInit, OnDestroy {
  private overlay = inject(Overlay);
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);

  @Input('libPopover') content!: TemplateRef<any> | ComponentType<T>;
  @Input() popoverContext: T = {} as T;
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() offsetX = 0;
  @Input() offsetY = 0;
  @Input() hasBackdrop = true;

  private overlayRef!: OverlayRef;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.createOverlay();
    this.setupTriggerEvents();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }

  private setupTriggerEvents() {
    fromEvent(this.elementRef.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.togglePopover());
  }

  private createOverlay() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(this.getPositions())
      .withPush(true);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();

    const config: OverlayConfig = {
      positionStrategy,
      scrollStrategy,
      hasBackdrop: this.hasBackdrop,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    };

    this.overlayRef = this.overlay.create(config);

    if (this.hasBackdrop) {
      this.overlayRef
        .backdropClick()
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.hide());
    }
  }

  private togglePopover() {
    this.overlayRef.hasAttached() ? this.hide() : this.show();
  }

  private show() {
    if (this.overlayRef.hasAttached()) return;

    if (this.content instanceof TemplateRef) {
      const portal = new TemplatePortal(
        this.content,
        this.viewContainerRef,
        this.popoverContext
      );
      this.overlayRef.attach(portal);
    } else {
      const portal = new ComponentPortal(this.content, this.viewContainerRef);
      const componentRef = this.overlayRef.attach(portal);
      Object.assign(componentRef.instance as any, this.popoverContext);
    }
  }

  private hide() {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  private getPositions(): ConnectedPosition[] {
    const positions: Record<string, ConnectedPosition> = {
      top: {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -8 + this.offsetY,
        offsetX: this.offsetX,
      },
      bottom: {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 8 + this.offsetY,
        offsetX: this.offsetX,
      },
      left: {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: -8 + this.offsetX,
        offsetY: this.offsetY,
      },
      right: {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: 8 + this.offsetX,
        offsetY: this.offsetY,
      },
    };

    return [
      positions[this.position],
      positions['bottom'],
      positions['right'],
      positions['left'],
      positions['top'],
    ];
  }
}

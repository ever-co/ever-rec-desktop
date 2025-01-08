import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

interface SnackbarQueueItem<T> {
  message: string;
  component?: ComponentType<T>;
  config?: MatSnackBarConfig;
  afterOpened: (snackbarRef?: MatSnackBarRef<T> | null) => void;
  afterDismissed?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarQueueService {
  private queue: SnackbarQueueItem<any>[] = [];
  private isSnackbarOpen = false;

  constructor(private readonly snackBar: MatSnackBar) {}

  /**
   * Adds a snackbar to the queue.
   * @param options Configuration options for the snackbar.
   */
  public enqueue<T>(options: SnackbarQueueItem<T>) {
    const { message, component } = options;

    if (!message && !component) {
      throw new Error(
        'Either a message or a component must be provided for the snackbar.'
      );
    }

    this.queue.push(options);
    this.tryShowNext();
  }

  /**
   * Displays the next snackbar in the queue.
   */
  private tryShowNext() {
    if (this.isSnackbarOpen || this.queue.length === 0) {
      return;
    }

    const { message, component, config, afterOpened, afterDismissed } =
      this.queue.shift()!;
    let currentRef = null;

    this.isSnackbarOpen = true;

    // Open the snackbar and assign the reference
    if (component) {
      currentRef = this.snackBar.openFromComponent(component);
    } else {
      currentRef = this.snackBar.open(message, undefined, {
        duration: 1500,
        ...config,
      });
      this.isSnackbarOpen = false;
    }

    afterOpened(currentRef);

    currentRef.afterDismissed().subscribe(() => {
      this.isSnackbarOpen = false;
      if (afterDismissed) {
        afterDismissed();
      }
      this.tryShowNext();
    });
  }
}

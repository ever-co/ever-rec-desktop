import { IActionButton } from './action-button.interface';

export interface IConfirmationDialog {
  title: string;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default' | 'primary';
  message: string;
  button?: {
    confirm?: IActionButton;
    cancel?: IActionButton;
  };
}

import { Observable } from 'rxjs';

export interface IActionButton {
  icon: string;
  label?: string;
  loadingLabel?: string;
  hide?: Observable<boolean>;
  loading?: Observable<boolean>;
  disable?: Observable<boolean>;
  tooltip?: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  size?: 'large' | 'medium' | 'small';
  type?: 'button' | 'submit' | 'reset';
  action?: (data?: any) => any;
}

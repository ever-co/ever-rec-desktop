import { Observable } from 'rxjs';

export interface IActionButton {
  icon: string;
  label?: string;
  hide?: Observable<boolean>;
  loading?: Observable<boolean>;
  tooltip?: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  size?: 'large' | 'medium' | 'small';
  action?: (data?: any) => any;
}

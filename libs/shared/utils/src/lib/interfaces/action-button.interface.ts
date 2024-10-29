import { Observable } from "rxjs";

export interface IActionButton {
  icon: string;
  label?: string;
  hide?: Observable<boolean>;
  loading?: Observable<boolean>;
  tooltip?: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  action?: (data?: any) => any;
}

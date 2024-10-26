import { Observable } from "rxjs";

export interface IActionButton {
  icon: string;
  label: string;
  loading?: Observable<boolean>;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  action?: (data?: any) => any;
}

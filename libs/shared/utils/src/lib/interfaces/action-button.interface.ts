export interface IActionButton {
  icon: string;
  label: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  action?: (data?: any) => any;
}

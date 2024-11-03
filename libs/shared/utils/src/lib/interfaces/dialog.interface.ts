export interface IConfirmationDialog {
  title: string;
  message: string;
  label?: {
    confirm?: string;
    cancel?: string;
  };
}

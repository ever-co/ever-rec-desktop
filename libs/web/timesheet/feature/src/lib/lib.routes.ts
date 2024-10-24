import { Route } from '@angular/router';

export const timesheetFeatureRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./timesheet/timesheet.component').then(
        (m) => m.TimesheetComponent
      ),
  },
];

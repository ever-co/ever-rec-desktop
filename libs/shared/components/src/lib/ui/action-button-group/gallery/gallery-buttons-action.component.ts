
import { Component, Input } from '@angular/core';
import { IActionButton } from '@ever-co/shared-utils';
import { ActionButtonGroupComponent } from '../group/action-button-group.component';

@Component({
    selector: 'lib-gallery-buttons-action',
    imports: [ActionButtonGroupComponent],
    templateUrl: './gallery-buttons-action.component.html',
    styleUrl: './gallery-buttons-action.component.scss'
})
export class GalleryButtonsActionComponent {
  @Input() buttons: IActionButton[] = [];
  @Input() size: number | null = 0;
  @Input() data: any;
}

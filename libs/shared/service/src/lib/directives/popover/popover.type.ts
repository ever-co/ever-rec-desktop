import { ComponentType } from '@angular/cdk/portal';
import { TemplateRef } from '@angular/core';

export type PopoverContent<T> = ComponentType<T> | TemplateRef<any>;

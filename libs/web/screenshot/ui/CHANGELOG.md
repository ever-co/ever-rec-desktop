# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

# 1.0.0 (2025-05-11)

### Dependency Updates

* `shared-components` updated to version `2.0.0`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.1.0`

### Code Refactoring

* **date-picker:** modularize date picker into dedicated libraries ([f19b188](https://github.com/ever-co/ever-capture/commit/f19b1883bc7392e9a42f7342afca689ab24fd029))
* **screenshot:** make screenshot card presentational and move logic ([44cfc69](https://github.com/ever-co/ever-capture/commit/44cfc69f610b7004634df4d68ee429a8858669a2))


### BREAKING CHANGES

* **screenshot:** `ScreenshotComponent` is no longer available from
`libs/shared/components`. It has been moved to `libs/web/screenshot/ui`
(importable via `@ever-co/screenshot-ui`).
The component's API has changed:
- It no longer contains internal action logic (view, delete, upload).
- It now requires an `actionButtons: IActionButton[]` input to define
its actions.
Consumers must update import paths and provide the `actionButtons` input.
* **date-picker:** Date picker components and state management have been
relocated from `shared-components` and `shared-service`.
`CopyContextButtonComponent` and `ToggleComponent` have been removed
from `shared-components`.
Migration:
- Update imports for `DatePickerComponent` to `@ever-co/date-picker-feature`.
- Update imports for date picker NgRx state to
`@ever-co/date-picker-data-access`.
- Replace usage of `DatePickerService` with NgRx selectors/actions from
`@ever-co/date-picker-data-access`.



# 1.0.0 (2025-05-11)

### Dependency Updates

* `shared-components` updated to version `2.0.0`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.1.0`

### Code Refactoring

* **date-picker:** modularize date picker into dedicated libraries ([f19b188](https://github.com/ever-co/ever-capture/commit/f19b1883bc7392e9a42f7342afca689ab24fd029))
* **screenshot:** make screenshot card presentational and move logic ([44cfc69](https://github.com/ever-co/ever-capture/commit/44cfc69f610b7004634df4d68ee429a8858669a2))


### BREAKING CHANGES

* **screenshot:** `ScreenshotComponent` is no longer available from
`libs/shared/components`. It has been moved to `libs/web/screenshot/ui`
(importable via `@ever-co/screenshot-ui`).
The component's API has changed:
- It no longer contains internal action logic (view, delete, upload).
- It now requires an `actionButtons: IActionButton[]` input to define
its actions.
Consumers must update import paths and provide the `actionButtons` input.
* **date-picker:** Date picker components and state management have been
relocated from `shared-components` and `shared-service`.
`CopyContextButtonComponent` and `ToggleComponent` have been removed
from `shared-components`.
Migration:
- Update imports for `DatePickerComponent` to `@ever-co/date-picker-feature`.
- Update imports for date picker NgRx state to
`@ever-co/date-picker-data-access`.
- Replace usage of `DatePickerService` with NgRx selectors/actions from
`@ever-co/date-picker-data-access`.

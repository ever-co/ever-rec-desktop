# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.1.11](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-ui-1.1.10...screenshot-ui-1.1.11) (2025-06-06)

### Dependency Updates

* `shared-service` updated to version `1.0.7`


## [1.1.10](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-ui-1.1.9...screenshot-ui-1.1.10) (2025-06-06)

### Dependency Updates

* `shared-service` updated to version `1.0.6`


## [1.1.9](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-ui-1.1.8...screenshot-ui-1.1.9) (2025-06-06)

### Dependency Updates

* `shared-service` updated to version `1.0.6`


## [1.1.8](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-ui-1.1.7...screenshot-ui-1.1.8) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.2`
* `shared-components` updated to version `2.0.7`
* `shared-service` updated to version `1.0.5`


## [1.1.7](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-ui-1.1.6...screenshot-ui-1.1.7) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `shared-components` updated to version `2.0.6`


## [1.1.6](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-ui-1.1.5...screenshot-ui-1.1.6) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `shared-components` updated to version `2.0.5`
* `shared-service` updated to version `1.0.4`


## [1.1.5](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-ui-1.1.4...screenshot-ui-1.1.5) (2025-06-04)



## [1.1.4](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-ui-1.1.3...screenshot-ui-1.1.4) (2025-06-03)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `shared-components` updated to version `2.0.4`
* `shared-service` updated to version `1.0.3`


## [1.1.3](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-ui-1.1.2...screenshot-ui-1.1.3) (2025-05-15)

### Dependency Updates

* `shared-service` updated to version `1.0.2`


## [1.1.2](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-ui-1.1.1...screenshot-ui-1.1.2) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.2.0`
* `shared-components` updated to version `2.0.3`


## [1.1.1](https://github.com/ever-co/ever-capture/compare/screenshot-ui-1.1.0...screenshot-ui-1.1.1) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `shared-components` updated to version `2.0.2`
* `shared-service` updated to version `1.0.1`


# [1.1.0](https://github.com/ever-co/ever-capture/compare/screenshot-ui-1.0.1...screenshot-ui-1.1.0) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `shared-components` updated to version `2.0.1`
* `shared-service` updated to version `1.0.0`

### Features

* **screenshot:** add statistical analysis charts ([3f2ec85](https://github.com/ever-co/ever-capture/commit/3f2ec8524ec595e00a6a2229a7b389d2e3a812b3))
* **screenshot:** add statistics by date range ([df5ca95](https://github.com/ever-co/ever-capture/commit/df5ca9558e4e21760a5aea8277add35fd98741c3))
* **ui:** move chart descriptions to tooltips ([cec100d](https://github.com/ever-co/ever-capture/commit/cec100ddbb227fe1da9913a67007516115f59ede))



## [1.0.1](https://github.com/ever-co/ever-capture/compare/screenshot-ui-1.0.0...screenshot-ui-1.0.1) (2025-05-11)

### Dependency Updates

* `shared-service` updated to version `1.0.0`


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

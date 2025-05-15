# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.8](https://github.com/ever-co/ever-rec-desktop/compare/generate-video-feature-1.0.7...generate-video-feature-1.0.8) (2025-05-15)

### Dependency Updates

* `notification-data-access` updated to version `1.0.4`


## [1.0.7](https://github.com/ever-co/ever-rec-desktop/compare/generate-video-feature-1.0.6...generate-video-feature-1.0.7) (2025-05-15)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.8`
* `notification-data-access` updated to version `1.0.3`
* `shared-service` updated to version `1.0.2`
* `utils` updated to version `1.2.0`


## [1.0.6](https://github.com/ever-co/ever-capture/compare/generate-video-feature-1.0.5...generate-video-feature-1.0.6) (2025-05-15)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.6`
* `notification-data-access` updated to version `1.0.3`
* `shared-service` updated to version `1.0.1`
* `utils` updated to version `1.1.0`


## [1.0.5](https://github.com/ever-co/ever-capture/compare/generate-video-feature-1.0.4...generate-video-feature-1.0.5) (2025-05-15)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.5`
* `shared-service` updated to version `1.0.0`
* `utils` updated to version `1.1.0`


## [1.0.4](https://github.com/ever-co/ever-capture/compare/generate-video-feature-1.0.3...generate-video-feature-1.0.4) (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.4`
* `notification-data-access` updated to version `1.0.2`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/generate-video-feature-1.0.2...generate-video-feature-1.0.3) (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.3`
* `notification-data-access` updated to version `1.0.1`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/generate-video-feature-1.0.1...generate-video-feature-1.0.2) (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.2`
* `shared-service` updated to version `1.0.0`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/generate-video-feature-1.0.0...generate-video-feature-1.0.1) (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.1`
* `notification-data-access` updated to version `1.0.1`
* `shared-service` updated to version `0.3.1`


# 1.0.0 (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.0`
* `notification-data-access` updated to version `1.0.0`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.1.0`

### Code Refactoring

* **date-picker:** modularize date picker into dedicated libraries ([f19b188](https://github.com/ever-co/ever-capture/commit/f19b1883bc7392e9a42f7342afca689ab24fd029))


### BREAKING CHANGES

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

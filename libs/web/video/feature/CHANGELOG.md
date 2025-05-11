# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.4](https://github.com/ever-co/ever-capture/compare/video-feature-1.0.3...video-feature-1.0.4) (2025-05-11)

### Dependency Updates

* `video-data-access` updated to version `1.0.4`
* `upload-data-access` updated to version `2.0.2`
* `web-setting-data-access` updated to version `1.0.3`
* `feature` updated to version `1.0.3`
* `generate-video-data-access` updated to version `1.0.3`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/video-feature-1.0.2...video-feature-1.0.3) (2025-05-11)

### Dependency Updates

* `video-data-access` updated to version `1.0.3`
* `shared-service` updated to version `1.0.0`
* `web-setting-data-access` updated to version `1.0.2`
* `feature` updated to version `1.0.2`
* `video-ui` updated to version `1.0.3`
* `generate-video-data-access` updated to version `1.0.2`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/video-feature-1.0.1...video-feature-1.0.2) (2025-05-11)

### Dependency Updates

* `video-data-access` updated to version `1.0.2`
* `shared-service` updated to version `0.3.1`
* `upload-data-access` updated to version `2.0.1`
* `web-setting-data-access` updated to version `1.0.1`
* `feature` updated to version `1.0.1`
* `video-ui` updated to version `1.0.2`
* `generate-video-data-access` updated to version `1.0.1`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/video-feature-1.0.0...video-feature-1.0.1) (2025-05-11)

### Dependency Updates

* `video-data-access` updated to version `1.0.1`
* `shared-components` updated to version `2.0.0`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.1.0`
* `upload-data-access` updated to version `2.0.0`
* `web-setting-data-access` updated to version `1.0.0`
* `feature` updated to version `1.0.0`
* `video-ui` updated to version `1.0.1`
* `generate-video-data-access` updated to version `1.0.0`
* `date-picker-data-access` updated to version `1.0.0`


# 1.0.0 (2025-05-11)

### Dependency Updates

* `video-data-access` updated to version `1.0.0`
* `shared-components` updated to version `1.1.0`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.0.0`
* `upload-data-access` updated to version `1.0.0`
* `web-setting-data-access` updated to version `0.3.0`
* `feature` updated to version `0.2.0`
* `video-ui` updated to version `1.0.0`
* `generate-video-data-access` updated to version `1.0.0`
* `date-picker-data-access` updated to version `1.0.0`

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

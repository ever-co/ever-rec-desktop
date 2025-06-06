# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.11](https://github.com/ever-co/ever-rec-desktop/compare/video-ui-1.0.10...video-ui-1.0.11) (2025-06-06)

### Dependency Updates

* `shared-service` updated to version `1.0.6`


## [1.0.10](https://github.com/ever-co/ever-rec-desktop/compare/video-ui-1.0.9...video-ui-1.0.10) (2025-06-06)

### Dependency Updates

* `shared-components` updated to version `2.0.7`
* `shared-service` updated to version `1.0.5`
* `utils` updated to version `1.3.2`


## [1.0.9](https://github.com/ever-co/ever-rec-desktop/compare/video-ui-1.0.8...video-ui-1.0.9) (2025-06-06)

### Dependency Updates

* `shared-components` updated to version `2.0.6`
* `utils` updated to version `1.3.1`


## [1.0.8](https://github.com/ever-co/ever-rec-desktop/compare/video-ui-1.0.7...video-ui-1.0.8) (2025-06-06)

### Dependency Updates

* `shared-components` updated to version `2.0.5`
* `shared-service` updated to version `1.0.4`
* `utils` updated to version `1.3.1`


## [1.0.7](https://github.com/ever-co/ever-rec-desktop/compare/video-ui-1.0.6...video-ui-1.0.7) (2025-06-03)

### Dependency Updates

* `shared-components` updated to version `2.0.4`
* `shared-service` updated to version `1.0.3`
* `utils` updated to version `1.3.1`


## [1.0.6](https://github.com/ever-co/ever-rec-desktop/compare/video-ui-1.0.5...video-ui-1.0.6) (2025-05-15)

### Dependency Updates

* `shared-components` updated to version `2.0.3`
* `shared-service` updated to version `1.0.2`
* `utils` updated to version `1.2.0`


## [1.0.5](https://github.com/ever-co/ever-capture/compare/video-ui-1.0.4...video-ui-1.0.5) (2025-05-15)

### Dependency Updates

* `shared-components` updated to version `2.0.2`
* `shared-service` updated to version `1.0.1`
* `utils` updated to version `1.1.0`


## [1.0.4](https://github.com/ever-co/ever-capture/compare/video-ui-1.0.3...video-ui-1.0.4) (2025-05-15)

### Dependency Updates

* `shared-components` updated to version `2.0.1`
* `shared-service` updated to version `1.0.0`
* `utils` updated to version `1.1.0`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/video-ui-1.0.2...video-ui-1.0.3) (2025-05-11)

### Dependency Updates

* `shared-service` updated to version `1.0.0`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/video-ui-1.0.1...video-ui-1.0.2) (2025-05-11)

### Dependency Updates

* `shared-service` updated to version `0.3.1`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/video-ui-1.0.0...video-ui-1.0.1) (2025-05-11)

### Dependency Updates

* `shared-components` updated to version `2.0.0`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.1.0`


# 1.0.0 (2025-05-11)

### Dependency Updates

* `shared-components` updated to version `1.1.0`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.0.0`

### Code Refactoring

* **date-picker:** modularize date picker into dedicated libraries ([f19b188](https://github.com/ever-co/ever-capture/commit/f19b1883bc7392e9a42f7342afca689ab24fd029))


* build(libs)!: upgrade Angular to v19 and simplify peer dependencies ([8a519ca](https://github.com/ever-co/ever-capture/commit/8a519ca4c491dfce28d1be34e7680dde4fce1023))


### BREAKING CHANGES

* Peer dependency declarations for numerous libraries
have been significantly reduced.
Most affected libraries now list only `@angular/common` and
`@angular/core` as `peerDependencies`. Previously declared peers
(e.g., `@ngrx/store`, `rxjs`, various `@ever-co/*` packages,
`@angular/material`) have been removed from these libraries'
`peerDependencies`.
Consuming applications must ensure these dependencies are directly
managed if still required. This change aims for greater flexibility
and reduced dependency conflicts but may require project adjustments.
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

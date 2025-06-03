# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.13](https://github.com/ever-co/ever-rec-desktop/compare/video-data-access-1.0.12...video-data-access-1.0.13) (2025-06-03)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `generate-video-data-access` updated to version `1.0.10`
* `notification-data-access` updated to version `1.0.4`
* `data-access-electron` updated to version `1.0.4`


## [1.0.12](https://github.com/ever-co/ever-rec-desktop/compare/video-data-access-1.0.11...video-data-access-1.0.12) (2025-05-15)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.9`


## [1.0.11](https://github.com/ever-co/ever-rec-desktop/compare/video-data-access-1.0.10...video-data-access-1.0.11) (2025-05-15)

### Dependency Updates

* `notification-data-access` updated to version `1.0.4`


## [1.0.10](https://github.com/ever-co/ever-rec-desktop/compare/video-data-access-1.0.9...video-data-access-1.0.10) (2025-05-15)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.8`
* `notification-data-access` updated to version `1.0.3`
* `data-access-electron` updated to version `1.0.3`


## [1.0.9](https://github.com/ever-co/ever-rec-desktop/compare/video-data-access-1.0.8...video-data-access-1.0.9) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.2.0`
* `generate-video-data-access` updated to version `1.0.7`
* `notification-data-access` updated to version `1.0.3`
* `data-access-electron` updated to version `1.0.2`


## [1.0.8](https://github.com/ever-co/ever-capture/compare/video-data-access-1.0.7...video-data-access-1.0.8) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `generate-video-data-access` updated to version `1.0.6`
* `notification-data-access` updated to version `1.0.3`


## [1.0.7](https://github.com/ever-co/ever-capture/compare/video-data-access-1.0.6...video-data-access-1.0.7) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `generate-video-data-access` updated to version `1.0.5`
* `data-access-electron` updated to version `1.0.1`


## [1.0.6](https://github.com/ever-co/ever-capture/compare/video-data-access-1.0.5...video-data-access-1.0.6) (2025-05-11)



## [1.0.5](https://github.com/ever-co/ever-capture/compare/video-data-access-1.0.4...video-data-access-1.0.5) (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.4`
* `notification-data-access` updated to version `1.0.2`


## [1.0.4](https://github.com/ever-co/ever-capture/compare/video-data-access-1.0.3...video-data-access-1.0.4) (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.3`
* `notification-data-access` updated to version `1.0.1`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/video-data-access-1.0.2...video-data-access-1.0.3) (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.2`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/video-data-access-1.0.1...video-data-access-1.0.2) (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.1`
* `notification-data-access` updated to version `1.0.1`
* `data-access-electron` updated to version `1.0.0`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/video-data-access-1.0.0...video-data-access-1.0.1) (2025-05-11)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `generate-video-data-access` updated to version `1.0.0`
* `notification-data-access` updated to version `1.0.0`
* `data-access-electron` updated to version `0.2.2`


# 1.0.0 (2025-05-11)

### Dependency Updates

* `utils` updated to version `1.0.0`
* `generate-video-data-access` updated to version `1.0.0`
* `notification-data-access` updated to version `0.1.6`
* `data-access-electron` updated to version `0.2.2`

### Code Refactoring

* **date-picker:** modularize date picker into dedicated libraries ([f19b188](https://github.com/ever-co/ever-capture/commit/f19b1883bc7392e9a42f7342afca689ab24fd029))


* build(libs)!: upgrade Angular to v19 and simplify peer dependencies ([8a519ca](https://github.com/ever-co/ever-capture/commit/8a519ca4c491dfce28d1be34e7680dde4fce1023))


### Features

* **media-sync:** update media item status on upload completion ([c86716f](https://github.com/ever-co/ever-capture/commit/c86716f2d191666024df7a629067cf596a170dfa))
* **video:** add newly generated video to the state ([90f6a30](https://github.com/ever-co/ever-capture/commit/90f6a300e1212961380e8b5b59a175b13aa4c892))


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

# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.1.3](https://github.com/ever-co/ever-rec-desktop/compare/photo-feature-1.1.2...photo-feature-1.1.3) (2025-05-15)

### Dependency Updates

* `photo-data-acess` updated to version `0.1.10`
* `upload-data-access` updated to version `2.0.9`
* `web-setting-data-access` updated to version `1.0.10`


## [1.1.2](https://github.com/ever-co/ever-rec-desktop/compare/photo-feature-1.1.1...photo-feature-1.1.2) (2025-05-15)

### Dependency Updates

* `photo-data-acess` updated to version `0.1.9`
* `shared-components` updated to version `2.0.3`
* `shared-service` updated to version `1.0.2`
* `utils` updated to version `1.2.0`
* `upload-data-access` updated to version `2.0.8`
* `web-setting-data-access` updated to version `1.0.9`
* `photo-ui` updated to version `0.2.6`
* `date-picker-data-access` updated to version `1.0.4`


## [1.1.1](https://github.com/ever-co/ever-capture/compare/photo-feature-1.1.0...photo-feature-1.1.1) (2025-05-15)

### Dependency Updates

* `photo-data-acess` updated to version `0.1.7`
* `shared-components` updated to version `2.0.2`
* `shared-service` updated to version `1.0.1`
* `utils` updated to version `1.1.0`
* `upload-data-access` updated to version `2.0.6`
* `web-setting-data-access` updated to version `1.0.7`
* `photo-ui` updated to version `0.2.5`
* `date-picker-data-access` updated to version `1.0.3`


# [1.1.0](https://github.com/ever-co/ever-capture/compare/photo-feature-1.0.5...photo-feature-1.1.0) (2025-05-15)

### Dependency Updates

* `photo-data-acess` updated to version `0.1.6`
* `shared-components` updated to version `2.0.1`
* `shared-service` updated to version `1.0.0`
* `utils` updated to version `1.1.0`
* `upload-data-access` updated to version `2.0.5`
* `web-setting-data-access` updated to version `1.0.6`
* `photo-ui` updated to version `0.2.4`
* `date-picker-data-access` updated to version `1.0.2`

### Features

* add audio and photo widgets to dashboard ([2821814](https://github.com/ever-co/ever-capture/commit/28218149d4ae3070bd37e4d353c29d8775e07434))



## [1.0.5](https://github.com/ever-co/ever-capture/compare/photo-feature-1.0.4...photo-feature-1.0.5) (2025-05-11)

### Dependency Updates

* `upload-data-access` updated to version `2.0.4`
* `web-setting-data-access` updated to version `1.0.5`
* `date-picker-data-access` updated to version `1.0.1`


## [1.0.4](https://github.com/ever-co/ever-capture/compare/photo-feature-1.0.3...photo-feature-1.0.4) (2025-05-11)

### Dependency Updates

* `photo-data-acess` updated to version `0.1.4`
* `upload-data-access` updated to version `2.0.3`
* `web-setting-data-access` updated to version `1.0.4`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/photo-feature-1.0.2...photo-feature-1.0.3) (2025-05-11)

### Dependency Updates

* `photo-data-acess` updated to version `0.1.3`
* `upload-data-access` updated to version `2.0.2`
* `web-setting-data-access` updated to version `1.0.3`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/photo-feature-1.0.1...photo-feature-1.0.2) (2025-05-11)

### Dependency Updates

* `photo-data-acess` updated to version `0.1.2`
* `shared-service` updated to version `1.0.0`
* `web-setting-data-access` updated to version `1.0.2`
* `photo-ui` updated to version `0.2.3`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/photo-feature-1.0.0...photo-feature-1.0.1) (2025-05-11)

### Dependency Updates

* `photo-data-acess` updated to version `0.1.1`
* `shared-service` updated to version `0.3.1`
* `upload-data-access` updated to version `2.0.1`
* `web-setting-data-access` updated to version `1.0.1`
* `photo-ui` updated to version `0.2.2`


# [1.0.0](https://github.com/ever-co/ever-capture/compare/photo-feature-0.2.0...photo-feature-1.0.0) (2025-05-11)

### Dependency Updates

* `photo-data-acess` updated to version `0.1.0`
* `shared-components` updated to version `2.0.0`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.1.0`
* `upload-data-access` updated to version `2.0.0`
* `web-setting-data-access` updated to version `1.0.0`
* `photo-ui` updated to version `0.2.1`
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



# [0.2.0](https://github.com/ever-co/ever-capture/compare/photo-feature-0.1.1...photo-feature-0.2.0) (2025-05-09)

### Dependency Updates

* `photo-data-acess` updated to version `0.0.4`
* `shared-components` updated to version `1.1.0`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.0.0`
* `upload-data-access` updated to version `1.0.0`
* `web-setting-data-access` updated to version `0.3.0`
* `photo-ui` updated to version `0.2.0`

### Features

* **photo-detail:** display photo sync status ([7f40c27](https://github.com/ever-co/ever-capture/commit/7f40c273e710fdb1832b6eb3650c999ad05651e1))



# 0.1.0 (2025-05-09)


### Features

* **photo-detail:** display photo sync status ([7f40c27](https://github.com/ever-co/ever-capture/commit/7f40c273e710fdb1832b6eb3650c999ad05651e1))
* **photo-gallery:** allow viewing photo by clicking card ([b3b1997](https://github.com/ever-co/ever-capture/commit/b3b199709c22514d56e36dd83289d2b1c4391a01))
* **photo:** add manual photo upload option ([293f319](https://github.com/ever-co/ever-capture/commit/293f319dc30b61ebcfa6c340a533b26a0b940374))



## [0.1.1](https://github.com/ever-co/ever-capture/compare/photo-feature-0.1.0...photo-feature-0.1.1) (2025-05-09)



# [0.1.0](https://github.com/ever-co/ever-capture/compare/photo-feature-0.0.1...photo-feature-0.1.0) (2025-05-09)

### Dependency Updates

* `photo-data-acess` updated to version `0.0.4`
* `shared-components` updated to version `1.0.0`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.0.0`
* `upload-data-access` updated to version `1.0.0`
* `web-setting-data-access` updated to version `0.3.0`
* `photo-ui` updated to version `0.1.0`

### Features

* **photo-gallery:** allow viewing photo by clicking card ([b3b1997](https://github.com/ever-co/ever-capture/commit/b3b199709c22514d56e36dd83289d2b1c4391a01))
* **photo:** add manual photo upload option ([293f319](https://github.com/ever-co/ever-capture/commit/293f319dc30b61ebcfa6c340a533b26a0b940374))



## 0.0.1 (2025-05-02)

### Dependency Updates

* `photo-data-acess` updated to version `0.0.1`
* `shared-components` updated to version `0.2.1`
* `shared-service` updated to version `0.2.0`
* `utils` updated to version `0.2.0`
* `photo-ui` updated to version `0.0.1`

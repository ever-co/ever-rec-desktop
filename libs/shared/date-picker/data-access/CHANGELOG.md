# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.8](https://github.com/ever-co/ever-rec-desktop/compare/date-picker-data-access-1.0.7...date-picker-data-access-1.0.8) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.2`


## [1.0.7](https://github.com/ever-co/ever-rec-desktop/compare/date-picker-data-access-1.0.6...date-picker-data-access-1.0.7) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.1`


## [1.0.6](https://github.com/ever-co/ever-rec-desktop/compare/date-picker-data-access-1.0.5...date-picker-data-access-1.0.6) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.1`


## [1.0.5](https://github.com/ever-co/ever-rec-desktop/compare/date-picker-data-access-1.0.4...date-picker-data-access-1.0.5) (2025-06-03)

### Dependency Updates

* `utils` updated to version `1.3.1`


## [1.0.4](https://github.com/ever-co/ever-rec-desktop/compare/date-picker-data-access-1.0.3...date-picker-data-access-1.0.4) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.2.0`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/date-picker-data-access-1.0.2...date-picker-data-access-1.0.3) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/date-picker-data-access-1.0.1...date-picker-data-access-1.0.2) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/date-picker-data-access-1.0.0...date-picker-data-access-1.0.1) (2025-05-11)


### Bug Fixes

* **date-picker-data-access:** correct typo in npm publish path ([4b63609](https://github.com/ever-co/ever-capture/commit/4b6360980058ea84b767d499e7b36324422abb00))



# 1.0.0 (2025-05-11)

### Dependency Updates

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

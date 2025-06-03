# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.1.1](https://github.com/ever-co/ever-rec-desktop/compare/activity-data-access-1.1.0...activity-data-access-1.1.1) (2025-06-03)

### Dependency Updates

* `timesheet-data-access` updated to version `1.1.4`


# [1.1.0](https://github.com/ever-co/ever-rec-desktop/compare/activity-data-access-1.0.10...activity-data-access-1.1.0) (2025-06-03)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `timesheet-data-access` updated to version `1.1.3`
* `date-picker-data-access` updated to version `1.0.5`
* `data-access-electron` updated to version `1.0.4`

### Features

* **activity:** add top applications productivity display ([add9743](https://github.com/ever-co/ever-rec-desktop/commit/add974388c46aebe59573741022b23b648d9c9c6))



## [1.0.10](https://github.com/ever-co/ever-rec-desktop/compare/activity-data-access-1.0.9...activity-data-access-1.0.10) (2025-05-15)

### Dependency Updates

* `timesheet-data-access` updated to version `1.1.2`


## [1.0.9](https://github.com/ever-co/ever-rec-desktop/compare/activity-data-access-1.0.8...activity-data-access-1.0.9) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.2.0`
* `date-picker-data-access` updated to version `1.0.4`
* `data-access-electron` updated to version `1.0.3`


## [1.0.8](https://github.com/ever-co/ever-capture/compare/activity-data-access-1.0.7...activity-data-access-1.0.8) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `timesheet-data-access` updated to version `1.1.1`
* `date-picker-data-access` updated to version `1.0.3`


## [1.0.7](https://github.com/ever-co/ever-capture/compare/activity-data-access-1.0.6...activity-data-access-1.0.7) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `timesheet-data-access` updated to version `1.1.0`
* `date-picker-data-access` updated to version `1.0.2`
* `data-access-electron` updated to version `1.0.1`


## [1.0.6](https://github.com/ever-co/ever-capture/compare/activity-data-access-1.0.5...activity-data-access-1.0.6) (2025-05-11)



## [1.0.5](https://github.com/ever-co/ever-capture/compare/activity-data-access-1.0.4...activity-data-access-1.0.5) (2025-05-11)

### Dependency Updates

* `timesheet-data-access` updated to version `1.0.5`
* `date-picker-data-access` updated to version `1.0.1`


## [1.0.4](https://github.com/ever-co/ever-capture/compare/activity-data-access-1.0.3...activity-data-access-1.0.4) (2025-05-11)

### Dependency Updates

* `timesheet-data-access` updated to version `1.0.4`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/activity-data-access-1.0.2...activity-data-access-1.0.3) (2025-05-11)

### Dependency Updates

* `timesheet-data-access` updated to version `1.0.3`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/activity-data-access-1.0.1...activity-data-access-1.0.2) (2025-05-11)

### Dependency Updates

* `timesheet-data-access` updated to version `1.0.2`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/activity-data-access-1.0.0...activity-data-access-1.0.1) (2025-05-11)

### Dependency Updates

* `timesheet-data-access` updated to version `1.0.1`
* `data-access-electron` updated to version `1.0.0`


# [1.0.0](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.7...activity-data-access-1.0.0) (2025-05-11)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `timesheet-data-access` updated to version `1.0.0`
* `date-picker-data-access` updated to version `1.0.0`
* `data-access-electron` updated to version `0.2.2`

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



# 0.1.0 (2025-05-09)


### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.0.7](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.6...activity-data-access-0.0.7) (2025-05-09)

### Dependency Updates

* `utils` updated to version `1.0.0`
* `shared-service` updated to version `0.3.1`
* `timesheet-data-access` updated to version `0.1.2`
* `data-access-electron` updated to version `0.2.2`


## [0.0.6](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.5...activity-data-access-0.0.6) (2025-05-02)

### Dependency Updates

* `shared-service` updated to version `0.2.0`
* `timesheet-data-access` updated to version `0.1.1`
* `data-access-electron` updated to version `0.2.1`


## [0.0.5](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.4...activity-data-access-0.0.5) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `shared-service` updated to version `0.1.2`
* `timesheet-data-access` updated to version `0.1.0`
* `data-access-electron` updated to version `0.2.0`


## [0.0.4](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.3...activity-data-access-0.0.4) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `shared-service` updated to version `0.1.2`
* `timesheet-data-access` updated to version `0.0.4`
* `data-access-electron` updated to version `0.1.2`


## [0.0.4](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.3...activity-data-access-0.0.4) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `shared-service` updated to version `0.1.2`
* `timesheet-data-access` updated to version `0.0.4`
* `data-access-electron` updated to version `0.1.2`


## [0.0.3](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.2...activity-data-access-0.0.3) (2025-02-12)

### Dependency Updates

* `timesheet-data-access` updated to version `0.0.3`


## [0.0.2](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.1...activity-data-access-0.0.2) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.1`
* `shared-service` updated to version `0.1.1`
* `timesheet-data-access` updated to version `0.0.2`
* `data-access-electron` updated to version `0.1.1`


## 0.0.1 (2025-01-10)

### Dependency Updates

* `utils` updated to version `0.1.0`
* `shared-service` updated to version `0.1.0`
* `timesheet-data-access` updated to version `0.0.1`
* `data-access-electron` updated to version `0.1.0`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.0.24](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.23...activity-data-access-0.0.24) (2025-01-09)

### Dependency Updates

* `timesheet-data-access` updated to version `0.0.26`


## [0.0.23](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.22...activity-data-access-0.0.23) (2025-01-09)

### Dependency Updates

* `timesheet-data-access` updated to version `0.0.25`


## [0.0.22](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.21...activity-data-access-0.0.22) (2025-01-09)

### Dependency Updates

* `shared-service` updated to version `0.1.18`
* `timesheet-data-access` updated to version `0.0.24`
* `data-access-electron` updated to version `0.1.13`


## [0.0.21](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.20...activity-data-access-0.0.21) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.2`
* `shared-service` updated to version `0.1.17`
* `timesheet-data-access` updated to version `0.0.23`


## [0.0.20](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.19...activity-data-access-0.0.20) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.1`
* `shared-service` updated to version `0.1.16`
* `timesheet-data-access` updated to version `0.0.22`
* `data-access-electron` updated to version `0.1.12`


## [0.0.19](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.18...activity-data-access-0.0.19) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.1`
* `shared-service` updated to version `0.1.15`
* `timesheet-data-access` updated to version `0.0.21`
* `data-access-electron` updated to version `0.1.11`


## [0.0.18](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.17...activity-data-access-0.0.18) (2025-01-08)

### Dependency Updates

* `shared-service` updated to version `0.1.14`
* `timesheet-data-access` updated to version `0.0.20`
* `data-access-electron` updated to version `0.1.10`


## [0.0.17](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.16...activity-data-access-0.0.17) (2025-01-08)

### Dependency Updates

* `utils` updated to version `0.4.0`
* `shared-service` updated to version `0.1.13`
* `timesheet-data-access` updated to version `0.0.19`
* `data-access-electron` updated to version `0.1.9`


## [0.0.16](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.15...activity-data-access-0.0.16) (2025-01-08)

### Dependency Updates

* `timesheet-data-access` updated to version `0.0.18`


## [0.0.15](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.14...activity-data-access-0.0.15) (2025-01-07)

### Dependency Updates

* `utils` updated to version `0.3.2`
* `shared-service` updated to version `0.1.12`
* `timesheet-data-access` updated to version `0.0.17`
* `data-access-electron` updated to version `0.1.9`


## [0.0.14](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.13...activity-data-access-0.0.14) (2025-01-06)

### Dependency Updates

* `shared-service` updated to version `0.1.11`
* `timesheet-data-access` updated to version `0.0.16`


## [0.0.13](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.12...activity-data-access-0.0.13) (2025-01-06)

### Dependency Updates

* `shared-service` updated to version `0.1.10`
* `timesheet-data-access` updated to version `0.0.14`


## [0.0.12](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.11...activity-data-access-0.0.12) (2025-01-06)

### Dependency Updates

* `timesheet-data-access` updated to version `0.0.13`
* `data-access-electron` updated to version `0.1.8`


## [0.0.11](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.10...activity-data-access-0.0.11) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.1`
* `shared-service` updated to version `0.1.10`
* `timesheet-data-access` updated to version `0.0.12`


## [0.0.10](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.9...activity-data-access-0.0.10) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.0`
* `shared-service` updated to version `0.1.9`
* `timesheet-data-access` updated to version `0.0.11`
* `data-access-electron` updated to version `0.1.7`


## [0.0.9](https://github.com/ever-co/ever-capture/compare/activity-data-access-0.0.8...activity-data-access-0.0.9) (2024-12-26)

### Dependency Updates

* `utils` updated to version `0.3.0`
* `shared-service` updated to version `0.1.8`
* `timesheet-data-access` updated to version `0.0.10`
* `data-access-electron` updated to version `0.1.6`


## [0.0.8](https://github.com/ever-co/ever-rec-desktop/compare/activity-data-access-0.0.7...activity-data-access-0.0.8) (2024-11-24)

### Dependency Updates

* `shared-service` updated to version `0.1.7`
* `timesheet-data-access` updated to version `0.0.9`
* `data-access-electron` updated to version `0.1.5`


## [0.0.7](https://github.com/ever-co/ever-rec-desktop/compare/activity-data-access-0.0.6...activity-data-access-0.0.7) (2024-11-24)

### Dependency Updates

* `utils` updated to version `0.2.1`
* `shared-service` updated to version `0.1.6`
* `timesheet-data-access` updated to version `0.0.8`
* `data-access-electron` updated to version `0.1.4`


## [0.0.6](https://github.com/ever-co/ever-rec-desktop/compare/activity-data-access-0.0.5...activity-data-access-0.0.6) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `shared-service` updated to version `0.1.4`
* `timesheet-data-access` updated to version `0.0.6`
* `data-access-electron` updated to version `0.1.3`


## [0.0.5](https://github.com/ever-co/ever-rec-desktop/compare/activity-data-access-0.0.4...activity-data-access-0.0.5) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `shared-service` updated to version `0.1.3`
* `timesheet-data-access` updated to version `0.0.5`
* `data-access-electron` updated to version `0.1.2`


## [0.0.4](https://github.com/ever-co/ever-rec-desktop/compare/activity-data-access-0.0.3...activity-data-access-0.0.4) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.1.1`
* `shared-service` updated to version `0.1.2`
* `timesheet-data-access` updated to version `0.0.4`
* `data-access-electron` updated to version `0.1.1`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.0.3](https://github.com/ever-co/ever-rec-desktop/compare/activity-data-access-0.0.2...activity-data-access-0.0.3) (2024-11-22)

### Dependency Updates

* `timesheet-data-access` updated to version `0.0.3`


## [0.0.2](https://github.com/ever-co/ever-rec-desktop/compare/activity-data-access-0.0.1...activity-data-access-0.0.2) (2024-11-21)

### Dependency Updates

* `shared-service` updated to version `0.1.1`
* `timesheet-data-access` updated to version `0.0.2`


## 0.0.1 (2024-11-20)

### Dependency Updates

* `utils` updated to version `0.1.0`
* `shared-service` updated to version `0.1.0`
* `timesheet-data-access` updated to version `0.0.1`
* `data-access-electron` updated to version `0.1.0`

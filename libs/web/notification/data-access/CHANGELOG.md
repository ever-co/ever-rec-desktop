# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.8](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-1.0.7...notification-data-access-1.0.8) (2025-06-06)

### Dependency Updates

* `shared-service` updated to version `1.0.6`


## [1.0.7](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-1.0.6...notification-data-access-1.0.7) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.2`
* `shared-service` updated to version `1.0.5`


## [1.0.6](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-1.0.5...notification-data-access-1.0.6) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `shared-service` updated to version `1.0.4`
* `data-access-electron` updated to version `1.0.5`

### Bug Fixes

* correct spelling of 'Clonable' to 'Cloneable' in multiple files ([013ebfe](https://github.com/ever-co/ever-rec-desktop/commit/013ebfeb3088419d1fe82030ab44580e8f880605))



## [1.0.6](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-1.0.5...notification-data-access-1.0.6) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `shared-service` updated to version `1.0.4`
* `data-access-electron` updated to version `1.0.4`

### Bug Fixes

* correct spelling of 'Clonable' to 'Cloneable' in multiple files ([013ebfe](https://github.com/ever-co/ever-rec-desktop/commit/013ebfeb3088419d1fe82030ab44580e8f880605))



## [1.0.5](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-1.0.4...notification-data-access-1.0.5) (2025-06-03)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `shared-service` updated to version `1.0.3`
* `data-access-electron` updated to version `1.0.4`


## [1.0.5](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-1.0.4...notification-data-access-1.0.5) (2025-06-03)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `shared-service` updated to version `1.0.3`
* `data-access-electron` updated to version `1.0.4`


## [1.0.4](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-1.0.3...notification-data-access-1.0.4) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.2.0`
* `shared-service` updated to version `1.0.2`
* `data-access-electron` updated to version `1.0.3`


## [1.0.4](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-1.0.3...notification-data-access-1.0.4) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.2.0`
* `shared-service` updated to version `1.0.2`
* `data-access-electron` updated to version `1.0.3`


## [1.0.4](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-1.0.3...notification-data-access-1.0.4) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.2.0`
* `data-access-electron` updated to version `1.0.2`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/notification-data-access-1.0.2...notification-data-access-1.0.3) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `shared-service` updated to version `1.0.1`
* `data-access-electron` updated to version `1.0.1`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/notification-data-access-1.0.2...notification-data-access-1.0.3) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `shared-service` updated to version `1.0.0`
* `data-access-electron` updated to version `1.0.1`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/notification-data-access-1.0.1...notification-data-access-1.0.2) (2025-05-11)

### Dependency Updates

* `shared-service` updated to version `1.0.0`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/notification-data-access-1.0.1...notification-data-access-1.0.2) (2025-05-11)

### Dependency Updates

* `shared-service` updated to version `1.0.0`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/notification-data-access-1.0.1...notification-data-access-1.0.2) (2025-05-11)

### Dependency Updates

* `shared-service` updated to version `1.0.0`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/notification-data-access-1.0.0...notification-data-access-1.0.1) (2025-05-11)

### Dependency Updates

* `shared-service` updated to version `0.3.1`
* `data-access-electron` updated to version `1.0.0`


# [1.0.0](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.6...notification-data-access-1.0.0) (2025-05-11)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `shared-service` updated to version `0.3.1`
* `data-access-electron` updated to version `0.2.2`

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



# 0.1.0 (2025-05-09)


### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))


### Features

* improves upload progress notification ([1299007](https://github.com/ever-co/ever-capture/commit/129900771fc07f6a91f1174c373bfd311d69c11d))



## [0.1.6](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.5...notification-data-access-0.1.6) (2025-05-09)

### Dependency Updates

* `utils` updated to version `1.0.0`
* `shared-service` updated to version `0.3.1`
* `data-access-electron` updated to version `0.2.2`


## [0.1.5](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.4...notification-data-access-0.1.5) (2025-05-02)

### Dependency Updates

* `shared-service` updated to version `0.2.0`
* `data-access-electron` updated to version `0.2.1`


## [0.1.4](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.3...notification-data-access-0.1.4) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `shared-service` updated to version `0.1.2`
* `data-access-electron` updated to version `0.2.0`


## [0.1.3](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.2...notification-data-access-0.1.3) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `shared-service` updated to version `0.1.2`
* `data-access-electron` updated to version `0.1.2`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.1...notification-data-access-0.1.2) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `shared-service` updated to version `0.1.1`
* `data-access-electron` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.0...notification-data-access-0.1.1) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.1`
* `shared-service` updated to version `0.1.1`
* `data-access-electron` updated to version `0.1.1`


# 0.1.0 (2025-01-10)

### Dependency Updates

* `utils` updated to version `0.1.0`
* `shared-service` updated to version `0.1.0`
* `data-access-electron` updated to version `0.1.0`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))


### Features

* improves upload progress notification ([1299007](https://github.com/ever-co/ever-capture/commit/129900771fc07f6a91f1174c373bfd311d69c11d))



## [0.1.6](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.5...notification-data-access-0.1.6) (2025-01-09)

### Dependency Updates

* `shared-service` updated to version `0.1.18`
* `data-access-electron` updated to version `0.1.13`


## [0.1.6](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.5...notification-data-access-0.1.6) (2025-01-09)

### Dependency Updates

* `data-access-electron` updated to version `0.1.13`


## [0.1.5](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.4...notification-data-access-0.1.5) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.2`


## [0.1.4](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.3...notification-data-access-0.1.4) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.1`
* `data-access-electron` updated to version `0.1.12`


## [0.1.3](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.2...notification-data-access-0.1.3) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.1`
* `shared-service` updated to version `0.1.15`
* `data-access-electron` updated to version `0.1.11`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.1...notification-data-access-0.1.2) (2025-01-08)

### Dependency Updates

* `data-access-electron` updated to version `0.1.10`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.1.0...notification-data-access-0.1.1) (2025-01-08)

### Dependency Updates

* `utils` updated to version `0.4.0`
* `data-access-electron` updated to version `0.1.9`


# [0.1.0](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.0.15...notification-data-access-0.1.0) (2025-01-08)


### Features

* improves upload progress notification ([1299007](https://github.com/ever-co/ever-capture/commit/129900771fc07f6a91f1174c373bfd311d69c11d))



## [0.0.15](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.0.14...notification-data-access-0.0.15) (2025-01-07)

### Dependency Updates

* `utils` updated to version `0.3.2`
* `shared-service` updated to version `0.1.12`
* `data-access-electron` updated to version `0.1.9`


## [0.0.14](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.0.13...notification-data-access-0.0.14) (2025-01-06)

### Dependency Updates

* `shared-service` updated to version `0.1.11`


## [0.0.13](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.0.12...notification-data-access-0.0.13) (2025-01-06)

### Dependency Updates

* `data-access-electron` updated to version `0.1.8`


## [0.0.13](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.0.12...notification-data-access-0.0.13) (2025-01-06)

### Dependency Updates

* `data-access-electron` updated to version `0.1.8`


## [0.0.12](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.0.11...notification-data-access-0.0.12) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.1`
* `shared-service` updated to version `0.1.9`


## [0.0.11](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.0.10...notification-data-access-0.0.11) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.0`
* `data-access-electron` updated to version `0.1.7`


## [0.0.10](https://github.com/ever-co/ever-capture/compare/notification-data-access-0.0.9...notification-data-access-0.0.10) (2024-12-26)

### Dependency Updates

* `utils` updated to version `0.3.0`
* `shared-service` updated to version `0.1.8`
* `data-access-electron` updated to version `0.1.6`


## [0.0.9](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-0.0.8...notification-data-access-0.0.9) (2024-11-24)

### Dependency Updates

* `shared-service` updated to version `0.1.7`
* `data-access-electron` updated to version `0.1.5`


## [0.0.8](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-0.0.7...notification-data-access-0.0.8) (2024-11-24)

### Dependency Updates

* `utils` updated to version `0.2.1`


## [0.0.7](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-0.0.6...notification-data-access-0.0.7) (2024-11-24)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `data-access-electron` updated to version `0.1.4`


## [0.0.6](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-0.0.5...notification-data-access-0.0.6) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `shared-service` updated to version `0.1.4`
* `data-access-electron` updated to version `0.1.3`


## [0.0.5](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-0.0.4...notification-data-access-0.0.5) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `shared-service` updated to version `0.1.3`
* `data-access-electron` updated to version `0.1.2`


## [0.0.4](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-0.0.3...notification-data-access-0.0.4) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.1.1`
* `shared-service` updated to version `0.1.2`
* `data-access-electron` updated to version `0.1.1`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.0.3](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-0.0.2...notification-data-access-0.0.3) (2024-11-22)



## [0.0.2](https://github.com/ever-co/ever-rec-desktop/compare/notification-data-access-0.0.1...notification-data-access-0.0.2) (2024-11-21)

### Dependency Updates

* `shared-service` updated to version `0.1.1`


## 0.0.1 (2024-11-20)

### Dependency Updates

* `utils` updated to version `0.1.0`
* `shared-service` updated to version `0.1.0`
* `data-access-electron` updated to version `0.1.0`

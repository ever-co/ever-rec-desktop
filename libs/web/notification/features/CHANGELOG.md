# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.9](https://github.com/ever-co/ever-rec-desktop/compare/notification-feature-1.0.8...notification-feature-1.0.9) (2025-06-03)

### Dependency Updates

* `notification-data-access` updated to version `1.0.5`


## [1.0.8](https://github.com/ever-co/ever-rec-desktop/compare/notification-feature-1.0.7...notification-feature-1.0.8) (2025-06-03)

### Dependency Updates

* `notification-data-access` updated to version `1.0.4`
* `shared-service` updated to version `1.0.3`
* `shared-components` updated to version `2.0.4`
* `utils` updated to version `1.3.1`


## [1.0.7](https://github.com/ever-co/ever-rec-desktop/compare/notification-feature-1.0.6...notification-feature-1.0.7) (2025-05-15)

### Dependency Updates

* `notification-data-access` updated to version `1.0.4`
* `shared-service` updated to version `1.0.2`
* `shared-components` updated to version `2.0.3`
* `utils` updated to version `1.2.0`


## [1.0.6](https://github.com/ever-co/ever-capture/compare/notification-feature-1.0.5...notification-feature-1.0.6) (2025-05-15)

### Dependency Updates

* `notification-data-access` updated to version `1.0.3`
* `shared-service` updated to version `1.0.1`
* `shared-components` updated to version `2.0.2`
* `utils` updated to version `1.1.0`


## [1.0.5](https://github.com/ever-co/ever-capture/compare/notification-feature-1.0.4...notification-feature-1.0.5) (2025-05-15)

### Dependency Updates

* `shared-service` updated to version `1.0.0`
* `shared-components` updated to version `2.0.1`
* `utils` updated to version `1.1.0`


## [1.0.4](https://github.com/ever-co/ever-capture/compare/notification-feature-1.0.3...notification-feature-1.0.4) (2025-05-11)

### Dependency Updates

* `notification-data-access` updated to version `1.0.2`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/notification-feature-1.0.2...notification-feature-1.0.3) (2025-05-11)

### Dependency Updates

* `notification-data-access` updated to version `1.0.1`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/notification-feature-1.0.1...notification-feature-1.0.2) (2025-05-11)

### Dependency Updates

* `shared-service` updated to version `1.0.0`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/notification-feature-1.0.0...notification-feature-1.0.1) (2025-05-11)

### Dependency Updates

* `notification-data-access` updated to version `1.0.1`
* `shared-service` updated to version `0.3.1`


# [1.0.0](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.6...notification-feature-1.0.0) (2025-05-11)

### Dependency Updates

* `notification-data-access` updated to version `1.0.0`
* `shared-service` updated to version `0.3.1`
* `shared-components` updated to version `2.0.0`
* `utils` updated to version `1.1.0`

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
* tailwind config js ([9761084](https://github.com/ever-co/ever-capture/commit/97610843fa16e2fbcea5261b70ed53cca5e669f0))


### Features

* improve video upload setting ([4d71737](https://github.com/ever-co/ever-capture/commit/4d71737ef629795aabf9ef4bc08dce24e4a15808))



## [0.1.6](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.5...notification-feature-0.1.6) (2025-05-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.6`
* `shared-service` updated to version `0.3.1`
* `shared-components` updated to version `1.0.0`
* `utils` updated to version `1.0.0`


## [0.1.5](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.4...notification-feature-0.1.5) (2025-05-02)

### Dependency Updates

* `notification-data-access` updated to version `0.1.5`
* `shared-service` updated to version `0.2.0`
* `shared-components` updated to version `0.2.1`


## [0.1.5](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.4...notification-feature-0.1.5) (2025-05-02)

### Dependency Updates

* `notification-data-access` updated to version `0.1.5`
* `shared-service` updated to version `0.2.0`
* `shared-components` updated to version `0.2.1`


## [0.1.4](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.3...notification-feature-0.1.4) (2025-05-02)

### Dependency Updates

* `notification-data-access` updated to version `0.1.4`
* `shared-service` updated to version `0.1.2`
* `shared-components` updated to version `0.2.0`
* `utils` updated to version `0.2.0`


## [0.1.3](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.2...notification-feature-0.1.3) (2025-02-12)

### Dependency Updates

* `notification-data-access` updated to version `0.1.2`
* `shared-service` updated to version `0.1.2`
* `shared-components` updated to version `0.1.3`
* `utils` updated to version `0.1.2`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.1...notification-feature-0.1.2) (2025-02-12)

### Dependency Updates

* `shared-components` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.0...notification-feature-0.1.1) (2025-02-12)

### Dependency Updates

* `notification-data-access` updated to version `0.1.1`
* `shared-service` updated to version `0.1.1`
* `shared-components` updated to version `0.1.1`
* `utils` updated to version `0.1.1`


# 0.1.0 (2025-01-10)

### Dependency Updates

* `notification-data-access` updated to version `0.1.0`
* `shared-service` updated to version `0.1.0`
* `shared-components` updated to version `0.1.0`
* `utils` updated to version `0.1.0`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* tailwind config js ([9761084](https://github.com/ever-co/ever-capture/commit/97610843fa16e2fbcea5261b70ed53cca5e669f0))


### Features

* improve video upload setting ([4d71737](https://github.com/ever-co/ever-capture/commit/4d71737ef629795aabf9ef4bc08dce24e4a15808))



## [0.1.9](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.8...notification-feature-0.1.9) (2025-01-10)

### Dependency Updates

* `shared-components` updated to version `0.4.9`


## [0.1.8](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.7...notification-feature-0.1.8) (2025-01-09)

### Dependency Updates

* `shared-components` updated to version `0.4.8`


## [0.1.8](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.7...notification-feature-0.1.8) (2025-01-09)

### Dependency Updates

* `shared-components` updated to version `0.4.7`


## [0.1.7](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.6...notification-feature-0.1.7) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.6`
* `shared-components` updated to version `0.4.6`


## [0.1.6](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.5...notification-feature-0.1.6) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.5`
* `shared-service` updated to version `0.1.18`
* `shared-components` updated to version `0.4.5`


## [0.1.5](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.4...notification-feature-0.1.5) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.5`
* `shared-service` updated to version `0.1.17`
* `shared-components` updated to version `0.4.4`
* `utils` updated to version `0.4.2`


## [0.1.4](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.3...notification-feature-0.1.4) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.4`
* `shared-service` updated to version `0.1.16`
* `shared-components` updated to version `0.4.3`
* `utils` updated to version `0.4.1`


## [0.1.3](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.2...notification-feature-0.1.3) (2025-01-09)

### Dependency Updates

* `shared-components` updated to version `0.4.2`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.1...notification-feature-0.1.2) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.3`
* `shared-service` updated to version `0.1.15`
* `shared-components` updated to version `0.4.1`
* `utils` updated to version `0.4.1`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/notification-feature-0.1.0...notification-feature-0.1.1) (2025-01-08)

### Dependency Updates

* `notification-data-access` updated to version `0.1.2`
* `shared-service` updated to version `0.1.14`
* `shared-components` updated to version `0.4.1`


# [0.1.0](https://github.com/ever-co/ever-capture/compare/notification-feature-0.0.21...notification-feature-0.1.0) (2025-01-08)

### Dependency Updates

* `notification-data-access` updated to version `0.1.1`
* `shared-service` updated to version `0.1.13`
* `shared-components` updated to version `0.4.0`
* `utils` updated to version `0.4.0`

### Features

* improve video upload setting ([4d71737](https://github.com/ever-co/ever-capture/commit/4d71737ef629795aabf9ef4bc08dce24e4a15808))



## [0.0.21](https://github.com/ever-co/ever-capture/compare/notification-feature-0.0.20...notification-feature-0.0.21) (2025-01-08)

### Dependency Updates

* `shared-components` updated to version `0.3.0`


## [0.0.20](https://github.com/ever-co/ever-capture/compare/notification-feature-0.0.19...notification-feature-0.0.20) (2025-01-08)

### Dependency Updates

* `shared-components` updated to version `0.2.10`


## [0.0.19](https://github.com/ever-co/ever-capture/compare/notification-feature-0.0.18...notification-feature-0.0.19) (2025-01-08)

### Dependency Updates

* `notification-data-access` updated to version `0.1.0`
* `shared-components` updated to version `0.2.9`


## [0.0.18](https://github.com/ever-co/ever-capture/compare/notification-feature-0.0.17...notification-feature-0.0.18) (2025-01-07)

### Dependency Updates

* `shared-components` updated to version `0.2.8`


## [0.0.17](https://github.com/ever-co/ever-capture/compare/notification-feature-0.0.16...notification-feature-0.0.17) (2025-01-07)

### Dependency Updates

* `notification-data-access` updated to version `0.0.15`
* `shared-service` updated to version `0.1.12`
* `shared-components` updated to version `0.2.7`
* `utils` updated to version `0.3.2`


## [0.0.16](https://github.com/ever-co/ever-capture/compare/notification-feature-0.0.15...notification-feature-0.0.16) (2025-01-06)

### Dependency Updates

* `notification-data-access` updated to version `0.0.14`
* `shared-service` updated to version `0.1.11`
* `shared-components` updated to version `0.2.6`


## [0.0.15](https://github.com/ever-co/ever-capture/compare/notification-feature-0.0.14...notification-feature-0.0.15) (2025-01-06)

### Dependency Updates

* `notification-data-access` updated to version `0.0.13`
* `shared-service` updated to version `0.1.10`
* `shared-components` updated to version `0.2.4`


## [0.0.14](https://github.com/ever-co/ever-capture/compare/notification-feature-0.0.13...notification-feature-0.0.14) (2025-01-06)

### Dependency Updates

* `shared-components` updated to version `0.2.3`


## [0.0.13](https://github.com/ever-co/ever-capture/compare/notification-feature-0.0.12...notification-feature-0.0.13) (2025-01-06)

### Dependency Updates

* `notification-data-access` updated to version `0.0.12`
* `shared-service` updated to version `0.1.10`
* `shared-components` updated to version `0.2.2`
* `utils` updated to version `0.3.1`


## [0.0.12](https://github.com/ever-co/ever-capture/compare/notification-feature-0.0.11...notification-feature-0.0.12) (2025-01-06)

### Dependency Updates

* `notification-data-access` updated to version `0.0.11`
* `shared-service` updated to version `0.1.9`
* `shared-components` updated to version `0.2.1`
* `utils` updated to version `0.3.0`


## [0.0.11](https://github.com/ever-co/ever-capture/compare/notification-feature-0.0.10...notification-feature-0.0.11) (2024-12-26)

### Dependency Updates

* `notification-data-access` updated to version `0.0.10`
* `shared-service` updated to version `0.1.8`
* `shared-components` updated to version `0.2.0`
* `utils` updated to version `0.3.0`


## [0.0.10](https://github.com/ever-co/ever-rec-desktop/compare/notification-feature-0.0.9...notification-feature-0.0.10) (2024-11-24)

### Dependency Updates

* `notification-data-access` updated to version `0.0.9`
* `shared-service` updated to version `0.1.7`
* `shared-components` updated to version `0.1.6`


## [0.0.9](https://github.com/ever-co/ever-rec-desktop/compare/notification-feature-0.0.8...notification-feature-0.0.9) (2024-11-24)

### Dependency Updates

* `notification-data-access` updated to version `0.0.8`
* `shared-service` updated to version `0.1.6`
* `shared-components` updated to version `0.1.5`
* `utils` updated to version `0.2.1`


## [0.0.8](https://github.com/ever-co/ever-rec-desktop/compare/notification-feature-0.0.7...notification-feature-0.0.8) (2024-11-23)

### Dependency Updates

* `notification-data-access` updated to version `0.0.6`
* `shared-service` updated to version `0.1.4`
* `shared-components` updated to version `0.1.4`
* `utils` updated to version `0.2.0`


## [0.0.7](https://github.com/ever-co/ever-rec-desktop/compare/notification-feature-0.0.6...notification-feature-0.0.7) (2024-11-23)

### Dependency Updates

* `notification-data-access` updated to version `0.0.5`
* `shared-service` updated to version `0.1.3`
* `shared-components` updated to version `0.1.3`
* `utils` updated to version `0.1.2`


## [0.0.6](https://github.com/ever-co/ever-rec-desktop/compare/notification-feature-0.0.5...notification-feature-0.0.6) (2024-11-23)

### Dependency Updates

* `notification-data-access` updated to version `0.0.4`
* `shared-service` updated to version `0.1.2`
* `shared-components` updated to version `0.1.2`
* `utils` updated to version `0.1.1`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.0.5](https://github.com/ever-co/ever-rec-desktop/compare/notification-feature-0.0.4...notification-feature-0.0.5) (2024-11-22)

### Dependency Updates

* `notification-data-access` updated to version `0.0.3`
* `shared-components` updated to version `0.1.1`


## [0.0.4](https://github.com/ever-co/ever-rec-desktop/compare/notification-feature-0.0.3...notification-feature-0.0.4) (2024-11-21)

### Dependency Updates

* `shared-components` updated to version `0.1.0`


## [0.0.3](https://github.com/ever-co/ever-rec-desktop/compare/notification-feature-0.0.2...notification-feature-0.0.3) (2024-11-21)

### Dependency Updates

* `shared-components` updated to version `0.1.0`

### Bug Fixes

* tailwind config js ([9761084](https://github.com/ever-co/ever-rec-desktop/commit/97610843fa16e2fbcea5261b70ed53cca5e669f0))



## [0.0.2](https://github.com/ever-co/ever-rec-desktop/compare/notification-feature-0.0.1...notification-feature-0.0.2) (2024-11-21)

### Dependency Updates

* `notification-data-access` updated to version `0.0.2`
* `shared-service` updated to version `0.1.1`


## 0.0.1 (2024-11-20)

### Dependency Updates

* `notification-data-access` updated to version `0.0.1`
* `shared-service` updated to version `0.1.0`
* `shared-components` updated to version `0.1.0`
* `utils` updated to version `0.1.0`

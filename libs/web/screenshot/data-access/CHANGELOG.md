# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.1.5](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-data-access-1.1.4...screenshot-data-access-1.1.5) (2025-06-03)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `date-picker-data-access` updated to version `1.0.5`
* `notification-data-access` updated to version `1.0.4`
* `shared-service` updated to version `1.0.3`
* `data-access-electron` updated to version `1.0.4`


## [1.1.4](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-data-access-1.1.3...screenshot-data-access-1.1.4) (2025-05-15)

### Dependency Updates

* `notification-data-access` updated to version `1.0.4`


## [1.1.3](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-data-access-1.1.2...screenshot-data-access-1.1.3) (2025-05-15)

### Dependency Updates

* `notification-data-access` updated to version `1.0.3`
* `shared-service` updated to version `1.0.2`
* `data-access-electron` updated to version `1.0.3`


## [1.1.2](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-data-access-1.1.1...screenshot-data-access-1.1.2) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.2.0`
* `date-picker-data-access` updated to version `1.0.4`
* `notification-data-access` updated to version `1.0.3`
* `data-access-electron` updated to version `1.0.2`


## [1.1.1](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-1.1.0...screenshot-data-access-1.1.1) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `date-picker-data-access` updated to version `1.0.3`
* `notification-data-access` updated to version `1.0.3`
* `shared-service` updated to version `1.0.1`


# [1.1.0](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-1.0.4...screenshot-data-access-1.1.0) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `date-picker-data-access` updated to version `1.0.2`
* `shared-service` updated to version `1.0.0`
* `data-access-electron` updated to version `1.0.1`

### Features

* **screenshot:** add statistics by date range ([df5ca95](https://github.com/ever-co/ever-capture/commit/df5ca9558e4e21760a5aea8277add35fd98741c3))
* **screenshot:** provide enhanced statistics data ([b117591](https://github.com/ever-co/ever-capture/commit/b1175913322ecd53dee4b2cb8e9fe0d5e64cd9c4))



## [1.0.4](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-1.0.3...screenshot-data-access-1.0.4) (2025-05-11)

### Dependency Updates

* `notification-data-access` updated to version `1.0.2`


## [1.0.4](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-1.0.3...screenshot-data-access-1.0.4) (2025-05-11)

### Dependency Updates

* `notification-data-access` updated to version `1.0.2`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-1.0.2...screenshot-data-access-1.0.3) (2025-05-11)

### Dependency Updates

* `notification-data-access` updated to version `1.0.1`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-1.0.2...screenshot-data-access-1.0.3) (2025-05-11)

### Dependency Updates

* `notification-data-access` updated to version `1.0.1`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-1.0.1...screenshot-data-access-1.0.2) (2025-05-11)

### Dependency Updates

* `shared-service` updated to version `1.0.0`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-1.0.0...screenshot-data-access-1.0.1) (2025-05-11)

### Dependency Updates

* `notification-data-access` updated to version `1.0.1`
* `shared-service` updated to version `0.3.1`
* `data-access-electron` updated to version `1.0.0`


# [1.0.0](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.2.2...screenshot-data-access-1.0.0) (2025-05-11)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `notification-data-access` updated to version `1.0.0`
* `shared-service` updated to version `0.3.1`
* `data-access-electron` updated to version `0.2.2`

* build(libs)!: upgrade Angular to v19 and simplify peer dependencies ([8a519ca](https://github.com/ever-co/ever-capture/commit/8a519ca4c491dfce28d1be34e7680dde4fce1023))


### Features

* **media-sync:** update media item status on upload completion ([c86716f](https://github.com/ever-co/ever-capture/commit/c86716f2d191666024df7a629067cf596a170dfa))


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

* fix inaccurate screenshot storage size calculation ([61ef441](https://github.com/ever-co/ever-capture/commit/61ef441e1d1b37885e896c9ad3d5418c55a1d860))
* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* **state:** update item counts on add/delete operations ([56e76c8](https://github.com/ever-co/ever-capture/commit/56e76c8d7b29ba2a6d00253ec91586acf440dfa1))


### Features

*  migrate to nx 19.8.3 ([a5b23fd](https://github.com/ever-co/ever-capture/commit/a5b23fd62e6e3c707e51b0b58d33d91592aafe4d))
* improve ([ca0c7da](https://github.com/ever-co/ever-capture/commit/ca0c7da98ae74a395ae7f9edf31971afaefd30df))
* modularize ever capture ([0549ee2](https://github.com/ever-co/ever-capture/commit/0549ee29138fe36f7e3c80a7351d28235f9b9055))
* **screenshot:** add support for viewing screenshot chunks ([01f7374](https://github.com/ever-co/ever-capture/commit/01f737459437b3ff190fb8d1875a9b0c46671c17))
* separete factories from libs ([130eae8](https://github.com/ever-co/ever-capture/commit/130eae837172f8ac359707db1df1ab75d15b47dd))
* **settings:** add granular delete and purge options for storage ([418df6d](https://github.com/ever-co/ever-capture/commit/418df6def7f107320da86110a385d46f0377f5f8))



## [0.2.2](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.2.1...screenshot-data-access-0.2.2) (2025-05-09)

### Dependency Updates

* `utils` updated to version `1.0.0`
* `notification-data-access` updated to version `0.1.6`
* `shared-service` updated to version `0.3.1`
* `data-access-electron` updated to version `0.2.2`


## [0.2.1](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.2.0...screenshot-data-access-0.2.1) (2025-05-02)

### Dependency Updates

* `notification-data-access` updated to version `0.1.5`
* `shared-service` updated to version `0.2.0`
* `data-access-electron` updated to version `0.2.1`


# [0.2.0](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.3...screenshot-data-access-0.2.0) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `notification-data-access` updated to version `0.1.3`
* `shared-service` updated to version `0.1.2`
* `data-access-electron` updated to version `0.2.0`

### Bug Fixes

* fix inaccurate screenshot storage size calculation ([61ef441](https://github.com/ever-co/ever-capture/commit/61ef441e1d1b37885e896c9ad3d5418c55a1d860))
* **state:** update item counts on add/delete operations ([56e76c8](https://github.com/ever-co/ever-capture/commit/56e76c8d7b29ba2a6d00253ec91586acf440dfa1))


### Features

* **screenshot:** add support for viewing screenshot chunks ([01f7374](https://github.com/ever-co/ever-capture/commit/01f737459437b3ff190fb8d1875a9b0c46671c17))
* **settings:** add granular delete and purge options for storage ([418df6d](https://github.com/ever-co/ever-capture/commit/418df6def7f107320da86110a385d46f0377f5f8))



## [0.1.3](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.2...screenshot-data-access-0.1.3) (2025-02-12)

### Dependency Updates

* `notification-data-access` updated to version `0.1.2`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.1...screenshot-data-access-0.1.2) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `notification-data-access` updated to version `0.1.1`
* `shared-service` updated to version `0.1.1`
* `data-access-electron` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.0...screenshot-data-access-0.1.1) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.1`
* `notification-data-access` updated to version `0.1.1`
* `shared-service` updated to version `0.1.1`
* `data-access-electron` updated to version `0.1.1`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.0...screenshot-data-access-0.1.1) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.1`
* `shared-service` updated to version `0.1.1`
* `data-access-electron` updated to version `0.1.1`


# 0.1.0 (2025-01-10)

### Dependency Updates

* `utils` updated to version `0.1.0`
* `notification-data-access` updated to version `0.1.0`
* `shared-service` updated to version `0.0.1`
* `data-access-electron` updated to version `0.1.0`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))


### Features

*  migrate to nx 19.8.3 ([a5b23fd](https://github.com/ever-co/ever-capture/commit/a5b23fd62e6e3c707e51b0b58d33d91592aafe4d))
* improve ([ca0c7da](https://github.com/ever-co/ever-capture/commit/ca0c7da98ae74a395ae7f9edf31971afaefd30df))
* modularize ever capture ([0549ee2](https://github.com/ever-co/ever-capture/commit/0549ee29138fe36f7e3c80a7351d28235f9b9055))
* separete factories from libs ([130eae8](https://github.com/ever-co/ever-capture/commit/130eae837172f8ac359707db1df1ab75d15b47dd))



## [0.1.22](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.21...screenshot-data-access-0.1.22) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.6`
* `shared-service` updated to version `0.1.18`
* `data-access-electron` updated to version `0.1.13`


## [0.1.22](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.21...screenshot-data-access-0.1.22) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.6`
* `shared-service` updated to version `0.1.18`
* `data-access-electron` updated to version `0.1.13`


## [0.1.22](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.21...screenshot-data-access-0.1.22) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.5`
* `shared-service` updated to version `0.1.18`
* `data-access-electron` updated to version `0.1.13`


## [0.1.21](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.20...screenshot-data-access-0.1.21) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.2`
* `notification-data-access` updated to version `0.1.5`
* `shared-service` updated to version `0.1.17`


## [0.1.20](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.19...screenshot-data-access-0.1.20) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.1`
* `notification-data-access` updated to version `0.1.4`
* `shared-service` updated to version `0.1.16`
* `data-access-electron` updated to version `0.1.12`


## [0.1.19](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.18...screenshot-data-access-0.1.19) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.1`
* `notification-data-access` updated to version `0.1.3`
* `shared-service` updated to version `0.1.15`
* `data-access-electron` updated to version `0.1.11`


## [0.1.18](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.17...screenshot-data-access-0.1.18) (2025-01-08)

### Dependency Updates

* `notification-data-access` updated to version `0.1.2`
* `shared-service` updated to version `0.1.14`
* `data-access-electron` updated to version `0.1.10`


## [0.1.17](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.16...screenshot-data-access-0.1.17) (2025-01-08)

### Dependency Updates

* `utils` updated to version `0.4.0`
* `notification-data-access` updated to version `0.1.1`
* `shared-service` updated to version `0.1.13`
* `data-access-electron` updated to version `0.1.9`


## [0.1.16](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.15...screenshot-data-access-0.1.16) (2025-01-08)

### Dependency Updates

* `notification-data-access` updated to version `0.1.0`


## [0.1.15](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.14...screenshot-data-access-0.1.15) (2025-01-07)

### Dependency Updates

* `utils` updated to version `0.3.2`
* `notification-data-access` updated to version `0.0.15`
* `shared-service` updated to version `0.1.12`
* `data-access-electron` updated to version `0.1.9`


## [0.1.14](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.13...screenshot-data-access-0.1.14) (2025-01-06)

### Dependency Updates

* `notification-data-access` updated to version `0.0.14`


## [0.1.13](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.12...screenshot-data-access-0.1.13) (2025-01-06)

### Dependency Updates

* `shared-service` updated to version `0.1.11`


## [0.1.12](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.11...screenshot-data-access-0.1.12) (2025-01-06)

### Dependency Updates

* `notification-data-access` updated to version `0.0.13`
* `shared-service` updated to version `0.1.10`
* `data-access-electron` updated to version `0.1.8`


## [0.1.12](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.11...screenshot-data-access-0.1.12) (2025-01-06)

### Dependency Updates

* `data-access-electron` updated to version `0.1.8`


## [0.1.11](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.10...screenshot-data-access-0.1.11) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.1`
* `notification-data-access` updated to version `0.0.12`
* `shared-service` updated to version `0.1.10`


## [0.1.10](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.9...screenshot-data-access-0.1.10) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.0`
* `notification-data-access` updated to version `0.0.11`
* `shared-service` updated to version `0.1.9`
* `data-access-electron` updated to version `0.1.7`


## [0.1.9](https://github.com/ever-co/ever-capture/compare/screenshot-data-access-0.1.8...screenshot-data-access-0.1.9) (2024-12-26)

### Dependency Updates

* `utils` updated to version `0.3.0`
* `notification-data-access` updated to version `0.0.10`
* `shared-service` updated to version `0.1.8`
* `data-access-electron` updated to version `0.1.6`


## [0.1.8](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-data-access-0.1.7...screenshot-data-access-0.1.8) (2024-11-24)

### Dependency Updates

* `notification-data-access` updated to version `0.0.9`
* `shared-service` updated to version `0.1.7`
* `data-access-electron` updated to version `0.1.5`


## [0.1.7](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-data-access-0.1.6...screenshot-data-access-0.1.7) (2024-11-24)

### Dependency Updates

* `utils` updated to version `0.2.1`
* `notification-data-access` updated to version `0.0.8`
* `shared-service` updated to version `0.1.6`


## [0.1.6](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-data-access-0.1.5...screenshot-data-access-0.1.6) (2024-11-24)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `notification-data-access` updated to version `0.0.7`
* `shared-service` updated to version `0.1.5`
* `data-access-electron` updated to version `0.1.4`


## [0.1.5](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-data-access-0.1.4...screenshot-data-access-0.1.5) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `notification-data-access` updated to version `0.0.6`
* `shared-service` updated to version `0.1.4`
* `data-access-electron` updated to version `0.1.3`


## [0.1.4](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-data-access-0.1.3...screenshot-data-access-0.1.4) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `notification-data-access` updated to version `0.0.5`
* `shared-service` updated to version `0.1.3`
* `data-access-electron` updated to version `0.1.2`


## [0.1.3](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-data-access-0.1.2...screenshot-data-access-0.1.3) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.1.1`
* `notification-data-access` updated to version `0.0.4`
* `shared-service` updated to version `0.1.2`
* `data-access-electron` updated to version `0.1.1`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.1.2](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-data-access-0.1.1...screenshot-data-access-0.1.2) (2024-11-22)

### Dependency Updates

* `notification-data-access` updated to version `0.0.3`


## [0.1.1](https://github.com/ever-co/ever-rec-desktop/compare/screenshot-data-access-0.1.0...screenshot-data-access-0.1.1) (2024-11-21)

### Dependency Updates

* `notification-data-access` updated to version `0.0.2`
* `shared-service` updated to version `0.1.1`


# 0.1.0 (2024-11-20)

### Dependency Updates

* `utils` updated to version `0.1.0`
* `notification-data-access` updated to version `0.0.1`
* `shared-service` updated to version `0.1.0`
* `data-access-electron` updated to version `0.1.0`

### Features

*  migrate to nx 19.8.3 ([a5b23fd](https://github.com/ever-co/ever-rec-desktop/commit/a5b23fd62e6e3c707e51b0b58d33d91592aafe4d))
* improve ([ca0c7da](https://github.com/ever-co/ever-rec-desktop/commit/ca0c7da98ae74a395ae7f9edf31971afaefd30df))
* modularize Ever Rec Desktop ([0549ee2](https://github.com/ever-co/ever-rec-desktop/commit/0549ee29138fe36f7e3c80a7351d28235f9b9055))
* separete factories from libs ([130eae8](https://github.com/ever-co/ever-rec-desktop/commit/130eae837172f8ac359707db1df1ab75d15b47dd))

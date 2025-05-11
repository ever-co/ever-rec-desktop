# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.4](https://github.com/ever-co/ever-capture/compare/library-1.0.3...library-1.0.4) (2025-05-11)

### Dependency Updates

* `video-feature` updated to version `1.0.5`
* `screenshot-feature` updated to version `1.0.4`
* `photo-feature` updated to version `1.0.4`
* `feature` updated to version `1.0.4`


## [1.0.3](https://github.com/ever-co/ever-capture/compare/library-1.0.2...library-1.0.3) (2025-05-11)

### Dependency Updates

* `video-feature` updated to version `1.0.4`
* `screenshot-feature` updated to version `1.0.3`
* `photo-feature` updated to version `1.0.3`
* `feature` updated to version `1.0.3`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/library-1.0.1...library-1.0.2) (2025-05-11)

### Dependency Updates

* `video-feature` updated to version `1.0.3`
* `screenshot-feature` updated to version `1.0.2`
* `photo-feature` updated to version `1.0.2`
* `feature` updated to version `1.0.2`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/library-1.0.0...library-1.0.1) (2025-05-11)

### Dependency Updates

* `video-feature` updated to version `1.0.2`
* `screenshot-feature` updated to version `1.0.1`
* `photo-feature` updated to version `1.0.1`
* `feature` updated to version `1.0.1`


# [1.0.0](https://github.com/ever-co/ever-capture/compare/library-0.1.2...library-1.0.0) (2025-05-11)

### Dependency Updates

* `video-feature` updated to version `1.0.1`
* `screenshot-feature` updated to version `1.0.0`
* `photo-feature` updated to version `1.0.0`
* `feature` updated to version `1.0.0`
* `breadcrumb-data-access` updated to version `1.0.0`

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

* **library:** add icons to library tabs ([1c09253](https://github.com/ever-co/ever-capture/commit/1c09253a9fd7fae9a8012ecf217312e2fae233a8))
* **webcam:** add audio gallery and management ([5fcb1af](https://github.com/ever-co/ever-capture/commit/5fcb1afcb7f1496dd620731423c7192a23ccea36))
* **webcam:** add photo gallery and detail view ([c810cca](https://github.com/ever-co/ever-capture/commit/c810cca3ddcb6d7daeedc8a7b658de700718d045))



## [0.1.2](https://github.com/ever-co/ever-capture/compare/library-0.1.1...library-0.1.2) (2025-05-09)

### Dependency Updates

* `convert-video-feature` updated to version `1.0.0`
* `convert-video-feature` updated to version `1.0.0`
* `screenshot-feature` updated to version `0.3.0`
* `screenshot-feature` updated to version `0.3.0`
* `photo-feature` updated to version `0.1.0`
* `feature` updated to version `0.2.0`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/library-0.1.0...library-0.1.1) (2025-05-02)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.1`
* `convert-video-feature` updated to version `0.3.1`
* `screenshot-feature` updated to version `0.2.1`
* `screenshot-feature` updated to version `0.2.1`


# [0.1.0](https://github.com/ever-co/ever-capture/compare/library-0.0.5...library-0.1.0) (2025-05-02)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.0`
* `convert-video-feature` updated to version `0.3.0`
* `screenshot-feature` updated to version `0.2.0`
* `screenshot-feature` updated to version `0.2.0`
* `breadcrumb-data-access` updated to version `0.1.2`
* `photo-feature` updated to version `0.0.1`
* `feature` updated to version `0.1.0`

### Features

* **library:** add icons to library tabs ([1c09253](https://github.com/ever-co/ever-capture/commit/1c09253a9fd7fae9a8012ecf217312e2fae233a8))
* **webcam:** add audio gallery and management ([5fcb1af](https://github.com/ever-co/ever-capture/commit/5fcb1afcb7f1496dd620731423c7192a23ccea36))
* **webcam:** add photo gallery and detail view ([c810cca](https://github.com/ever-co/ever-capture/commit/c810cca3ddcb6d7daeedc8a7b658de700718d045))



## [0.0.5](https://github.com/ever-co/ever-capture/compare/library-0.0.4...library-0.0.5) (2025-02-12)

### Dependency Updates

* `convert-video-feature` updated to version `0.2.2`
* `convert-video-feature` updated to version `0.2.2`
* `screenshot-feature` updated to version `0.1.4`
* `screenshot-feature` updated to version `0.1.4`
* `breadcrumb-data-access` updated to version `0.1.1`


## [0.0.4](https://github.com/ever-co/ever-capture/compare/library-0.0.3...library-0.0.4) (2025-02-12)

### Dependency Updates

* `convert-video-feature` updated to version `0.2.1`
* `convert-video-feature` updated to version `0.2.1`
* `screenshot-feature` updated to version `0.1.2`
* `screenshot-feature` updated to version `0.1.2`


## [0.0.3](https://github.com/ever-co/ever-capture/compare/library-0.0.2...library-0.0.3) (2025-02-12)

### Dependency Updates

* `convert-video-feature` updated to version `0.2.0`
* `convert-video-feature` updated to version `0.2.0`
* `screenshot-feature` updated to version `0.1.1`
* `screenshot-feature` updated to version `0.1.1`


## [0.0.2](https://github.com/ever-co/ever-capture/compare/library-0.0.1...library-0.0.2) (2025-01-10)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.0`
* `convert-video-feature` updated to version `0.1.0`


## 0.0.1 (2025-01-10)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.0`
* `convert-video-feature` updated to version `0.1.0`
* `screenshot-feature` updated to version `0.1.0`
* `screenshot-feature` updated to version `0.1.0`
* `breadcrumb-data-access` updated to version `0.1.0`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* tailwind config js ([9761084](https://github.com/ever-co/ever-capture/commit/97610843fa16e2fbcea5261b70ed53cca5e669f0))



## [0.0.33](https://github.com/ever-co/ever-capture/compare/library-0.0.32...library-0.0.33) (2025-01-10)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.10`
* `convert-video-feature` updated to version `0.3.10`
* `screenshot-feature` updated to version `0.2.22`
* `screenshot-feature` updated to version `0.2.22`


## [0.0.32](https://github.com/ever-co/ever-capture/compare/library-0.0.31...library-0.0.32) (2025-01-09)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.9`
* `convert-video-feature` updated to version `0.3.9`
* `screenshot-feature` updated to version `0.2.21`
* `screenshot-feature` updated to version `0.2.21`


## [0.0.31](https://github.com/ever-co/ever-capture/compare/library-0.0.30...library-0.0.31) (2025-01-09)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.8`
* `convert-video-feature` updated to version `0.3.8`
* `screenshot-feature` updated to version `0.2.20`
* `screenshot-feature` updated to version `0.2.20`


## [0.0.30](https://github.com/ever-co/ever-capture/compare/library-0.0.29...library-0.0.30) (2025-01-09)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.7`
* `convert-video-feature` updated to version `0.3.7`
* `screenshot-feature` updated to version `0.2.19`
* `screenshot-feature` updated to version `0.2.19`


## [0.0.29](https://github.com/ever-co/ever-capture/compare/library-0.0.28...library-0.0.29) (2025-01-09)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.6`
* `convert-video-feature` updated to version `0.3.6`
* `screenshot-feature` updated to version `0.2.18`
* `screenshot-feature` updated to version `0.2.18`


## [0.0.28](https://github.com/ever-co/ever-capture/compare/library-0.0.27...library-0.0.28) (2025-01-09)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.5`
* `convert-video-feature` updated to version `0.3.5`
* `screenshot-feature` updated to version `0.2.17`
* `screenshot-feature` updated to version `0.2.17`


## [0.0.27](https://github.com/ever-co/ever-capture/compare/library-0.0.26...library-0.0.27) (2025-01-09)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.4`
* `convert-video-feature` updated to version `0.3.4`
* `screenshot-feature` updated to version `0.2.16`
* `screenshot-feature` updated to version `0.2.16`


## [0.0.26](https://github.com/ever-co/ever-capture/compare/library-0.0.25...library-0.0.26) (2025-01-09)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.3`
* `convert-video-feature` updated to version `0.3.3`
* `screenshot-feature` updated to version `0.2.15`
* `screenshot-feature` updated to version `0.2.15`


## [0.0.26](https://github.com/ever-co/ever-capture/compare/library-0.0.25...library-0.0.26) (2025-01-09)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.2`
* `convert-video-feature` updated to version `0.3.2`
* `screenshot-feature` updated to version `0.2.14`
* `screenshot-feature` updated to version `0.2.14`


## [0.0.25](https://github.com/ever-co/ever-capture/compare/library-0.0.24...library-0.0.25) (2025-01-08)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.1`
* `convert-video-feature` updated to version `0.3.1`
* `screenshot-feature` updated to version `0.2.13`
* `screenshot-feature` updated to version `0.2.13`


## [0.0.24](https://github.com/ever-co/ever-capture/compare/library-0.0.23...library-0.0.24) (2025-01-08)

### Dependency Updates

* `convert-video-feature` updated to version `0.3.0`
* `convert-video-feature` updated to version `0.3.0`
* `screenshot-feature` updated to version `0.2.12`
* `screenshot-feature` updated to version `0.2.12`


## [0.0.23](https://github.com/ever-co/ever-capture/compare/library-0.0.22...library-0.0.23) (2025-01-08)

### Dependency Updates

* `convert-video-feature` updated to version `0.2.0`
* `convert-video-feature` updated to version `0.2.0`
* `screenshot-feature` updated to version `0.2.11`
* `screenshot-feature` updated to version `0.2.11`


## [0.0.22](https://github.com/ever-co/ever-capture/compare/library-0.0.21...library-0.0.22) (2025-01-08)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.21`
* `convert-video-feature` updated to version `0.1.21`
* `screenshot-feature` updated to version `0.2.10`
* `screenshot-feature` updated to version `0.2.10`


## [0.0.21](https://github.com/ever-co/ever-capture/compare/library-0.0.20...library-0.0.21) (2025-01-08)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.20`
* `convert-video-feature` updated to version `0.1.20`
* `screenshot-feature` updated to version `0.2.9`
* `screenshot-feature` updated to version `0.2.9`


## [0.0.20](https://github.com/ever-co/ever-capture/compare/library-0.0.19...library-0.0.20) (2025-01-07)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.19`
* `convert-video-feature` updated to version `0.1.19`
* `screenshot-feature` updated to version `0.2.8`
* `screenshot-feature` updated to version `0.2.8`


## [0.0.19](https://github.com/ever-co/ever-capture/compare/library-0.0.18...library-0.0.19) (2025-01-07)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.18`
* `convert-video-feature` updated to version `0.1.18`
* `screenshot-feature` updated to version `0.2.7`
* `screenshot-feature` updated to version `0.2.7`


## [0.0.18](https://github.com/ever-co/ever-capture/compare/library-0.0.17...library-0.0.18) (2025-01-06)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.17`
* `convert-video-feature` updated to version `0.1.17`
* `screenshot-feature` updated to version `0.2.6`
* `screenshot-feature` updated to version `0.2.6`


## [0.0.17](https://github.com/ever-co/ever-capture/compare/library-0.0.16...library-0.0.17) (2025-01-06)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.16`
* `convert-video-feature` updated to version `0.1.16`
* `screenshot-feature` updated to version `0.2.4`
* `screenshot-feature` updated to version `0.2.4`


## [0.0.16](https://github.com/ever-co/ever-capture/compare/library-0.0.15...library-0.0.16) (2025-01-06)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.15`
* `convert-video-feature` updated to version `0.1.15`
* `screenshot-feature` updated to version `0.2.3`
* `screenshot-feature` updated to version `0.2.3`


## [0.0.15](https://github.com/ever-co/ever-capture/compare/library-0.0.14...library-0.0.15) (2025-01-06)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.14`
* `convert-video-feature` updated to version `0.1.14`
* `screenshot-feature` updated to version `0.2.2`
* `screenshot-feature` updated to version `0.2.2`


## [0.0.14](https://github.com/ever-co/ever-capture/compare/library-0.0.13...library-0.0.14) (2025-01-06)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.13`
* `convert-video-feature` updated to version `0.1.13`
* `screenshot-feature` updated to version `0.2.1`
* `screenshot-feature` updated to version `0.2.1`


## [0.0.13](https://github.com/ever-co/ever-capture/compare/library-0.0.12...library-0.0.13) (2024-12-26)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.12`
* `convert-video-feature` updated to version `0.1.12`
* `screenshot-feature` updated to version `0.2.0`
* `screenshot-feature` updated to version `0.2.0`
* `breadcrumb-data-access` updated to version `0.1.3`


## [0.0.12](https://github.com/ever-co/ever-rec-desktop/compare/library-0.0.11...library-0.0.12) (2024-11-24)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.11`
* `convert-video-feature` updated to version `0.1.11`
* `screenshot-feature` updated to version `0.1.9`
* `screenshot-feature` updated to version `0.1.9`


## [0.0.11](https://github.com/ever-co/ever-rec-desktop/compare/library-0.0.10...library-0.0.11) (2024-11-24)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.10`
* `convert-video-feature` updated to version `0.1.10`
* `screenshot-feature` updated to version `0.1.8`
* `screenshot-feature` updated to version `0.1.8`


## [0.0.10](https://github.com/ever-co/ever-rec-desktop/compare/library-0.0.9...library-0.0.10) (2024-11-23)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.9`
* `convert-video-feature` updated to version `0.1.9`
* `screenshot-feature` updated to version `0.1.7`
* `screenshot-feature` updated to version `0.1.7`


## [0.0.9](https://github.com/ever-co/ever-rec-desktop/compare/library-0.0.8...library-0.0.9) (2024-11-23)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.8`
* `convert-video-feature` updated to version `0.1.8`
* `screenshot-feature` updated to version `0.1.6`
* `screenshot-feature` updated to version `0.1.6`
* `breadcrumb-data-access` updated to version `0.1.2`


## [0.0.8](https://github.com/ever-co/ever-rec-desktop/compare/library-0.0.7...library-0.0.8) (2024-11-23)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.7`
* `convert-video-feature` updated to version `0.1.7`
* `screenshot-feature` updated to version `0.1.5`
* `screenshot-feature` updated to version `0.1.5`
* `breadcrumb-data-access` updated to version `0.1.1`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.0.7](https://github.com/ever-co/ever-rec-desktop/compare/library-0.0.6...library-0.0.7) (2024-11-22)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.6`
* `convert-video-feature` updated to version `0.1.6`
* `screenshot-feature` updated to version `0.1.4`
* `screenshot-feature` updated to version `0.1.4`


## [0.0.6](https://github.com/ever-co/ever-rec-desktop/compare/library-0.0.5...library-0.0.6) (2024-11-21)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.5`


## [0.0.5](https://github.com/ever-co/ever-rec-desktop/compare/library-0.0.4...library-0.0.5) (2024-11-21)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.4`
* `screenshot-feature` updated to version `0.1.3`


## [0.0.4](https://github.com/ever-co/ever-rec-desktop/compare/library-0.0.3...library-0.0.4) (2024-11-21)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.3`
* `screenshot-feature` updated to version `0.1.2`

### Bug Fixes

* tailwind config js ([9761084](https://github.com/ever-co/ever-rec-desktop/commit/97610843fa16e2fbcea5261b70ed53cca5e669f0))



## [0.0.3](https://github.com/ever-co/ever-rec-desktop/compare/library-0.0.2...library-0.0.3) (2024-11-21)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.2`
* `screenshot-feature` updated to version `0.1.1`


## [0.0.2](https://github.com/ever-co/ever-rec-desktop/compare/library-0.0.1...library-0.0.2) (2024-11-21)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.1`


## 0.0.1 (2024-11-20)

### Dependency Updates

* `convert-video-feature` updated to version `0.1.0`
* `screenshot-feature` updated to version `0.1.0`
* `breadcrumb-data-access` updated to version `0.1.0`

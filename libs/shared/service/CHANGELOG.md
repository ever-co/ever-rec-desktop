# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.7](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-1.0.6...shared-service-1.0.7) (2025-06-06)

### Dependency Updates

* `data-access-electron` updated to version `1.0.5`


## [1.0.6](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-1.0.5...shared-service-1.0.6) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.2`


## [1.0.5](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-1.0.4...shared-service-1.0.5) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `data-access-electron` updated to version `1.0.5`


## [1.0.4](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-1.0.3...shared-service-1.0.4) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.1`


## [1.0.3](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-1.0.2...shared-service-1.0.3) (2025-06-03)

### Dependency Updates

* `utils` updated to version `1.3.0`
* `data-access-electron` updated to version `1.0.3`


## [1.0.2](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-1.0.1...shared-service-1.0.2) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.2.0`
* `data-access-electron` updated to version `1.0.2`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/shared-service-1.0.0...shared-service-1.0.1) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `data-access-electron` updated to version `1.0.1`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/shared-service-1.0.0...shared-service-1.0.1) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`


# [1.0.0](https://github.com/ever-co/ever-capture/compare/shared-service-0.3.1...shared-service-1.0.0) (2025-05-11)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `data-access-electron` updated to version `1.0.0`

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



# [1.0.0](https://github.com/ever-co/ever-capture/compare/shared-service-0.3.1...shared-service-1.0.0) (2025-05-11)

### Dependency Updates

* `utils` updated to version `1.1.0`
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



# [1.0.0](https://github.com/ever-co/ever-capture/compare/shared-service-0.3.1...shared-service-1.0.0) (2025-05-11)

### Dependency Updates

* `utils` updated to version `1.0.0`
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
* **webcam-audio:** set saving state on successful recording stop ([e54eb91](https://github.com/ever-co/ever-capture/commit/e54eb919620d053067cbf403d2e991b01d98c796))


### Features

* **app:** integrate REC_ENV for environment configuration ([306d2e2](https://github.com/ever-co/ever-capture/commit/306d2e2f77f2c02f3409d73f67dddc21b2fe412f))
* **audio-gallery:** add action popover to audio gallery items ([adfecb0](https://github.com/ever-co/ever-capture/commit/adfecb09a4cec12fe53f2464cedcb07cb5e01a24))
* **audio:** add metadata display component ([9d440fa](https://github.com/ever-co/ever-capture/commit/9d440fafb02cf51e81c41849aa9dc9951939bf3a))
* create pipe, utc to local time pipe ([acc794d](https://github.com/ever-co/ever-capture/commit/acc794d6ebbdc5b9b6df75f83bc4d41fdc4bbb06))
* create resize directive ([e1b8f3f](https://github.com/ever-co/ever-capture/commit/e1b8f3f4c9c932d03bb922ce3f1b289f20a48d52))
* **date-picker:** change default date range to current week till now ([60b8b57](https://github.com/ever-co/ever-capture/commit/60b8b570cf6a4b2b1dab71a6f7f0f633257984e2))
* **hydration:** make state hydration type-safe with generics ([582e043](https://github.com/ever-co/ever-capture/commit/582e0435e6f7489358cec2bcf6ef614f10ada999))
* **mediator:** add service and effects for inter-window state sync ([ff2bd68](https://github.com/ever-co/ever-capture/commit/ff2bd6888ac1ec7b34ad5a138ed5742e9bb7774b))
* **mediator:** sync screenshot stop success action ([0ec54a4](https://github.com/ever-co/ever-capture/commit/0ec54a436dd796ef001b814786adb44f94dca847))
* modularize ever capture ([0549ee2](https://github.com/ever-co/ever-capture/commit/0549ee29138fe36f7e3c80a7351d28235f9b9055))
* separate all timeline elements ([6c3920a](https://github.com/ever-co/ever-capture/commit/6c3920a264f61c3905b74caa474a584eb6809e79))
* separete factories from libs ([130eae8](https://github.com/ever-co/ever-capture/commit/130eae837172f8ac359707db1df1ab75d15b47dd))
* **settings:** add codec dropdown and initial webcam settings ([df644e6](https://github.com/ever-co/ever-capture/commit/df644e656b92a35dea2993c69c0dd862c4404405))
* **shared-service:** add deleteAll and conditional serialization to IndexedDbService ([3d5bc23](https://github.com/ever-co/ever-capture/commit/3d5bc236a27767f5670583c2e484e26fba3cdce0))
* **shared-service:** implement ngrx state hydration via indexeddb ([eda38f9](https://github.com/ever-co/ever-capture/commit/eda38f9137530a5871d6a1c7ef197544f4345294))



## [0.3.1](https://github.com/ever-co/ever-capture/compare/shared-service-0.3.0...shared-service-0.3.1) (2025-05-09)

### Dependency Updates

* `utils` updated to version `1.0.0`
* `data-access-electron` updated to version `0.2.2`


# [0.3.0](https://github.com/ever-co/ever-capture/compare/shared-service-0.2.0...shared-service-0.3.0) (2025-05-05)

### Dependency Updates

* `utils` updated to version `0.2.1`

### Features

* **app:** integrate REC_ENV for environment configuration ([306d2e2](https://github.com/ever-co/ever-capture/commit/306d2e2f77f2c02f3409d73f67dddc21b2fe412f))



# [0.2.0](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.2...shared-service-0.2.0) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `data-access-electron` updated to version `0.2.1`

### Bug Fixes

* **webcam-audio:** set saving state on successful recording stop ([e54eb91](https://github.com/ever-co/ever-capture/commit/e54eb919620d053067cbf403d2e991b01d98c796))


### Features

* **audio-gallery:** add action popover to audio gallery items ([adfecb0](https://github.com/ever-co/ever-capture/commit/adfecb09a4cec12fe53f2464cedcb07cb5e01a24))
* **audio:** add metadata display component ([9d440fa](https://github.com/ever-co/ever-capture/commit/9d440fafb02cf51e81c41849aa9dc9951939bf3a))
* **date-picker:** change default date range to current week till now ([60b8b57](https://github.com/ever-co/ever-capture/commit/60b8b570cf6a4b2b1dab71a6f7f0f633257984e2))
* **hydration:** make state hydration type-safe with generics ([582e043](https://github.com/ever-co/ever-capture/commit/582e0435e6f7489358cec2bcf6ef614f10ada999))
* **mediator:** add service and effects for inter-window state sync ([ff2bd68](https://github.com/ever-co/ever-capture/commit/ff2bd6888ac1ec7b34ad5a138ed5742e9bb7774b))
* **mediator:** sync screenshot stop success action ([0ec54a4](https://github.com/ever-co/ever-capture/commit/0ec54a436dd796ef001b814786adb44f94dca847))
* **settings:** add codec dropdown and initial webcam settings ([df644e6](https://github.com/ever-co/ever-capture/commit/df644e656b92a35dea2993c69c0dd862c4404405))
* **shared-service:** add deleteAll and conditional serialization to IndexedDbService ([3d5bc23](https://github.com/ever-co/ever-capture/commit/3d5bc236a27767f5670583c2e484e26fba3cdce0))
* **shared-service:** implement ngrx state hydration via indexeddb ([eda38f9](https://github.com/ever-co/ever-capture/commit/eda38f9137530a5871d6a1c7ef197544f4345294))



# [0.2.0](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.2...shared-service-0.2.0) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `data-access-electron` updated to version `0.1.2`

### Bug Fixes

* **webcam-audio:** set saving state on successful recording stop ([e54eb91](https://github.com/ever-co/ever-capture/commit/e54eb919620d053067cbf403d2e991b01d98c796))


### Features

* **audio-gallery:** add action popover to audio gallery items ([adfecb0](https://github.com/ever-co/ever-capture/commit/adfecb09a4cec12fe53f2464cedcb07cb5e01a24))
* **audio:** add metadata display component ([9d440fa](https://github.com/ever-co/ever-capture/commit/9d440fafb02cf51e81c41849aa9dc9951939bf3a))
* **date-picker:** change default date range to current week till now ([60b8b57](https://github.com/ever-co/ever-capture/commit/60b8b570cf6a4b2b1dab71a6f7f0f633257984e2))
* **hydration:** make state hydration type-safe with generics ([582e043](https://github.com/ever-co/ever-capture/commit/582e0435e6f7489358cec2bcf6ef614f10ada999))
* **mediator:** add service and effects for inter-window state sync ([ff2bd68](https://github.com/ever-co/ever-capture/commit/ff2bd6888ac1ec7b34ad5a138ed5742e9bb7774b))
* **mediator:** sync screenshot stop success action ([0ec54a4](https://github.com/ever-co/ever-capture/commit/0ec54a436dd796ef001b814786adb44f94dca847))
* **settings:** add codec dropdown and initial webcam settings ([df644e6](https://github.com/ever-co/ever-capture/commit/df644e656b92a35dea2993c69c0dd862c4404405))
* **shared-service:** add deleteAll and conditional serialization to IndexedDbService ([3d5bc23](https://github.com/ever-co/ever-capture/commit/3d5bc236a27767f5670583c2e484e26fba3cdce0))
* **shared-service:** implement ngrx state hydration via indexeddb ([eda38f9](https://github.com/ever-co/ever-capture/commit/eda38f9137530a5871d6a1c7ef197544f4345294))



## [0.1.2](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.1...shared-service-0.1.2) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `data-access-electron` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.0...shared-service-0.1.1) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.1`
* `data-access-electron` updated to version `0.1.1`


# 0.1.0 (2025-01-10)

### Dependency Updates

* `utils` updated to version `0.1.0`
* `data-access-electron` updated to version `0.1.0`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))


### Features

* create pipe, utc to local time pipe ([acc794d](https://github.com/ever-co/ever-capture/commit/acc794d6ebbdc5b9b6df75f83bc4d41fdc4bbb06))
* create resize directive ([e1b8f3f](https://github.com/ever-co/ever-capture/commit/e1b8f3f4c9c932d03bb922ce3f1b289f20a48d52))
* modularize ever capture ([0549ee2](https://github.com/ever-co/ever-capture/commit/0549ee29138fe36f7e3c80a7351d28235f9b9055))
* separate all timeline elements ([6c3920a](https://github.com/ever-co/ever-capture/commit/6c3920a264f61c3905b74caa474a584eb6809e79))
* separete factories from libs ([130eae8](https://github.com/ever-co/ever-capture/commit/130eae837172f8ac359707db1df1ab75d15b47dd))



## [0.1.18](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.17...shared-service-0.1.18) (2025-01-09)

### Dependency Updates

* `data-access-electron` updated to version `0.1.13`


## [0.1.17](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.16...shared-service-0.1.17) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.2`


## [0.1.16](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.15...shared-service-0.1.16) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.1`
* `data-access-electron` updated to version `0.1.12`


## [0.1.15](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.14...shared-service-0.1.15) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.1`
* `data-access-electron` updated to version `0.1.11`


## [0.1.14](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.13...shared-service-0.1.14) (2025-01-08)

### Dependency Updates

* `data-access-electron` updated to version `0.1.10`


## [0.1.13](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.12...shared-service-0.1.13) (2025-01-08)

### Dependency Updates

* `utils` updated to version `0.4.0`
* `data-access-electron` updated to version `0.1.9`


## [0.1.12](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.11...shared-service-0.1.12) (2025-01-07)

### Dependency Updates

* `utils` updated to version `0.3.2`
* `data-access-electron` updated to version `0.1.9`


## [0.1.11](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.10...shared-service-0.1.11) (2025-01-06)

### Dependency Updates

* `data-access-electron` updated to version `0.1.8`


## [0.1.11](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.10...shared-service-0.1.11) (2025-01-06)

### Dependency Updates

* `data-access-electron` updated to version `0.1.8`


## [0.1.10](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.9...shared-service-0.1.10) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.1`


## [0.1.9](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.8...shared-service-0.1.9) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.0`
* `data-access-electron` updated to version `0.1.7`


## [0.1.8](https://github.com/ever-co/ever-capture/compare/shared-service-0.1.7...shared-service-0.1.8) (2024-12-26)

### Dependency Updates

* `utils` updated to version `0.3.0`
* `data-access-electron` updated to version `0.1.6`


## [0.1.7](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-0.1.6...shared-service-0.1.7) (2024-11-24)

### Dependency Updates

* `data-access-electron` updated to version `0.1.5`


## [0.1.6](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-0.1.5...shared-service-0.1.6) (2024-11-24)

### Dependency Updates

* `utils` updated to version `0.2.1`


## [0.1.5](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-0.1.4...shared-service-0.1.5) (2024-11-24)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `data-access-electron` updated to version `0.1.4`


## [0.1.4](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-0.1.3...shared-service-0.1.4) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `data-access-electron` updated to version `0.1.3`


## [0.1.3](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-0.1.2...shared-service-0.1.3) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `data-access-electron` updated to version `0.1.2`


## [0.1.2](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-0.1.1...shared-service-0.1.2) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.1.1`
* `data-access-electron` updated to version `0.1.1`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.1.1](https://github.com/ever-co/ever-rec-desktop/compare/shared-service-0.1.0...shared-service-0.1.1) (2024-11-21)



# 0.1.0 (2024-11-20)

### Dependency Updates

* `utils` updated to version `0.1.0`
* `data-access-electron` updated to version `0.1.0`

### Features

* create pipe, utc to local time pipe ([acc794d](https://github.com/ever-co/ever-rec-desktop/commit/acc794d6ebbdc5b9b6df75f83bc4d41fdc4bbb06))
* create resize directive ([e1b8f3f](https://github.com/ever-co/ever-rec-desktop/commit/e1b8f3f4c9c932d03bb922ce3f1b289f20a48d52))
* modularize Ever Rec Desktop ([0549ee2](https://github.com/ever-co/ever-rec-desktop/commit/0549ee29138fe36f7e3c80a7351d28235f9b9055))
* separate all timeline elements ([6c3920a](https://github.com/ever-co/ever-rec-desktop/commit/6c3920a264f61c3905b74caa474a584eb6809e79))
* separete factories from libs ([130eae8](https://github.com/ever-co/ever-rec-desktop/commit/130eae837172f8ac359707db1df1ab75d15b47dd))

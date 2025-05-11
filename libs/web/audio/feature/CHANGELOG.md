# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.3](https://github.com/ever-co/ever-capture/compare/feature-1.0.2...feature-1.0.3) (2025-05-11)

### Dependency Updates

* `data-access` updated to version `0.2.3`
* `generate-video-data-access` updated to version `1.0.3`
* `screenshot-data-access` updated to version `1.0.2`
* `upload-data-access` updated to version `2.0.2`
* `web-setting-data-access` updated to version `1.0.3`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/feature-1.0.1...feature-1.0.2) (2025-05-11)

### Dependency Updates

* `data-access` updated to version `0.2.2`
* `shared-service` updated to version `1.0.0`
* `audio-ui` updated to version `0.1.4`
* `generate-video-data-access` updated to version `1.0.2`
* `screenshot-data-access` updated to version `1.0.2`
* `web-setting-data-access` updated to version `1.0.2`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/feature-1.0.0...feature-1.0.1) (2025-05-11)

### Dependency Updates

* `data-access` updated to version `0.2.1`
* `shared-service` updated to version `0.3.1`
* `audio-ui` updated to version `0.1.3`
* `generate-video-data-access` updated to version `1.0.1`
* `screenshot-data-access` updated to version `1.0.1`
* `upload-data-access` updated to version `2.0.1`
* `web-setting-data-access` updated to version `1.0.1`


# [1.0.0](https://github.com/ever-co/ever-capture/compare/feature-0.2.0...feature-1.0.0) (2025-05-11)

### Dependency Updates

* `data-access` updated to version `0.2.0`
* `shared-components` updated to version `2.0.0`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.1.0`
* `audio-ui` updated to version `0.1.2`
* `generate-video-data-access` updated to version `1.0.0`
* `screenshot-data-access` updated to version `1.0.0`
* `upload-data-access` updated to version `2.0.0`
* `web-setting-data-access` updated to version `1.0.0`
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



# 0.1.0 (2025-05-09)


### Bug Fixes

* **audio-player:** improve audio synchronization and state handling ([eb324a2](https://github.com/ever-co/ever-capture/commit/eb324a20dba613190ba2a809e2a989b8db15a70b))
* **audio-player:** pass explicit state to toggleMute action ([e6beccb](https://github.com/ever-co/ever-capture/commit/e6beccba52cfde96588bf5c088d885708af0c65f))
* **player-container:** use isSame value in toggle stream ([43ce5e0](https://github.com/ever-co/ever-capture/commit/43ce5e01dd4641053cea3f342c87a77ad787494a))


### Features

* **audio-gallery:** add upload action for audio items ([fafa302](https://github.com/ever-co/ever-capture/commit/fafa30286d4e44333c56340b7cbbc52b7a6c63b0))
* **audio-gallery:** hide time log button during capture or generation ([b2cb0c5](https://github.com/ever-co/ever-capture/commit/b2cb0c5e27fdfe77a2dbfa223eb4d2fa48d93f49))
* **audio:** implement audio player feature ([d19c350](https://github.com/ever-co/ever-capture/commit/d19c350858c36272175744dbc99e63016de93bb3))
* **audio:** implement audio synchronization ([d29bc3c](https://github.com/ever-co/ever-capture/commit/d29bc3c9d57ce2c23fb4e330cefb101ddf886e3a))
* **audio:** manage current audio via ngrx state ([474f7fc](https://github.com/ever-co/ever-capture/commit/474f7fcaf4074dd5483d1161c6170bab0ceb03c5))
* **audio:** scaffold data-access, feature, and ui libraries ([cbd6686](https://github.com/ever-co/ever-capture/commit/cbd66864a17e35714567debc3b13550e40d9db4f))



# [0.2.0](https://github.com/ever-co/ever-capture/compare/feature-0.1.1...feature-0.2.0) (2025-05-09)

### Dependency Updates

* `data-access` updated to version `0.1.4`
* `shared-components` updated to version `1.0.0`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.0.0`
* `audio-ui` updated to version `0.1.0`
* `convert-video-data-access` updated to version `0.2.1`
* `screenshot-data-access` updated to version `0.2.2`
* `upload-data-access` updated to version `1.0.0`
* `web-setting-data-access` updated to version `0.3.0`

### Features

* **audio-gallery:** add upload action for audio items ([fafa302](https://github.com/ever-co/ever-capture/commit/fafa30286d4e44333c56340b7cbbc52b7a6c63b0))



## [0.1.1](https://github.com/ever-co/ever-capture/compare/feature-0.1.0...feature-0.1.1) (2025-05-02)

### Dependency Updates

* `shared-components` updated to version `0.2.2`
* `utils` updated to version `0.2.1`
* `data-access` updated to version `0.1.1`
* `audio-ui` updated to version `0.1.0`


# 0.1.0 (2025-05-02)

### Dependency Updates

* `shared-components` updated to version `0.2.1`
* `shared-service` updated to version `0.2.0`
* `utils` updated to version `0.2.0`
* `data-access` updated to version `0.1.0`
* `audio-ui` updated to version `0.1.0`
* `convert-video-data-access` updated to version `0.2.0`
* `screenshot-data-access` updated to version `0.2.1`

### Bug Fixes

* **audio-player:** improve audio synchronization and state handling ([eb324a2](https://github.com/ever-co/ever-capture/commit/eb324a20dba613190ba2a809e2a989b8db15a70b))
* **audio-player:** pass explicit state to toggleMute action ([e6beccb](https://github.com/ever-co/ever-capture/commit/e6beccba52cfde96588bf5c088d885708af0c65f))
* **player-container:** use isSame value in toggle stream ([43ce5e0](https://github.com/ever-co/ever-capture/commit/43ce5e01dd4641053cea3f342c87a77ad787494a))


### Features

* **audio-gallery:** hide time log button during capture or generation ([b2cb0c5](https://github.com/ever-co/ever-capture/commit/b2cb0c5e27fdfe77a2dbfa223eb4d2fa48d93f49))
* **audio:** implement audio player feature ([d19c350](https://github.com/ever-co/ever-capture/commit/d19c350858c36272175744dbc99e63016de93bb3))
* **audio:** implement audio synchronization ([d29bc3c](https://github.com/ever-co/ever-capture/commit/d29bc3c9d57ce2c23fb4e330cefb101ddf886e3a))
* **audio:** manage current audio via ngrx state ([474f7fc](https://github.com/ever-co/ever-capture/commit/474f7fcaf4074dd5483d1161c6170bab0ceb03c5))
* **audio:** scaffold data-access, feature, and ui libraries ([cbd6686](https://github.com/ever-co/ever-capture/commit/cbd66864a17e35714567debc3b13550e40d9db4f))

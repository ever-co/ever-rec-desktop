# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [0.1.6](https://github.com/ever-co/ever-capture/compare/webcam-feature-0.1.5...webcam-feature-0.1.6) (2025-05-11)

### Dependency Updates

* `webcam-data-access` updated to version `1.1.4`
* `screenshot-data-access` updated to version `1.0.2`


## [0.1.5](https://github.com/ever-co/ever-capture/compare/webcam-feature-0.1.4...webcam-feature-0.1.5) (2025-05-11)

### Dependency Updates

* `notification-data-access` updated to version `1.0.1`
* `webcam-data-access` updated to version `1.1.3`
* `screenshot-data-access` updated to version `1.0.1`


## [0.1.4](https://github.com/ever-co/ever-capture/compare/webcam-feature-0.1.3...webcam-feature-0.1.4) (2025-05-11)

### Dependency Updates

* `notification-data-access` updated to version `1.0.0`
* `utils` updated to version `1.1.0`
* `webcam-data-access` updated to version `1.1.2`
* `screenshot-data-access` updated to version `1.0.0`
* `shared-components` updated to version `2.0.0`


# 0.1.0 (2025-05-09)


### Bug Fixes

* **photo-capture:** ensure capture ticks only during active tracking ([3a13f77](https://github.com/ever-co/ever-capture/commit/3a13f77567d0ca38ce2d88bbddcd1a84b81d3c8b))
* **ui:** limit height and enable scroll on detail views ([699bd6e](https://github.com/ever-co/ever-capture/commit/699bd6e8831bdeb4203389c7df96a2cd7f554334))
* **webcam-control:** add type="button" to camera button ([de93288](https://github.com/ever-co/ever-capture/commit/de9328885f991aa8e0dc809b215bb530dcdebb73))
* **webcam/audio:** coordinate audio stop with photo tracking ([b873ab2](https://github.com/ever-co/ever-capture/commit/b873ab29fbe13f7f8969dac3b6b3ba08dc69055f))
* **webcam:** correct webcam setting label and casing ([d5aed15](https://github.com/ever-co/ever-capture/commit/d5aed15325ffba24845bdd170501e95a738e74cc))
* **webcam:** prevent saving photo if camera unusable ([c71bf52](https://github.com/ever-co/ever-capture/commit/c71bf528ae1a4d8b34eb8f55cb1d69f1ea633ac3))
* **webcam:** refine audio gallery responsive layout ([76bb0bb](https://github.com/ever-co/ever-capture/commit/76bb0bb8aa39fb265c1a9d9033095452d9865c20))
* **webcam:** stop event propagation on capture button click ([aa91dad](https://github.com/ever-co/ever-capture/commit/aa91dad5365dae1279e5fefe6fead9c8d5ec871a))


### Features

* **audio-gallery:** add action popover to audio gallery items ([adfecb0](https://github.com/ever-co/ever-capture/commit/adfecb09a4cec12fe53f2464cedcb07cb5e01a24))
* **audio-gallery:** add popover for metadata on mobile ([9a73847](https://github.com/ever-co/ever-capture/commit/9a73847ce05df38420369eeb1d1cc4ede7f6e71b))
* **audio:** add channel/rate metadata and refactor worker ([e307cc1](https://github.com/ever-co/ever-capture/commit/e307cc1f38bc36f82edb80031557a679b6c115c6))
* **audio:** add metadata display component ([9d440fa](https://github.com/ever-co/ever-capture/commit/9d440fafb02cf51e81c41849aa9dc9951939bf3a))
* **audio:** add single audio deletion ([6955ae8](https://github.com/ever-co/ever-capture/commit/6955ae8b6bffff83ca99cf99a735e6df2bad51b3))
* **audio:** implement audio player feature ([d19c350](https://github.com/ever-co/ever-capture/commit/d19c350858c36272175744dbc99e63016de93bb3))
* **audio:** implement audio synchronization ([d29bc3c](https://github.com/ever-co/ever-capture/commit/d29bc3c9d57ce2c23fb4e330cefb101ddf886e3a))
* **audio:** manage current audio via ngrx state ([474f7fc](https://github.com/ever-co/ever-capture/commit/474f7fcaf4074dd5483d1161c6170bab0ceb03c5))
* **desktop:** implement periodic webcam photo capture ([fa2dbdb](https://github.com/ever-co/ever-capture/commit/fa2dbdb4139b326683260dca1c2fcac16596ab0f))
* implement navigation from audio metadata to video and timesheet ([f54dfd8](https://github.com/ever-co/ever-capture/commit/f54dfd831e6cef5b9ac1369a583d0d24f1a87aa1))
* **setting:** enable/disable dependent settings based on camera toggle ([7e69672](https://github.com/ever-co/ever-capture/commit/7e69672c5de8b4a4c041f64dcbbdc74bf648e56d))
* **settings:** add codec dropdown and initial webcam settings ([df644e6](https://github.com/ever-co/ever-capture/commit/df644e656b92a35dea2993c69c0dd862c4404405))
* **shared-service:** implement ngrx state hydration via indexeddb ([eda38f9](https://github.com/ever-co/ever-capture/commit/eda38f9137530a5871d6a1c7ef197544f4345294))
* **webcam/feature:** allow hiding preview controls ([32b1dd2](https://github.com/ever-co/ever-capture/commit/32b1dd28139c4acb4aa19eb0e9a92f827755b8aa))
* **webcam:** add audio gallery and management ([5fcb1af](https://github.com/ever-co/ever-capture/commit/5fcb1afcb7f1496dd620731423c7192a23ccea36))
* **webcam:** add button to open captured photo in new tab ([a90d68f](https://github.com/ever-co/ever-capture/commit/a90d68fc193c43859b133fd5773ed9444a2a261c))
* **webcam:** add camera preview option in settings component ([c617a15](https://github.com/ever-co/ever-capture/commit/c617a15fd64c4472865d1cf14d156cfc8ec7420a))
* **webcam:** add camera resolution selection ([2e5106b](https://github.com/ever-co/ever-capture/commit/2e5106ba7cfe289052be8a257a413be53af38f13))
* **webcam:** add initial webcam preview component ([9817895](https://github.com/ever-co/ever-capture/commit/98178958e08a4dfd7342a2e1e3b96c9f0a5a8083))
* **webcam:** add loading state to stop button ([cce1378](https://github.com/ever-co/ever-capture/commit/cce13784fc8ef6397c0de0cbffe71672bd0ec184))
* **webcam:** add mic status buttons to webcam component ([73e412f](https://github.com/ever-co/ever-capture/commit/73e412faa9aa27c727b8e2e644ae04d41d4af23e))
* **webcam:** add microphone selection capability ([b3fed6b](https://github.com/ever-co/ever-capture/commit/b3fed6b1bba89758d0b0a05e6b1d136f5daab01a))
* **webcam:** add microphone support and refactor constraints builder ([7ce432e](https://github.com/ever-co/ever-capture/commit/7ce432e70266f6488bd8854a7b128e881307b322))
* **webcam:** add new camera control component ([4bc1816](https://github.com/ever-co/ever-capture/commit/4bc1816c65e423569de59dbe2e98265825ce59ca))
* **webcam:** add photo gallery and detail view ([c810cca](https://github.com/ever-co/ever-capture/commit/c810cca3ddcb6d7daeedc8a7b658de700718d045))
* **webcam:** add responsive layout to audio gallery ([31cb668](https://github.com/ever-co/ever-capture/commit/31cb6684fc8cf0a0bb214b11511175e5fc3ab03a))
* **webcam:** add saving indicator to capture button ([3c6a677](https://github.com/ever-co/ever-capture/commit/3c6a677e5e94e9ffc52fa5db6d2f8559b573ba79))
* **webcam:** add screenshot capture functionality ([a7d8d1c](https://github.com/ever-co/ever-capture/commit/a7d8d1c1326247173f6fd8819c8aa3b69649f728))
* **webcam:** add stop tracking functionality ([9eeeab1](https://github.com/ever-co/ever-capture/commit/9eeeab1977df60de9bc3138204e23757562f5993))
* **webcam:** add webcam data-access and feature libraries ([8e5aa9d](https://github.com/ever-co/ever-capture/commit/8e5aa9d4db1bbcf5a5d236e266f7faa09eaadfdb))
* **webcam:** add webcam selection and state management ([f3adafe](https://github.com/ever-co/ever-capture/commit/f3adafed936cc59e7efc6224cdfbbaec33ab4e31))
* **webcam:** adjust video fit mode for preview ([857301d](https://github.com/ever-co/ever-capture/commit/857301d6627c9f340f35aaeb0159ff7166b43f11))
* **webcam:** enable photo capture via electron event ([54c30d7](https://github.com/ever-co/ever-capture/commit/54c30d7fad7a89c4b277b6d37c30ce799a83cded))
* **webcam:** enable selection for audio items in gallery ([1861dad](https://github.com/ever-co/ever-capture/commit/1861dadd03f022ff7be055c245d244ca34736ad4))
* **webcam:** implement audio recording capability ([993f19d](https://github.com/ever-co/ever-capture/commit/993f19d01e3da049aa3f8cc1f0649f788b0b316f))
* **webcam:** make webcam preview always-on-top and draggable ([eefddb7](https://github.com/ever-co/ever-capture/commit/eefddb73c0f198c802f8c16263fd52a48337a14b))
* **webcam:** update preview component to display and style camera preview ([ff43b0e](https://github.com/ever-co/ever-capture/commit/ff43b0e0b8053306e12ab65726240325b7c96f6f))
* **webcam:** update webcam route to incorporate new preview and control components ([c9caadf](https://github.com/ever-co/ever-capture/commit/c9caadfc27518caab219ce964173dfdb66f03d52))



## [0.1.3](https://github.com/ever-co/ever-capture/compare/webcam-feature-0.1.2...webcam-feature-0.1.3) (2025-05-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.6`
* `utils` updated to version `1.0.0`
* `webcam-data-access` updated to version `1.1.1`
* `screenshot-data-access` updated to version `0.2.2`
* `shared-components` updated to version `1.0.0`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/webcam-feature-0.1.1...webcam-feature-0.1.2) (2025-05-03)

### Dependency Updates

* `utils` updated to version `0.2.1`
* `webcam-data-access` updated to version `1.0.4`
* `shared-components` updated to version `0.2.2`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/webcam-feature-0.1.0...webcam-feature-0.1.1) (2025-05-02)

### Dependency Updates

* `webcam-data-access` updated to version `1.0.0`


# 0.1.0 (2025-05-02)

### Dependency Updates

* `notification-data-access` updated to version `0.1.5`
* `utils` updated to version `0.2.0`
* `webcam-data-access` updated to version `1.0.0`
* `screenshot-data-access` updated to version `0.2.1`
* `shared-components` updated to version `0.2.1`

### Bug Fixes

* **photo-capture:** ensure capture ticks only during active tracking ([3a13f77](https://github.com/ever-co/ever-capture/commit/3a13f77567d0ca38ce2d88bbddcd1a84b81d3c8b))
* **ui:** limit height and enable scroll on detail views ([699bd6e](https://github.com/ever-co/ever-capture/commit/699bd6e8831bdeb4203389c7df96a2cd7f554334))
* **webcam-control:** add type="button" to camera button ([de93288](https://github.com/ever-co/ever-capture/commit/de9328885f991aa8e0dc809b215bb530dcdebb73))
* **webcam/audio:** coordinate audio stop with photo tracking ([b873ab2](https://github.com/ever-co/ever-capture/commit/b873ab29fbe13f7f8969dac3b6b3ba08dc69055f))
* **webcam:** correct webcam setting label and casing ([d5aed15](https://github.com/ever-co/ever-capture/commit/d5aed15325ffba24845bdd170501e95a738e74cc))
* **webcam:** prevent saving photo if camera unusable ([c71bf52](https://github.com/ever-co/ever-capture/commit/c71bf528ae1a4d8b34eb8f55cb1d69f1ea633ac3))
* **webcam:** refine audio gallery responsive layout ([76bb0bb](https://github.com/ever-co/ever-capture/commit/76bb0bb8aa39fb265c1a9d9033095452d9865c20))
* **webcam:** stop event propagation on capture button click ([aa91dad](https://github.com/ever-co/ever-capture/commit/aa91dad5365dae1279e5fefe6fead9c8d5ec871a))


### Features

* **audio-gallery:** add action popover to audio gallery items ([adfecb0](https://github.com/ever-co/ever-capture/commit/adfecb09a4cec12fe53f2464cedcb07cb5e01a24))
* **audio-gallery:** add popover for metadata on mobile ([9a73847](https://github.com/ever-co/ever-capture/commit/9a73847ce05df38420369eeb1d1cc4ede7f6e71b))
* **audio:** add channel/rate metadata and refactor worker ([e307cc1](https://github.com/ever-co/ever-capture/commit/e307cc1f38bc36f82edb80031557a679b6c115c6))
* **audio:** add metadata display component ([9d440fa](https://github.com/ever-co/ever-capture/commit/9d440fafb02cf51e81c41849aa9dc9951939bf3a))
* **audio:** add single audio deletion ([6955ae8](https://github.com/ever-co/ever-capture/commit/6955ae8b6bffff83ca99cf99a735e6df2bad51b3))
* **audio:** implement audio player feature ([d19c350](https://github.com/ever-co/ever-capture/commit/d19c350858c36272175744dbc99e63016de93bb3))
* **audio:** implement audio synchronization ([d29bc3c](https://github.com/ever-co/ever-capture/commit/d29bc3c9d57ce2c23fb4e330cefb101ddf886e3a))
* **audio:** manage current audio via ngrx state ([474f7fc](https://github.com/ever-co/ever-capture/commit/474f7fcaf4074dd5483d1161c6170bab0ceb03c5))
* **desktop:** implement periodic webcam photo capture ([fa2dbdb](https://github.com/ever-co/ever-capture/commit/fa2dbdb4139b326683260dca1c2fcac16596ab0f))
* implement navigation from audio metadata to video and timesheet ([f54dfd8](https://github.com/ever-co/ever-capture/commit/f54dfd831e6cef5b9ac1369a583d0d24f1a87aa1))
* **setting:** enable/disable dependent settings based on camera toggle ([7e69672](https://github.com/ever-co/ever-capture/commit/7e69672c5de8b4a4c041f64dcbbdc74bf648e56d))
* **settings:** add codec dropdown and initial webcam settings ([df644e6](https://github.com/ever-co/ever-capture/commit/df644e656b92a35dea2993c69c0dd862c4404405))
* **shared-service:** implement ngrx state hydration via indexeddb ([eda38f9](https://github.com/ever-co/ever-capture/commit/eda38f9137530a5871d6a1c7ef197544f4345294))
* **webcam/feature:** allow hiding preview controls ([32b1dd2](https://github.com/ever-co/ever-capture/commit/32b1dd28139c4acb4aa19eb0e9a92f827755b8aa))
* **webcam:** add audio gallery and management ([5fcb1af](https://github.com/ever-co/ever-capture/commit/5fcb1afcb7f1496dd620731423c7192a23ccea36))
* **webcam:** add button to open captured photo in new tab ([a90d68f](https://github.com/ever-co/ever-capture/commit/a90d68fc193c43859b133fd5773ed9444a2a261c))
* **webcam:** add camera preview option in settings component ([c617a15](https://github.com/ever-co/ever-capture/commit/c617a15fd64c4472865d1cf14d156cfc8ec7420a))
* **webcam:** add camera resolution selection ([2e5106b](https://github.com/ever-co/ever-capture/commit/2e5106ba7cfe289052be8a257a413be53af38f13))
* **webcam:** add initial webcam preview component ([9817895](https://github.com/ever-co/ever-capture/commit/98178958e08a4dfd7342a2e1e3b96c9f0a5a8083))
* **webcam:** add loading state to stop button ([cce1378](https://github.com/ever-co/ever-capture/commit/cce13784fc8ef6397c0de0cbffe71672bd0ec184))
* **webcam:** add mic status buttons to webcam component ([73e412f](https://github.com/ever-co/ever-capture/commit/73e412faa9aa27c727b8e2e644ae04d41d4af23e))
* **webcam:** add microphone selection capability ([b3fed6b](https://github.com/ever-co/ever-capture/commit/b3fed6b1bba89758d0b0a05e6b1d136f5daab01a))
* **webcam:** add microphone support and refactor constraints builder ([7ce432e](https://github.com/ever-co/ever-capture/commit/7ce432e70266f6488bd8854a7b128e881307b322))
* **webcam:** add new camera control component ([4bc1816](https://github.com/ever-co/ever-capture/commit/4bc1816c65e423569de59dbe2e98265825ce59ca))
* **webcam:** add photo gallery and detail view ([c810cca](https://github.com/ever-co/ever-capture/commit/c810cca3ddcb6d7daeedc8a7b658de700718d045))
* **webcam:** add responsive layout to audio gallery ([31cb668](https://github.com/ever-co/ever-capture/commit/31cb6684fc8cf0a0bb214b11511175e5fc3ab03a))
* **webcam:** add saving indicator to capture button ([3c6a677](https://github.com/ever-co/ever-capture/commit/3c6a677e5e94e9ffc52fa5db6d2f8559b573ba79))
* **webcam:** add screenshot capture functionality ([a7d8d1c](https://github.com/ever-co/ever-capture/commit/a7d8d1c1326247173f6fd8819c8aa3b69649f728))
* **webcam:** add stop tracking functionality ([9eeeab1](https://github.com/ever-co/ever-capture/commit/9eeeab1977df60de9bc3138204e23757562f5993))
* **webcam:** add webcam data-access and feature libraries ([8e5aa9d](https://github.com/ever-co/ever-capture/commit/8e5aa9d4db1bbcf5a5d236e266f7faa09eaadfdb))
* **webcam:** add webcam selection and state management ([f3adafe](https://github.com/ever-co/ever-capture/commit/f3adafed936cc59e7efc6224cdfbbaec33ab4e31))
* **webcam:** adjust video fit mode for preview ([857301d](https://github.com/ever-co/ever-capture/commit/857301d6627c9f340f35aaeb0159ff7166b43f11))
* **webcam:** enable photo capture via electron event ([54c30d7](https://github.com/ever-co/ever-capture/commit/54c30d7fad7a89c4b277b6d37c30ce799a83cded))
* **webcam:** enable selection for audio items in gallery ([1861dad](https://github.com/ever-co/ever-capture/commit/1861dadd03f022ff7be055c245d244ca34736ad4))
* **webcam:** implement audio recording capability ([993f19d](https://github.com/ever-co/ever-capture/commit/993f19d01e3da049aa3f8cc1f0649f788b0b316f))
* **webcam:** make webcam preview always-on-top and draggable ([eefddb7](https://github.com/ever-co/ever-capture/commit/eefddb73c0f198c802f8c16263fd52a48337a14b))
* **webcam:** update preview component to display and style camera preview ([ff43b0e](https://github.com/ever-co/ever-capture/commit/ff43b0e0b8053306e12ab65726240325b7c96f6f))
* **webcam:** update webcam route to incorporate new preview and control components ([c9caadf](https://github.com/ever-co/ever-capture/commit/c9caadfc27518caab219ce964173dfdb66f03d52))

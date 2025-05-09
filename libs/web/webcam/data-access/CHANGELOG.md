# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

# 0.1.0 (2025-05-09)


### Bug Fixes

* **audio-recorder:** correct import path for AudioWorkerService and remove obsolete audio-woker.service.ts file ([cb9495e](https://github.com/ever-co/ever-capture/commit/cb9495edf1256ad40485510b68b01b53a2cb94ee))
* **photo-capture:** ensure capture ticks only during active tracking ([3a13f77](https://github.com/ever-co/ever-capture/commit/3a13f77567d0ca38ce2d88bbddcd1a84b81d3c8b))
* **stream:** correct stream window closing and resolutions ([81bea96](https://github.com/ever-co/ever-capture/commit/81bea960ae34aa62a3edcbc973e74f7e59a328fe))
* **webcam-audio:** set saving state on successful recording stop ([e54eb91](https://github.com/ever-co/ever-capture/commit/e54eb919620d053067cbf403d2e991b01d98c796))
* **webcam/audio:** coordinate audio stop with photo tracking ([b873ab2](https://github.com/ever-co/ever-capture/commit/b873ab29fbe13f7f8969dac3b6b3ba08dc69055f))
* **webcam:** correct webcam state initialization logic ([6d0d67d](https://github.com/ever-co/ever-capture/commit/6d0d67d197660eaa9ad7bb3761a3cb91a06a366d))
* **webcam:** enable autoGainControl by default for audio ([d7e550a](https://github.com/ever-co/ever-capture/commit/d7e550a77cb3d909e02e17f7dbc341e63f1be96f))


### Code Refactoring

* **webcam-data-access:** export WebcamService instead of MediaStreamService ([dcb8119](https://github.com/ever-co/ever-capture/commit/dcb81190cf0a1a66175b808ac3198902f24706b4))


### Features

* **app:** integrate REC_ENV for environment configuration ([306d2e2](https://github.com/ever-co/ever-capture/commit/306d2e2f77f2c02f3409d73f67dddc21b2fe412f))
* **audio:** add channel/rate metadata and refactor worker ([e307cc1](https://github.com/ever-co/ever-capture/commit/e307cc1f38bc36f82edb80031557a679b6c115c6))
* **audio:** add single audio deletion ([6955ae8](https://github.com/ever-co/ever-capture/commit/6955ae8b6bffff83ca99cf99a735e6df2bad51b3))
* **audio:** capture and store audio duration, channels, and rate ([19e6f9e](https://github.com/ever-co/ever-capture/commit/19e6f9e438859a62a71fe24fefb583f70b0c0cb9))
* **audio:** link audio entities to corresponding video ([978bc3f](https://github.com/ever-co/ever-capture/commit/978bc3fedbdff61eed683bdc8b8f51b2b64b5292))
* **photo:** add photo capture and management functionality ([f674686](https://github.com/ever-co/ever-capture/commit/f6746866d756bd6f64d04fe317d6ddb48636e958))
* **settings:** add audio storage tracking and deletion ([1ceedbd](https://github.com/ever-co/ever-capture/commit/1ceedbd575b5f49da1ea85cb39b8e48d7acc6036))
* **settings:** add granular delete and purge options for storage ([418df6d](https://github.com/ever-co/ever-capture/commit/418df6def7f107320da86110a385d46f0377f5f8))
* **tracking:** implement auto-start tracking based on persisted state ([02bdb33](https://github.com/ever-co/ever-capture/commit/02bdb33ac9bee83b2dc5379b2719e3c28fe561ee))
* **webcam(state):** add ngrx state management for camera ([e3b04c8](https://github.com/ever-co/ever-capture/commit/e3b04c84cbc8b5b7559c3f637a533517625a50ca))
* **webcam/audio:** process audio after video generation finishes ([6df33b4](https://github.com/ever-co/ever-capture/commit/6df33b41013c05818673badc671f8b0cf978d9ec))
* **webcam/data-access:** add explicit audio recording start/stop actions ([00a4d41](https://github.com/ever-co/ever-capture/commit/00a4d41816d086e92fb9ceeef9413dc5773e05b7))
* **webcam/data-access:** add loading/error state for camera authorization ([c4c4ef4](https://github.com/ever-co/ever-capture/commit/c4c4ef44bcc4479368442127b96c1795897efd25))
* **webcam:** add audio gallery and management ([5fcb1af](https://github.com/ever-co/ever-capture/commit/5fcb1afcb7f1496dd620731423c7192a23ccea36))
* **webcam:** add audio recording functionality ([db2d995](https://github.com/ever-co/ever-capture/commit/db2d9952935d676db525c08e8881a9bf612e3787))
* **webcam:** add camera resolution selection ([2e5106b](https://github.com/ever-co/ever-capture/commit/2e5106ba7cfe289052be8a257a413be53af38f13))
* **webcam:** add MediaStreamService and export it in data-access index ([02a270e](https://github.com/ever-co/ever-capture/commit/02a270e587c6871e6ba8439417bb469afbff25a7))
* **webcam:** add microphone selection capability ([b3fed6b](https://github.com/ever-co/ever-capture/commit/b3fed6b1bba89758d0b0a05e6b1d136f5daab01a))
* **webcam:** add microphone support and refactor constraints builder ([7ce432e](https://github.com/ever-co/ever-capture/commit/7ce432e70266f6488bd8854a7b128e881307b322))
* **webcam:** add photo actions and integrate MediaStreamService in effects ([94e0abc](https://github.com/ever-co/ever-capture/commit/94e0abc1a93b8b4e5976c7f0165256e42be04aa8))
* **webcam:** add photo gallery and detail view ([c810cca](https://github.com/ever-co/ever-capture/commit/c810cca3ddcb6d7daeedc8a7b658de700718d045))
* **webcam:** add saving indicator to capture button ([3c6a677](https://github.com/ever-co/ever-capture/commit/3c6a677e5e94e9ffc52fa5db6d2f8559b573ba79))
* **webcam:** add screenshot capture functionality ([a7d8d1c](https://github.com/ever-co/ever-capture/commit/a7d8d1c1326247173f6fd8819c8aa3b69649f728))
* **webcam:** add stop tracking functionality ([9eeeab1](https://github.com/ever-co/ever-capture/commit/9eeeab1977df60de9bc3138204e23757562f5993))
* **webcam:** add webcam data-access and feature libraries ([8e5aa9d](https://github.com/ever-co/ever-capture/commit/8e5aa9d4db1bbcf5a5d236e266f7faa09eaadfdb))
* **webcam:** add webcam selection and state management ([f3adafe](https://github.com/ever-co/ever-capture/commit/f3adafed936cc59e7efc6224cdfbbaec33ab4e31))
* **webcam:** enable camera and microphone by default in stream constraints ([423d717](https://github.com/ever-co/ever-capture/commit/423d7177bd5a0248d0c0196a499b9da4aecb113d))
* **webcam:** enable camera usage by default ([5b36a15](https://github.com/ever-co/ever-capture/commit/5b36a15f101b64b4c93bfa027c21f4bea2fd99f1))
* **webcam:** enable photo capture via electron event ([54c30d7](https://github.com/ever-co/ever-capture/commit/54c30d7fad7a89c4b277b6d37c30ce799a83cded))
* **webcam:** implement audio recording capability ([993f19d](https://github.com/ever-co/ever-capture/commit/993f19d01e3da049aa3f8cc1f0649f788b0b316f))
* **webcam:** trigger webcam load on authorization success ([f9b63cf](https://github.com/ever-co/ever-capture/commit/f9b63cf6cc09d9499ee148bc32b23cd3f53112e0))


### Performance Improvements

* **webcam:** offload audio blob processing to web worker ([89a8f7d](https://github.com/ever-co/ever-capture/commit/89a8f7d3da17b89e54fa23d7f6e6afc1036ddaa0))


### Reverts

* Revert "build(webcam/data-access): configure build to include worker assets" ([8052c79](https://github.com/ever-co/ever-capture/commit/8052c79b0889863b220a3cc89b9018b3c5aad8bb))


### BREAKING CHANGES

* **webcam-data-access:** The previously exported `MediaStreamService` has been renamed to `WebcamService`. Consumers importing this service directly via the barrel file must update their imports.



## [1.1.1](https://github.com/ever-co/ever-capture/compare/webcam-data-access-1.1.0...webcam-data-access-1.1.1) (2025-05-09)

### Dependency Updates

* `utils` updated to version `1.0.0`
* `shared-service` updated to version `0.3.1`
* `data-access-electron` updated to version `0.2.2`
* `convert-video-data-access` updated to version `0.2.1`


# [1.1.0](https://github.com/ever-co/ever-capture/compare/webcam-data-access-1.0.7...webcam-data-access-1.1.0) (2025-05-05)

### Dependency Updates

* `utils` updated to version `0.3.0`
* `shared-service` updated to version `0.3.0`

### Features

* **app:** integrate REC_ENV for environment configuration ([306d2e2](https://github.com/ever-co/ever-capture/commit/306d2e2f77f2c02f3409d73f67dddc21b2fe412f))



## [1.0.7](https://github.com/ever-co/ever-capture/compare/webcam-data-access-1.0.6...webcam-data-access-1.0.7) (2025-05-05)


### Bug Fixes

* **audio-recorder:** correct import path for AudioWorkerService and remove obsolete audio-woker.service.ts file ([cb9495e](https://github.com/ever-co/ever-capture/commit/cb9495edf1256ad40485510b68b01b53a2cb94ee))



## [1.0.6](https://github.com/ever-co/ever-capture/compare/webcam-data-access-1.0.5...webcam-data-access-1.0.6) (2025-05-03)


### Reverts

* Revert "build(webcam/data-access): configure build to include worker assets" ([8052c79](https://github.com/ever-co/ever-capture/commit/8052c79b0889863b220a3cc89b9018b3c5aad8bb))



## [1.0.5](https://github.com/ever-co/ever-capture/compare/webcam-data-access-1.0.4...webcam-data-access-1.0.5) (2025-05-03)



## [1.0.4](https://github.com/ever-co/ever-capture/compare/webcam-data-access-1.0.3...webcam-data-access-1.0.4) (2025-05-03)



## [1.0.3](https://github.com/ever-co/ever-capture/compare/webcam-data-access-1.0.2...webcam-data-access-1.0.3) (2025-05-02)



## [1.0.2](https://github.com/ever-co/ever-capture/compare/webcam-data-access-1.0.1...webcam-data-access-1.0.2) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.1`


## [1.0.2](https://github.com/ever-co/ever-capture/compare/webcam-data-access-1.0.1...webcam-data-access-1.0.2) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.1`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/webcam-data-access-1.0.0...webcam-data-access-1.0.1) (2025-05-02)



# 1.0.0 (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `data-access-electron` updated to version `0.2.1`
* `convert-video-data-access` updated to version `0.2.0`
* `shared-service` updated to version `0.2.0`

### Bug Fixes

* **photo-capture:** ensure capture ticks only during active tracking ([3a13f77](https://github.com/ever-co/ever-capture/commit/3a13f77567d0ca38ce2d88bbddcd1a84b81d3c8b))
* **stream:** correct stream window closing and resolutions ([81bea96](https://github.com/ever-co/ever-capture/commit/81bea960ae34aa62a3edcbc973e74f7e59a328fe))
* **webcam-audio:** set saving state on successful recording stop ([e54eb91](https://github.com/ever-co/ever-capture/commit/e54eb919620d053067cbf403d2e991b01d98c796))
* **webcam/audio:** coordinate audio stop with photo tracking ([b873ab2](https://github.com/ever-co/ever-capture/commit/b873ab29fbe13f7f8969dac3b6b3ba08dc69055f))
* **webcam:** correct webcam state initialization logic ([6d0d67d](https://github.com/ever-co/ever-capture/commit/6d0d67d197660eaa9ad7bb3761a3cb91a06a366d))
* **webcam:** enable autoGainControl by default for audio ([d7e550a](https://github.com/ever-co/ever-capture/commit/d7e550a77cb3d909e02e17f7dbc341e63f1be96f))


### Code Refactoring

* **webcam-data-access:** export WebcamService instead of MediaStreamService ([dcb8119](https://github.com/ever-co/ever-capture/commit/dcb81190cf0a1a66175b808ac3198902f24706b4))


### Features

* **audio:** add channel/rate metadata and refactor worker ([e307cc1](https://github.com/ever-co/ever-capture/commit/e307cc1f38bc36f82edb80031557a679b6c115c6))
* **audio:** add single audio deletion ([6955ae8](https://github.com/ever-co/ever-capture/commit/6955ae8b6bffff83ca99cf99a735e6df2bad51b3))
* **audio:** capture and store audio duration, channels, and rate ([19e6f9e](https://github.com/ever-co/ever-capture/commit/19e6f9e438859a62a71fe24fefb583f70b0c0cb9))
* **audio:** link audio entities to corresponding video ([978bc3f](https://github.com/ever-co/ever-capture/commit/978bc3fedbdff61eed683bdc8b8f51b2b64b5292))
* **photo:** add photo capture and management functionality ([f674686](https://github.com/ever-co/ever-capture/commit/f6746866d756bd6f64d04fe317d6ddb48636e958))
* **settings:** add audio storage tracking and deletion ([1ceedbd](https://github.com/ever-co/ever-capture/commit/1ceedbd575b5f49da1ea85cb39b8e48d7acc6036))
* **settings:** add granular delete and purge options for storage ([418df6d](https://github.com/ever-co/ever-capture/commit/418df6def7f107320da86110a385d46f0377f5f8))
* **tracking:** implement auto-start tracking based on persisted state ([02bdb33](https://github.com/ever-co/ever-capture/commit/02bdb33ac9bee83b2dc5379b2719e3c28fe561ee))
* **webcam(state):** add ngrx state management for camera ([e3b04c8](https://github.com/ever-co/ever-capture/commit/e3b04c84cbc8b5b7559c3f637a533517625a50ca))
* **webcam/audio:** process audio after video generation finishes ([6df33b4](https://github.com/ever-co/ever-capture/commit/6df33b41013c05818673badc671f8b0cf978d9ec))
* **webcam/data-access:** add explicit audio recording start/stop actions ([00a4d41](https://github.com/ever-co/ever-capture/commit/00a4d41816d086e92fb9ceeef9413dc5773e05b7))
* **webcam/data-access:** add loading/error state for camera authorization ([c4c4ef4](https://github.com/ever-co/ever-capture/commit/c4c4ef44bcc4479368442127b96c1795897efd25))
* **webcam:** add audio gallery and management ([5fcb1af](https://github.com/ever-co/ever-capture/commit/5fcb1afcb7f1496dd620731423c7192a23ccea36))
* **webcam:** add audio recording functionality ([db2d995](https://github.com/ever-co/ever-capture/commit/db2d9952935d676db525c08e8881a9bf612e3787))
* **webcam:** add camera resolution selection ([2e5106b](https://github.com/ever-co/ever-capture/commit/2e5106ba7cfe289052be8a257a413be53af38f13))
* **webcam:** add MediaStreamService and export it in data-access index ([02a270e](https://github.com/ever-co/ever-capture/commit/02a270e587c6871e6ba8439417bb469afbff25a7))
* **webcam:** add microphone selection capability ([b3fed6b](https://github.com/ever-co/ever-capture/commit/b3fed6b1bba89758d0b0a05e6b1d136f5daab01a))
* **webcam:** add microphone support and refactor constraints builder ([7ce432e](https://github.com/ever-co/ever-capture/commit/7ce432e70266f6488bd8854a7b128e881307b322))
* **webcam:** add photo actions and integrate MediaStreamService in effects ([94e0abc](https://github.com/ever-co/ever-capture/commit/94e0abc1a93b8b4e5976c7f0165256e42be04aa8))
* **webcam:** add photo gallery and detail view ([c810cca](https://github.com/ever-co/ever-capture/commit/c810cca3ddcb6d7daeedc8a7b658de700718d045))
* **webcam:** add saving indicator to capture button ([3c6a677](https://github.com/ever-co/ever-capture/commit/3c6a677e5e94e9ffc52fa5db6d2f8559b573ba79))
* **webcam:** add screenshot capture functionality ([a7d8d1c](https://github.com/ever-co/ever-capture/commit/a7d8d1c1326247173f6fd8819c8aa3b69649f728))
* **webcam:** add stop tracking functionality ([9eeeab1](https://github.com/ever-co/ever-capture/commit/9eeeab1977df60de9bc3138204e23757562f5993))
* **webcam:** add webcam data-access and feature libraries ([8e5aa9d](https://github.com/ever-co/ever-capture/commit/8e5aa9d4db1bbcf5a5d236e266f7faa09eaadfdb))
* **webcam:** add webcam selection and state management ([f3adafe](https://github.com/ever-co/ever-capture/commit/f3adafed936cc59e7efc6224cdfbbaec33ab4e31))
* **webcam:** enable camera and microphone by default in stream constraints ([423d717](https://github.com/ever-co/ever-capture/commit/423d7177bd5a0248d0c0196a499b9da4aecb113d))
* **webcam:** enable camera usage by default ([5b36a15](https://github.com/ever-co/ever-capture/commit/5b36a15f101b64b4c93bfa027c21f4bea2fd99f1))
* **webcam:** enable photo capture via electron event ([54c30d7](https://github.com/ever-co/ever-capture/commit/54c30d7fad7a89c4b277b6d37c30ce799a83cded))
* **webcam:** implement audio recording capability ([993f19d](https://github.com/ever-co/ever-capture/commit/993f19d01e3da049aa3f8cc1f0649f788b0b316f))
* **webcam:** trigger webcam load on authorization success ([f9b63cf](https://github.com/ever-co/ever-capture/commit/f9b63cf6cc09d9499ee148bc32b23cd3f53112e0))


### Performance Improvements

* **webcam:** offload audio blob processing to web worker ([89a8f7d](https://github.com/ever-co/ever-capture/commit/89a8f7d3da17b89e54fa23d7f6e6afc1036ddaa0))


### BREAKING CHANGES

* **webcam-data-access:** The previously exported `MediaStreamService` has been renamed to `WebcamService`. Consumers importing this service directly via the barrel file must update their imports.

# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [2.0.5](https://github.com/ever-co/ever-capture/compare/upload-data-access-2.0.4...upload-data-access-2.0.5) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `generate-video-data-access` updated to version `1.0.5`
* `data-access-electron` updated to version `1.0.1`


## [2.0.4](https://github.com/ever-co/ever-capture/compare/upload-data-access-2.0.3...upload-data-access-2.0.4) (2025-05-11)

### Dependency Updates

* `web-setting-data-access` updated to version `1.0.5`


## [2.0.3](https://github.com/ever-co/ever-capture/compare/upload-data-access-2.0.2...upload-data-access-2.0.3) (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.4`
* `notification-data-access` updated to version `1.0.2`
* `web-setting-data-access` updated to version `1.0.4`


## [2.0.2](https://github.com/ever-co/ever-capture/compare/upload-data-access-2.0.1...upload-data-access-2.0.2) (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.3`
* `notification-data-access` updated to version `1.0.1`
* `web-setting-data-access` updated to version `1.0.3`


## [2.0.2](https://github.com/ever-co/ever-capture/compare/upload-data-access-2.0.1...upload-data-access-2.0.2) (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.2`
* `web-setting-data-access` updated to version `1.0.2`


## [2.0.1](https://github.com/ever-co/ever-capture/compare/upload-data-access-2.0.0...upload-data-access-2.0.1) (2025-05-11)

### Dependency Updates

* `generate-video-data-access` updated to version `1.0.1`
* `notification-data-access` updated to version `1.0.1`
* `web-setting-data-access` updated to version `1.0.1`
* `data-access-electron` updated to version `1.0.0`


# [2.0.0](https://github.com/ever-co/ever-capture/compare/upload-data-access-1.0.0...upload-data-access-2.0.0) (2025-05-11)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `generate-video-data-access` updated to version `1.0.0`
* `notification-data-access` updated to version `1.0.0`
* `web-setting-data-access` updated to version `1.0.0`
* `data-access-electron` updated to version `0.2.2`

### chore

* **upload-data-access:** update peer dependencies and upgrade Angular to v19 ([743b320](https://github.com/ever-co/ever-capture/commit/743b3202214822a6fd4d99b8ebd3c85203c5f1a8))


### BREAKING CHANGES

* **upload-data-access:** Removes several peer dependencies. Consumers must now
explicitly manage these if they were relying on this library to declare
them.
Removed dependencies:
- @ever-co/shared-utils
- @ngrx/store
- @ever-co/convert-video-data-access
- @ever-co/notification-data-access
- @ngrx/effects
- rxjs
- @ever-co/electron-data-access
- @ever-co/web-setting-data-access



# 0.1.0 (2025-05-09)


### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* remove console.log(...) ([de5d503](https://github.com/ever-co/ever-capture/commit/de5d503b41b308357e70d7e9a1470ed9ce3dcaf1))
* timeline generation for single videos ([508d8a2](https://github.com/ever-co/ever-capture/commit/508d8a22d270749b8bd150c24426335e33c01433))
* updates upload done notification message ([d9f6bc3](https://github.com/ever-co/ever-capture/commit/d9f6bc30ebc45bc5707433d27956d225d7c9109f))
* upload button visibility for single/timeline videos ([0f85986](https://github.com/ever-co/ever-capture/commit/0f8598684bd5f4b731145fc0234dc8c4e7f9a50c))
* upload config key for videos ([2346b8e](https://github.com/ever-co/ever-capture/commit/2346b8e60adcac611be92bf3ab8359a869fa881c))
* **upload:** clone queued items and improve queue UI ([ee285b3](https://github.com/ever-co/ever-capture/commit/ee285b31f7e3fc8dc53a89da9946ea40a634191a))
* **upload:** correct upload action visibility and progress status ([cee4d0c](https://github.com/ever-co/ever-capture/commit/cee4d0cf1b2267714e50702bc00d9936ae151cce))


### Features

* improve video upload setting ([4d71737](https://github.com/ever-co/ever-capture/commit/4d71737ef629795aabf9ef4bc08dce24e4a15808))
* logs the result of the upload process ([3df8820](https://github.com/ever-co/ever-capture/commit/3df8820ba4f8c4be3ee733349b62f5d02a7a1fd2))
* **upload.effects:** handle startItemUploadSuccess action ([5fc63f5](https://github.com/ever-co/ever-capture/commit/5fc63f52b56f722f14a809fff2323c21e5f2f48a))
* **upload:** add batch queue actions and enhance stability ([0a197f5](https://github.com/ever-co/ever-capture/commit/0a197f5805cd4c2e800cff5189ac67b148312e0e))
* **upload:** add photo upload capability and generalize upload service ([71aac04](https://github.com/ever-co/ever-capture/commit/71aac047b27863408c8062f6ce421d955f16132c))
* **upload:** enhance display of failed upload items ([74c4d55](https://github.com/ever-co/ever-capture/commit/74c4d55691e0ee83ccf5bdcda45c1e5d33e2f327))
* **upload:** handle 'uploadAllFromQueue' action ([564a629](https://github.com/ever-co/ever-capture/commit/564a629676afd4d7f326007b2d4994f59bef857e))
* **upload:** honor auto-sync setting for automatic uploads ([178c515](https://github.com/ever-co/ever-capture/commit/178c51544838a508080b404b7f9f12821b2d8e90))
* **upload:** implement deep cloning for UploadItem ([87d995d](https://github.com/ever-co/ever-capture/commit/87d995d708d5a7a179c839974c3e08925682f0a7))
* **upload:** implement item-based upload queue with UI and parallel processing ([a4e3df3](https://github.com/ever-co/ever-capture/commit/a4e3df3751db121359f024d9d78fd1d97a89af54))


### BREAKING CHANGES

* **upload:** The Ngrx store for uploads has been completely refactored:
- `uploadFeatureKey` changed from 'upload' to 'uploadQueue'.
- The state structure is now item-based (managing lists for `queue`,
`inProgress`, `completed`, `failed`, `canceled`, `activeUploads`)
replacing the previous global upload status.
- Actions like `uploadActions.uploadVideos` are replaced by
`uploadActions.addItemToQueue({ item: new UploadVideoItem(video) })`
or `uploadActions.addItemToQueue({ items: [...] })`.
- Selectors like `selectUploadState.uploading` are deprecated. Use new
selectors such as `selectUploadInProgress` (boolean),
`selectInProgress` (list of items), `selectCanUploadMore`, etc.
The global `UploadProgressComponent` snackbar previously managed by
`LayoutComponent` has been removed. Upload status is now primarily
managed through the new `UploadBadgeComponent` and `UploadQueueComponent`.
The `UploadProgressComponent` itself has been repurposed to display
progress for a single `IUploadItem` (passed as an `@Input()`) and is
used within the `UploadQueueComponent`.
The `UploaderService.cancel()` method now requires an `itemId` parameter.
The data payload for IPC events `Channel.UPLOAD_PROGRESS`,
`Channel.UPLOAD_DONE`, and `Channel.UPLOAD_ERROR` has changed. They
now emit objects containing an `itemId` and conform to the new
`IUploadProgress`, `IUploadDone`, and `IUploadError` interfaces
respectively.



# [1.0.0](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.1.5...upload-data-access-1.0.0) (2025-05-09)

### Dependency Updates

* `utils` updated to version `1.0.0`
* `convert-video-data-access` updated to version `0.2.1`
* `notification-data-access` updated to version `0.1.6`
* `data-access-electron` updated to version `0.2.2`
* `web-setting-data-access` updated to version `0.3.0`

### Bug Fixes

* **upload:** clone queued items and improve queue UI ([ee285b3](https://github.com/ever-co/ever-capture/commit/ee285b31f7e3fc8dc53a89da9946ea40a634191a))
* **upload:** correct upload action visibility and progress status ([cee4d0c](https://github.com/ever-co/ever-capture/commit/cee4d0cf1b2267714e50702bc00d9936ae151cce))


### Features

* **upload.effects:** handle startItemUploadSuccess action ([5fc63f5](https://github.com/ever-co/ever-capture/commit/5fc63f52b56f722f14a809fff2323c21e5f2f48a))
* **upload:** add batch queue actions and enhance stability ([0a197f5](https://github.com/ever-co/ever-capture/commit/0a197f5805cd4c2e800cff5189ac67b148312e0e))
* **upload:** add photo upload capability and generalize upload service ([71aac04](https://github.com/ever-co/ever-capture/commit/71aac047b27863408c8062f6ce421d955f16132c))
* **upload:** enhance display of failed upload items ([74c4d55](https://github.com/ever-co/ever-capture/commit/74c4d55691e0ee83ccf5bdcda45c1e5d33e2f327))
* **upload:** handle 'uploadAllFromQueue' action ([564a629](https://github.com/ever-co/ever-capture/commit/564a629676afd4d7f326007b2d4994f59bef857e))
* **upload:** honor auto-sync setting for automatic uploads ([178c515](https://github.com/ever-co/ever-capture/commit/178c51544838a508080b404b7f9f12821b2d8e90))
* **upload:** implement deep cloning for UploadItem ([87d995d](https://github.com/ever-co/ever-capture/commit/87d995d708d5a7a179c839974c3e08925682f0a7))
* **upload:** implement item-based upload queue with UI and parallel processing ([a4e3df3](https://github.com/ever-co/ever-capture/commit/a4e3df3751db121359f024d9d78fd1d97a89af54))


### BREAKING CHANGES

* **upload:** The Ngrx store for uploads has been completely refactored:
- `uploadFeatureKey` changed from 'upload' to 'uploadQueue'.
- The state structure is now item-based (managing lists for `queue`,
`inProgress`, `completed`, `failed`, `canceled`, `activeUploads`)
replacing the previous global upload status.
- Actions like `uploadActions.uploadVideos` are replaced by
`uploadActions.addItemToQueue({ item: new UploadVideoItem(video) })`
or `uploadActions.addItemToQueue({ items: [...] })`.
- Selectors like `selectUploadState.uploading` are deprecated. Use new
selectors such as `selectUploadInProgress` (boolean),
`selectInProgress` (list of items), `selectCanUploadMore`, etc.
The global `UploadProgressComponent` snackbar previously managed by
`LayoutComponent` has been removed. Upload status is now primarily
managed through the new `UploadBadgeComponent` and `UploadQueueComponent`.
The `UploadProgressComponent` itself has been repurposed to display
progress for a single `IUploadItem` (passed as an `@Input()`) and is
used within the `UploadQueueComponent`.
The `UploaderService.cancel()` method now requires an `itemId` parameter.
The data payload for IPC events `Channel.UPLOAD_PROGRESS`,
`Channel.UPLOAD_DONE`, and `Channel.UPLOAD_ERROR` has changed. They
now emit objects containing an `itemId` and conform to the new
`IUploadProgress`, `IUploadDone`, and `IUploadError` interfaces
respectively.



## [0.1.5](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.1.4...upload-data-access-0.1.5) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.1`
* `web-setting-data-access` updated to version `0.2.2`


## [0.1.4](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.1.3...upload-data-access-0.1.4) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `convert-video-data-access` updated to version `0.2.0`
* `notification-data-access` updated to version `0.1.5`
* `data-access-electron` updated to version `0.2.1`
* `web-setting-data-access` updated to version `0.2.1`


## [0.1.4](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.1.3...upload-data-access-0.1.4) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `convert-video-data-access` updated to version `0.1.2`
* `notification-data-access` updated to version `0.1.4`
* `data-access-electron` updated to version `0.2.0`
* `web-setting-data-access` updated to version `0.1.3`


## [0.1.3](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.1.2...upload-data-access-0.1.3) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `convert-video-data-access` updated to version `0.1.2`
* `notification-data-access` updated to version `0.1.2`
* `data-access-electron` updated to version `0.1.2`
* `web-setting-data-access` updated to version `0.1.3`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.1.1...upload-data-access-0.1.2) (2025-02-12)

### Dependency Updates

* `web-setting-data-access` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.1.0...upload-data-access-0.1.1) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.1`
* `convert-video-data-access` updated to version `0.1.1`
* `notification-data-access` updated to version `0.1.1`
* `data-access-electron` updated to version `0.1.1`
* `web-setting-data-access` updated to version `0.1.1`


# 0.1.0 (2025-01-10)

### Dependency Updates

* `utils` updated to version `0.1.0`
* `convert-video-data-access` updated to version `0.1.0`
* `notification-data-access` updated to version `0.1.0`
* `data-access-electron` updated to version `0.1.0`
* `web-setting-data-access` updated to version `0.1.0`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* remove console.log(...) ([de5d503](https://github.com/ever-co/ever-capture/commit/de5d503b41b308357e70d7e9a1470ed9ce3dcaf1))
* timeline generation for single videos ([508d8a2](https://github.com/ever-co/ever-capture/commit/508d8a22d270749b8bd150c24426335e33c01433))
* updates upload done notification message ([d9f6bc3](https://github.com/ever-co/ever-capture/commit/d9f6bc30ebc45bc5707433d27956d225d7c9109f))
* upload button visibility for single/timeline videos ([0f85986](https://github.com/ever-co/ever-capture/commit/0f8598684bd5f4b731145fc0234dc8c4e7f9a50c))
* upload config key for videos ([2346b8e](https://github.com/ever-co/ever-capture/commit/2346b8e60adcac611be92bf3ab8359a869fa881c))


### Features

* improve video upload setting ([4d71737](https://github.com/ever-co/ever-capture/commit/4d71737ef629795aabf9ef4bc08dce24e4a15808))
* logs the result of the upload process ([3df8820](https://github.com/ever-co/ever-capture/commit/3df8820ba4f8c4be3ee733349b62f5d02a7a1fd2))



## [0.2.6](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.2.5...upload-data-access-0.2.6) (2025-01-10)


### Bug Fixes

* upload button visibility for single/timeline videos ([0f85986](https://github.com/ever-co/ever-capture/commit/0f8598684bd5f4b731145fc0234dc8c4e7f9a50c))



## [0.2.5](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.2.4...upload-data-access-0.2.5) (2025-01-09)

### Dependency Updates

* `web-setting-data-access` updated to version `0.1.7`


## [0.2.4](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.2.3...upload-data-access-0.2.4) (2025-01-09)

### Dependency Updates

* `convert-video-data-access` updated to version `0.1.24`
* `notification-data-access` updated to version `0.1.6`


## [0.2.3](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.2.2...upload-data-access-0.2.3) (2025-01-09)

### Dependency Updates

* `convert-video-data-access` updated to version `0.1.23`
* `notification-data-access` updated to version `0.1.5`
* `data-access-electron` updated to version `0.1.13`
* `web-setting-data-access` updated to version `0.1.5`


## [0.2.2](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.2.1...upload-data-access-0.2.2) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.2`
* `convert-video-data-access` updated to version `0.1.22`
* `notification-data-access` updated to version `0.1.5`
* `web-setting-data-access` updated to version `0.1.4`


## [0.2.1](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.2.0...upload-data-access-0.2.1) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.1`
* `convert-video-data-access` updated to version `0.1.21`
* `notification-data-access` updated to version `0.1.4`
* `data-access-electron` updated to version `0.1.12`
* `web-setting-data-access` updated to version `0.1.3`

### Bug Fixes

* remove console.log(...) ([de5d503](https://github.com/ever-co/ever-capture/commit/de5d503b41b308357e70d7e9a1470ed9ce3dcaf1))
* timeline generation for single videos ([508d8a2](https://github.com/ever-co/ever-capture/commit/508d8a22d270749b8bd150c24426335e33c01433))



# [0.2.0](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.1.3...upload-data-access-0.2.0) (2025-01-09)


### Features

* logs the result of the upload process ([3df8820](https://github.com/ever-co/ever-capture/commit/3df8820ba4f8c4be3ee733349b62f5d02a7a1fd2))



## [0.1.3](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.1.2...upload-data-access-0.1.3) (2025-01-09)


### Bug Fixes

* updates upload done notification message ([d9f6bc3](https://github.com/ever-co/ever-capture/commit/d9f6bc30ebc45bc5707433d27956d225d7c9109f))



## [0.1.2](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.1.1...upload-data-access-0.1.2) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.1`
* `convert-video-data-access` updated to version `0.1.20`
* `notification-data-access` updated to version `0.1.3`
* `data-access-electron` updated to version `0.1.11`
* `web-setting-data-access` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.1.0...upload-data-access-0.1.1) (2025-01-08)

### Dependency Updates

* `convert-video-data-access` updated to version `0.1.19`
* `notification-data-access` updated to version `0.1.2`
* `data-access-electron` updated to version `0.1.10`
* `web-setting-data-access` updated to version `0.1.1`


# [0.1.0](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.21...upload-data-access-0.1.0) (2025-01-08)

### Dependency Updates

* `utils` updated to version `0.4.0`
* `convert-video-data-access` updated to version `0.1.18`
* `notification-data-access` updated to version `0.1.1`
* `data-access-electron` updated to version `0.1.9`
* `web-setting-data-access` updated to version `0.1.0`

### Features

* improve video upload setting ([4d71737](https://github.com/ever-co/ever-capture/commit/4d71737ef629795aabf9ef4bc08dce24e4a15808))



## [0.0.21](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.20...upload-data-access-0.0.21) (2025-01-08)

### Dependency Updates

* `convert-video-data-access` updated to version `0.1.17`
* `notification-data-access` updated to version `0.1.0`
* `web-setting-data-access` updated to version `0.0.18`


## [0.0.21](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.20...upload-data-access-0.0.21) (2025-01-08)

### Dependency Updates

* `convert-video-data-access` updated to version `0.1.17`
* `notification-data-access` updated to version `0.1.0`
* `web-setting-data-access` updated to version `0.0.18`


## [0.0.20](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.19...upload-data-access-0.0.20) (2025-01-07)

### Dependency Updates

* `web-setting-data-access` updated to version `0.0.17`


## [0.0.19](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.18...upload-data-access-0.0.19) (2025-01-07)

### Dependency Updates

* `utils` updated to version `0.3.2`
* `convert-video-data-access` updated to version `0.1.16`
* `notification-data-access` updated to version `0.0.15`
* `data-access-electron` updated to version `0.1.9`


## [0.0.18](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.17...upload-data-access-0.0.18) (2025-01-06)

### Dependency Updates

* `convert-video-data-access` updated to version `0.1.15`
* `notification-data-access` updated to version `0.0.14`
* `web-setting-data-access` updated to version `0.0.16`


## [0.0.17](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.16...upload-data-access-0.0.17) (2025-01-06)

### Dependency Updates

* `convert-video-data-access` updated to version `0.1.14`


## [0.0.16](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.15...upload-data-access-0.0.16) (2025-01-06)

### Dependency Updates

* `convert-video-data-access` updated to version `0.1.13`
* `notification-data-access` updated to version `0.0.13`
* `web-setting-data-access` updated to version `0.0.15`


## [0.0.15](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.14...upload-data-access-0.0.15) (2025-01-06)

### Dependency Updates

* `convert-video-data-access` updated to version `0.1.12`
* `data-access-electron` updated to version `0.1.8`
* `web-setting-data-access` updated to version `0.0.13`


## [0.0.14](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.13...upload-data-access-0.0.14) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.1`
* `convert-video-data-access` updated to version `0.1.11`
* `notification-data-access` updated to version `0.0.12`
* `web-setting-data-access` updated to version `0.0.13`


## [0.0.13](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.12...upload-data-access-0.0.13) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.0`
* `convert-video-data-access` updated to version `0.1.10`
* `notification-data-access` updated to version `0.0.11`
* `data-access-electron` updated to version `0.1.7`
* `web-setting-data-access` updated to version `0.0.12`


## [0.0.12](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.11...upload-data-access-0.0.12) (2025-01-06)


### Bug Fixes

* upload config key for videos ([2346b8e](https://github.com/ever-co/ever-capture/commit/2346b8e60adcac611be92bf3ab8359a869fa881c))



## [0.0.11](https://github.com/ever-co/ever-capture/compare/upload-data-access-0.0.10...upload-data-access-0.0.11) (2024-12-26)

### Dependency Updates

* `utils` updated to version `0.3.0`
* `convert-video-data-access` updated to version `0.1.9`
* `notification-data-access` updated to version `0.0.10`
* `data-access-electron` updated to version `0.1.6`
* `web-setting-data-access` updated to version `0.0.11`


## [0.0.10](https://github.com/ever-co/ever-rec-desktop/compare/upload-data-access-0.0.9...upload-data-access-0.0.10) (2024-11-24)

### Dependency Updates

* `convert-video-data-access` updated to version `0.1.8`
* `notification-data-access` updated to version `0.0.9`
* `data-access-electron` updated to version `0.1.5`
* `web-setting-data-access` updated to version `0.0.10`


## [0.0.9](https://github.com/ever-co/ever-rec-desktop/compare/upload-data-access-0.0.8...upload-data-access-0.0.9) (2024-11-24)

### Dependency Updates

* `utils` updated to version `0.2.1`
* `convert-video-data-access` updated to version `0.1.7`
* `notification-data-access` updated to version `0.0.8`
* `web-setting-data-access` updated to version `0.0.9`


## [0.0.8](https://github.com/ever-co/ever-rec-desktop/compare/upload-data-access-0.0.7...upload-data-access-0.0.8) (2024-11-24)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `convert-video-data-access` updated to version `0.1.6`
* `notification-data-access` updated to version `0.0.7`
* `data-access-electron` updated to version `0.1.4`
* `web-setting-data-access` updated to version `0.0.8`


## [0.0.7](https://github.com/ever-co/ever-rec-desktop/compare/upload-data-access-0.0.6...upload-data-access-0.0.7) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.2.0`
* `convert-video-data-access` updated to version `0.1.5`
* `notification-data-access` updated to version `0.0.6`
* `data-access-electron` updated to version `0.1.3`
* `web-setting-data-access` updated to version `0.0.7`


## [0.0.6](https://github.com/ever-co/ever-rec-desktop/compare/upload-data-access-0.0.5...upload-data-access-0.0.6) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.1.2`
* `convert-video-data-access` updated to version `0.1.4`
* `notification-data-access` updated to version `0.0.5`
* `data-access-electron` updated to version `0.1.2`
* `web-setting-data-access` updated to version `0.0.6`


## [0.0.5](https://github.com/ever-co/ever-rec-desktop/compare/upload-data-access-0.0.4...upload-data-access-0.0.5) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.1.1`
* `convert-video-data-access` updated to version `0.1.3`
* `notification-data-access` updated to version `0.0.4`
* `data-access-electron` updated to version `0.1.1`
* `web-setting-data-access` updated to version `0.0.5`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.0.4](https://github.com/ever-co/ever-rec-desktop/compare/upload-data-access-0.0.3...upload-data-access-0.0.4) (2024-11-22)

### Dependency Updates

* `convert-video-data-access` updated to version `0.1.2`
* `notification-data-access` updated to version `0.0.3`
* `web-setting-data-access` updated to version `0.0.4`


## [0.0.3](https://github.com/ever-co/ever-rec-desktop/compare/upload-data-access-0.0.2...upload-data-access-0.0.3) (2024-11-21)

### Dependency Updates

* `convert-video-data-access` updated to version `0.1.1`
* `notification-data-access` updated to version `0.0.2`
* `web-setting-data-access` updated to version `0.0.3`


## [0.0.2](https://github.com/ever-co/ever-rec-desktop/compare/upload-data-access-0.0.1...upload-data-access-0.0.2) (2024-11-21)

### Dependency Updates

* `web-setting-data-access` updated to version `0.0.2`


## 0.0.1 (2024-11-20)

### Dependency Updates

* `utils` updated to version `0.1.0`
* `convert-video-data-access` updated to version `0.1.0`
* `notification-data-access` updated to version `0.0.1`
* `data-access-electron` updated to version `0.1.0`
* `web-setting-data-access` updated to version `0.0.1`

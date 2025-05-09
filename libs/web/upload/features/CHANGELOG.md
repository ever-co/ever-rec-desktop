# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.1](https://github.com/ever-co/ever-capture/compare/upload-feature-1.0.0...upload-feature-1.0.1) (2025-05-09)



# [1.0.0](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.5...upload-feature-1.0.0) (2025-05-09)

### Dependency Updates

* `upload-data-access` updated to version `1.0.0`
* `shared-service` updated to version `0.3.1`

### Bug Fixes

* **upload-queue:** apply max-height and enable overflow scrolling ([62a0672](https://github.com/ever-co/ever-capture/commit/62a0672a5670ee7ebf912265fee2e5e97589028c))
* **upload-queue:** apply max-height and overflow to list container ([ebc1788](https://github.com/ever-co/ever-capture/commit/ebc1788b5d516df615fc135d80bc871b801d989f))
* **upload:** clone queued items and improve queue UI ([ee285b3](https://github.com/ever-co/ever-capture/commit/ee285b31f7e3fc8dc53a89da9946ea40a634191a))
* **upload:** correct upload action visibility and progress status ([cee4d0c](https://github.com/ever-co/ever-capture/commit/cee4d0cf1b2267714e50702bc00d9936ae151cce))
* **upload:** format progress percentage display and stringify log messages ([32cfde2](https://github.com/ever-co/ever-capture/commit/32cfde26083f6edf3bee8ce0f378b1c12b346060))


### Features

* **upload:** add batch queue actions and enhance stability ([0a197f5](https://github.com/ever-co/ever-capture/commit/0a197f5805cd4c2e800cff5189ac67b148312e0e))
* **upload:** enhance display of failed upload items ([74c4d55](https://github.com/ever-co/ever-capture/commit/74c4d55691e0ee83ccf5bdcda45c1e5d33e2f327))
* **upload:** handle 'uploadAllFromQueue' action ([564a629](https://github.com/ever-co/ever-capture/commit/564a629676afd4d7f326007b2d4994f59bef857e))
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



## [0.1.5](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.4...upload-feature-0.1.5) (2025-05-02)

### Dependency Updates

* `upload-data-access` updated to version `0.1.4`


## [0.1.4](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.3...upload-feature-0.1.4) (2025-05-02)

### Dependency Updates

* `upload-data-access` updated to version `0.1.3`


## [0.1.3](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.2...upload-feature-0.1.3) (2025-02-12)

### Dependency Updates

* `upload-data-access` updated to version `0.1.3`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.1...upload-feature-0.1.2) (2025-02-12)

### Dependency Updates

* `upload-data-access` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.0...upload-feature-0.1.1) (2025-02-12)

### Dependency Updates

* `upload-data-access` updated to version `0.1.1`


# 0.1.0 (2025-01-10)

### Dependency Updates

* `upload-data-access` updated to version `0.1.0`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* tailwind config js ([9761084](https://github.com/ever-co/ever-capture/commit/97610843fa16e2fbcea5261b70ed53cca5e669f0))
* upload button visibility for single/timeline videos ([0f85986](https://github.com/ever-co/ever-capture/commit/0f8598684bd5f4b731145fc0234dc8c4e7f9a50c))


### Features

* **upload:** create upload feature to allow user to see uploading progress ([2d823d6](https://github.com/ever-co/ever-capture/commit/2d823d6aadb5c438f007807370ffbb8850b543a9))



## [0.1.12](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.11...upload-feature-0.1.12) (2025-01-10)

### Dependency Updates

* `upload-data-access` updated to version `0.2.6`

### Bug Fixes

* upload button visibility for single/timeline videos ([0f85986](https://github.com/ever-co/ever-capture/commit/0f8598684bd5f4b731145fc0234dc8c4e7f9a50c))



## [0.1.11](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.10...upload-feature-0.1.11) (2025-01-09)

### Dependency Updates

* `upload-data-access` updated to version `0.2.5`


## [0.1.10](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.9...upload-feature-0.1.10) (2025-01-09)

### Dependency Updates

* `upload-data-access` updated to version `0.2.4`


## [0.1.9](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.8...upload-feature-0.1.9) (2025-01-09)

### Dependency Updates

* `upload-data-access` updated to version `0.2.3`


## [0.1.8](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.7...upload-feature-0.1.8) (2025-01-09)

### Dependency Updates

* `upload-data-access` updated to version `0.2.2`


## [0.1.7](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.6...upload-feature-0.1.7) (2025-01-09)

### Dependency Updates

* `upload-data-access` updated to version `0.2.1`


## [0.1.6](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.5...upload-feature-0.1.6) (2025-01-09)

### Dependency Updates

* `upload-data-access` updated to version `0.1.2`


## [0.1.5](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.4...upload-feature-0.1.5) (2025-01-08)

### Dependency Updates

* `upload-data-access` updated to version `0.1.1`


## [0.1.4](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.3...upload-feature-0.1.4) (2025-01-08)

### Dependency Updates

* `upload-data-access` updated to version `0.1.0`


## [0.1.3](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.2...upload-feature-0.1.3) (2025-01-08)

### Dependency Updates

* `upload-data-access` updated to version `0.0.21`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.1...upload-feature-0.1.2) (2025-01-08)

### Dependency Updates

* `upload-data-access` updated to version `0.0.20`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/upload-feature-0.1.0...upload-feature-0.1.1) (2025-01-07)

### Dependency Updates

* `upload-data-access` updated to version `0.0.20`


# [0.1.0](https://github.com/ever-co/ever-capture/compare/upload-feature-0.0.7...upload-feature-0.1.0) (2025-01-07)

### Dependency Updates

* `upload-data-access` updated to version `0.0.19`

### Features

* **upload:** create upload feature to allow user to see uploading progress ([2d823d6](https://github.com/ever-co/ever-capture/commit/2d823d6aadb5c438f007807370ffbb8850b543a9))



## [0.0.7](https://github.com/ever-co/ever-capture/compare/upload-feature-0.0.6...upload-feature-0.0.7) (2024-12-26)



## [0.0.6](https://github.com/ever-co/ever-rec-desktop/compare/upload-feature-0.0.5...upload-feature-0.0.6) (2024-11-23)



## [0.0.5](https://github.com/ever-co/ever-rec-desktop/compare/upload-feature-0.0.4...upload-feature-0.0.5) (2024-11-23)


### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.0.4](https://github.com/ever-co/ever-rec-desktop/compare/upload-feature-0.0.3...upload-feature-0.0.4) (2024-11-22)



## [0.0.3](https://github.com/ever-co/ever-rec-desktop/compare/upload-feature-0.0.2...upload-feature-0.0.3) (2024-11-21)



## [0.0.2](https://github.com/ever-co/ever-rec-desktop/compare/upload-feature-0.0.1...upload-feature-0.0.2) (2024-11-21)


### Bug Fixes

* tailwind config js ([9761084](https://github.com/ever-co/ever-rec-desktop/commit/97610843fa16e2fbcea5261b70ed53cca5e669f0))



## 0.0.1 (2024-11-20)

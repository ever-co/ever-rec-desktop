# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.1.1](https://github.com/ever-co/ever-capture/compare/electron-utils-1.1.0...electron-utils-1.1.1) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`


# [1.1.0](https://github.com/ever-co/ever-capture/compare/electron-utils-1.0.2...electron-utils-1.1.0) (2025-05-11)

### Dependency Updates

* `utils` updated to version `1.1.0`

### Features

* **media-sync:** update media item status on upload completion ([c86716f](https://github.com/ever-co/ever-capture/commit/c86716f2d191666024df7a629067cf596a170dfa))


### Performance Improvements

* **uploader:** expedite upload completion signal by not awaiting synchronization ([f711d2a](https://github.com/ever-co/ever-capture/commit/f711d2aef1b1cac73727a11a7ae7308e5a6c897b))



# 0.1.0 (2025-05-09)


### Bug Fixes

* **electron-utils:** get correct browser window for progress bar ([00ce082](https://github.com/ever-co/ever-capture/commit/00ce0820164b0597b9c46766d74d001acc697230))
* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* remove unecessary import ([9774b23](https://github.com/ever-co/ever-capture/commit/9774b23148378c27cfc2d2bcf4ff052cf6ee707b))
* removes unused IScreenshot import ([6746061](https://github.com/ever-co/ever-capture/commit/6746061cbd9bb214ef1f80af012ccb8e3dc93a9c))
* timeline generation for single videos ([508d8a2](https://github.com/ever-co/ever-capture/commit/508d8a22d270749b8bd150c24426335e33c01433))
* updates upload done notification message ([d9f6bc3](https://github.com/ever-co/ever-capture/commit/d9f6bc30ebc45bc5707433d27956d225d7c9109f))
* upload button visibility for single/timeline videos ([0f85986](https://github.com/ever-co/ever-capture/commit/0f8598684bd5f4b731145fc0234dc8c4e7f9a50c))
* **uploader:** correct base URL extraction in screenshot uploader ([24af30f](https://github.com/ever-co/ever-capture/commit/24af30fd743872bd54fcc1abb013473b11735ba5))
* **uploader:** improve robustness of screenshot uploader URL handling ([a797ed3](https://github.com/ever-co/ever-capture/commit/a797ed3b062d86daf0bf9554a79c3f0540ecb85e))
* **uploader:** terminate worker after upload completion or error ([b937891](https://github.com/ever-co/ever-capture/commit/b9378919693ea911ed4d836ef576c9613679cb12))
* **upload:** format progress percentage display and stringify log messages ([32cfde2](https://github.com/ever-co/ever-capture/commit/32cfde26083f6edf3bee8ce0f378b1c12b346060))
* video conversion ([9bbbdf6](https://github.com/ever-co/ever-capture/commit/9bbbdf62b5adcc7532aa89dd4d78ae0384d07e8b))
* video conversion ([314c586](https://github.com/ever-co/ever-capture/commit/314c586480dedbe6099e5d080cdf633e63f080ab))
* **worker-handler:** terminate worker on completion or error ([039979c](https://github.com/ever-co/ever-capture/commit/039979cae6aa33bc9a0f3ad858a50889dffcc7ba))


### Features

* added ordering by createdAt in ASC order to findOne queries in VideoConversionService. ([5b8ac76](https://github.com/ever-co/ever-capture/commit/5b8ac7609e1d326d6c058ea20dc8edf68b658276))
* dded codec and batch fields to VideoMetadata entity and updated VideoConversionService to use them; updated VideoMetadataService to save codec and batch; added codec, batch, and resolution to video config and updated interfaces accordingly ([157ba9e](https://github.com/ever-co/ever-capture/commit/157ba9eb15fab7c11f0e3b925f0fe52cb69fe26f))
* handle timeline uploading if not synced ([57f717f](https://github.com/ever-co/ever-capture/commit/57f717fb606f76efa2241bade7f5c12089757046))
* improve this code by separate responsability ([eea58cf](https://github.com/ever-co/ever-capture/commit/eea58cf1a3b915c1c40cc8ea9c55955acb15ab15))
* **logger:** initialize electron logger with unique id ([4cac175](https://github.com/ever-co/ever-capture/commit/4cac1756a9c499aaf40e4278972c49de3e635dd1))
* set 'private' to false in multiple package.json files ([b3506c9](https://github.com/ever-co/ever-capture/commit/b3506c95e079effddee1d6591afe213929ceeda4))
* **settings:** add granular delete and purge options for storage ([418df6d](https://github.com/ever-co/ever-capture/commit/418df6def7f107320da86110a385d46f0377f5f8))
* sync video after uploaded ([4ccb402](https://github.com/ever-co/ever-capture/commit/4ccb40296c9045a6c1eedea89ca1f159bea3b604))
* Update ElectronLogger methods to accept variable number of arguments ([5b32d14](https://github.com/ever-co/ever-capture/commit/5b32d1477beecad47ec061fc61a2517bba3e44bf))
* updated video conversion service, added effects and reducer for generate video actions, and modified components for video and screenshot timeline ([bce655a](https://github.com/ever-co/ever-capture/commit/bce655a3f653149da08bd41b98b369a68f3d60f0))
* updates upload process to use POST method ([23d30ca](https://github.com/ever-co/ever-capture/commit/23d30ca4af91fe572c39864faf5047c48cb59f6c))
* **upload:** add photo upload service implementation ([70bf8cb](https://github.com/ever-co/ever-capture/commit/70bf8cb85106c283d0f10f3da3e86ae1b512a958))
* **uploader:** add support for audio uploads ([0ce4550](https://github.com/ever-co/ever-capture/commit/0ce4550a3f07cb644a9baca968097e37e179b8bc))
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



## [1.0.2](https://github.com/ever-co/ever-capture/compare/electron-utils-1.0.1...electron-utils-1.0.2) (2025-05-09)


### Bug Fixes

* **uploader:** improve robustness of screenshot uploader URL handling ([a797ed3](https://github.com/ever-co/ever-capture/commit/a797ed3b062d86daf0bf9554a79c3f0540ecb85e))



## [1.0.1](https://github.com/ever-co/ever-capture/compare/electron-utils-1.0.0...electron-utils-1.0.1) (2025-05-09)


### Bug Fixes

* **uploader:** correct base URL extraction in screenshot uploader ([24af30f](https://github.com/ever-co/ever-capture/commit/24af30fd743872bd54fcc1abb013473b11735ba5))



# [1.0.0](https://github.com/ever-co/ever-capture/compare/electron-utils-0.3.0...electron-utils-1.0.0) (2025-05-09)

### Dependency Updates

* `utils` updated to version `1.0.0`

### Bug Fixes

* **uploader:** terminate worker after upload completion or error ([b937891](https://github.com/ever-co/ever-capture/commit/b9378919693ea911ed4d836ef576c9613679cb12))
* **upload:** format progress percentage display and stringify log messages ([32cfde2](https://github.com/ever-co/ever-capture/commit/32cfde26083f6edf3bee8ce0f378b1c12b346060))
* **worker-handler:** terminate worker on completion or error ([039979c](https://github.com/ever-co/ever-capture/commit/039979cae6aa33bc9a0f3ad858a50889dffcc7ba))


### Features

* **upload:** add photo upload service implementation ([70bf8cb](https://github.com/ever-co/ever-capture/commit/70bf8cb85106c283d0f10f3da3e86ae1b512a958))
* **uploader:** add support for audio uploads ([0ce4550](https://github.com/ever-co/ever-capture/commit/0ce4550a3f07cb644a9baca968097e37e179b8bc))
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



# [0.3.0](https://github.com/ever-co/ever-capture/compare/electron-utils-0.2.0...electron-utils-0.3.0) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.0`

### Bug Fixes

* **electron-utils:** get correct browser window for progress bar ([00ce082](https://github.com/ever-co/ever-capture/commit/00ce0820164b0597b9c46766d74d001acc697230))


### Features

* **settings:** add granular delete and purge options for storage ([418df6d](https://github.com/ever-co/ever-capture/commit/418df6def7f107320da86110a385d46f0377f5f8))



# [0.2.0](https://github.com/ever-co/ever-capture/compare/electron-utils-0.1.4...electron-utils-0.2.0) (2025-04-04)


### Features

* **logger:** initialize electron logger with unique id ([4cac175](https://github.com/ever-co/ever-capture/commit/4cac1756a9c499aaf40e4278972c49de3e635dd1))



## [0.1.4](https://github.com/ever-co/ever-capture/compare/electron-utils-0.1.3...electron-utils-0.1.4) (2025-04-04)



## [0.1.3](https://github.com/ever-co/ever-capture/compare/electron-utils-0.1.2...electron-utils-0.1.3) (2025-02-22)

### Dependency Updates

* `utils` updated to version `0.1.2`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/electron-utils-0.1.1...electron-utils-0.1.2) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/electron-utils-0.1.0...electron-utils-0.1.1) (2025-02-12)

### Dependency Updates

* `utils` updated to version `0.1.1`


# 0.1.0 (2025-01-10)

### Dependency Updates

* `utils` updated to version `0.1.0`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* remove unecessary import ([9774b23](https://github.com/ever-co/ever-capture/commit/9774b23148378c27cfc2d2bcf4ff052cf6ee707b))
* removes unused IScreenshot import ([6746061](https://github.com/ever-co/ever-capture/commit/6746061cbd9bb214ef1f80af012ccb8e3dc93a9c))
* timeline generation for single videos ([508d8a2](https://github.com/ever-co/ever-capture/commit/508d8a22d270749b8bd150c24426335e33c01433))
* updates upload done notification message ([d9f6bc3](https://github.com/ever-co/ever-capture/commit/d9f6bc30ebc45bc5707433d27956d225d7c9109f))
* upload button visibility for single/timeline videos ([0f85986](https://github.com/ever-co/ever-capture/commit/0f8598684bd5f4b731145fc0234dc8c4e7f9a50c))
* video conversion ([9bbbdf6](https://github.com/ever-co/ever-capture/commit/9bbbdf62b5adcc7532aa89dd4d78ae0384d07e8b))
* video conversion ([314c586](https://github.com/ever-co/ever-capture/commit/314c586480dedbe6099e5d080cdf633e63f080ab))


### Features

* added ordering by createdAt in ASC order to findOne queries in VideoConversionService. ([5b8ac76](https://github.com/ever-co/ever-capture/commit/5b8ac7609e1d326d6c058ea20dc8edf68b658276))
* dded codec and batch fields to VideoMetadata entity and updated VideoConversionService to use them; updated VideoMetadataService to save codec and batch; added codec, batch, and resolution to video config and updated interfaces accordingly ([157ba9e](https://github.com/ever-co/ever-capture/commit/157ba9eb15fab7c11f0e3b925f0fe52cb69fe26f))
* handle timeline uploading if not synced ([57f717f](https://github.com/ever-co/ever-capture/commit/57f717fb606f76efa2241bade7f5c12089757046))
* improve this code by separate responsability ([eea58cf](https://github.com/ever-co/ever-capture/commit/eea58cf1a3b915c1c40cc8ea9c55955acb15ab15))
* set 'private' to false in multiple package.json files ([b3506c9](https://github.com/ever-co/ever-capture/commit/b3506c95e079effddee1d6591afe213929ceeda4))
* sync video after uploaded ([4ccb402](https://github.com/ever-co/ever-capture/commit/4ccb40296c9045a6c1eedea89ca1f159bea3b604))
* Update ElectronLogger methods to accept variable number of arguments ([5b32d14](https://github.com/ever-co/ever-capture/commit/5b32d1477beecad47ec061fc61a2517bba3e44bf))
* updated video conversion service, added effects and reducer for generate video actions, and modified components for video and screenshot timeline ([bce655a](https://github.com/ever-co/ever-capture/commit/bce655a3f653149da08bd41b98b369a68f3d60f0))
* updates upload process to use POST method ([23d30ca](https://github.com/ever-co/ever-capture/commit/23d30ca4af91fe572c39864faf5047c48cb59f6c))



# [0.5.0](https://github.com/ever-co/ever-capture/compare/electron-utils-0.4.4...electron-utils-0.5.0) (2025-01-10)


### Features

* handle timeline uploading if not synced ([57f717f](https://github.com/ever-co/ever-capture/commit/57f717fb606f76efa2241bade7f5c12089757046))



## [0.4.4](https://github.com/ever-co/ever-capture/compare/electron-utils-0.4.3...electron-utils-0.4.4) (2025-01-10)


### Bug Fixes

* upload button visibility for single/timeline videos ([0f85986](https://github.com/ever-co/ever-capture/commit/0f8598684bd5f4b731145fc0234dc8c4e7f9a50c))



## [0.4.3](https://github.com/ever-co/ever-capture/compare/electron-utils-0.4.2...electron-utils-0.4.3) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.2`


## [0.4.2](https://github.com/ever-co/ever-capture/compare/electron-utils-0.4.1...electron-utils-0.4.2) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.1`

### Bug Fixes

* timeline generation for single videos ([508d8a2](https://github.com/ever-co/ever-capture/commit/508d8a22d270749b8bd150c24426335e33c01433))



## [0.4.1](https://github.com/ever-co/ever-capture/compare/electron-utils-0.4.0...electron-utils-0.4.1) (2025-01-09)


### Bug Fixes

* updates upload done notification message ([d9f6bc3](https://github.com/ever-co/ever-capture/commit/d9f6bc30ebc45bc5707433d27956d225d7c9109f))



# [0.4.0](https://github.com/ever-co/ever-capture/compare/electron-utils-0.3.1...electron-utils-0.4.0) (2025-01-09)

### Dependency Updates

* `utils` updated to version `0.4.1`

### Bug Fixes

* remove unecessary import ([9774b23](https://github.com/ever-co/ever-capture/commit/9774b23148378c27cfc2d2bcf4ff052cf6ee707b))


### Features

* improve this code by separate responsability ([eea58cf](https://github.com/ever-co/ever-capture/commit/eea58cf1a3b915c1c40cc8ea9c55955acb15ab15))



## [0.3.1](https://github.com/ever-co/ever-capture/compare/electron-utils-0.3.0...electron-utils-0.3.1) (2025-01-08)

### Dependency Updates

* `utils` updated to version `0.4.0`


# [0.3.0](https://github.com/ever-co/ever-capture/compare/electron-utils-0.2.3...electron-utils-0.3.0) (2025-01-07)

### Dependency Updates

* `utils` updated to version `0.3.2`

### Features

* sync video after uploaded ([4ccb402](https://github.com/ever-co/ever-capture/commit/4ccb40296c9045a6c1eedea89ca1f159bea3b604))



## [0.2.3](https://github.com/ever-co/ever-capture/compare/electron-utils-0.2.2...electron-utils-0.2.3) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.1`


## [0.2.2](https://github.com/ever-co/ever-capture/compare/electron-utils-0.2.1...electron-utils-0.2.2) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.0`

### Bug Fixes

* removes unused IScreenshot import ([6746061](https://github.com/ever-co/ever-capture/commit/6746061cbd9bb214ef1f80af012ccb8e3dc93a9c))



## [0.2.1](https://github.com/ever-co/ever-capture/compare/electron-utils-0.2.0...electron-utils-0.2.1) (2025-01-06)

### Dependency Updates

* `utils` updated to version `0.3.0`


# [0.2.0](https://github.com/ever-co/ever-capture/compare/electron-utils-0.1.5...electron-utils-0.2.0) (2025-01-06)


### Features

* updates upload process to use POST method ([23d30ca](https://github.com/ever-co/ever-capture/commit/23d30ca4af91fe572c39864faf5047c48cb59f6c))



## [0.1.5](https://github.com/ever-co/ever-capture/compare/electron-utils-0.1.4...electron-utils-0.1.5) (2024-12-26)

### Dependency Updates

* `utils` updated to version `0.3.0`


## [0.1.4](https://github.com/ever-co/ever-rec-desktop/compare/electron-utils-0.1.3...electron-utils-0.1.4) (2024-11-24)

### Dependency Updates

* `utils` updated to version `0.2.1`


## [0.1.3](https://github.com/ever-co/ever-rec-desktop/compare/electron-utils-0.1.2...electron-utils-0.1.3) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.2.0`


## [0.1.2](https://github.com/ever-co/ever-rec-desktop/compare/electron-utils-0.1.1...electron-utils-0.1.2) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-rec-desktop/compare/electron-utils-0.1.0...electron-utils-0.1.1) (2024-11-23)

### Dependency Updates

* `utils` updated to version `0.1.1`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



# 0.1.0 (2024-11-20)

### Dependency Updates

* `utils` updated to version `0.1.0`

### Bug Fixes

* video conversion ([9bbbdf6](https://github.com/ever-co/ever-rec-desktop/commit/9bbbdf62b5adcc7532aa89dd4d78ae0384d07e8b))
* video conversion ([314c586](https://github.com/ever-co/ever-rec-desktop/commit/314c586480dedbe6099e5d080cdf633e63f080ab))


### Features

* added ordering by createdAt in ASC order to findOne queries in VideoConversionService. ([5b8ac76](https://github.com/ever-co/ever-rec-desktop/commit/5b8ac7609e1d326d6c058ea20dc8edf68b658276))
* dded codec and batch fields to VideoMetadata entity and updated VideoConversionService to use them; updated VideoMetadataService to save codec and batch; added codec, batch, and resolution to video config and updated interfaces accordingly ([157ba9e](https://github.com/ever-co/ever-rec-desktop/commit/157ba9eb15fab7c11f0e3b925f0fe52cb69fe26f))
* set 'private' to false in multiple package.json files ([b3506c9](https://github.com/ever-co/ever-rec-desktop/commit/b3506c95e079effddee1d6591afe213929ceeda4))
* Update ElectronLogger methods to accept variable number of arguments ([5b32d14](https://github.com/ever-co/ever-rec-desktop/commit/5b32d1477beecad47ec061fc61a2517bba3e44bf))
* updated video conversion service, added effects and reducer for generate video actions, and modified components for video and screenshot timeline ([bce655a](https://github.com/ever-co/ever-rec-desktop/commit/bce655a3f653149da08bd41b98b369a68f3d60f0))

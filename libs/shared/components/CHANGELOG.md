# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [2.0.8](https://github.com/ever-co/ever-rec-desktop/compare/shared-components-2.0.7...shared-components-2.0.8) (2025-06-21)

### Dependency Updates

* `utils` updated to version `1.4.0`


## [2.0.7](https://github.com/ever-co/ever-rec-desktop/compare/shared-components-2.0.6...shared-components-2.0.7) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.2`


## [2.0.6](https://github.com/ever-co/ever-rec-desktop/compare/shared-components-2.0.5...shared-components-2.0.6) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.1`


## [2.0.5](https://github.com/ever-co/ever-rec-desktop/compare/shared-components-2.0.4...shared-components-2.0.5) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.1`


## [2.0.4](https://github.com/ever-co/ever-rec-desktop/compare/shared-components-2.0.3...shared-components-2.0.4) (2025-06-03)

### Dependency Updates

* `utils` updated to version `1.3.1`


## [2.0.3](https://github.com/ever-co/ever-rec-desktop/compare/shared-components-2.0.2...shared-components-2.0.3) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.2.0`


## [2.0.2](https://github.com/ever-co/ever-capture/compare/shared-components-2.0.1...shared-components-2.0.2) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`


## [2.0.1](https://github.com/ever-co/ever-capture/compare/shared-components-2.0.0...shared-components-2.0.1) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`


# [2.0.0](https://github.com/ever-co/ever-capture/compare/shared-components-1.1.0...shared-components-2.0.0) (2025-05-11)

### Dependency Updates

* `utils` updated to version `1.1.0`

### Code Refactoring

* **date-picker:** modularize date picker into dedicated libraries ([f19b188](https://github.com/ever-co/ever-capture/commit/f19b1883bc7392e9a42f7342afca689ab24fd029))
* **screenshot:** make screenshot card presentational and move logic ([44cfc69](https://github.com/ever-co/ever-capture/commit/44cfc69f610b7004634df4d68ee429a8858669a2))


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
* **screenshot:** `ScreenshotComponent` is no longer available from
`libs/shared/components`. It has been moved to `libs/web/screenshot/ui`
(importable via `@ever-co/screenshot-ui`).
The component's API has changed:
- It no longer contains internal action logic (view, delete, upload).
- It now requires an `actionButtons: IActionButton[]` input to define
its actions.
Consumers must update import paths and provide the `actionButtons` input.
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

* **action-button:** fix icon font on button interaction states ([a92eec5](https://github.com/ever-co/ever-capture/commit/a92eec5d3f0bd0475fc46c27d9a3b95e737ead8e))
* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* tailwind config js ([9761084](https://github.com/ever-co/ever-capture/commit/97610843fa16e2fbcea5261b70ed53cca5e669f0))
* **ui/audio:** set explicit mode for audio component in video detail ([72c383c](https://github.com/ever-co/ever-capture/commit/72c383cd05f5344d456abe9d3bfaa81b61e6ddd1))
* updated gallery component HTML and SCSS: added createdAt timestamp to figcaption, wrapped figcaption content in div, and added display flex and margin styles to figure element. ([8545924](https://github.com/ever-co/ever-capture/commit/8545924649a24ce9464da6c2d61caa598e0e5d1f))
* upload button visibility for single/timeline videos ([0f85986](https://github.com/ever-co/ever-capture/commit/0f8598684bd5f4b731145fc0234dc8c4e7f9a50c))


### Features

* **action-button-group:** add blurred background style option ([6002ac0](https://github.com/ever-co/ever-capture/commit/6002ac01fc7984b81b319a75d0877187e3d4409a))
* **audio-gallery:** add upload action for audio items ([fafa302](https://github.com/ever-co/ever-capture/commit/fafa30286d4e44333c56340b7cbbc52b7a6c63b0))
* create pipe, utc to local time pipe ([acc794d](https://github.com/ever-co/ever-capture/commit/acc794d6ebbdc5b9b6df75f83bc4d41fdc4bbb06))
* create reusable component ([d1bce63](https://github.com/ever-co/ever-capture/commit/d1bce6369b54fd614114e84c3ebf755148f4e79d))
* displays video sync status and full name ([b164ccf](https://github.com/ever-co/ever-capture/commit/b164ccf9de583ad56f6ef6fe16b2bb0ae48c8d55))
* improve gallery button group ([1e093b5](https://github.com/ever-co/ever-capture/commit/1e093b53f05de6f474ca309aee0df4481d869899))
* improve video upload setting ([4d71737](https://github.com/ever-co/ever-capture/commit/4d71737ef629795aabf9ef4bc08dce24e4a15808))
* modularize ever capture ([0549ee2](https://github.com/ever-co/ever-capture/commit/0549ee29138fe36f7e3c80a7351d28235f9b9055))
* move command buttons ([08ef606](https://github.com/ever-co/ever-capture/commit/08ef60687fa0f50858d8a1c513277dcccbdc691b))
* optimize storage ([c73da1b](https://github.com/ever-co/ever-capture/commit/c73da1b0d79e33ba6fd85e21848254be77eee80a))
* **screenshot:** add manual upload and enhance gallery interaction ([4520d5a](https://github.com/ever-co/ever-capture/commit/4520d5a64e35481ef355a0df620998408a62d930))
* **screenshot:** display screenshot sync status icon ([a125b6a](https://github.com/ever-co/ever-capture/commit/a125b6a590376e881d029d20f746efd0bffbbad2))
* **settings:** add granular delete and purge options for storage ([418df6d](https://github.com/ever-co/ever-capture/commit/418df6def7f107320da86110a385d46f0377f5f8))
* **shared/components:** add audio player component ([bd39965](https://github.com/ever-co/ever-capture/commit/bd39965dd830ab7de33633e9ef70dd8e4e70f6e9))
* **upload:** add photo upload capability and generalize upload service ([71aac04](https://github.com/ever-co/ever-capture/commit/71aac047b27863408c8062f6ce421d955f16132c))
* **upload:** implement item-based upload queue with UI and parallel processing ([a4e3df3](https://github.com/ever-co/ever-capture/commit/a4e3df3751db121359f024d9d78fd1d97a89af54))
* **video-gallery:** enable video detail view on card click ([5fa3078](https://github.com/ever-co/ever-capture/commit/5fa3078c0912413fadff40a2581d0fc0f7d947af))
* **video:** enhance upload button with loading state and improve dialogs ([9104406](https://github.com/ever-co/ever-capture/commit/9104406622966226d6671a5b25e3b8d113660d1a))
* **webcam:** add audio gallery and management ([5fcb1af](https://github.com/ever-co/ever-capture/commit/5fcb1afcb7f1496dd620731423c7192a23ccea36))
* **webcam:** add photo gallery and detail view ([c810cca](https://github.com/ever-co/ever-capture/commit/c810cca3ddcb6d7daeedc8a7b658de700718d045))
* **webcam:** add webcam selection and state management ([f3adafe](https://github.com/ever-co/ever-capture/commit/f3adafed936cc59e7efc6224cdfbbaec33ab4e31))
* **webcam:** implement audio recording capability ([993f19d](https://github.com/ever-co/ever-capture/commit/993f19d01e3da049aa3f8cc1f0649f788b0b316f))


### Performance Improvements

* **action-button-group:** optimize button rendering with specific trackBy ([f614db6](https://github.com/ever-co/ever-capture/commit/f614db6cc2962953b013ed220d928d1ec53de3e3))


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



# [1.1.0](https://github.com/ever-co/ever-capture/compare/shared-components-1.0.0...shared-components-1.1.0) (2025-05-09)


### Features

* **screenshot:** display screenshot sync status icon ([a125b6a](https://github.com/ever-co/ever-capture/commit/a125b6a590376e881d029d20f746efd0bffbbad2))



# [1.0.0](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.2...shared-components-1.0.0) (2025-05-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.6`
* `data-access-electron` updated to version `0.2.2`
* `shared-service` updated to version `0.3.1`
* `utils` updated to version `1.0.0`
* `web-setting-data-access` updated to version `0.3.0`
* `convert-video-data-access` updated to version `0.2.1`
* `screenshot-data-access` updated to version `0.2.2`
* `upload-data-access` updated to version `1.0.0`
* `timesheet-data-access` updated to version `0.1.2`

### Features

* **audio-gallery:** add upload action for audio items ([fafa302](https://github.com/ever-co/ever-capture/commit/fafa30286d4e44333c56340b7cbbc52b7a6c63b0))
* **screenshot:** add manual upload and enhance gallery interaction ([4520d5a](https://github.com/ever-co/ever-capture/commit/4520d5a64e35481ef355a0df620998408a62d930))
* **upload:** add photo upload capability and generalize upload service ([71aac04](https://github.com/ever-co/ever-capture/commit/71aac047b27863408c8062f6ce421d955f16132c))
* **upload:** implement item-based upload queue with UI and parallel processing ([a4e3df3](https://github.com/ever-co/ever-capture/commit/a4e3df3751db121359f024d9d78fd1d97a89af54))
* **video-gallery:** enable video detail view on card click ([5fa3078](https://github.com/ever-co/ever-capture/commit/5fa3078c0912413fadff40a2581d0fc0f7d947af))
* **video:** enhance upload button with loading state and improve dialogs ([9104406](https://github.com/ever-co/ever-capture/commit/9104406622966226d6671a5b25e3b8d113660d1a))


### Performance Improvements

* **action-button-group:** optimize button rendering with specific trackBy ([f614db6](https://github.com/ever-co/ever-capture/commit/f614db6cc2962953b013ed220d928d1ec53de3e3))


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



## [0.2.2](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.1...shared-components-0.2.2) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.1`
* `web-setting-data-access` updated to version `0.2.2`
* `upload-data-access` updated to version `0.1.4`


## [0.2.1](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.0...shared-components-0.2.1) (2025-05-02)

### Dependency Updates

* `notification-data-access` updated to version `0.1.5`
* `data-access-electron` updated to version `0.2.1`
* `shared-service` updated to version `0.2.0`
* `web-setting-data-access` updated to version `0.2.1`
* `convert-video-data-access` updated to version `0.2.0`
* `screenshot-data-access` updated to version `0.2.1`
* `timesheet-data-access` updated to version `0.1.0`
* `upload-data-access` updated to version `0.1.4`


# [0.2.0](https://github.com/ever-co/ever-capture/compare/shared-components-0.1.3...shared-components-0.2.0) (2025-05-02)

### Dependency Updates

* `notification-data-access` updated to version `0.1.4`
* `data-access-electron` updated to version `0.2.0`
* `shared-service` updated to version `0.1.2`
* `utils` updated to version `0.2.0`
* `web-setting-data-access` updated to version `0.2.0`
* `convert-video-data-access` updated to version `0.1.2`
* `screenshot-data-access` updated to version `0.2.0`
* `timesheet-data-access` updated to version `0.1.0`
* `upload-data-access` updated to version `0.1.3`

### Bug Fixes

* **action-button:** fix icon font on button interaction states ([a92eec5](https://github.com/ever-co/ever-capture/commit/a92eec5d3f0bd0475fc46c27d9a3b95e737ead8e))
* **ui/audio:** set explicit mode for audio component in video detail ([72c383c](https://github.com/ever-co/ever-capture/commit/72c383cd05f5344d456abe9d3bfaa81b61e6ddd1))


### Features

* **action-button-group:** add blurred background style option ([6002ac0](https://github.com/ever-co/ever-capture/commit/6002ac01fc7984b81b319a75d0877187e3d4409a))
* **settings:** add granular delete and purge options for storage ([418df6d](https://github.com/ever-co/ever-capture/commit/418df6def7f107320da86110a385d46f0377f5f8))
* **shared/components:** add audio player component ([bd39965](https://github.com/ever-co/ever-capture/commit/bd39965dd830ab7de33633e9ef70dd8e4e70f6e9))
* **webcam:** add audio gallery and management ([5fcb1af](https://github.com/ever-co/ever-capture/commit/5fcb1afcb7f1496dd620731423c7192a23ccea36))
* **webcam:** add photo gallery and detail view ([c810cca](https://github.com/ever-co/ever-capture/commit/c810cca3ddcb6d7daeedc8a7b658de700718d045))
* **webcam:** add webcam selection and state management ([f3adafe](https://github.com/ever-co/ever-capture/commit/f3adafed936cc59e7efc6224cdfbbaec33ab4e31))
* **webcam:** implement audio recording capability ([993f19d](https://github.com/ever-co/ever-capture/commit/993f19d01e3da049aa3f8cc1f0649f788b0b316f))



## [0.1.3](https://github.com/ever-co/ever-capture/compare/shared-components-0.1.2...shared-components-0.1.3) (2025-02-12)

### Dependency Updates

* `notification-data-access` updated to version `0.1.2`
* `data-access-electron` updated to version `0.1.2`
* `shared-service` updated to version `0.1.2`
* `utils` updated to version `0.1.2`
* `web-setting-data-access` updated to version `0.1.3`
* `convert-video-data-access` updated to version `0.1.2`
* `screenshot-data-access` updated to version `0.1.3`
* `timesheet-data-access` updated to version `0.0.3`
* `upload-data-access` updated to version `0.1.3`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/shared-components-0.1.1...shared-components-0.1.2) (2025-02-12)

### Dependency Updates

* `web-setting-data-access` updated to version `0.1.2`
* `screenshot-data-access` updated to version `0.1.1`
* `timesheet-data-access` updated to version `0.0.3`
* `upload-data-access` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/shared-components-0.1.0...shared-components-0.1.1) (2025-02-12)

### Dependency Updates

* `notification-data-access` updated to version `0.1.1`
* `data-access-electron` updated to version `0.1.1`
* `shared-service` updated to version `0.1.1`
* `utils` updated to version `0.1.1`
* `web-setting-data-access` updated to version `0.1.1`
* `convert-video-data-access` updated to version `0.1.1`
* `screenshot-data-access` updated to version `0.1.0`
* `timesheet-data-access` updated to version `0.0.2`
* `upload-data-access` updated to version `0.1.1`


# 0.1.0 (2025-01-10)

### Dependency Updates

* `notification-data-access` updated to version `0.1.0`
* `data-access-electron` updated to version `0.1.0`
* `shared-service` updated to version `0.1.0`
* `utils` updated to version `0.1.0`
* `web-setting-data-access` updated to version `0.1.0`
* `convert-video-data-access` updated to version `0.1.0`
* `screenshot-data-access` updated to version `0.1.0`
* `timesheet-data-access` updated to version `0.0.1`
* `upload-data-access` updated to version `0.1.0`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* tailwind config js ([9761084](https://github.com/ever-co/ever-capture/commit/97610843fa16e2fbcea5261b70ed53cca5e669f0))
* updated gallery component HTML and SCSS: added createdAt timestamp to figcaption, wrapped figcaption content in div, and added display flex and margin styles to figure element. ([8545924](https://github.com/ever-co/ever-capture/commit/8545924649a24ce9464da6c2d61caa598e0e5d1f))
* upload button visibility for single/timeline videos ([0f85986](https://github.com/ever-co/ever-capture/commit/0f8598684bd5f4b731145fc0234dc8c4e7f9a50c))


### Features

* create pipe, utc to local time pipe ([acc794d](https://github.com/ever-co/ever-capture/commit/acc794d6ebbdc5b9b6df75f83bc4d41fdc4bbb06))
* create reusable component ([d1bce63](https://github.com/ever-co/ever-capture/commit/d1bce6369b54fd614114e84c3ebf755148f4e79d))
* displays video sync status and full name ([b164ccf](https://github.com/ever-co/ever-capture/commit/b164ccf9de583ad56f6ef6fe16b2bb0ae48c8d55))
* improve gallery button group ([1e093b5](https://github.com/ever-co/ever-capture/commit/1e093b53f05de6f474ca309aee0df4481d869899))
* improve video upload setting ([4d71737](https://github.com/ever-co/ever-capture/commit/4d71737ef629795aabf9ef4bc08dce24e4a15808))
* modularize ever capture ([0549ee2](https://github.com/ever-co/ever-capture/commit/0549ee29138fe36f7e3c80a7351d28235f9b9055))
* move command buttons ([08ef606](https://github.com/ever-co/ever-capture/commit/08ef60687fa0f50858d8a1c513277dcccbdc691b))
* optimize storage ([c73da1b](https://github.com/ever-co/ever-capture/commit/c73da1b0d79e33ba6fd85e21848254be77eee80a))



## [0.4.9](https://github.com/ever-co/ever-capture/compare/shared-components-0.4.8...shared-components-0.4.9) (2025-01-10)

### Dependency Updates

* `upload-data-access` updated to version `0.2.6`

### Bug Fixes

* upload button visibility for single/timeline videos ([0f85986](https://github.com/ever-co/ever-capture/commit/0f8598684bd5f4b731145fc0234dc8c4e7f9a50c))



## [0.4.8](https://github.com/ever-co/ever-capture/compare/shared-components-0.4.7...shared-components-0.4.8) (2025-01-09)

### Dependency Updates

* `upload-data-access` updated to version `0.2.5`


## [0.4.7](https://github.com/ever-co/ever-capture/compare/shared-components-0.4.6...shared-components-0.4.7) (2025-01-09)

### Dependency Updates

* `web-setting-data-access` updated to version `0.1.7`
* `screenshot-data-access` updated to version `0.1.22`
* `timesheet-data-access` updated to version `0.0.26`


## [0.4.6](https://github.com/ever-co/ever-capture/compare/shared-components-0.4.5...shared-components-0.4.6) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.6`
* `web-setting-data-access` updated to version `0.1.6`
* `convert-video-data-access` updated to version `0.1.24`
* `screenshot-data-access` updated to version `0.1.21`
* `upload-data-access` updated to version `0.2.4`


## [0.4.5](https://github.com/ever-co/ever-capture/compare/shared-components-0.4.4...shared-components-0.4.5) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.5`
* `data-access-electron` updated to version `0.1.13`
* `shared-service` updated to version `0.1.18`
* `web-setting-data-access` updated to version `0.1.5`
* `convert-video-data-access` updated to version `0.1.23`
* `screenshot-data-access` updated to version `0.1.21`
* `timesheet-data-access` updated to version `0.0.24`
* `upload-data-access` updated to version `0.2.3`


## [0.4.4](https://github.com/ever-co/ever-capture/compare/shared-components-0.4.3...shared-components-0.4.4) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.5`
* `shared-service` updated to version `0.1.17`
* `utils` updated to version `0.4.2`
* `web-setting-data-access` updated to version `0.1.4`
* `convert-video-data-access` updated to version `0.1.22`
* `screenshot-data-access` updated to version `0.1.21`
* `timesheet-data-access` updated to version `0.0.23`
* `upload-data-access` updated to version `0.2.2`


## [0.4.3](https://github.com/ever-co/ever-capture/compare/shared-components-0.4.2...shared-components-0.4.3) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.4`
* `data-access-electron` updated to version `0.1.12`
* `shared-service` updated to version `0.1.16`
* `utils` updated to version `0.4.1`
* `web-setting-data-access` updated to version `0.1.3`
* `convert-video-data-access` updated to version `0.1.21`
* `screenshot-data-access` updated to version `0.1.20`
* `timesheet-data-access` updated to version `0.0.22`
* `upload-data-access` updated to version `0.2.1`


## [0.4.2](https://github.com/ever-co/ever-capture/compare/shared-components-0.4.1...shared-components-0.4.2) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.3`
* `data-access-electron` updated to version `0.1.11`
* `shared-service` updated to version `0.1.15`
* `utils` updated to version `0.4.1`
* `web-setting-data-access` updated to version `0.1.2`
* `convert-video-data-access` updated to version `0.1.20`
* `screenshot-data-access` updated to version `0.1.19`
* `timesheet-data-access` updated to version `0.0.21`
* `upload-data-access` updated to version `0.1.2`


## [0.4.2](https://github.com/ever-co/ever-capture/compare/shared-components-0.4.1...shared-components-0.4.2) (2025-01-09)

### Dependency Updates

* `notification-data-access` updated to version `0.1.3`
* `data-access-electron` updated to version `0.1.11`
* `shared-service` updated to version `0.1.15`
* `utils` updated to version `0.4.1`
* `web-setting-data-access` updated to version `0.1.2`
* `convert-video-data-access` updated to version `0.1.20`
* `screenshot-data-access` updated to version `0.1.19`
* `upload-data-access` updated to version `0.1.2`


## [0.4.1](https://github.com/ever-co/ever-capture/compare/shared-components-0.4.0...shared-components-0.4.1) (2025-01-08)

### Dependency Updates

* `notification-data-access` updated to version `0.1.2`
* `data-access-electron` updated to version `0.1.10`
* `shared-service` updated to version `0.1.14`
* `web-setting-data-access` updated to version `0.1.1`
* `convert-video-data-access` updated to version `0.1.19`
* `screenshot-data-access` updated to version `0.1.18`
* `timesheet-data-access` updated to version `0.0.20`
* `upload-data-access` updated to version `0.1.1`


# [0.4.0](https://github.com/ever-co/ever-capture/compare/shared-components-0.3.0...shared-components-0.4.0) (2025-01-08)

### Dependency Updates

* `notification-data-access` updated to version `0.1.1`
* `data-access-electron` updated to version `0.1.9`
* `shared-service` updated to version `0.1.13`
* `utils` updated to version `0.4.0`
* `web-setting-data-access` updated to version `0.1.0`
* `convert-video-data-access` updated to version `0.1.18`
* `screenshot-data-access` updated to version `0.1.17`
* `timesheet-data-access` updated to version `0.0.19`
* `upload-data-access` updated to version `0.1.0`

### Features

* improve video upload setting ([4d71737](https://github.com/ever-co/ever-capture/commit/4d71737ef629795aabf9ef4bc08dce24e4a15808))



# [0.3.0](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.10...shared-components-0.3.0) (2025-01-08)


### Features

* displays video sync status and full name ([b164ccf](https://github.com/ever-co/ever-capture/commit/b164ccf9de583ad56f6ef6fe16b2bb0ae48c8d55))



## [0.2.10](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.9...shared-components-0.2.10) (2025-01-08)

### Dependency Updates

* `upload-data-access` updated to version `0.0.21`


## [0.2.9](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.8...shared-components-0.2.9) (2025-01-08)

### Dependency Updates

* `notification-data-access` updated to version `0.1.0`
* `web-setting-data-access` updated to version `0.0.18`
* `convert-video-data-access` updated to version `0.1.17`
* `screenshot-data-access` updated to version `0.1.16`
* `timesheet-data-access` updated to version `0.0.18`
* `upload-data-access` updated to version `0.0.20`


## [0.2.8](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.7...shared-components-0.2.8) (2025-01-07)

### Dependency Updates

* `upload-data-access` updated to version `0.0.20`


## [0.2.7](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.6...shared-components-0.2.7) (2025-01-07)

### Dependency Updates

* `notification-data-access` updated to version `0.0.15`
* `data-access-electron` updated to version `0.1.9`
* `shared-service` updated to version `0.1.12`
* `utils` updated to version `0.3.2`
* `web-setting-data-access` updated to version `0.0.17`
* `convert-video-data-access` updated to version `0.1.16`
* `screenshot-data-access` updated to version `0.1.15`
* `upload-data-access` updated to version `0.0.19`


## [0.2.6](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.5...shared-components-0.2.6) (2025-01-06)

### Dependency Updates

* `notification-data-access` updated to version `0.0.14`
* `web-setting-data-access` updated to version `0.0.16`
* `convert-video-data-access` updated to version `0.1.15`
* `screenshot-data-access` updated to version `0.1.14`
* `timesheet-data-access` updated to version `0.0.16`
* `upload-data-access` updated to version `0.0.18`


## [0.2.5](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.4...shared-components-0.2.5) (2025-01-06)

### Dependency Updates

* `shared-service` updated to version `0.1.11`
* `convert-video-data-access` updated to version `0.1.14`
* `screenshot-data-access` updated to version `0.1.13`
* `timesheet-data-access` updated to version `0.0.15`
* `upload-data-access` updated to version `0.0.17`


## [0.2.4](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.3...shared-components-0.2.4) (2025-01-06)

### Dependency Updates

* `notification-data-access` updated to version `0.0.13`
* `shared-service` updated to version `0.1.10`
* `web-setting-data-access` updated to version `0.0.15`
* `convert-video-data-access` updated to version `0.1.13`
* `screenshot-data-access` updated to version `0.1.12`
* `timesheet-data-access` updated to version `0.0.14`
* `upload-data-access` updated to version `0.0.16`


## [0.2.3](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.2...shared-components-0.2.3) (2025-01-06)

### Dependency Updates

* `data-access-electron` updated to version `0.1.8`
* `web-setting-data-access` updated to version `0.0.14`
* `convert-video-data-access` updated to version `0.1.12`
* `timesheet-data-access` updated to version `0.0.13`
* `upload-data-access` updated to version `0.0.15`


## [0.2.2](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.1...shared-components-0.2.2) (2025-01-06)

### Dependency Updates

* `notification-data-access` updated to version `0.0.12`
* `shared-service` updated to version `0.1.10`
* `utils` updated to version `0.3.1`
* `web-setting-data-access` updated to version `0.0.13`
* `convert-video-data-access` updated to version `0.1.11`
* `screenshot-data-access` updated to version `0.1.11`
* `timesheet-data-access` updated to version `0.0.12`
* `upload-data-access` updated to version `0.0.14`


## [0.2.1](https://github.com/ever-co/ever-capture/compare/shared-components-0.2.0...shared-components-0.2.1) (2025-01-06)

### Dependency Updates

* `notification-data-access` updated to version `0.0.11`
* `data-access-electron` updated to version `0.1.7`
* `shared-service` updated to version `0.1.9`
* `utils` updated to version `0.3.0`
* `web-setting-data-access` updated to version `0.0.12`
* `convert-video-data-access` updated to version `0.1.10`
* `screenshot-data-access` updated to version `0.1.10`
* `timesheet-data-access` updated to version `0.0.11`
* `upload-data-access` updated to version `0.0.13`


# [0.2.0](https://github.com/ever-co/ever-capture/compare/shared-components-0.1.6...shared-components-0.2.0) (2024-12-26)

### Dependency Updates

* `notification-data-access` updated to version `0.0.10`
* `data-access-electron` updated to version `0.1.6`
* `shared-service` updated to version `0.1.8`
* `utils` updated to version `0.3.0`
* `web-setting-data-access` updated to version `0.0.11`
* `convert-video-data-access` updated to version `0.1.9`
* `screenshot-data-access` updated to version `0.1.9`
* `timesheet-data-access` updated to version `0.0.10`
* `upload-data-access` updated to version `0.0.11`

### Features

* optimize storage ([c73da1b](https://github.com/ever-co/ever-capture/commit/c73da1b0d79e33ba6fd85e21848254be77eee80a))



## [0.1.6](https://github.com/ever-co/ever-rec-desktop/compare/shared-components-0.1.5...shared-components-0.1.6) (2024-11-24)

### Dependency Updates

* `notification-data-access` updated to version `0.0.9`
* `data-access-electron` updated to version `0.1.5`
* `shared-service` updated to version `0.1.7`
* `web-setting-data-access` updated to version `0.0.10`
* `convert-video-data-access` updated to version `0.1.8`
* `screenshot-data-access` updated to version `0.1.8`
* `timesheet-data-access` updated to version `0.0.9`
* `upload-data-access` updated to version `0.0.10`


## [0.1.5](https://github.com/ever-co/ever-rec-desktop/compare/shared-components-0.1.4...shared-components-0.1.5) (2024-11-24)

### Dependency Updates

* `notification-data-access` updated to version `0.0.8`
* `data-access-electron` updated to version `0.1.4`
* `shared-service` updated to version `0.1.6`
* `utils` updated to version `0.2.1`
* `web-setting-data-access` updated to version `0.0.9`
* `convert-video-data-access` updated to version `0.1.7`
* `screenshot-data-access` updated to version `0.1.7`
* `timesheet-data-access` updated to version `0.0.8`
* `upload-data-access` updated to version `0.0.9`


## [0.1.4](https://github.com/ever-co/ever-rec-desktop/compare/shared-components-0.1.3...shared-components-0.1.4) (2024-11-23)

### Dependency Updates

* `notification-data-access` updated to version `0.0.6`
* `data-access-electron` updated to version `0.1.3`
* `shared-service` updated to version `0.1.4`
* `utils` updated to version `0.2.0`
* `web-setting-data-access` updated to version `0.0.7`
* `convert-video-data-access` updated to version `0.1.5`
* `screenshot-data-access` updated to version `0.1.5`
* `timesheet-data-access` updated to version `0.0.6`
* `upload-data-access` updated to version `0.0.7`


## [0.1.3](https://github.com/ever-co/ever-rec-desktop/compare/shared-components-0.1.2...shared-components-0.1.3) (2024-11-23)

### Dependency Updates

* `notification-data-access` updated to version `0.0.5`
* `data-access-electron` updated to version `0.1.2`
* `shared-service` updated to version `0.1.3`
* `utils` updated to version `0.1.2`
* `web-setting-data-access` updated to version `0.0.6`
* `convert-video-data-access` updated to version `0.1.4`
* `screenshot-data-access` updated to version `0.1.4`
* `timesheet-data-access` updated to version `0.0.5`
* `upload-data-access` updated to version `0.0.6`


## [0.1.2](https://github.com/ever-co/ever-rec-desktop/compare/shared-components-0.1.1...shared-components-0.1.2) (2024-11-23)

### Dependency Updates

* `notification-data-access` updated to version `0.0.4`
* `data-access-electron` updated to version `0.1.1`
* `shared-service` updated to version `0.1.2`
* `utils` updated to version `0.1.1`
* `web-setting-data-access` updated to version `0.0.5`
* `convert-video-data-access` updated to version `0.1.3`
* `screenshot-data-access` updated to version `0.1.3`
* `timesheet-data-access` updated to version `0.0.4`
* `upload-data-access` updated to version `0.0.5`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.1.1](https://github.com/ever-co/ever-rec-desktop/compare/shared-components-0.1.0...shared-components-0.1.1) (2024-11-22)

### Dependency Updates

* `notification-data-access` updated to version `0.0.3`
* `web-setting-data-access` updated to version `0.0.4`
* `convert-video-data-access` updated to version `0.1.2`
* `screenshot-data-access` updated to version `0.1.2`
* `timesheet-data-access` updated to version `0.0.3`
* `upload-data-access` updated to version `0.0.4`


# 0.1.0 (2024-11-21)

### Dependency Updates

* `notification-data-access` updated to version `0.0.2`
* `data-access-electron` updated to version `0.1.0`
* `shared-service` updated to version `0.1.1`
* `utils` updated to version `0.1.0`
* `web-setting-data-access` updated to version `0.0.3`
* `convert-video-data-access` updated to version `0.1.1`
* `screenshot-data-access` updated to version `0.1.1`
* `timesheet-data-access` updated to version `0.0.2`
* `upload-data-access` updated to version `0.0.3`

### Bug Fixes

* tailwind config js ([9761084](https://github.com/ever-co/ever-rec-desktop/commit/97610843fa16e2fbcea5261b70ed53cca5e669f0))
* updated gallery component HTML and SCSS: added createdAt timestamp to figcaption, wrapped figcaption content in div, and added display flex and margin styles to figure element. ([8545924](https://github.com/ever-co/ever-rec-desktop/commit/8545924649a24ce9464da6c2d61caa598e0e5d1f))


### Features

* create pipe, utc to local time pipe ([acc794d](https://github.com/ever-co/ever-rec-desktop/commit/acc794d6ebbdc5b9b6df75f83bc4d41fdc4bbb06))
* create reusable component ([d1bce63](https://github.com/ever-co/ever-rec-desktop/commit/d1bce6369b54fd614114e84c3ebf755148f4e79d))
* improve gallery button group ([1e093b5](https://github.com/ever-co/ever-rec-desktop/commit/1e093b53f05de6f474ca309aee0df4481d869899))
* modularize ever capture ([0549ee2](https://github.com/ever-co/ever-rec-desktop/commit/0549ee29138fe36f7e3c80a7351d28235f9b9055))
* move command buttons ([08ef606](https://github.com/ever-co/ever-rec-desktop/commit/08ef60687fa0f50858d8a1c513277dcccbdc691b))

# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

# 0.1.0 (2025-05-09)


### Bug Fixes

* "buildResources" directory path in maker.options.json ([06f6b2a](https://github.com/ever-co/ever-capture/commit/06f6b2aa81fb13691c0da848729906530eafb307))
* app building ([c92eccb](https://github.com/ever-co/ever-capture/commit/c92eccb5c1c25d5ac82171c7a405ad55b11eeed5))
* appending of file properties to FormData ([1fc9376](https://github.com/ever-co/ever-capture/commit/1fc9376d79471ef5518a1baa7ef2eb19a9b9c6d9))
* index.html path and electron builder config ([2c250a4](https://github.com/ever-co/ever-capture/commit/2c250a4a80aa9c289e9c6780cc3cead9cb073988))


### Features

* configure macOS permissions and update activity calc ([63c6141](https://github.com/ever-co/ever-capture/commit/63c6141ba4123f4ad7e4292246a3953815d7b2ca))
* create worker that upload multiple files ([d6925b6](https://github.com/ever-co/ever-capture/commit/d6925b660e9a2e4a9266a2c585a67b1c9acb0c5a))
* dded electron-log and assigned its functions to console; updated main.ts imports ([538a848](https://github.com/ever-co/ever-capture/commit/538a8487ff52bb5e3a87526bf28fa51bff400e5a))
* **desktop:** enable media device enumeration ([96d28c3](https://github.com/ever-co/ever-capture/commit/96d28c3a7bbe6cee01fb1d654e8079600a3a20e4))
* **desktop:** implement periodic webcam photo capture ([fa2dbdb](https://github.com/ever-co/ever-capture/commit/fa2dbdb4139b326683260dca1c2fcac16596ab0f))
* **permissions:** auto-grant media permissions ([36b608f](https://github.com/ever-co/ever-capture/commit/36b608fa8498a81f21a4a764795bf7a5caf949c2))
* **photo:** make metadata optional for creation ([bb32221](https://github.com/ever-co/ever-capture/commit/bb3222111ed963f74bda130c43b74beb5f4c7171))
* setup electron project usin nx-electron ([10046ba](https://github.com/ever-co/ever-capture/commit/10046ba518027a6eeb17118bc8b2a54f9f837ae9))
* swap typeorm by knexjs ([f3a1f1e](https://github.com/ever-co/ever-capture/commit/f3a1f1eb21795100d282c6245e8227670517707d))
* updates upload process to use POST method ([23d30ca](https://github.com/ever-co/ever-capture/commit/23d30ca4af91fe572c39864faf5047c48cb59f6c))
* **upload:** implement item-based upload queue with UI and parallel processing ([a4e3df3](https://github.com/ever-co/ever-capture/commit/a4e3df3751db121359f024d9d78fd1d97a89af54))
* **webcam:** add audio recording functionality ([db2d995](https://github.com/ever-co/ever-capture/commit/db2d9952935d676db525c08e8881a9bf612e3787))
* **webcam:** make webcam preview always-on-top and draggable ([eefddb7](https://github.com/ever-co/ever-capture/commit/eefddb73c0f198c802f8c16263fd52a48337a14b))


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

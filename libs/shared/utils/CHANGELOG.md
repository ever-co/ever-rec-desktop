# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [0.2.1](https://github.com/ever-co/ever-capture/compare/utils-0.2.0...utils-0.2.1) (2025-05-02)



# [0.2.0](https://github.com/ever-co/ever-capture/compare/utils-0.1.2...utils-0.2.0) (2025-05-02)


### Bug Fixes

* fix inaccurate screenshot storage size calculation ([61ef441](https://github.com/ever-co/ever-capture/commit/61ef441e1d1b37885e896c9ad3d5418c55a1d860))
* **utils:** correct omitted property in IAudioMetadataInput ([c107292](https://github.com/ever-co/ever-capture/commit/c107292b3e76ad7771d370c6a6b3dbf98f255550))


### Features

* **audio:** add audio recording CRUD functionality ([11b1b10](https://github.com/ever-co/ever-capture/commit/11b1b10ec965875116c5fa8f88c3eb8f66bb6794))
* **audio:** capture and store audio duration, channels, and rate ([19e6f9e](https://github.com/ever-co/ever-capture/commit/19e6f9e438859a62a71fe24fefb583f70b0c0cb9))
* **audio:** link audio entities to corresponding video ([978bc3f](https://github.com/ever-co/ever-capture/commit/978bc3fedbdff61eed683bdc8b8f51b2b64b5292))
* **database:** add audio entity support ([a717dbf](https://github.com/ever-co/ever-capture/commit/a717dbf4c4eb767079b84c02ac55ce36cc7d9802))
* **date-picker:** change default date range to current week till now ([60b8b57](https://github.com/ever-co/ever-capture/commit/60b8b570cf6a4b2b1dab71a6f7f0f633257984e2))
* **desktop:** enable media device enumeration ([96d28c3](https://github.com/ever-co/ever-capture/commit/96d28c3a7bbe6cee01fb1d654e8079600a3a20e4))
* **desktop:** implement periodic webcam photo capture ([fa2dbdb](https://github.com/ever-co/ever-capture/commit/fa2dbdb4139b326683260dca1c2fcac16596ab0f))
* **electron:** implement mediator pattern for window communication ([ac4ae79](https://github.com/ever-co/ever-capture/commit/ac4ae79c4c37e201f597fbbce3e18d4705fd5b35))
* **mediator:** add outgoing mediator message type ([f96ccb8](https://github.com/ever-co/ever-capture/commit/f96ccb82eb326581e95d69989493ef03149bc119))
* **mediator:** add service and effects for inter-window state sync ([ff2bd68](https://github.com/ever-co/ever-capture/commit/ff2bd6888ac1ec7b34ad5a138ed5742e9bb7774b))
* **photo:** add photo capture and management functionality ([f674686](https://github.com/ever-co/ever-capture/commit/f6746866d756bd6f64d04fe317d6ddb48636e958))
* **photo:** make metadata optional for creation ([bb32221](https://github.com/ever-co/ever-capture/commit/bb3222111ed963f74bda130c43b74beb5f4c7171))
* **screenshot:** introduce screenshot chunking for multi-display captures ([0643604](https://github.com/ever-co/ever-capture/commit/0643604266df3d295ac8cbd28b2e678cf4816b3d))
* **settings:** add audio storage tracking and deletion ([1ceedbd](https://github.com/ever-co/ever-capture/commit/1ceedbd575b5f49da1ea85cb39b8e48d7acc6036))
* **settings:** add codec dropdown and initial webcam settings ([df644e6](https://github.com/ever-co/ever-capture/commit/df644e656b92a35dea2993c69c0dd862c4404405))
* **settings:** add granular delete and purge options for storage ([418df6d](https://github.com/ever-co/ever-capture/commit/418df6def7f107320da86110a385d46f0377f5f8))
* **shared-service:** implement ngrx state hydration via indexeddb ([eda38f9](https://github.com/ever-co/ever-capture/commit/eda38f9137530a5871d6a1c7ef197544f4345294))
* **statistics:** add confidence scores and advanced analysis to statistics ([17df069](https://github.com/ever-co/ever-capture/commit/17df0694add9391e985cf185d9e7e66d85fe1f1f))
* **storage:** include photo size in storage usage ([cd4e7f7](https://github.com/ever-co/ever-capture/commit/cd4e7f7e074a593b582b49cbeafcae2d5f48ea98))
* **tracking:** implement auto-start tracking based on persisted state ([02bdb33](https://github.com/ever-co/ever-capture/commit/02bdb33ac9bee83b2dc5379b2719e3c28fe561ee))
* update UI theme and video filename format ([6a36165](https://github.com/ever-co/ever-capture/commit/6a361652c9ae2cf657f540044c1dfabadfdb32e8))
* **webcam:** add audio recording functionality ([db2d995](https://github.com/ever-co/ever-capture/commit/db2d9952935d676db525c08e8881a9bf612e3787))
* **webcam:** add camera resolution selection ([2e5106b](https://github.com/ever-co/ever-capture/commit/2e5106ba7cfe289052be8a257a413be53af38f13))
* **webcam:** add microphone selection capability ([b3fed6b](https://github.com/ever-co/ever-capture/commit/b3fed6b1bba89758d0b0a05e6b1d136f5daab01a))
* **webcam:** add microphone support and refactor constraints builder ([7ce432e](https://github.com/ever-co/ever-capture/commit/7ce432e70266f6488bd8854a7b128e881307b322))
* **webcam:** add photo gallery and detail view ([c810cca](https://github.com/ever-co/ever-capture/commit/c810cca3ddcb6d7daeedc8a7b658de700718d045))
* **webcam:** add stop tracking functionality ([9eeeab1](https://github.com/ever-co/ever-capture/commit/9eeeab1977df60de9bc3138204e23757562f5993))



## [0.1.2](https://github.com/ever-co/ever-capture/compare/utils-0.1.1...utils-0.1.2) (2025-02-12)



## [0.1.1](https://github.com/ever-co/ever-capture/compare/utils-0.1.0...utils-0.1.1) (2025-02-12)



# 0.1.0 (2025-01-10)


### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* screenshot interface ([02095f4](https://github.com/ever-co/ever-capture/commit/02095f455e7103a992ebc7fff1d43e9bcfb62dd7))
* timeline generation for single videos ([508d8a2](https://github.com/ever-co/ever-capture/commit/508d8a22d270749b8bd150c24426335e33c01433))
* video conversion ([314c586](https://github.com/ever-co/ever-capture/commit/314c586480dedbe6099e5d080cdf633e63f080ab))


### Features

* create resize directive ([e1b8f3f](https://github.com/ever-co/ever-capture/commit/e1b8f3f4c9c932d03bb922ce3f1b289f20a48d52))
* dded codec and batch fields to VideoMetadata entity and updated VideoConversionService to use them; updated VideoMetadataService to save codec and batch; added codec, batch, and resolution to video config and updated interfaces accordingly ([157ba9e](https://github.com/ever-co/ever-capture/commit/157ba9eb15fab7c11f0e3b925f0fe52cb69fe26f))
* delete applications on purge ([42ce42b](https://github.com/ever-co/ever-capture/commit/42ce42bbd7fcf8dedb0fa1b61dfca21c247368e8))
* improve auto sync adding auto sync service ([46e247f](https://github.com/ever-co/ever-capture/commit/46e247f4d592c2be2b757e5954d33c7e27099d36))
* improve video upload setting ([4d71737](https://github.com/ever-co/ever-capture/commit/4d71737ef629795aabf9ef4bc08dce24e4a15808))
* initialize timeline structure ([943cf62](https://github.com/ever-co/ever-capture/commit/943cf6279083e81e98d1d542f60fe08a21013cae))
* optimize storage ([c73da1b](https://github.com/ever-co/ever-capture/commit/c73da1b0d79e33ba6fd85e21848254be77eee80a))
* separate all timeline elements ([6c3920a](https://github.com/ever-co/ever-capture/commit/6c3920a264f61c3905b74caa474a584eb6809e79))
* set 'private' to false in multiple package.json files ([b3506c9](https://github.com/ever-co/ever-capture/commit/b3506c95e079effddee1d6591afe213929ceeda4))
* swap typeorm by knexjs ([f3a1f1e](https://github.com/ever-co/ever-capture/commit/f3a1f1eb21795100d282c6245e8227670517707d))



## [0.4.2](https://github.com/ever-co/ever-capture/compare/utils-0.4.1...utils-0.4.2) (2025-01-09)


### Bug Fixes

* timeline generation for single videos ([508d8a2](https://github.com/ever-co/ever-capture/commit/508d8a22d270749b8bd150c24426335e33c01433))



## [0.4.2](https://github.com/ever-co/ever-capture/compare/utils-0.4.1...utils-0.4.2) (2025-01-09)


### Bug Fixes

* timeline generation for single videos ([508d8a2](https://github.com/ever-co/ever-capture/commit/508d8a22d270749b8bd150c24426335e33c01433))



## [0.4.1](https://github.com/ever-co/ever-capture/compare/utils-0.4.0...utils-0.4.1) (2025-01-09)



# [0.4.0](https://github.com/ever-co/ever-capture/compare/utils-0.3.2...utils-0.4.0) (2025-01-08)


### Features

* improve video upload setting ([4d71737](https://github.com/ever-co/ever-capture/commit/4d71737ef629795aabf9ef4bc08dce24e4a15808))



## [0.3.2](https://github.com/ever-co/ever-capture/compare/utils-0.3.1...utils-0.3.2) (2025-01-06)



## [0.3.1](https://github.com/ever-co/ever-capture/compare/utils-0.3.0...utils-0.3.1) (2025-01-06)



## [0.3.1](https://github.com/ever-co/ever-capture/compare/utils-0.3.0...utils-0.3.1) (2025-01-06)



# [0.3.0](https://github.com/ever-co/ever-capture/compare/utils-0.2.1...utils-0.3.0) (2024-12-26)


### Features

* delete applications on purge ([42ce42b](https://github.com/ever-co/ever-capture/commit/42ce42bbd7fcf8dedb0fa1b61dfca21c247368e8))
* optimize storage ([c73da1b](https://github.com/ever-co/ever-capture/commit/c73da1b0d79e33ba6fd85e21848254be77eee80a))



## [0.2.1](https://github.com/ever-co/ever-rec-desktop/compare/utils-0.2.0...utils-0.2.1) (2024-11-24)



## [0.2.1](https://github.com/ever-co/ever-rec-desktop/compare/utils-0.2.0...utils-0.2.1) (2024-11-24)



# [0.2.0](https://github.com/ever-co/ever-rec-desktop/compare/utils-0.1.2...utils-0.2.0) (2024-11-23)


### Features

* improve auto sync adding auto sync service ([46e247f](https://github.com/ever-co/ever-rec-desktop/commit/46e247f4d592c2be2b757e5954d33c7e27099d36))



## [0.1.2](https://github.com/ever-co/ever-rec-desktop/compare/utils-0.1.1...utils-0.1.2) (2024-11-23)



## [0.1.1](https://github.com/ever-co/ever-rec-desktop/compare/utils-0.1.0...utils-0.1.1) (2024-11-23)


### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



# 0.1.0 (2024-11-20)


### Bug Fixes

* screenshot interface ([02095f4](https://github.com/ever-co/ever-rec-desktop/commit/02095f455e7103a992ebc7fff1d43e9bcfb62dd7))
* video conversion ([314c586](https://github.com/ever-co/ever-rec-desktop/commit/314c586480dedbe6099e5d080cdf633e63f080ab))


### Features

* create resize directive ([e1b8f3f](https://github.com/ever-co/ever-rec-desktop/commit/e1b8f3f4c9c932d03bb922ce3f1b289f20a48d52))
* dded codec and batch fields to VideoMetadata entity and updated VideoConversionService to use them; updated VideoMetadataService to save codec and batch; added codec, batch, and resolution to video config and updated interfaces accordingly ([157ba9e](https://github.com/ever-co/ever-rec-desktop/commit/157ba9eb15fab7c11f0e3b925f0fe52cb69fe26f))
* initialize timeline structure ([943cf62](https://github.com/ever-co/ever-rec-desktop/commit/943cf6279083e81e98d1d542f60fe08a21013cae))
* separate all timeline elements ([6c3920a](https://github.com/ever-co/ever-rec-desktop/commit/6c3920a264f61c3905b74caa474a584eb6809e79))
* set 'private' to false in multiple package.json files ([b3506c9](https://github.com/ever-co/ever-rec-desktop/commit/b3506c95e079effddee1d6591afe213929ceeda4))
* swap typeorm by knexjs ([f3a1f1e](https://github.com/ever-co/ever-rec-desktop/commit/f3a1f1eb21795100d282c6245e8227670517707d))

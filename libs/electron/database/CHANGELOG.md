# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

# [0.2.0](https://github.com/ever-co/ever-capture/compare/database-electron-0.1.2...database-electron-0.2.0) (2025-05-02)

### Dependency Updates

* `electron-utils` updated to version `0.2.0`
* `utils` updated to version `0.2.0`

### Bug Fixes

* **audio:** associate audio with latest time log even if stopped ([dce74bf](https://github.com/ever-co/ever-capture/commit/dce74bfec8a3dd49aaa7018379d3ac8a7c8df770))
* fix inaccurate screenshot storage size calculation ([61ef441](https://github.com/ever-co/ever-capture/commit/61ef441e1d1b37885e896c9ad3d5418c55a1d860))


### Features

* **audio:** add audio recording CRUD functionality ([11b1b10](https://github.com/ever-co/ever-capture/commit/11b1b10ec965875116c5fa8f88c3eb8f66bb6794))
* **audio:** add channel/rate metadata and refactor worker ([e307cc1](https://github.com/ever-co/ever-capture/commit/e307cc1f38bc36f82edb80031557a679b6c115c6))
* **audio:** link audio entities to corresponding video ([978bc3f](https://github.com/ever-co/ever-capture/commit/978bc3fedbdff61eed683bdc8b8f51b2b64b5292))
* configure macOS permissions and update activity calc ([63c6141](https://github.com/ever-co/ever-capture/commit/63c6141ba4123f4ad7e4292246a3953815d7b2ca))
* **database:** add audio entity support ([a717dbf](https://github.com/ever-co/ever-capture/commit/a717dbf4c4eb767079b84c02ac55ce36cc7d9802))
* **database:** link audio and video entities ([6852806](https://github.com/ever-co/ever-capture/commit/685280609f42baf475723e601ecb6525eaa44b81))
* **database:** link root audio to video on timeline insert ([2128058](https://github.com/ever-co/ever-capture/commit/21280585b380e9f528048c22decc611cb0d4bc7a))
* **desktop:** implement periodic webcam photo capture ([fa2dbdb](https://github.com/ever-co/ever-capture/commit/fa2dbdb4139b326683260dca1c2fcac16596ab0f))
* **photo:** add photo capture and management functionality ([f674686](https://github.com/ever-co/ever-capture/commit/f6746866d756bd6f64d04fe317d6ddb48636e958))
* **screenshot:** introduce screenshot chunking for multi-display captures ([0643604](https://github.com/ever-co/ever-capture/commit/0643604266df3d295ac8cbd28b2e678cf4816b3d))
* **settings:** add audio storage tracking and deletion ([1ceedbd](https://github.com/ever-co/ever-capture/commit/1ceedbd575b5f49da1ea85cb39b8e48d7acc6036))
* **statistics:** add confidence scores and advanced analysis to statistics ([17df069](https://github.com/ever-co/ever-capture/commit/17df0694add9391e985cf185d9e7e66d85fe1f1f))
* **storage:** include photo size in storage usage ([cd4e7f7](https://github.com/ever-co/ever-capture/commit/cd4e7f7e074a593b582b49cbeafcae2d5f48ea98))



## [0.1.2](https://github.com/ever-co/ever-capture/compare/database-electron-0.1.1...database-electron-0.1.2) (2025-02-12)

### Dependency Updates

* `electron-utils` updated to version `0.1.2`
* `utils` updated to version `0.1.2`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/database-electron-0.1.1...database-electron-0.1.2) (2025-02-12)

### Dependency Updates

* `electron-utils` updated to version `0.1.2`
* `utils` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/database-electron-0.1.0...database-electron-0.1.1) (2025-02-12)

### Dependency Updates

* `electron-utils` updated to version `0.1.1`
* `utils` updated to version `0.1.1`


# 0.1.0 (2025-01-10)

### Dependency Updates

* `electron-utils` updated to version `0.1.0`
* `utils` updated to version `0.1.0`

### Bug Fixes

* delete dynamic element on update ([8119d9e](https://github.com/ever-co/ever-capture/commit/8119d9ec6ba44e02b19b2a4b52f80ac8194ba9a7))
* npm package name ([6018f87](https://github.com/ever-co/ever-capture/commit/6018f87419f5149440d5a4dce4f184b736e3740c))
* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* start and end of day ([0169069](https://github.com/ever-co/ever-capture/commit/0169069767c9af4d36f8d28e138c6cbeb89e74f0))
* timeline generation for single videos ([508d8a2](https://github.com/ever-co/ever-capture/commit/508d8a22d270749b8bd150c24426335e33c01433))
* video conversion ([314c586](https://github.com/ever-co/ever-capture/commit/314c586480dedbe6099e5d080cdf633e63f080ab))


### Features

* added 'codec' and 'batch' properties to video metadata" ([35d5478](https://github.com/ever-co/ever-capture/commit/35d54787b9795f0327cfff06b7625bb84cca2ee4))
* dded codec and batch fields to VideoMetadata entity and updated VideoConversionService to use them; updated VideoMetadataService to save codec and batch; added codec, batch, and resolution to video config and updated interfaces accordingly ([157ba9e](https://github.com/ever-co/ever-capture/commit/157ba9eb15fab7c11f0e3b925f0fe52cb69fe26f))
* delete applications on purge ([42ce42b](https://github.com/ever-co/ever-capture/commit/42ce42bbd7fcf8dedb0fa1b61dfca21c247368e8))
* improve ([ca0c7da](https://github.com/ever-co/ever-capture/commit/ca0c7da98ae74a395ae7f9edf31971afaefd30df))
* optimize storage ([c73da1b](https://github.com/ever-co/ever-capture/commit/c73da1b0d79e33ba6fd85e21848254be77eee80a))
* set 'private' to false in multiple package.json files ([b3506c9](https://github.com/ever-co/ever-capture/commit/b3506c95e079effddee1d6591afe213929ceeda4))
* swap typeorm by knexjs ([f3a1f1e](https://github.com/ever-co/ever-capture/commit/f3a1f1eb21795100d282c6245e8227670517707d))



## [0.2.9](https://github.com/ever-co/ever-capture/compare/database-electron-0.2.8...database-electron-0.2.9) (2025-01-10)

### Dependency Updates

* `electron-utils` updated to version `0.5.0`


## [0.2.8](https://github.com/ever-co/ever-capture/compare/database-electron-0.2.7...database-electron-0.2.8) (2025-01-10)

### Dependency Updates

* `electron-utils` updated to version `0.4.4`


## [0.2.7](https://github.com/ever-co/ever-capture/compare/database-electron-0.2.6...database-electron-0.2.7) (2025-01-09)

### Dependency Updates

* `electron-utils` updated to version `0.4.3`
* `utils` updated to version `0.4.2`


## [0.2.6](https://github.com/ever-co/ever-capture/compare/database-electron-0.2.5...database-electron-0.2.6) (2025-01-09)

### Dependency Updates

* `electron-utils` updated to version `0.4.2`
* `utils` updated to version `0.4.1`

### Bug Fixes

* timeline generation for single videos ([508d8a2](https://github.com/ever-co/ever-capture/commit/508d8a22d270749b8bd150c24426335e33c01433))



## [0.2.5](https://github.com/ever-co/ever-capture/compare/database-electron-0.2.4...database-electron-0.2.5) (2025-01-09)

### Dependency Updates

* `electron-utils` updated to version `0.4.0`
* `utils` updated to version `0.4.1`


## [0.2.4](https://github.com/ever-co/ever-capture/compare/database-electron-0.2.3...database-electron-0.2.4) (2025-01-08)

### Dependency Updates

* `electron-utils` updated to version `0.3.1`
* `utils` updated to version `0.4.0`


## [0.2.3](https://github.com/ever-co/ever-capture/compare/database-electron-0.2.2...database-electron-0.2.3) (2025-01-07)

### Dependency Updates

* `electron-utils` updated to version `0.3.0`
* `utils` updated to version `0.3.2`


## [0.2.2](https://github.com/ever-co/ever-capture/compare/database-electron-0.2.1...database-electron-0.2.2) (2025-01-06)

### Dependency Updates

* `electron-utils` updated to version `0.2.3`
* `utils` updated to version `0.3.1`


## [0.2.1](https://github.com/ever-co/ever-capture/compare/database-electron-0.2.0...database-electron-0.2.1) (2025-01-06)

### Dependency Updates

* `electron-utils` updated to version `0.2.2`
* `utils` updated to version `0.3.0`


# [0.2.0](https://github.com/ever-co/ever-capture/compare/database-electron-0.1.4...database-electron-0.2.0) (2024-12-26)

### Dependency Updates

* `electron-utils` updated to version `0.1.5`
* `utils` updated to version `0.3.0`

### Features

* delete applications on purge ([42ce42b](https://github.com/ever-co/ever-capture/commit/42ce42bbd7fcf8dedb0fa1b61dfca21c247368e8))
* optimize storage ([c73da1b](https://github.com/ever-co/ever-capture/commit/c73da1b0d79e33ba6fd85e21848254be77eee80a))



## [0.1.4](https://github.com/ever-co/ever-rec-desktop/compare/database-electron-0.1.3...database-electron-0.1.4) (2024-11-24)

### Dependency Updates

* `electron-utils` updated to version `0.1.4`
* `utils` updated to version `0.2.1`


## [0.1.3](https://github.com/ever-co/ever-rec-desktop/compare/database-electron-0.1.2...database-electron-0.1.3) (2024-11-23)

### Dependency Updates

* `electron-utils` updated to version `0.1.3`
* `utils` updated to version `0.2.0`


## [0.1.2](https://github.com/ever-co/ever-rec-desktop/compare/database-electron-0.1.1...database-electron-0.1.2) (2024-11-23)

### Dependency Updates

* `electron-utils` updated to version `0.1.2`
* `utils` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-rec-desktop/compare/database-electron-0.1.0...database-electron-0.1.1) (2024-11-23)

### Dependency Updates

* `electron-utils` updated to version `0.1.1`
* `utils` updated to version `0.1.1`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



# 0.1.0 (2024-11-20)

### Dependency Updates

* `electron-utils` updated to version `0.1.0`
* `utils` updated to version `0.1.0`

### Bug Fixes

* npm package name ([6018f87](https://github.com/ever-co/ever-rec-desktop/commit/6018f87419f5149440d5a4dce4f184b736e3740c))
* start and end of day ([0169069](https://github.com/ever-co/ever-rec-desktop/commit/0169069767c9af4d36f8d28e138c6cbeb89e74f0))
* video conversion ([314c586](https://github.com/ever-co/ever-rec-desktop/commit/314c586480dedbe6099e5d080cdf633e63f080ab))


### Features

* added 'codec' and 'batch' properties to video metadata" ([35d5478](https://github.com/ever-co/ever-rec-desktop/commit/35d54787b9795f0327cfff06b7625bb84cca2ee4))
* dded codec and batch fields to VideoMetadata entity and updated VideoConversionService to use them; updated VideoMetadataService to save codec and batch; added codec, batch, and resolution to video config and updated interfaces accordingly ([157ba9e](https://github.com/ever-co/ever-rec-desktop/commit/157ba9eb15fab7c11f0e3b925f0fe52cb69fe26f))
* improve ([ca0c7da](https://github.com/ever-co/ever-rec-desktop/commit/ca0c7da98ae74a395ae7f9edf31971afaefd30df))
* set 'private' to false in multiple package.json files ([b3506c9](https://github.com/ever-co/ever-rec-desktop/commit/b3506c95e079effddee1d6591afe213929ceeda4))
* swap typeorm by knexjs ([f3a1f1e](https://github.com/ever-co/ever-rec-desktop/commit/f3a1f1eb21795100d282c6245e8227670517707d))

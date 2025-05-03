# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [0.2.6](https://github.com/ever-co/ever-capture/compare/event-0.2.5...event-0.2.6) (2025-05-03)

### Dependency Updates

* `window` updated to version `0.3.0`

### Bug Fixes

* **event:** optimize mediator instance usage in event handling ([cb8a64d](https://github.com/ever-co/ever-capture/commit/cb8a64d8d250f1c8330da3ef8c816b02ee76acb2))



## [0.2.5](https://github.com/ever-co/ever-capture/compare/event-0.2.4...event-0.2.5) (2025-05-03)

### Dependency Updates

* `window` updated to version `0.2.2`


## [0.2.4](https://github.com/ever-co/ever-capture/compare/event-0.2.3...event-0.2.4) (2025-05-03)

### Dependency Updates

* `window` updated to version `0.2.0`


## [0.2.3](https://github.com/ever-co/ever-capture/compare/event-0.2.2...event-0.2.3) (2025-05-03)



## [0.2.2](https://github.com/ever-co/ever-capture/compare/event-0.2.1...event-0.2.2) (2025-05-03)



## [0.2.1](https://github.com/ever-co/ever-capture/compare/event-0.2.0...event-0.2.1) (2025-05-02)

### Dependency Updates

* `utils` updated to version `0.2.1`
* `window` updated to version `0.2.0`


# [0.2.0](https://github.com/ever-co/ever-capture/compare/event-0.1.2...event-0.2.0) (2025-05-02)

### Dependency Updates

* `database-electron` updated to version `0.2.0`
* `electron-utils` updated to version `0.3.0`
* `utils` updated to version `0.2.0`
* `window` updated to version `0.1.0`

### Bug Fixes

* **electron/event:** increase padding for photo preview window ([c70f098](https://github.com/ever-co/ever-capture/commit/c70f098e46ce7886de9a5cd8b8a36b6c14d7aa3e))
* **event:** delay auto stop sync until stream window closes ([b1c3d31](https://github.com/ever-co/ever-capture/commit/b1c3d31e4574a92c6a138cf21a5bde1d560fd2b8))
* **event:** select only parent screenshots for timelog filter ([cf9efc5](https://github.com/ever-co/ever-capture/commit/cf9efc5ba0de94f883996764a713ecc1a20dc8cc))
* **photo-capture:** ensure capture ticks only during active tracking ([3a13f77](https://github.com/ever-co/ever-capture/commit/3a13f77567d0ca38ce2d88bbddcd1a84b81d3c8b))
* **stream:** correct stream window closing and resolutions ([81bea96](https://github.com/ever-co/ever-capture/commit/81bea960ae34aa62a3edcbc973e74f7e59a328fe))
* **window:** properly handle stream window closure and destruction ([8cbe0a2](https://github.com/ever-co/ever-capture/commit/8cbe0a20988a1295b86418d6330eec8a24ee7f20))


### Features

* **audio:** add audio recording CRUD functionality ([11b1b10](https://github.com/ever-co/ever-capture/commit/11b1b10ec965875116c5fa8f88c3eb8f66bb6794))
* **audio:** add channel/rate metadata and refactor worker ([e307cc1](https://github.com/ever-co/ever-capture/commit/e307cc1f38bc36f82edb80031557a679b6c115c6))
* **audio:** add chunk count and action buttons to metadata display ([0a01b46](https://github.com/ever-co/ever-capture/commit/0a01b460eced09d254b29cc696ff5d5ea01f6c39))
* **audio:** capture and store audio duration, channels, and rate ([19e6f9e](https://github.com/ever-co/ever-capture/commit/19e6f9e438859a62a71fe24fefb583f70b0c0cb9))
* **audio:** link audio entities to corresponding video ([978bc3f](https://github.com/ever-co/ever-capture/commit/978bc3fedbdff61eed683bdc8b8f51b2b64b5292))
* **desktop:** implement periodic webcam photo capture ([fa2dbdb](https://github.com/ever-co/ever-capture/commit/fa2dbdb4139b326683260dca1c2fcac16596ab0f))
* **electron:** implement mediator pattern for window communication ([ac4ae79](https://github.com/ever-co/ever-capture/commit/ac4ae79c4c37e201f597fbbce3e18d4705fd5b35))
* **mediator:** add service and effects for inter-window state sync ([ff2bd68](https://github.com/ever-co/ever-capture/commit/ff2bd6888ac1ec7b34ad5a138ed5742e9bb7774b))
* **photo:** add photo capture and management functionality ([f674686](https://github.com/ever-co/ever-capture/commit/f6746866d756bd6f64d04fe317d6ddb48636e958))
* **screenshot:** add support for viewing screenshot chunks ([01f7374](https://github.com/ever-co/ever-capture/commit/01f737459437b3ff190fb8d1875a9b0c46671c17))
* **screenshot:** introduce screenshot chunking for multi-display captures ([0643604](https://github.com/ever-co/ever-capture/commit/0643604266df3d295ac8cbd28b2e678cf4816b3d))
* **settings:** add granular delete and purge options for storage ([418df6d](https://github.com/ever-co/ever-capture/commit/418df6def7f107320da86110a385d46f0377f5f8))
* **tracking:** implement auto-start tracking based on persisted state ([02bdb33](https://github.com/ever-co/ever-capture/commit/02bdb33ac9bee83b2dc5379b2719e3c28fe561ee))
* **webcam:** add audio gallery and management ([5fcb1af](https://github.com/ever-co/ever-capture/commit/5fcb1afcb7f1496dd620731423c7192a23ccea36))
* **webcam:** add audio recording functionality ([db2d995](https://github.com/ever-co/ever-capture/commit/db2d9952935d676db525c08e8881a9bf612e3787))
* **webcam:** add stop tracking functionality ([9eeeab1](https://github.com/ever-co/ever-capture/commit/9eeeab1977df60de9bc3138204e23757562f5993))
* **webcam:** enable photo capture via electron event ([54c30d7](https://github.com/ever-co/ever-capture/commit/54c30d7fad7a89c4b277b6d37c30ce799a83cded))
* **webcam:** make webcam preview always-on-top and draggable ([eefddb7](https://github.com/ever-co/ever-capture/commit/eefddb73c0f198c802f8c16263fd52a48337a14b))


### Performance Improvements

* **webcam:** offload audio blob processing to web worker ([89a8f7d](https://github.com/ever-co/ever-capture/commit/89a8f7d3da17b89e54fa23d7f6e6afc1036ddaa0))



# [0.2.0](https://github.com/ever-co/ever-capture/compare/event-0.1.2...event-0.2.0) (2025-05-02)

### Dependency Updates

* `database-electron` updated to version `0.2.0`
* `electron-utils` updated to version `0.3.0`
* `utils` updated to version `0.2.0`
* `window` updated to version `0.1.0`

### Bug Fixes

* **electron/event:** increase padding for photo preview window ([c70f098](https://github.com/ever-co/ever-capture/commit/c70f098e46ce7886de9a5cd8b8a36b6c14d7aa3e))
* **event:** delay auto stop sync until stream window closes ([b1c3d31](https://github.com/ever-co/ever-capture/commit/b1c3d31e4574a92c6a138cf21a5bde1d560fd2b8))
* **event:** select only parent screenshots for timelog filter ([cf9efc5](https://github.com/ever-co/ever-capture/commit/cf9efc5ba0de94f883996764a713ecc1a20dc8cc))
* **photo-capture:** ensure capture ticks only during active tracking ([3a13f77](https://github.com/ever-co/ever-capture/commit/3a13f77567d0ca38ce2d88bbddcd1a84b81d3c8b))
* **stream:** correct stream window closing and resolutions ([81bea96](https://github.com/ever-co/ever-capture/commit/81bea960ae34aa62a3edcbc973e74f7e59a328fe))
* **window:** properly handle stream window closure and destruction ([8cbe0a2](https://github.com/ever-co/ever-capture/commit/8cbe0a20988a1295b86418d6330eec8a24ee7f20))


### Features

* **audio:** add audio recording CRUD functionality ([11b1b10](https://github.com/ever-co/ever-capture/commit/11b1b10ec965875116c5fa8f88c3eb8f66bb6794))
* **audio:** add channel/rate metadata and refactor worker ([e307cc1](https://github.com/ever-co/ever-capture/commit/e307cc1f38bc36f82edb80031557a679b6c115c6))
* **audio:** add chunk count and action buttons to metadata display ([0a01b46](https://github.com/ever-co/ever-capture/commit/0a01b460eced09d254b29cc696ff5d5ea01f6c39))
* **audio:** capture and store audio duration, channels, and rate ([19e6f9e](https://github.com/ever-co/ever-capture/commit/19e6f9e438859a62a71fe24fefb583f70b0c0cb9))
* **audio:** link audio entities to corresponding video ([978bc3f](https://github.com/ever-co/ever-capture/commit/978bc3fedbdff61eed683bdc8b8f51b2b64b5292))
* **desktop:** implement periodic webcam photo capture ([fa2dbdb](https://github.com/ever-co/ever-capture/commit/fa2dbdb4139b326683260dca1c2fcac16596ab0f))
* **electron:** implement mediator pattern for window communication ([ac4ae79](https://github.com/ever-co/ever-capture/commit/ac4ae79c4c37e201f597fbbce3e18d4705fd5b35))
* **mediator:** add service and effects for inter-window state sync ([ff2bd68](https://github.com/ever-co/ever-capture/commit/ff2bd6888ac1ec7b34ad5a138ed5742e9bb7774b))
* **photo:** add photo capture and management functionality ([f674686](https://github.com/ever-co/ever-capture/commit/f6746866d756bd6f64d04fe317d6ddb48636e958))
* **screenshot:** add support for viewing screenshot chunks ([01f7374](https://github.com/ever-co/ever-capture/commit/01f737459437b3ff190fb8d1875a9b0c46671c17))
* **screenshot:** introduce screenshot chunking for multi-display captures ([0643604](https://github.com/ever-co/ever-capture/commit/0643604266df3d295ac8cbd28b2e678cf4816b3d))
* **settings:** add granular delete and purge options for storage ([418df6d](https://github.com/ever-co/ever-capture/commit/418df6def7f107320da86110a385d46f0377f5f8))
* **tracking:** implement auto-start tracking based on persisted state ([02bdb33](https://github.com/ever-co/ever-capture/commit/02bdb33ac9bee83b2dc5379b2719e3c28fe561ee))
* **webcam:** add audio gallery and management ([5fcb1af](https://github.com/ever-co/ever-capture/commit/5fcb1afcb7f1496dd620731423c7192a23ccea36))
* **webcam:** add audio recording functionality ([db2d995](https://github.com/ever-co/ever-capture/commit/db2d9952935d676db525c08e8881a9bf612e3787))
* **webcam:** add stop tracking functionality ([9eeeab1](https://github.com/ever-co/ever-capture/commit/9eeeab1977df60de9bc3138204e23757562f5993))
* **webcam:** enable photo capture via electron event ([54c30d7](https://github.com/ever-co/ever-capture/commit/54c30d7fad7a89c4b277b6d37c30ce799a83cded))
* **webcam:** make webcam preview always-on-top and draggable ([eefddb7](https://github.com/ever-co/ever-capture/commit/eefddb73c0f198c802f8c16263fd52a48337a14b))


### Performance Improvements

* **webcam:** offload audio blob processing to web worker ([89a8f7d](https://github.com/ever-co/ever-capture/commit/89a8f7d3da17b89e54fa23d7f6e6afc1036ddaa0))



## [0.1.2](https://github.com/ever-co/ever-capture/compare/event-0.1.1...event-0.1.2) (2025-02-12)

### Dependency Updates

* `database-electron` updated to version `0.1.2`
* `electron-utils` updated to version `0.1.2`
* `utils` updated to version `0.1.2`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/event-0.1.1...event-0.1.2) (2025-02-12)

### Dependency Updates

* `database-electron` updated to version `0.1.2`
* `electron-utils` updated to version `0.1.2`
* `utils` updated to version `0.1.2`


## [0.1.2](https://github.com/ever-co/ever-capture/compare/event-0.1.1...event-0.1.2) (2025-02-12)

### Dependency Updates

* `database-electron` updated to version `0.1.1`
* `electron-utils` updated to version `0.1.2`
* `utils` updated to version `0.1.2`


## [0.1.1](https://github.com/ever-co/ever-capture/compare/event-0.1.0...event-0.1.1) (2025-02-12)

### Dependency Updates

* `database-electron` updated to version `0.1.1`
* `electron-utils` updated to version `0.1.1`
* `utils` updated to version `0.1.1`


# 0.1.0 (2025-01-10)

### Dependency Updates

* `database-electron` updated to version `0.1.0`
* `electron-utils` updated to version `0.1.0`
* `utils` updated to version `0.1.0`

### Bug Fixes

* duplicated icon in storage ([cacc9de](https://github.com/ever-co/ever-capture/commit/cacc9decbe0eb2f70b9ea0c6d797160eb27ecfda))
* not found screen source ([fa641d3](https://github.com/ever-co/ever-capture/commit/fa641d3a99a450ef7871e7d85114994bde2d0b21))
* npm package name ([6018f87](https://github.com/ever-co/ever-capture/commit/6018f87419f5149440d5a4dce4f184b736e3740c))
* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))
* video conversion ([314c586](https://github.com/ever-co/ever-capture/commit/314c586480dedbe6099e5d080cdf633e63f080ab))


### Features

* add jsdoc ([29b2c34](https://github.com/ever-co/ever-capture/commit/29b2c34ac2df1bed805dcee17ac243b0365540d0))
* add logger ([d476aff](https://github.com/ever-co/ever-capture/commit/d476aff3cc9538243b3cff86ba2f01eef40c3938))
* delete applications on purge ([42ce42b](https://github.com/ever-co/ever-capture/commit/42ce42bbd7fcf8dedb0fa1b61dfca21c247368e8))
* improve ([ca0c7da](https://github.com/ever-co/ever-capture/commit/ca0c7da98ae74a395ae7f9edf31971afaefd30df))
* improve screenshot metadat query and capture ([8205d10](https://github.com/ever-co/ever-capture/commit/8205d1047b0d12ab32a0b8245828ce080d5a4218))
* optimize storage ([c73da1b](https://github.com/ever-co/ever-capture/commit/c73da1b0d79e33ba6fd85e21848254be77eee80a))
* set 'private' to false in multiple package.json files ([b3506c9](https://github.com/ever-co/ever-capture/commit/b3506c95e079effddee1d6591afe213929ceeda4))
* swap typeorm by knexjs ([f3a1f1e](https://github.com/ever-co/ever-capture/commit/f3a1f1eb21795100d282c6245e8227670517707d))



## [0.2.8](https://github.com/ever-co/ever-capture/compare/event-0.2.7...event-0.2.8) (2025-01-10)

### Dependency Updates

* `database-electron` updated to version `0.2.9`
* `electron-utils` updated to version `0.5.0`


## [0.2.7](https://github.com/ever-co/ever-capture/compare/event-0.2.6...event-0.2.7) (2025-01-10)

### Dependency Updates

* `database-electron` updated to version `0.2.8`
* `electron-utils` updated to version `0.4.4`


## [0.2.6](https://github.com/ever-co/ever-capture/compare/event-0.2.5...event-0.2.6) (2025-01-09)

### Dependency Updates

* `database-electron` updated to version `0.2.7`
* `electron-utils` updated to version `0.4.3`
* `utils` updated to version `0.4.2`


## [0.2.5](https://github.com/ever-co/ever-capture/compare/event-0.2.4...event-0.2.5) (2025-01-09)

### Dependency Updates

* `database-electron` updated to version `0.2.5`
* `electron-utils` updated to version `0.4.0`
* `utils` updated to version `0.4.1`


## [0.2.4](https://github.com/ever-co/ever-capture/compare/event-0.2.3...event-0.2.4) (2025-01-08)

### Dependency Updates

* `database-electron` updated to version `0.2.4`
* `electron-utils` updated to version `0.3.1`
* `utils` updated to version `0.4.0`


## [0.2.3](https://github.com/ever-co/ever-capture/compare/event-0.2.2...event-0.2.3) (2025-01-07)

### Dependency Updates

* `database-electron` updated to version `0.2.3`
* `electron-utils` updated to version `0.3.0`
* `utils` updated to version `0.3.2`


## [0.2.2](https://github.com/ever-co/ever-capture/compare/event-0.2.1...event-0.2.2) (2025-01-06)

### Dependency Updates

* `database-electron` updated to version `0.2.2`
* `electron-utils` updated to version `0.2.3`
* `utils` updated to version `0.3.1`


## [0.2.1](https://github.com/ever-co/ever-capture/compare/event-0.2.0...event-0.2.1) (2025-01-06)

### Dependency Updates

* `database-electron` updated to version `0.2.1`
* `electron-utils` updated to version `0.2.2`
* `utils` updated to version `0.3.0`


# [0.2.0](https://github.com/ever-co/ever-capture/compare/event-0.1.6...event-0.2.0) (2024-12-26)

### Dependency Updates

* `database-electron` updated to version `0.2.0`
* `electron-utils` updated to version `0.1.5`
* `utils` updated to version `0.3.0`

### Bug Fixes

* duplicated icon in storage ([cacc9de](https://github.com/ever-co/ever-capture/commit/cacc9decbe0eb2f70b9ea0c6d797160eb27ecfda))


### Features

* delete applications on purge ([42ce42b](https://github.com/ever-co/ever-capture/commit/42ce42bbd7fcf8dedb0fa1b61dfca21c247368e8))
* optimize storage ([c73da1b](https://github.com/ever-co/ever-capture/commit/c73da1b0d79e33ba6fd85e21848254be77eee80a))



## [0.1.6](https://github.com/ever-co/ever-rec-desktop/compare/event-0.1.5...event-0.1.6) (2024-11-25)



## [0.1.5](https://github.com/ever-co/ever-rec-desktop/compare/event-0.1.4...event-0.1.5) (2024-11-24)

### Dependency Updates

* `database-electron` updated to version `0.1.4`
* `electron-utils` updated to version `0.1.4`
* `utils` updated to version `0.2.1`


## [0.1.4](https://github.com/ever-co/ever-rec-desktop/compare/event-0.1.3...event-0.1.4) (2024-11-23)

### Dependency Updates

* `database-electron` updated to version `0.1.3`
* `electron-utils` updated to version `0.1.3`
* `utils` updated to version `0.2.0`


## [0.1.3](https://github.com/ever-co/ever-rec-desktop/compare/event-0.1.2...event-0.1.3) (2024-11-23)

### Dependency Updates

* `database-electron` updated to version `0.1.1`
* `electron-utils` updated to version `0.1.1`
* `utils` updated to version `0.1.1`

### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.1.2](https://github.com/ever-co/ever-rec-desktop/compare/event-0.1.1...event-0.1.2) (2024-11-21)



## [0.1.1](https://github.com/ever-co/ever-rec-desktop/compare/event-0.1.0...event-0.1.1) (2024-11-20)

### Dependency Updates

* `database-electron` updated to version `0.1.0`
* `electron-utils` updated to version `0.1.0`


# 0.1.0 (2024-11-20)

### Dependency Updates

* `database-electron` updated to version `0.1.0`
* `electron-utils` updated to version `0.1.0`
* `utils` updated to version `0.1.0`

### Bug Fixes

* not found screen source ([fa641d3](https://github.com/ever-co/ever-rec-desktop/commit/fa641d3a99a450ef7871e7d85114994bde2d0b21))
* npm package name ([6018f87](https://github.com/ever-co/ever-rec-desktop/commit/6018f87419f5149440d5a4dce4f184b736e3740c))
* video conversion ([314c586](https://github.com/ever-co/ever-rec-desktop/commit/314c586480dedbe6099e5d080cdf633e63f080ab))


### Features

* add jsdoc ([29b2c34](https://github.com/ever-co/ever-rec-desktop/commit/29b2c34ac2df1bed805dcee17ac243b0365540d0))
* add logger ([d476aff](https://github.com/ever-co/ever-rec-desktop/commit/d476aff3cc9538243b3cff86ba2f01eef40c3938))
* improve ([ca0c7da](https://github.com/ever-co/ever-rec-desktop/commit/ca0c7da98ae74a395ae7f9edf31971afaefd30df))
* improve screenshot metadat query and capture ([8205d10](https://github.com/ever-co/ever-rec-desktop/commit/8205d1047b0d12ab32a0b8245828ce080d5a4218))
* set 'private' to false in multiple package.json files ([b3506c9](https://github.com/ever-co/ever-rec-desktop/commit/b3506c95e079effddee1d6591afe213929ceeda4))
* swap typeorm by knexjs ([f3a1f1e](https://github.com/ever-co/ever-rec-desktop/commit/f3a1f1eb21795100d282c6245e8227670517707d))

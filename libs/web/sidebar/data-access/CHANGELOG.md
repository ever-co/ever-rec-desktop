# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

# [1.0.0](https://github.com/ever-co/ever-capture/compare/sidebar-0.1.2...sidebar-1.0.0) (2025-05-11)


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



# 0.1.0 (2025-05-09)


### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))


### Features

* implement sidebar ([0e5252d](https://github.com/ever-co/ever-capture/commit/0e5252d4a984b1111daf7d260994cf71fe68ae2c))
* separate all timeline elements ([6c3920a](https://github.com/ever-co/ever-capture/commit/6c3920a264f61c3905b74caa474a584eb6809e79))



## [0.1.2](https://github.com/ever-co/ever-capture/compare/sidebar-0.1.1...sidebar-0.1.2) (2025-05-02)



## [0.1.1](https://github.com/ever-co/ever-capture/compare/sidebar-0.1.0...sidebar-0.1.1) (2025-02-12)



# 0.1.0 (2025-01-10)


### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))


### Features

* implement sidebar ([0e5252d](https://github.com/ever-co/ever-capture/commit/0e5252d4a984b1111daf7d260994cf71fe68ae2c))
* separate all timeline elements ([6c3920a](https://github.com/ever-co/ever-capture/commit/6c3920a264f61c3905b74caa474a584eb6809e79))



## [0.1.4](https://github.com/ever-co/ever-capture/compare/sidebar-0.1.3...sidebar-0.1.4) (2024-12-26)



## [0.1.3](https://github.com/ever-co/ever-rec-desktop/compare/sidebar-0.1.2...sidebar-0.1.3) (2024-11-23)



## [0.1.2](https://github.com/ever-co/ever-rec-desktop/compare/sidebar-0.1.1...sidebar-0.1.2) (2024-11-23)


### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



## [0.1.1](https://github.com/ever-co/ever-rec-desktop/compare/sidebar-0.1.0...sidebar-0.1.1) (2024-11-22)



# 0.1.0 (2024-11-20)


### Features

* implement sidebar ([0e5252d](https://github.com/ever-co/ever-rec-desktop/commit/0e5252d4a984b1111daf7d260994cf71fe68ae2c))
* separate all timeline elements ([6c3920a](https://github.com/ever-co/ever-rec-desktop/commit/6c3920a264f61c3905b74caa474a584eb6809e79))

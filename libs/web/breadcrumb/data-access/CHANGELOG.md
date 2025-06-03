# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.1](https://github.com/ever-co/ever-rec-desktop/compare/breadcrumb-data-access-1.0.0...breadcrumb-data-access-1.0.1) (2025-06-03)



# [1.0.0](https://github.com/ever-co/ever-capture/compare/breadcrumb-data-access-0.1.2...breadcrumb-data-access-1.0.0) (2025-05-11)


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

* modularize ever capture ([0549ee2](https://github.com/ever-co/ever-capture/commit/0549ee29138fe36f7e3c80a7351d28235f9b9055))



## [0.1.2](https://github.com/ever-co/ever-capture/compare/breadcrumb-data-access-0.1.1...breadcrumb-data-access-0.1.2) (2025-05-02)



## [0.1.1](https://github.com/ever-co/ever-capture/compare/breadcrumb-data-access-0.1.0...breadcrumb-data-access-0.1.1) (2025-02-12)



# 0.1.0 (2025-01-10)


### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-capture/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))


### Features

* modularize ever capture ([0549ee2](https://github.com/ever-co/ever-capture/commit/0549ee29138fe36f7e3c80a7351d28235f9b9055))



## [0.1.3](https://github.com/ever-co/ever-capture/compare/breadcrumb-data-access-0.1.2...breadcrumb-data-access-0.1.3) (2024-12-26)



## [0.1.2](https://github.com/ever-co/ever-rec-desktop/compare/breadcrumb-data-access-0.1.1...breadcrumb-data-access-0.1.2) (2024-11-23)



## [0.1.1](https://github.com/ever-co/ever-rec-desktop/compare/breadcrumb-data-access-0.1.0...breadcrumb-data-access-0.1.1) (2024-11-23)


### Bug Fixes

* publish commands ([ec40beb](https://github.com/ever-co/ever-rec-desktop/commit/ec40beb144bea21e949e86f1d6e61dd699790b6a))



# 0.1.0 (2024-11-20)


### Features

* modularize  ([0549ee2](https://github.com/ever-co/ever-rec-desktop/commit/0549ee29138fe36f7e3c80a7351d28235f9b9055))

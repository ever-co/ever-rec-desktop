# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.0.8](https://github.com/ever-co/ever-rec-desktop/compare/timesheet-ui-1.0.7...timesheet-ui-1.0.8) (2025-06-06)

### Dependency Updates

* `shared-service` updated to version `1.0.6`


## [1.0.7](https://github.com/ever-co/ever-rec-desktop/compare/timesheet-ui-1.0.6...timesheet-ui-1.0.7) (2025-06-06)

### Dependency Updates

* `shared-service` updated to version `1.0.6`


## [1.0.6](https://github.com/ever-co/ever-rec-desktop/compare/timesheet-ui-1.0.5...timesheet-ui-1.0.6) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.2`
* `shared-service` updated to version `1.0.5`
* `shared-components` updated to version `2.0.7`


## [1.0.5](https://github.com/ever-co/ever-rec-desktop/compare/timesheet-ui-1.0.4...timesheet-ui-1.0.5) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `shared-components` updated to version `2.0.6`


## [1.0.4](https://github.com/ever-co/ever-rec-desktop/compare/timesheet-ui-1.0.3...timesheet-ui-1.0.4) (2025-06-06)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `shared-service` updated to version `1.0.4`
* `shared-components` updated to version `2.0.5`


## [1.0.3](https://github.com/ever-co/ever-rec-desktop/compare/timesheet-ui-1.0.2...timesheet-ui-1.0.3) (2025-06-03)

### Dependency Updates

* `utils` updated to version `1.3.1`
* `shared-service` updated to version `1.0.3`
* `shared-components` updated to version `2.0.4`

### Bug Fixes

* **timesheet:** fix publish command directory ([e989263](https://github.com/ever-co/ever-rec-desktop/commit/e98926352cc35956fc3eff5d69a7ba20ecee258f))



## [1.0.2](https://github.com/ever-co/ever-rec-desktop/compare/timesheet-ui-1.0.1...timesheet-ui-1.0.2) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.2.0`
* `shared-service` updated to version `1.0.2`
* `shared-components` updated to version `2.0.3`


## [1.0.1](https://github.com/ever-co/ever-capture/compare/timesheet-ui-1.0.0...timesheet-ui-1.0.1) (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `shared-service` updated to version `1.0.1`
* `shared-components` updated to version `2.0.2`


# 1.0.0 (2025-05-15)

### Dependency Updates

* `utils` updated to version `1.1.0`
* `shared-service` updated to version `1.0.0`
* `shared-components` updated to version `2.0.1`

### Bug Fixes

* **timesheet-heat-map:** adjust sizing and overflow ([043348a](https://github.com/ever-co/ever-capture/commit/043348a21f65eb63166cf222d83ff60c40356bd4))
* **timesheet-heatmap:** correct hourly heat map duration calculation ([44e07af](https://github.com/ever-co/ever-capture/commit/44e07af44ae23fbf6c8f6240e4a3dd1a49e650e2))
* **timesheet-heatmap:** process logs spanning multiple days day by day ([b75efb4](https://github.com/ever-co/ever-capture/commit/b75efb4c864557478d7d3dcb1c37ad16ec390c13))
* **timesheet/heatmap:** distribute log durations accurately ([c340cbf](https://github.com/ever-co/ever-capture/commit/c340cbfd15ca8fe2a52335bba0805f0b017645a2))


### Features

* **timesheet-heat-map-widget:** add timesheet heat map widget ([2ba91a0](https://github.com/ever-co/ever-capture/commit/2ba91a0d60c3809a4b3d2f554c1cf27c77f973fb))
* **timesheet-heat-map:** add web worker data processing ([e24e93a](https://github.com/ever-co/ever-capture/commit/e24e93a743e246c0eeb6288954a9e482510f9307))
* **timesheet-heat-map:** improve responsiveness and no data handling ([519f43b](https://github.com/ever-co/ever-capture/commit/519f43b77d491b31fe59910f09758f3b3a9f898a))
* **timesheet-heatmap:** add monthly data processing ([8823852](https://github.com/ever-co/ever-capture/commit/88238523afde3c4606cf608a2d4c74bdbaeade25))
* **timesheet:** add timesheet heatmap component ([36018d9](https://github.com/ever-co/ever-capture/commit/36018d9aac0e64664e69ae14396198707778287d))
* **timesheet:** fetch data for heat map ([e498521](https://github.com/ever-co/ever-capture/commit/e498521a8652651ca6bd864663ecec06235630f1))


### Performance Improvements

* **web/timesheet:** lazy load timesheet heat map widget ([c3ce5d0](https://github.com/ever-co/ever-capture/commit/c3ce5d0344b660651084e9802b30afbf8a2e30b7))


### BREAKING CHANGES

* **timesheet-heat-map:** The `processData` method in `DataProcessingStrategy` now returns an `Observable<IHeatMapDataPoint[]>` instead of `IHeatMapDataPoint[]`.

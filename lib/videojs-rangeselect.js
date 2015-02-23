/*! videojs-rangeselect - v0.0.0 - 2015-2-23
 * Copyright (c) 2015 Ryan Sadwick
 * Licensed under the MIT license. */
(function(window, videojs) {
  'use strict';

  var defaults = {
        option: true
      },
      rangeselect;

  /**
   * Initialize the plugin.
   * @param options (optional) {object} configuration for the plugin
   */
  rangeselect = function(options) {
    var settings = videojs.util.mergeOptions(defaults, options),
        player = this;

    // TODO: write some amazing plugin code
  };

  // register the plugin
  videojs.plugin('rangeselect', rangeselect);
})(window, window.videojs);

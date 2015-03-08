/*! videojs-rangeselect - v0.0.0 - 2015-2-23
 * Copyright (c) 2015 Ryan Sadwick
 * Licensed under the MIT license. */
(function (window, videojs) {
    'use strict';

    var defaults = {
            option: true
        },
        rangeselect;

    /**
     * Initialize the plugin.
     * @param options (optional) {object} configuration for the plugin
     */
    rangeselect = function (options) {
        var settings = videojs.util.mergeOptions(defaults, options),
            player = this,
            startPoint = 0,
            endPoint = 0;

        //handler code with draggable
        //todo: make wrapper for dragging so it's not dependent on Draggable


        var HandleBar = vjs.Component.extend({
            /** @constructor */
            init: function (player, options) {
                vjs.Component.call(this, player, options);
                this.fired = false;
                //this.on('mousedown', this.onMouseDown);
            }
        });


        HandleBar.prototype.createEl = function () {
            this.collisionDistance = 10;
            this.leftOriginalX = 0;
            this.rightOriginalX = null;

            var el = vjs.Component.prototype.createEl.call(this, 'div', {
                className: 'vjs-rangeselect-controls'
            });

            //handles
            this.handleLeft = vjs.createEl('div', {
                className: 'handle-drags left'
            });

            this.handleRight = vjs.createEl('div', {
                className: 'handle-drags right'
            });

            //range bar
            this.rangeBar = vjs.createEl('div', {
                className: 'vjs-rangeselect-display',
                id: 'range-selector',
                innerHTML: '<span class="vjs-control-text-rangeselect">' + this.localize('Stream Type') + '</span>' + this.localize('LIVE'),
                'aria-live': 'off'
            });

            var scope = this;

            this.rangeBar.appendChild(this.handleLeft);
            this.rangeBar.appendChild(this.handleRight);
            player.controlBar.progressControl.el().appendChild(this.rangeBar);

            //add draggle
            Draggable.create(this.handleLeft, {type: "x", edgeResistance: 0, bounds: this.rangeBar, throwProps: false,

                onPress: function (e) {
                    this.leftOriginalX = e.target._gsTransform.x;
                },

                onDrag: function (e) {
                    if (this.hitTest(".right", this.collisionDistance)) {
                        e.target._gsTransform.x = this.leftOriginalX;
                        this.disable();
                    }
                },

                onDragEnd: function (e) {
                    var rangeSlider = document.getElementById("range-selector");
                    var rangeWidth = rangeSlider.offsetWidth;
                    scope.setStartTime((player.duration()) * (e.target._gsTransform.x / rangeWidth));
                    this.enable();
                }
            });

            //add draggle
            Draggable.create(this.handleRight, {type: "x", edgeResistance: 0, bounds: this.rangeBar, throwProps: false,

                onPress: function (e) {
                    this.rightOriginalX = e.target._gsTransform.x;

                },

                onDrag: function (e) {
                    //see if the target overlaps with the element with ID "element2"
                    if (this.hitTest(".left", this.collisionDistance)) {
                        e.target._gsTransform.x = this.rightOriginalX;
                        this.disable();
                    }
                },

                onDragEnd: function (e) {
                    var rangeSlider = document.getElementById("range-selector");
                    var rangeWidth = rangeSlider.offsetWidth;
                    scope.setEndTime((player.duration()) * (e.target._gsTransform.x / rangeWidth));
                    this.enable();
                }
            });


            return el;
        };

        HandleBar.prototype.setStartTime = function (value) {
            startPoint = value;
            console.log("start : " + startPoint)
            // player.on("timeupdate", videojs.bind(this, this.loop));
        }

        HandleBar.prototype.getStartTime = function () {
            return startPoint;

        }

        HandleBar.prototype.setEndTime = function (value) {
            endPoint = value;
            player.on("timeupdate", videojs.bind(this, this.loop));
        }

        HandleBar.prototype.getEndTime = function () {
            return endPoint;
        }

        HandleBar.prototype.loop = function () {

            if (player) {
                var currentTime = player.currentTime();

                if (this.fired && currentTime > this.getEndTime()) {
                    player.currentTime(this.getStartTime());
                    this.fired = false;
                }
                else if (currentTime < this.getStartTime() && this.fired == false || this.getEndTime() > 0 && this.getEndTime() < currentTime && this.fired == false) {
                    player.currentTime(this.getStartTime());
                    this.fired = true;
                }
                else {
                    return;
                }
            }
        }

        player.ready(function () {
            var handleBar = new HandleBar(player);
            console.log(handleBar.getStartTime());
        });
    };

    // register the plugin
    videojs.plugin('rangeselect', rangeselect);

})(window, window.videojs);

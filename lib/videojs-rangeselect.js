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
            player = this;

        //handler code with draggable
        //todo: make wrapper for dragging so it's not dependent on Draggable


        var HandleBar = vjs.Component.extend({
            /** @constructor */
            init: function (player, options) {
                vjs.Component.call(this, player, options);
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
                innerHTML: '<span class="vjs-control-text-rangeselect">' + this.localize('Stream Type') + '</span>' + this.localize('LIVE'),
                'aria-live': 'off'
            });



            this.rangeBar.appendChild(this.handleLeft);
            this.rangeBar.appendChild(this.handleRight);
            player.controlBar.progressControl.el().appendChild(this.rangeBar);


            //add draggle
            Draggable.create(this.handleLeft, {type: "x", edgeResistance: 0, bounds: this.rangeBar, throwProps: false,

                onPress: function(e){
                 this.leftOriginalX = e.target._gsTransform.x;
                  //  console.log(this.leftOriginalX)
                },

                onDrag: function (e) {
                    //see if the target overlaps with the element with ID "element2"
                    if (this.hitTest(".right", this.collisionDistance)) {
                        e.target._gsTransform.x = this.leftOriginalX;
                        console.log(this.leftOriginalX)
                        this.disable();

                    }
                },

                onDragEnd: function(e){
                    this.enable();
                }
            });

             //add draggle
            Draggable.create(this.handleRight, {type: "x", edgeResistance: 0, bounds: this.rangeBar, throwProps: false,

                onPress: function(e){
                 this.rightOriginalX = e.target._gsTransform.x;

                },

                onDrag: function (e) {
                    //see if the target overlaps with the element with ID "element2"
                    if (this.hitTest(".left", this.collisionDistance)) {
                        e.target._gsTransform.x = this.rightOriginalX;
                        this.disable();
                    }
                },
                onDragEnd: function(e){
                    this.enable();
                }
            });


            return el;
        };


        var holderDiv = document.createElement('div');
        holderDiv.className = 'handle';

        var title = document.createElement('h5');
        title.innerHTML = 'More Videos';
        holderDiv.appendChild(title);

        player.el().appendChild(holderDiv);

        Draggable.create(".handle", {type: "x,y", edgeResistance: 0.65, bounds: "#video_html5_api", throwProps: false});

        player.ready(function () {
            var handleBar = new HandleBar(player);
        });
    };

    // register the plugin
    videojs.plugin('rangeselect', rangeselect);

})(window, window.videojs);

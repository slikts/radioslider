/*!
 * radioSlider 1.0.0 - jQuery plugin for enhancing radio inputs
 * https://github.com/slikts/radioslider
 * Made by Reinis Ivanovs <dabas@untu.ms>
 * Licensed under the MIT license
 */

;(function($, window, console, undefined) {
    'use strict';

    var pluginName = 'radioSlider';

    function Slider(container, options) {
        this.container = container;
        var $container = this.$container = $(container);
        this.dataOptions = $container.data('slider-options');
        this.options = options;
        this._name = pluginName;
        this.init();
        return this;
    }

    Slider.prototype = {
        defaults: {
            // Prepended before all class and data property names to avoid
            // naming conflicts
            prefix: 'slider-',
            // Determines whether the selector moves instantaneously or is animated
            animate: true,
            animateOptions: {
                duration: 'fast',
                easing: undefined,
                complete: undefined
            },
            // Number of child elements to add to selector (used for styling)
            selectorChildren: 8,
            // Called after selecting a label
            selectCallback: undefined,
            // Allows, e.g., selecting a child element of the label
            // or selecting the label by class name
            labelFilter: ':first',
            // Currently just displays console output to help debugging labelFilter option
            debug: false,
            // Inline style properties applied to the selector element
            selectorStyle: {},
            inputSelector: 'input[type=radio]'
        },
        init: function() {
            var config = this.config = $.extend({}, this.defaults, this.dataOptions, this.options);
            var $container = this.$container;
            var inputSelector = config.inputSelector;
            var slider = this;

            this.$selector = this.makeSelector().appendTo($container);

            $container.find(inputSelector + ':checked').each(function() {
                slider.select(this);
                return false;
            });

            $container.on('change', inputSelector, this.onInputChange.bind(this))
            .on('focus', inputSelector, this.onInputFocus.bind(this))
            .on('blur', inputSelector, this.onInputBlur.bind(this));
        },
        onInputChange: function(e) {
            this.select(e.target);
        },
        getLabel: function(input) {
            var prefix = this.config.prefix;
            var $input = $(input);
            var $label = $input.data(prefix + '$label');
            var labelSelector;
            if (!$label) {
                // Find first label matching input and cache the result
                labelSelector = 'label[for=' + $input.attr('id') + ']' +
                this.config.labelFilter;
                $label = this.$container.find(labelSelector);
                if (this.config.debug && window.console) {
                    console.log('[slider.getLabel] input:', $input,
                        '\nlabel:', $label, '\nlabel selector:',
                        labelSelector, this);
                }
                $label.data(prefix + '$input', $input);
                $input.data(prefix + '$label', $label);
            }
            return $label;
        },
        onInputFocus: function(event) {
            this.getLabel(event.target).addClass(this.config.prefix + 'focus');
        },
        onInputBlur: function(event) {
            this.getLabel(event.target).removeClass(this.config.prefix + 'focus');
        },
        // Moves the selector over a label
        select: function(input) {
            var config = this.config;
            var prefix = config.prefix;
            var $label = this.getLabel(input);
            var $activeLabel = this.$activeLabel;
            var $selector = this.$selector;
            if ($activeLabel) {
                $activeLabel.removeClass(prefix + 'active');
            }
            $activeLabel = this.$activeLabel = $label.addClass(prefix + 'active');

            var style = $.extend($label.position(),
            {
                width: $label.outerWidth(),
                height: $label.outerHeight()
            });

            if ($selector.is(':visible')) {
                if (config.animate) {
                    var animateOptions = config.animateOptions;
                    $selector.stop().animate(style,
                        animateOptions.duration,
                        animateOptions.easing,
                        animateOptions.complete);
                } else {
                    $selector.css(style);
                }
            } else {
                $selector.css(style).show();
            }
            var callback = config.selectCallback;
            if (callback) {
                callback.apply(this, arguments);
            }
        },
        makeSelectorMarkup: function() {
            var prefix = this.config.prefix;
            var html = '<span class="' + prefix + 'selector">';
            for (var i = 0, n = this.config.selectorChildren; i < n; i++) {
                html += '<span class="' + prefix + 'selector-' + i + '"></span>';
            }
            return html += '</span>';
        },
        makeSelector: function() {
            var style = $.extend({
                position: 'absolute',
                display: 'none'
            }, this.config.selectorStyle);
            return $(this.makeSelectorMarkup()).css(style)
            .on('click', this.onSliderClick.bind(this));
        },
        onSliderClick: function(event) {
            if (event.which !== 1) {
                return;
            }
            this.$activeLabel.data(this.config.prefix + '$input').focus();
        }
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Slider(this, options));
            }
        });
    };

    // Alias to allow modifying the plugin defaults, extending it etc.
    $.fn[pluginName].Slider = Slider;
})(jQuery, window, console);

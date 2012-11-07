/*
 * radioSlider 1.0.0 - jQuery plugin for enhancing radio inputs
 * https://github.com/slikts/radioslider
 * Copyright 2012 Reinis Ivanovs <dabas@untu.ms>
 * MIT licenced
 */

/*jshint evil:true, devel:true, browser:true, jquery:true, strict: true */
(function($) {
    'use strict';

    function Slider(container, options) {
        var $container = $(container);

        var dataOptions = $container.data('slider-options');
        if (dataOptions) {
            dataOptions = eval('({' + dataOptions + '})');
        }
        this.options = $.extend({}, this.options, dataOptions, options);

        this.init($container);

        return this;
    }

    Slider.prototype = {
        options: {
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
            selectorStyle: {}
        },
        $activeLabel: undefined,
        init: function(container) {
            var $container = this.$container = $(container);

            this.selectorMarkup = this.makeSelectorMarkup();
            this.$selector = this.makeSelector().appendTo($container);

            var slider = this;

            var inputSelector = 'input[type=radio]';

            $container.find(inputSelector + ':checked').each(function() {
                slider.select(this);
            });
            $container.on('change', inputSelector, this.onInputChange.bind(this))
            .on('focus', inputSelector, this.onInputFocus.bind(this))
            .on('blur', inputSelector, this.onInputBlur.bind(this));
        },
        onInputChange: function(e) {
            this.select(e.target);
        },
        getLabel: function(input) {
            var prefix = this.options.prefix;
            var $input = $(input);
            var $label = $input.data(prefix + '$label');
            var labelSelector;
            if (!$label) {
                // Find first label matching input and cache the result
                labelSelector = 'label[for=' + $input.attr('id') + ']' +
                    this.options.labelFilter;
                $label = this.$container.find(labelSelector);
                if (this.options.debug && window.console) {
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
            console.log('focus', $(event.target).is(':focus'))
            this.getLabel(event.target).addClass(this.options.prefix + 'focus');
        },
        onInputBlur: function(event) {
            this.getLabel(event.target).removeClass(this.options.prefix + 'focus');
        },
        // Moves the selector over a label
        select: function(input) {
            var options = this.options;
            var prefix = options.prefix;
            var $label = this.getLabel(input);
            var $activeLabel = this.$activeLabel;
            var $selector = this.$selector;

            if ($activeLabel) {
                $activeLabel.removeClass(prefix + 'active');
            }
            $activeLabel = this.$activeLabel = $label.addClass(prefix + 'active');

            var style = $label.position();
            style.width = $label.outerWidth();
            style.height = $label.outerHeight();

            if ($selector.is(':visible')) {
                if (options.animate) {
                    var animateOptions = options.animateOptions;
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
            var callback = this.options.selectCallback;
            if (callback) {
                callback.apply(this, arguments);
            }
        },
        makeSelectorMarkup: function() {
            var prefix = this.options.prefix;
            var html = '<span class="' + prefix + 'selector">';
            for (var i = 0, n = this.options.selectorChildren; i < n; i++) {
                html += '<span class="' + prefix + 'selector-' + i + '"></span>';
            }
            return html += '</span>';
        },
        makeSelector: function() {
            var style = $.extend({
                position: 'absolute',
                display: 'none'
            }, this.options.selectorStyle);
            return $(this.selectorMarkup).css(style)
            .on('click', this.onSliderClick.bind(this));
        },
        onSliderClick: function(event) {
            if (event.which !== 1) {
                return;
            }
            this.$activeLabel.data(this.options.prefix + '$input').focus();
        }
    };

    $.fn.radioSlider = function(options) {
        return this.each(function() {
            var $this = $(this);
            $this.data('_slider', new Slider($this, options));
        });
    };

    // Alias to allow modifying the plugin
    $.fn.radioSlider._Slider = Slider;
})(jQuery);

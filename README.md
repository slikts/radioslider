radioSlider
===========

radioSlider is a jQuery plugin for enhancing the presentation of radio input groups
by positioning a "selector" element over the selected input's label.
The basic principle of moving a selector over labels enables creating advanced
and visually interesting replacements for regular radio input groups when used
in combination with CSS. Please see the [demo page](https://github.com/slikts/radioslider) for examples.

The design goals of radioSlider are to be lightweight, flexible and
to follow the best development practices. The plugin can be applied to labeled
radio inputs without requiring special changes to the document structure and with
minimal configuration. The plugin preserves keyboard accessibility for the
form inputs but doesn't duplicate default browser functions to make
the enhanced inputs work. radioSlider also uses prototypal inheritance to make the
plugin code cleaner and slightly more efficient.

The idea for the plugin came from reading [Invention: Multiple-Choice “Windowed Slider” UI](http://www.chrisnorstrom.com/2012/11/invention-multiple-choice-windowed-slider-ui/)
by UI designer Chris Norström.

Installation
------------

The plugin can be included in a page as follows:

    <script type="text/javascript" src="//github.com/slikts/radioslider/js/radioslider.jquery.min.js"></script>

It's recommended to place the script tag at the end of the document to avoid
blocking page rendering while the script is loading. The plugin depends on **jQuery
versions 1.7 or later**.

The plugin provides several different style options for the radio groups
which can be previewed in the [examples page](https://github.com/slikts/radioslider).
The stylesheets need to be included in the head section of the document and the appropriate class names need to
be applied to the slider container for them to work. Custom styles for the
radio groups can be achieved either using overrides with the provided
example styles or by creating new custom style rules. See the "Styles" section
of this document for more details.

Usage
-----

Basic usage example:

    <p class="slider">
        <input id="radio-a"
               type="radio"
               name="example"
               value="a">
        <label for="radio-a">A</label>
        <input id="radio-b"
               type="radio"
               name="example"
               value="b">
        <label for="radio-b">B</label>
    </p>
    <script type="text/javascript">
        $('p.slider').radioSlider();
    </script>

There aren't any special requirements for the element structure besides
the `for` attributes of labels needing to be valid (matched to `id` attributes of
inputs). For instance, the input elements could also be nested inside the labels etc.

radioSlider uses event delegation so the structure could also be modified after
the plugin is applied and it should continue to work correctly with any
new inputs and labels in the slider container.

NB: This basic usage doesn't by itself create visible changes unless there are
styles applied. Different style options along with more advanced usage can
be seen in the [examples page](https://github.com/slikts/radioslider).

Configuration
-------------

Configuration can be applied either programmatically as an argument to the `.radioSlider()`
method or declaratively on the slider container. The `.radioSlider()` accepts options as
an object like so:

    $('.slider').radioSlider({ animate: false, debug: true });

The declarative configuration uses a data attribute like so (based on the basic usage example):

    <p class="slider" data-slider-options="animate: false, debug: true">

The `data-slider-options` attribute value must be written using the JavaScript object
literal notation. Note that options passed programmatically take precedence over the
declarative options.

This is the full list of options with default values and comments:

    // Prepended before all class and data property names to avoid naming conflicts
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
    // or selecting the label by class name (see examples page)
    labelFilter: ':first',
    // Currently just displays console output to help debugging labelFilter option
    debug: false,
    // Inline style properties applied to the selector element
    selectorStyle: {}

Styles
------

The style examples use SASS and compass.

XXX

Caveats
-------

 * The slider container should have position set as relative for the selector
   to move together with it.
 * Some of the provided style examples don't fully support old browsers like IE6.

TODO
----

 * Create a jQuery UI widget version of the plugin

Copyright
---------

radioSlider is [MIT licenced](http://opensource.org/licenses/MIT) and
is made by Reinis Ivanovs <dabas@untu.ms>.

Multi-list Picker
=================

### This project is not being maintained

Most of the code should work, and it has been tested well enough. However, without any need from my own projects for such component at the time, I simply do not have the time to properly maintain it. If anyone is interested in <em>owning</em> this project, I am more than happy to transfer ownership.

Meanwhile, you can check out https://github.com/jasonmamy/cordova-wheel-selector-plugin which seems to be a maintained project with some of the same capabilities as this one.

## Introduction

The multi-list picker is a component that lets you pick a value
from a list. Imagine a combobox, but only better.

The picker helps you define lists that are bound to various properties
of a model and specify the available values.

Here is a simple example with static values and a single list:

    <proton:multi-list-picker>
      <proton:multi-list-picker-list>
        <proton:multi-list-picker-list-item>iPhone 5</proton:multi-list-picker-list-item>
        <proton:multi-list-picker-list-item>iPhone 6</proton:multi-list-picker-list-item>
        <proton:multi-list-picker-list-item>iPhone 6 Plus</proton:multi-list-picker-list-item>
        <proton:multi-list-picker-list-item>iPhone 6s</proton:multi-list-picker-list-item>
        <proton:multi-list-picker-list-item>iPhone 6s Plus</proton:multi-list-picker-list-item>
        <proton:multi-list-picker-list-item>iPhone 5se</proton:multi-list-picker-list-item>
      </proton:multi-list-picker-list>
    </proton:multi-list-picker>

which results in this list-picker:

![list-picker](http://i.imgur.com/0iMxtSb.png)

This comes with support for scrolling the list to select an item with
momentum and every other thing you would expect to see in a native iOS
list-picker. You can easily change the `attachment` type and other
options on the list-picker to achieve a more sophisticated setting.
  
Usage
-----

You have to import the following two files into your `index.html`:

  * `dist/proton.multi-list-picker.min.js`
  * `dist/proton.multi-list-picker.css`

and add a dependency to the parent module to your application:

    angular.module('myApplication', [..., 'proton.multi-list-picker']);

Dependencies
------------

This directive does not have any dependencies whatsoever. The only dependency is
AngularJS itself, and there is a soft dependency on `ngSanitize` if you need HTML
captions.

Directives
----------

This module comes with multiple, nested directives.

 > ##### Development Tip
 > To help you with your development and benefit from IDE completion, and
XSD file is included with detailed instructions on the
directives. To use the XSD, add the following to your `index.html` file:
 >
 >     xmlns:proton="http://github.com/mmnaseri/proton.multi-list-picker"
 >
 > and if necessary, add a local path, as well. Now, you can use all the directives
 > with the benefit of code completion. Just remember to use the *namespace* form
 > when using the directives. This means using `<proton:multi-list-picker/>` instead
 > of `<proton-multi-list-picker/>`

## proton-multi-list-picker

This is the root element for defining a multi-list picker component.

##### Format

    <proton-multi-list-picker
        [ng-model="..."]
        [attachment="..."]
        [bind-html="..."]
        [done="..."] >
        :
    </proton-multi-list-picker>

##### Options

  * `ngModel`: this is to let you bind the top-level object for the list picker
  to the directive.
  * `attachment` (`enum`, default: `inline`): This attribute will let you define
  the attachment type of the component to the screen. Possible values are:
      * `inline`: the component will be displayed as an inline block
      * `modal`: the component will be displayed as a modal dialog with appropriate
      close buttons
      * `bottom`: the component will be affixed to the bottom of the screen
      * `top`: the component will be affixed to the top of the screen
  * `bindHtml` (`boolean`, default: `false`): Whether or not list item labels should
  be interpreted as HTML values or normal text. If you set this to `true` you will need
  to add a dependency to [`ngSanitize`](https://docs.angularjs.org/api/ngSanitize) to
  your application, as the template will internally use [`ngBindHtml`](https://docs.angularjs.org/api/ng/directive/ngBindHtml)
  to accomplish proper rendering.
  * `done` (`AngularJS Expression`, default: `""`): this expression will be executed with
   the value `$model` interpolated with the bound model object (or the resolved model, if no
   model is bound) once the `Done` button in the toolbar is clicked. There will be no
   toolbar displayed if the attachment is set to `inline`.

##### Nested Children

  * `<proton-multi-list-picker-list/>`: to specify a child list
  * `<proton-multi-list-picker-divider/>`: to specify a divider

## proton-multi-list-picker-list

Let's you define a list for the multi-list picker component.

##### Format

    <proton-multi-list-picker-list
        [alias="..."]
        [source="..."]
        [static="..."]
        [cycle="..."]
        [strict-matching="..."] >
    </proton-multi-list-picker-list>

##### Options

  * `alias` (`string`, default: numerical index of the list): the name of the model
  property to which the value of this list is bound. If none is specified, then the
  numerical value of the list will be used as the property. In the example above, it
  would create a property named `0` in any model bound (or if an array was bound, the
  first item would have been set to the value picked via the list).
  * `source` (`AngularJS expression`, default: `undefined`): the source for the items
  within this list. If nothing is provided, the contents will be used instead. If you
  are providing a method, beware that it is going to be called a lot, since we are
  watching for changes in the source to update the list picker accordingly. If you
  want to disable this feature use `static` binding.
  * `static` (`boolean`, default: `false`): Sets the binding type to static so that
  once read first, the value of the `source` property is not read again. If you do
  not specify a `source` this will be automatically set to `true`. Set this to `true`
  if you are providing the items in this list via an AngularJS expression and you know
  the contents of the list are not going to change.
  * `cycle` (`boolean`, default: `false`): whether the list should *cycle*. If you set
  this to `true`, the list will have no end. It will be like working with a circular
  dial (thus the name). This means that you will get infinite scrolling on this list.
  * `strictMatching` (`boolean`, default: `false`): this property directs the directive
  to perform strict label matching when determining the absolute width of a list. Since
  setting this to `true` means every item in the list will be tried as a separate HTML
  object to account for the width, only set it to `true` if you are experiencing
  problems with the width of the list and if the width is changing when you are scrolling
  through the items.

##### Nested Children

  * `<proton-multi-list-picker-list-item/>`: use this to specify static items for the
  list. If the `<proton-multi-list-picker-list/>` directive specifies a `source` these
  items will be completely ignored. Also note that since this is a *static* definition,
  you will not benefit from any bindings or other DOM manipulations after the items are
  initially scanned.

## proton-multi-list-picker-divider

A divider element between lists. The content of the element will be picked up and
placed in the component. If `bindHtml` is set to `true` on the parent
`proton-multi-list-picker`, it will be treated as HTML content.

You can leave the content as blank if you want a breaking divider that visually
divides the multi-list picker into two sections. Since the value of the divider
is treated statically, it will not be updated once the picker is rendered. This
means no further DOM manipulations or AngularJS bindings.

##### Format

    <proton-multi-list-picker-divider>...</proton-multi-list-picker-divider>

##### Options

This directive has no options

##### Nested Children

Anything nested within this directive will be treated as the caption for the divider.

## proton-multi-list-picker-list-item

This element let's you define a single list item. The contents of this tag
will be treated as the caption for the item, and if `bindHtml` is set to `true`
on the parent `<proton-multi-list-picker/>` it will be treated as HTML.
You will need to specify a `value` attribute if you want to have values
that are different from the inline HTML value of the tag.

##### Format

    <proton-multi-list-picker-list-item
        [value="..."] />
        ...
    </proton-multi-list-picker-list-item>

##### Options

  * `value` (`string`, default: same as caption): the value bound to this item. This
  is the same as specifying a `value` on an `<option/>` HTML tag in a `<select/>`
  component.

##### Nested Children

This directive has no nested children and anything written within the tag as children
will be read as the caption for the item.

Example
-------

An example is provided under the `/demo` folder. You can clone this repository and
look at the examples to get a better understanding of how this works.

All the options are explored in the example, and you will see a more sophisticated
list picker.

Below is an image of the example application in action:

![Example](http://i.imgur.com/bVhU2og.png)

Sizing
------

The size of all the elements here is determined relative to the font-size of the
list picker component. Therefore, if you want to change the size of a component
specifically, you can select it by ID or via the `proton-multi-list-picker` class
name:

    .proton-multi-list-picker {
        font-size: 20px;
    }

Styling
-------

The list is configured to show five items at a time and simulate a bevel effect as
though the underlying list is a circular dial.

This is all accomplished via the CSS file. You can play with these settings by modifying
the SASS file `proton.multi-list-picker.scss` under `src`, or use your own style.

The template for the directive can be loaded via `$templateCache` like this:

    var template = $templateCache.get("$/proton/multi-list-picker/picker.html");

License
-------

This work is distributed under the MIT license, which can be found in `LICENSE.md`
next to this readme.

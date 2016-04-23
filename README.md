Multi-list Picker
=================

The multi-list picker is a component that lets you pick a value
from a list. Imagine a combobox, but only better.

The picker helps you define lists that are bound to various properties
of a model and specify the available values.

Here is a simple example:

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

This comes with support for scrolling the list to select an item with momentum and every other thing you would expect to see
in a native iOS list-picker. You can easily change the `attachment` type of the picker to any of these values:

  * `inline` (default): to have the list-picker as a block-level item in your form
  * `modal`: to display a floating, centered modal with the list-picker
  * `top`: to have the list-picker attached to the top of the screen
  * `bottom`: to have the list-picker attached to the bottom of the screen
  


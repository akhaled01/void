[**@akhaled01/void**](../../../README.md) • **Docs**

***

[@akhaled01/void](../../../README.md) / [types/jsx](../README.md) / ButtonProps

# Interface: ButtonProps

Defines properties for the `<button>` element, extending CommonProps.

## Extends

- [`CommonProps`](CommonProps.md)

## Properties

### className?

> `optional` **className**: `string`

A string representing one or more CSS classes to be applied to the element.

#### Inherited from

[`CommonProps`](CommonProps.md).[`className`](CommonProps.md#classname)

#### Defined in

[types/jsx.d.ts:23](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/types/jsx.d.ts#L23)

***

### id?

> `optional` **id**: `string`

A string representing the unique ID of the element.

#### Inherited from

[`CommonProps`](CommonProps.md).[`id`](CommonProps.md#id)

#### Defined in

[types/jsx.d.ts:28](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/types/jsx.d.ts#L28)

***

### onClick()?

> `optional` **onClick**: (`event`) => `void`

A function that gets called when the button is clicked.

#### Parameters

• **event**: `MouseEvent`

#### Returns

`void`

#### Defined in

[types/jsx.d.ts:79](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/types/jsx.d.ts#L79)

***

### style?

> `optional` **style**: `object`

An object representing inline CSS styles, where the keys are CSS property names and
the values are the corresponding styles (either strings or numbers).

#### Index Signature

 \[`key`: `string`\]: `string` \| `number`

#### Inherited from

[`CommonProps`](CommonProps.md).[`style`](CommonProps.md#style)

#### Defined in

[types/jsx.d.ts:34](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/types/jsx.d.ts#L34)

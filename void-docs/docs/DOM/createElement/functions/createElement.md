[**@akhaled01/void**](../../../README.md) • **Docs**

***

[@akhaled01/void](../../../README.md) / [DOM/createElement](../README.md) / createElement

# Function: createElement()

> **createElement**\<`P`\>(`tag`, `props`, ...`children`): [`ElementVNode`](../../types/type-aliases/ElementVNode.md)

Creates a virtual DOM element.

## Type Parameters

• **P** = `object`

## Parameters

• **tag**: `string`

The HTML tag name.

• **props**: `P` = `...`

The properties/attributes of the element.

• ...**children**: (`string` \| [`VNode`](../../types/type-aliases/VNode.md))[]

The child elements or text nodes.

## Returns

[`ElementVNode`](../../types/type-aliases/ElementVNode.md)

A VNode representing the element.

## Defined in

[DOM/createElement.ts:11](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/DOM/createElement.ts#L11)

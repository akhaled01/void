[**@akhaled01/void**](../../README.md) • **Docs**

***

[@akhaled01/void](../../README.md) / [pulse](../README.md) / Pulse

# Class: Pulse\<T\>

The `Pulse` class is a reactive data-binding utility that synchronizes changes to its internal
data model with the DOM. It supports both objects and arrays, enabling reactivity and rendering
of data in the DOM.

## Type Parameters

• **T** *extends* `object` \| `any`[]

Type of the data model which can be an object or an array.

## Constructors

### new Pulse()

> **new Pulse**\<`T`\>(`initialValue`, `id`, `template`?): [`Pulse`](Pulse.md)\<`T`\>

Constructs a `Pulse` instance.

#### Parameters

• **initialValue**: `T`

The initial value of the data model.

• **id**: `string`

A unique identifier for this Pulse instance.

• **template?**

An optional template function to render the data.

#### Returns

[`Pulse`](Pulse.md)\<`T`\>

#### Defined in

[pulse.ts:26](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/pulse.ts#L26)

## Properties

### childPulseMap

> **childPulseMap**: `Map`\<`string`, [`Pulse`](Pulse.md)\<`any`\>\>

#### Defined in

[pulse.ts:17](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/pulse.ts#L17)

## Methods

### addItem()

> **addItem**(`item`): `void`

Adds a new item to the array and renders it.

#### Parameters

• **item**: `any`

The item to add.

#### Returns

`void`

#### Defined in

[pulse.ts:220](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/pulse.ts#L220)

***

### attachTo()

> **attachTo**(`element`): `void`

Attaches the Pulse instance to a DOM element and performs initial rendering.

#### Parameters

• **element**: `HTMLElement`

The DOM element to attach to.

#### Returns

`void`

#### Defined in

[pulse.ts:134](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/pulse.ts#L134)

***

### get()

> **get**(): `T`

Gets the current value of the Pulse instance.

#### Returns

`T`

The current value.

#### Defined in

[pulse.ts:105](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/pulse.ts#L105)

***

### performDOMRender()

> **performDOMRender**(): `void`

Performs DOM rendering based on the current value and template.

#### Returns

`void`

#### Defined in

[pulse.ts:142](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/pulse.ts#L142)

***

### removeItem()

> **removeItem**(`index`): `void`

Removes an item from the array by index and updates the DOM.

#### Parameters

• **index**: `number`

The index of the item to remove.

#### Returns

`void`

#### Defined in

[pulse.ts:253](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/pulse.ts#L253)

***

### set()

> **set**(`newValue`): `void`

Sets a new value for the Pulse instance and triggers re-rendering.

#### Parameters

• **newValue**: `T`

The new value to set.

#### Returns

`void`

#### Defined in

[pulse.ts:92](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/pulse.ts#L92)

***

### subscribe()

> **subscribe**(`listener`): () => `void`

Subscribes a listener function to changes in the Pulse value.

#### Parameters

• **listener**

The listener function to subscribe.

#### Returns

`Function`

A function to unsubscribe the listener.

##### Returns

`void`

#### Defined in

[pulse.ts:115](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/pulse.ts#L115)

***

### updateItem()

> **updateItem**(`index`, `newValue`): `void`

Updates an existing item in the array.

#### Parameters

• **index**: `number`

The index of the item to update.

• **newValue**: `any`

The new value to set.

#### Returns

`void`

#### Defined in

[pulse.ts:275](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/pulse.ts#L275)

[**@akhaled01/void**](../../README.md) • **Docs**

***

[@akhaled01/void](../../README.md) / [signal](../README.md) / Signal

# Class: Signal

## Constructors

### new Signal()

> **new Signal**(): [`Signal`](Signal.md)

#### Returns

[`Signal`](Signal.md)

## Methods

### listen()

> `static` **listen**\<`T`\>(`target`, `eventName`, `callback`): () => `void`

Subscribe to a native event on a DOM element.

#### Type Parameters

• **T** *extends* [`DocumentEventNames`](../type-aliases/DocumentEventNames.md)

#### Parameters

• **target**: `DOMNode`

The target DOM node (Document or HTMLElement).

• **eventName**: `T`

The name of the event to listen for.

• **callback**

The callback function to invoke when the event occurs.

#### Returns

`Function`

A cleanup function to unsubscribe from the event.

##### Returns

`void`

#### Defined in

[signal.ts:37](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/signal.ts#L37)

***

### listenMultiple()

> `static` **listenMultiple**\<`T`\>(`target`, `eventNames`, `callback`): () => `void`

Listen for multiple events on a target.

#### Type Parameters

• **T** *extends* [`DocumentEventNames`](../type-aliases/DocumentEventNames.md)

#### Parameters

• **target**: `DOMNode`

The target DOM node (Document or HTMLElement).

• **eventNames**: `T`[]

An array of event names to listen for.

• **callback**

The callback function to invoke when any of the events occur.

#### Returns

`Function`

A cleanup function to unsubscribe from all events.

##### Returns

`void`

#### Defined in

[signal.ts:55](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/signal.ts#L55)

***

### trigger()

> `static` **trigger**(`target`, `eventName`): `void`

Trigger a native event programmatically.

#### Parameters

• **target**: `DOMNode`

The target DOM node (Document or HTMLElement).

• **eventName**: [`DocumentEventNames`](../type-aliases/DocumentEventNames.md)

The name of the event to trigger.

#### Returns

`void`

#### Defined in

[signal.ts:72](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/signal.ts#L72)

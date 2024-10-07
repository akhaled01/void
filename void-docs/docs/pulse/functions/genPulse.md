[**@akhaled01/void**](../../README.md) • **Docs**

***

[@akhaled01/void](../../README.md) / [pulse](../README.md) / genPulse

# Function: genPulse()

> **genPulse**\<`T`\>(`initialValue`, `id`, `baseTemplate`?, `childTemplate`?): [`Pulse`](../classes/Pulse.md)\<`T`\>

Generate a new pulse and add it to the global registry.

## Type Parameters

• **T** *extends* `object` \| `any`[]

## Parameters

• **initialValue**: `T`

The initial value of the pulse.

• **id**: `string`

The unique ID of the pulse.

• **baseTemplate?**

The base template for rendering the parent object.

• **childTemplate?**

A template specifically for child items, if applicable.

## Returns

[`Pulse`](../classes/Pulse.md)\<`T`\>

## Example

```ts
const todos = genPulse([], "todos", todoListTemplate, () => <div>Child</div>);
```

## Defined in

[pulse.ts:323](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/pulse.ts#L323)

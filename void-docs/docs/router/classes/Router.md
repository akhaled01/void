[**@akhaled01/void**](../../README.md) • **Docs**

***

[@akhaled01/void](../../README.md) / [router](../README.md) / Router

# Class: Router

The Router class to handle client-side routing and rendering
of pages using a virtual DOM approach.

## Constructors

### new Router()

> **new Router**(): [`Router`](Router.md)

Initializes the Router instance, sets up event listeners,
and extends HTMLElement and Document prototypes with custom event methods.

#### Returns

[`Router`](Router.md)

#### Defined in

[router.ts:24](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/router.ts#L24)

## Properties

### currentVNode

> **currentVNode**: [`VNode`](../../DOM/types/type-aliases/VNode.md)

Store the current virtual DOM node

#### Defined in

[router.ts:16](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/router.ts#L16)

***

### pageContext

> **pageContext**: `RequireContext`

Context for dynamic imports of page components

#### Defined in

[router.ts:14](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/router.ts#L14)

***

### root

> **root**: `HTMLElement`

The root element where pages will be rendered

#### Defined in

[router.ts:12](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/router.ts#L12)

***

### stylesheetRef

> **stylesheetRef**: `HTMLLinkElement`

Reference to the `<link>` element for stylesheets

#### Defined in

[router.ts:18](https://github.com/akhaled01/vortex/blob/6129b4a0bc7b35d178a4a45ea59f5942bbd0b23a/core/router.ts#L18)

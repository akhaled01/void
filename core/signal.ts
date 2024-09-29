/**
 * Utility types for handling DOM events.
 */
export type DocumentEventNames =
  | keyof GlobalEventHandlersEventMap // Events defined on global event handlers
  | keyof DocumentEventMap; // Events defined on the Document interface

type DOMNode = Document | HTMLElement; // Union type for a DOMNode

/**
 * A utility class for managing DOM events on a `Document` or an `HTMLElement`.
 */
export class Signal {
  /**
   * Subscribe to a native event on a DOM element.
   *
   * @param target - The target DOM node (Document or HTMLElement).
   * @param eventName - The name of the event to listen for.
   * @param callback - The callback function to invoke when the event occurs.
   * @returns A cleanup function to unsubscribe from the event.
   */
  static listen<T extends DocumentEventNames>(
    target: DOMNode,
    eventName: T,
    callback: (event: DocumentEventMap[T]) => void
  ) {
    target.addEventListener(eventName, callback as EventListener);
    return () =>
      target.removeEventListener(eventName, callback as EventListener);
  }

  /**
   * Listen for multiple events on a target.
   *
   * @param target - The target DOM node (Document or HTMLElement).
   * @param eventNames - An array of event names to listen for.
   * @param callback - The callback function to invoke when any of the events occur.
   * @returns A cleanup function to unsubscribe from all events.
   */
  static listenMultiple<T extends DocumentEventNames>(
    target: DOMNode,
    eventNames: T[],
    callback: (event: DocumentEventMap[T]) => void
  ) {
    const cleanupFunctions = eventNames.map((eventName) =>
      this.listen(target, eventName, callback)
    );
    return () => cleanupFunctions.forEach((cleanup) => cleanup());
  }

  /**
   * Trigger a native event programmatically.
   *
   * @param target - The target DOM node (Document or HTMLElement).
   * @param eventName - The name of the event to trigger.
   */
  static trigger(target: DOMNode, eventName: DocumentEventNames) {
    const event = new Event(eventName);
    target.dispatchEvent(event);
  }
}

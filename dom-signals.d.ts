/**
 * TypeScript declaration file to extend the Document and HTMLElement interfaces
 * with custom event handling methods.
 */

/**
 * Utility type that encompasses all possible event names
 * that can be listened to on Document and HTMLElement.
 */
export type DocumentEventNames =
  | keyof GlobalEventHandlersEventMap // Event names available on global event handlers
  | keyof DocumentEventMap; // Event names available on the Document interface

/**
 * Global declaration to extend the Document and HTMLElement interfaces.
 */
declare global {
  /**
   * Extends the Document interface to add custom event handling methods.
   */
  interface Document {
    /**
     * Listen for a native event on the Document.
     *
     * @param eventName - The name of the event to listen for.
     * @param callback - The callback function to invoke when the event occurs.
     * @returns A cleanup function to unsubscribe from the event.
     */
    listen<T extends DocumentEventNames>(
      eventName: T,
      callback: (event: DocumentEventMap[T]) => void
    ): () => void;

    /**
     * Listen for multiple events on the Document.
     *
     * @param eventNames - An array of event names to listen for.
     * @param callback - The callback function to invoke when any of the events occur.
     * @returns A cleanup function to unsubscribe from all events.
     */
    listenMultiple<T extends DocumentEventNames>(
      eventNames: T[],
      callback: (event: DocumentEventMap[T]) => void
    ): () => void;

    /**
     * Trigger a native event programmatically on the Document.
     *
     * @param eventName - The name of the event to trigger.
     */
    trigger(eventName: DocumentEventNames): void;
  }

  /**
   * Extends the HTMLElement interface to add custom event handling methods.
   */
  interface HTMLElement {
    /**
     * Listen for a native event on an HTMLElement.
     *
     * @param eventName - The name of the event to listen for.
     * @param callback - The callback function to invoke when the event occurs.
     * @returns A cleanup function to unsubscribe from the event.
     */
    listen<T extends DocumentEventNames>(
      eventName: T,
      callback: (event: DocumentEventMap[T]) => void
    ): () => void;

    /**
     * Listen for multiple events on an HTMLElement.
     *
     * @param eventNames - An array of event names to listen for.
     * @param callback - The callback function to invoke when any of the events occur.
     * @returns A cleanup function to unsubscribe from all events.
     */
    listenMultiple<T extends DocumentEventNames>(
      eventNames: T[],
      callback: (event: DocumentEventMap[T]) => void
    ): () => void;

    /**
     * Trigger a native event programmatically on the HTMLElement.
     *
     * @param eventName - The name of the event to trigger.
     */
    trigger(eventName: DocumentEventNames): void;
  }
}

// This export statement is necessary to make this file a module
// so that the global declarations take effect.
export {};

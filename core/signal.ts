type DocumentEventNames = keyof GlobalEventHandlersEventMap | keyof DocumentEventMap;

/**
 * A utility class for managing DOM events on a `Document` or an `` object.
 */
export class Signal {
    // Subscribe to a native event on a DOM element
    static listen<T extends DocumentEventNames>(
        target: Document | HTMLElement,
        eventName: T,
        callback: (event: DocumentEventMap[T]) => void
    ) {
        target.addEventListener(eventName, callback as EventListener);

        // Return a function to unsubscribe
        return () => {
            target.removeEventListener(eventName, callback as EventListener);
        };
    }

    // Listen for multiple events on a target
    static listenMultiple<T extends DocumentEventNames>(
        target: Document | HTMLElement,
        eventNames: T[],
        callback: (event: DocumentEventMap[T]) => void
    ) {
        const cleanupFunctions = eventNames.map(eventName => this.listen(target, eventName, callback));

        // Return a cleanup function that calls all cleanup functions
        return () => {
            cleanupFunctions.forEach(cleanup => cleanup());
        };
    }

    // Trigger a native event programmatically
    static trigger(target: Document | HTMLElement, eventName: DocumentEventNames) {
        const event = new Event(eventName);
        target.dispatchEvent(event);
    }
}

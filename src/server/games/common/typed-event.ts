export type Listener<T> = (event: T) => any;

export interface IDisposable {
    dispose(): void;
}

/** passes through events as they happen. You will not get events from before you start listening */
export class TypedEvent<T> {
    private listeners: Array<Listener<T>> = [];

    private listenersOncer: Array<Listener<T>> = [];

    public on = (listener: Listener<T>): IDisposable => {
        this.listeners.push(listener);
        return {
            dispose: () => this.off(listener),
        };
    };

    public once = (listener: Listener<T>): void => {
        this.listenersOncer.push(listener);
    };

    public off = (listener: Listener<T>) => {
        const callbackIndex = this.listeners.indexOf(listener);
        if (callbackIndex > -1) {
            this.listeners.splice(callbackIndex, 1);
        }
    };

    public removeAllListeners = () => {
        this.listeners = [];
        this.listenersOncer = [];
    };

    public emit = (event: T) => {
        /** Update any general listeners */
        this.listeners.forEach((listener) => listener(event));

        /** Clear the `once` queue */
        this.listenersOncer.forEach((listener) => listener(event));
        this.listenersOncer = [];
    };

    public pipe = (te: TypedEvent<T>): IDisposable => this.on((e) => te.emit(e));
}

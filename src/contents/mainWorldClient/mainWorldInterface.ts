export default abstract class MainWorldInterface<T, R> {
    abstract name: string;

    protected abstract clientFunction(arg: T): R;

    initClientSide() {
        globalThis.addEventListener(`${this.name}_REQUEST`, (event: any) => {
            const arg = event.detail;
            const result = this.clientFunction(arg);
            globalThis.dispatchEvent(new CustomEvent(`${this.name}_RESPONSE`, {
                detail: result
            }));
        })
    }


    callFunction(arg: T): Promise<R> {
        return new Promise<R>((resolve) => {
            const handleResponse = (event: any) => {
                globalThis.removeEventListener(`${this.name}_RESPONSE`, handleResponse);
                resolve(event.detail);
            };
            globalThis.addEventListener(`${this.name}_RESPONSE`, handleResponse);
            globalThis.dispatchEvent(new CustomEvent(`${this.name}_REQUEST`, {
                detail: arg
            }));
        });
    }

    protected getReactElement(e: Element | null) {
        if (!e) {
            return null;
        }

        const keys = Object.keys(e);
        for (const key of keys) {
            if (key.startsWith("__reactFiber$")) {
                return (e as any)[key];
            }
        }
        return null;
    }
}
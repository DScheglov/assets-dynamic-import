export function importStyle<T = void>(href: string, resolveCallback?: () => T): Promise<T>;

export function importStyle<T = void>(href: string, nodeProps?: HTMLLinkElement, resolveCallback?: () => T): Promise<T>;

export function importScript<T = void>(src: string, resolveCallback?: () => T): Promise<T>;

export function importScript<T = void>(src: string, nodeProps?: HTMLScriptElement, resolveCallback?: () => T): Promise<T>;

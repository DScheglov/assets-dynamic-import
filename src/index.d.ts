type IfEquals<X, Y, A=X, B=never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;

type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T];

type WritableAttribures<T> = Pick<T, WritableKeys<T>>

export function importStyle<T = void>(href: string, resolveCallback?: () => T): Promise<T>;

export function importStyle<T = void>(href: string, nodeProps?: WritableAttribures<HTMLLinkElement>, resolveCallback?: () => T): Promise<T>;

export function importScript<T = void>(src: string, resolveCallback?: () => T): Promise<T>;

export function importScript<T = void>(src: string, nodeProps?: WritableAttribures<HTMLScriptElement>, resolveCallback?: () => T): Promise<T>;

export function appendStyle<T = void>(href: string, resolveCallback?: () => T): Promise<T>;

export function appendStyle<T = void>(href: string, nodeProps?: WritableAttribures<HTMLLinkElement>, resolveCallback?: () => T): Promise<T>;

export function appendScript<T = void>(src: string, resolveCallback?: () => T): Promise<T>;

export function appendScript<T = void>(src: string, nodeProps?: WritableAttribures<HTMLScriptElement>, resolveCallback?: () => T): Promise<T>;

type IfEquals<X, Y, A=X, B=never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;

type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T];

type WritableAttribures<T> = Pick<T, WritableKeys<T>>

export function appendNodeAsync<R = void>(target: HTMLElement, node: HTMLElement, resolveCallback: () => R): Promise<R>;

export function createElement <K extends keyof HTMLElementTagNameMap>(
	tagName: K, 
	nodeProps: WritableAttribures<HTMLElementTagNameMap[K]>
): HTMLElementTagNameMap[K];

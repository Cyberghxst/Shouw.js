export declare class Collective<K, V> extends Map<K, V> {
    create(key: K, value: V): this;
    filter(fn: (value: V, index: number, array: V[]) => V[]): V[];
    filterKeys(fn: (key: K, index: number, array: K[]) => K[]): unknown[];
    find(fn: (value: V, index: number, array: V[]) => V | undefined): unknown | undefined;
    some(fn: (value: V, index: number, array: V[]) => boolean): boolean;
    has(key: K): boolean;
    get K(): K[];
    get V(): V[];
}

import { Collective } from '../utils';
import type { FunctionData } from '../typings';
import type { ShouwClient } from './ShouwClient';
export declare class FunctionsManager extends Collective<string, FunctionData> {
    readonly client: ShouwClient;
    constructor(client: ShouwClient);
    load(basePath: string, debug: boolean): void;
}

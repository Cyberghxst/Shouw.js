import { Collective } from '../utils';
import type { ShouwClient } from './ShouwClient';
import type { CommandData } from '../typings';
export declare class CommandsManager {
    readonly client: ShouwClient;
    messageCreate?: Collective<number, CommandData>;
    interactionCreate?: {
        slash: Collective<number, CommandData>;
        button: Collective<number, CommandData>;
        selectMenu: Collective<number, CommandData>;
    };
    constructor(client: ShouwClient, events: Array<string>);
}

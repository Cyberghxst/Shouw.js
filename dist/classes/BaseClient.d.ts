import { Client } from 'discord.js';
import type { ShouwClientOptions } from '../typings';
export declare class BaseClient extends Client {
    constructor({ token, intents, partials, ...options }: ShouwClientOptions);
}

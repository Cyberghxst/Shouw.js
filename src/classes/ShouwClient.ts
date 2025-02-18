import * as path from 'node:path';
import type { ShouwClientOptions, CommandData } from '../typings';
import { BaseClient } from './BaseClient';
import { FunctionsManager } from './Functions';
import { CommandsManager } from './Commands';

export class ShouwClient extends BaseClient {
    public functions: FunctionsManager;
    public commands: CommandsManager;
    public readonly prefix: Array<string>;

    constructor(options: ShouwClientOptions) {
        super(options);
        this.prefix = Array.isArray(options.prefix) ? options.prefix : [options.prefix];
        this.functions = new FunctionsManager(this);
        this.commands = new CommandsManager(this, options.events);
        this.functions.load(path.join(__dirname, '../functions'), false);
    }

    public command(data: CommandData): ShouwClient {
        const command = this.commands[data.type];
        if (!command) return this;
        command.set(command.size, data);
        return this;
    }
}

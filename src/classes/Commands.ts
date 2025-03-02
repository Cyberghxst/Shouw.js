import { Collective } from '../utils';
import { Events } from 'discord.js';
import type { ShouwClient } from './ShouwClient';
import type { CommandData } from '../typings';

export class CommandsManager {
    public readonly client: ShouwClient;
    public messageCreate?: Collective<number, CommandData>;
    public interactionCreate?: {
        slash: Collective<number, CommandData>;
        button: Collective<number, CommandData>;
        selectMenu: Collective<number, CommandData>;
        modal: Collective<number, CommandData>;
    };

    constructor(client: ShouwClient, events: Array<string>) {
        this.client = client;

        if (!Array.isArray(events)) return;
        const _events = events.filter((e: string) => Object.values(Events).includes(e as Events));

        for (const event of _events) {
            if (event === 'interactionCreate') {
                this[event] = {
                    slash: new Collective(),
                    button: new Collective(),
                    selectMenu: new Collective(),
                    modal: new Collective()
                };
            } else {
                this[event] = new Collective();
            }

            this.client.on(event, (...args) => require(`../events/${event}`).default(...args, this.client));
        }
    }
}

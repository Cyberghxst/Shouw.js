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
    };

    constructor(client: ShouwClient, events: Array<string>) {
        this.client = client;

        if (!Array.isArray(events)) return;
        const _events = events.filter((e: string) => Object.values(Events).includes(e as Events));

        for (const event of _events) {
            if (event === 'interactionCreate') {
                this.interactionCreate = {
                    slash: new Collective(),
                    button: new Collective(),
                    selectMenu: new Collective()
                };
            } else {
                this[event] = new Collective();
                const Events = require(`../events/${event}`).default;
                this.client.on(event, (...args) => Events(...args, this.client));
            }
        }
    }
}

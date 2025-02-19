import { Collective } from '../utils';
import { Events } from 'discord.js';
import { ShouwClient } from './ShouwClient';
import type { CommandData } from '../typings';

export class CommandsManager {
    public readonly client: ShouwClient;
    public messageCreate?: Collective<number, CommandData>;

    constructor(client: ShouwClient, events: Array<string>) {
        this.client = client;

        if (!Array.isArray(events)) return;
        events = events.filter((e: string) => Object.values(Events).includes(e as Events));
        events.forEach((event: string) => {
            if (event === 'interactionCreate') {
                this['interactionCreate'] = {
                    slash: new Collective(),
                    button: new Collective(),
                    selectMenu: new Collective()
                };
            } else {
                this[event] = new Collective();
                const Events = require(`../events/${event}`).default;
                this.client.on(event, (...args: any) => Events(...args, this.client));
            }
        });
    }
}

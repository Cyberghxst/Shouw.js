import { Saving } from '../utils/Saving';
import { Events } from 'discord.js';
import { ShouwClient } from './ShouwClient';

export class CommandsManager {
    public readonly client: ShouwClient;
    public messageCreate?: Saving;

    constructor(client: ShouwClient, events: Array<string>) {
        this.client = client;

        if (!Array.isArray(events)) return;
        events = events.filter((e: string) => Object.values(Events).includes(e as Events));
        events.forEach((event: string) => {
            if (event === 'interactionCreate') {
                this['interactionCreate'] = {
                    slash: new Saving(),
                    button: new Saving(),
                    selectMenu: new Saving()
                };
            } else {
                this[event] = new Saving();
                const Events = require(`../events/${event}`).default;
                this.client.on(event, (...args: any) => Events(...args, this.client));
            }
        });
    }
}

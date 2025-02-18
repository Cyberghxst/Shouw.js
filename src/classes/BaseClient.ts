import { Client, GatewayIntentBits as Intents, Partials } from 'discord.js';
import type { ShouwClientOptions } from '../typings';

export class BaseClient extends Client {
    constructor({ token, intents, partials, ...options }: ShouwClientOptions) {
        if (Array.isArray(intents)) intents = intents.map((i: string | unknown) => Intents[i as string] | (i as any));
        if (Array.isArray(partials))
            partials = partials.map((p: string | unknown) => Partials[p as string] | (p as any));

        super({ intents: intents ?? [], partials: partials ?? [], ...options });
        super.login(token);
    }
}

import type { Message } from 'discord.js';
import { type ShouwClient, Context } from '../classes';
import { Interpreter } from '../core';
import type { InterpreterOptions } from '../typings';

export default async function Events(message: Message, client: ShouwClient) {
    if (message.author.bot) return;

    const commands = client.commands?.messageCreate?.V;

    const prefixes: Promise<string | undefined>[] = client.prefix
        .map(async (prefix) => {
            if (prefix.includes('$') && prefix !== '$') {
                const result = await new Interpreter({ name: 'prefix', type: 'parsing', code: prefix }, {
                    context: new Context(message, []),
                    client: client,
                    channel: message.channel,
                    guild: message.guild,
                    user: message.author,
                    member: message.member
                } as InterpreterOptions).initialize();

                return result.result ?? undefined;
            }
            return prefix;
        })
        .filter(Boolean);

    for (const RawPrefix of prefixes) {
        const prefix = await RawPrefix;
        if (!prefix) continue;
        if (!message.content || !message.content.startsWith(prefix)) continue;

        const args = message.content.slice(prefix.length).split(/ +/g);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) continue;
        const command = commands?.find((cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName));
        if (!command) break;

        await new Interpreter(command, {
            context: new Context(message, args),
            client: client,
            channel: message.channel,
            guild: message.guild,
            user: message.author,
            member: message.member
        } as InterpreterOptions).initialize();
    }
}

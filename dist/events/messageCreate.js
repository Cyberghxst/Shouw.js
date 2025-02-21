"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Events;
const classes_1 = require("../classes");
const core_1 = require("../core");
async function Events(message, client) {
    if (message.author.bot)
        return;
    const commands = client.commands?.messageCreate?.V;
    const prefixes = client.prefix
        .map(async (prefix) => {
        if (prefix.includes('$') && prefix !== '$') {
            const result = await new core_1.Interpreter({ name: 'prefix', type: 'parsing', code: prefix }, {
                context: new classes_1.Context(message, []),
                client: client,
                channel: message.channel,
                guild: message.guild,
                user: message.author,
                member: message.member
            }).initialize();
            return result.result ?? undefined;
        }
        return prefix;
    })
        .filter(Boolean);
    for (const RawPrefix of prefixes) {
        const prefix = await RawPrefix;
        if (!prefix)
            continue;
        if (!message.content || !message.content.startsWith(prefix))
            continue;
        const args = message.content.slice(prefix.length).split(/ +/g);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName)
            continue;
        const command = commands?.find((cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName));
        if (!command)
            break;
        await new core_1.Interpreter(command, {
            context: new classes_1.Context(message, args),
            client: client,
            channel: message.channel,
            guild: message.guild,
            user: message.author,
            member: message.member
        }).initialize();
    }
}

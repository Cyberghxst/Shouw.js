import { ShouwClient } from '../dist';

const client = new ShouwClient({
    token: process.env.TOKEN,
    prefix: 'nou',
    intents: ['Guilds', 'GuildMessages', 'MessageContent'],
    events: ['messageCreate']
});

client.command({
    name: 'meow',
    type: 'messageCreate',
    code: '$description[meow]'
});

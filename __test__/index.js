'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const dist_1 = require('../dist');
const client = new dist_1.ShouwClient({
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsManager = void 0;
const utils_1 = require("../utils");
const discord_js_1 = require("discord.js");
class CommandsManager {
    constructor(client, events) {
        this.client = client;
        if (!Array.isArray(events))
            return;
        const _events = events.filter((e) => Object.values(discord_js_1.Events).includes(e));
        for (const event of _events) {
            if (event === 'interactionCreate') {
                this[event] = {
                    slash: new utils_1.Collective(),
                    button: new utils_1.Collective(),
                    selectMenu: new utils_1.Collective(),
                    modal: new utils_1.Collective()
                };
            }
            else {
                this[event] = new utils_1.Collective();
            }
            this.client.on(event, (...args) => require(`../events/${event}`).default(...args, this.client));
        }
    }
}
exports.CommandsManager = CommandsManager;

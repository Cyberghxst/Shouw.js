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
        events = events.filter((e) => Object.values(discord_js_1.Events).includes(e));
        events.forEach((event) => {
            if (event === 'interactionCreate') {
                this['interactionCreate'] = {
                    slash: new utils_1.Collective(),
                    button: new utils_1.Collective(),
                    selectMenu: new utils_1.Collective()
                };
            }
            else {
                this[event] = new utils_1.Collective();
                const Events = require(`../events/${event}`).default;
                this.client.on(event, (...args) => Events(...args, this.client));
            }
        });
    }
}
exports.CommandsManager = CommandsManager;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsManager = void 0;
const Saving_1 = require("../utils/Saving");
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
                    slash: new Saving_1.Saving(),
                    button: new Saving_1.Saving(),
                    selectMenu: new Saving_1.Saving()
                };
            }
            else {
                this[event] = new Saving_1.Saving();
                const Events = require(`../events/${event}`).default;
                this.client.on(event, (...args) => Events(...args, this.client));
            }
        });
    }
}
exports.CommandsManager = CommandsManager;

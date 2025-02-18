"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShouwClient = void 0;
const path = require("node:path");
const BaseClient_1 = require("./BaseClient");
const Functions_1 = require("./Functions");
const Commands_1 = require("./Commands");
class ShouwClient extends BaseClient_1.BaseClient {
    constructor(options) {
        super(options);
        this.prefix = Array.isArray(options.prefix) ? options.prefix : [options.prefix];
        this.functions = new Functions_1.FunctionsManager(this);
        this.commands = new Commands_1.CommandsManager(this, options.events);
        this.functions.load(path.join(__dirname, '../functions'), false);
    }
    command(data) {
        const command = this.commands[data.type];
        if (!command)
            return this;
        command.set(command.size, data);
        return this;
    }
}
exports.ShouwClient = ShouwClient;

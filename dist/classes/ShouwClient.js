"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShouwClient = void 0;
const path = require("node:path");
const _1 = require("./");
const BaseClient_1 = require("./BaseClient");
class ShouwClient extends BaseClient_1.BaseClient {
    constructor(options) {
        super(options);
        this.prefix = Array.isArray(options.prefix) ? options.prefix : [options.prefix];
        this.functions = new _1.FunctionsManager(this);
        this.commands = new _1.CommandsManager(this, options.events);
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

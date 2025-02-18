"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShouwClient = void 0;
const path = require("node:path");
const BaseClient_1 = require("./BaseClient");
const Functions_1 = require("./Functions");
class ShouwClient extends BaseClient_1.BaseClient {
    constructor(options) {
        super(options);
        this.functions = new Functions_1.FunctionsManager(this);
        this.functions.load(path.join(__dirname, '../functions'), false);
    }
}
exports.ShouwClient = ShouwClient;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
class Context {
    constructor(ctx, args) {
        this.ctx = ctx;
        this.args = args;
        this.channel = ctx.channel;
    }
    async send(data) {
        return await this.channel?.send(data);
    }
}
exports.Context = Context;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const discord_js_1 = require("discord.js");
class Context {
    constructor(ctx, args) {
        this.interaction = ctx instanceof discord_js_1.Message ? null : ctx;
        this.args = args;
        this.message = ctx instanceof discord_js_1.Message ? ctx : null;
        this.channel = ctx.channel;
        this.user = (ctx instanceof discord_js_1.Message ? ctx.author : ctx.user);
        this.member = ctx.member;
        this.guild = ctx.guild;
    }
    isInteraction(ctx) {
        return (!!this.interaction &&
            (ctx instanceof discord_js_1.ChatInputCommandInteraction ||
                ctx instanceof discord_js_1.MessageComponentInteraction ||
                ctx instanceof discord_js_1.ModalSubmitInteraction ||
                ctx instanceof discord_js_1.ContextMenuCommandInteraction));
    }
    async send(data) {
        if (!this.channel)
            return void 0;
        return await this.channel?.send(data);
    }
    // biome-ignore lint: data: any, Promise<any>
    async reply(data) {
        if (this.isInteraction(this.interaction)) {
            return await this.interaction?.reply(data);
        }
        return await this.message?.reply(data);
    }
}
exports.Context = Context;

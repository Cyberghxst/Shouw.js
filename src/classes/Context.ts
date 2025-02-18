import { Message, TextChannel } from 'discord.js';

export class Context {
    public ctx: Message;
    public args: Array<string>;
    public channel: TextChannel;
    constructor(ctx: Message, args: Array<string>) {
        this.ctx = ctx;
        this.args = args;
        this.channel = ctx.channel as TextChannel;
    }

    public async send(data: string | object): Promise<Message> {
        return await this.channel?.send(data);
    }
}

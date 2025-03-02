import type {
    TextChannel,
    User,
    Guild,
    GuildMember,
    MessagePayload,
    MessageReplyOptions,
    MessageCreateOptions,
    OmitPartialGroupDMChannel,
    InteractionCallbackResponse,
    InteractionReplyOptions
} from 'discord.js';
import {
    Message,
    ChatInputCommandInteraction,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    ContextMenuCommandInteraction
} from 'discord.js';

export class Context {
    public args?: Array<string>;
    public channel?: TextChannel;
    public user?: User;
    public member?: GuildMember;
    public guild?: Guild;
    public message?: Message | null;
    public interaction:
        | ChatInputCommandInteraction
        | MessageComponentInteraction
        | ModalSubmitInteraction
        | ContextMenuCommandInteraction
        | null;

    constructor(
        ctx:
            | Message
            | ChatInputCommandInteraction
            | MessageComponentInteraction
            | ModalSubmitInteraction
            | ContextMenuCommandInteraction,
        args: Array<string>
    ) {
        this.interaction = ctx instanceof Message ? null : ctx;
        this.args = args;
        this.message = ctx instanceof Message ? ctx : null;
        this.channel = ctx.channel as TextChannel;
        this.user = (ctx instanceof Message ? ctx.author : ctx.user) as User;
        this.member = ctx.member as GuildMember;
        this.guild = ctx.guild as Guild;
    }

    private isInteraction(ctx: unknown): boolean {
        return (
            !!this.interaction &&
            (ctx instanceof ChatInputCommandInteraction ||
                ctx instanceof MessageComponentInteraction ||
                ctx instanceof ModalSubmitInteraction ||
                ctx instanceof ContextMenuCommandInteraction)
        );
    }

    public async send(data: string | MessagePayload | MessageCreateOptions): Promise<Message<boolean> | undefined> {
        if (!this.channel) return void 0;
        return await this.channel?.send(data);
    }

    public async reply(
        data: string | MessagePayload | MessageReplyOptions
    ): Promise<Message<boolean> | OmitPartialGroupDMChannel<Message<boolean>> | undefined>;

    public async reply(
        data: string | (InteractionReplyOptions & { fetchReply?: boolean; withResponse?: boolean })
    ): Promise<InteractionCallbackResponse>;

    public async reply(data: any): Promise<any> {
        if (this.isInteraction(this.interaction)) {
            return await this.interaction?.reply(data);
        }

        return await this.message?.reply(data);
    }
}

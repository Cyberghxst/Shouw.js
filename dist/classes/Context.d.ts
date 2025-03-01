import type { TextChannel, User, Guild, GuildMember, MessagePayload, MessageReplyOptions, MessageCreateOptions, OmitPartialGroupDMChannel, InteractionCallbackResponse, InteractionReplyOptions } from 'discord.js';
import { Message, ChatInputCommandInteraction, MessageComponentInteraction, ModalSubmitInteraction, ContextMenuCommandInteraction } from 'discord.js';
export declare class Context {
    args?: Array<string>;
    channel?: TextChannel;
    user?: User;
    member?: GuildMember;
    guild?: Guild;
    message?: Message | null;
    interaction: ChatInputCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | ContextMenuCommandInteraction | null;
    constructor(ctx: Message | ChatInputCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction | ContextMenuCommandInteraction, args: Array<string>);
    private isInteraction;
    send(data: string | MessagePayload | MessageCreateOptions): Promise<Message<boolean> | undefined>;
    reply(data: string | MessagePayload | MessageReplyOptions): Promise<Message<boolean> | OmitPartialGroupDMChannel<Message<boolean>> | undefined>;
    reply(data: string | (InteractionReplyOptions & {
        fetchReply?: boolean;
        withResponse?: boolean;
    })): Promise<InteractionCallbackResponse>;
}

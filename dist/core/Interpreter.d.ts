import type { Channel, JSONEncodable, APIActionRowComponent, APIMessageActionRowComponent, ActionRowData, MessageActionRowComponentData, MessageActionRowComponentBuilder } from 'discord.js';
import type { CommandData, HelpersData, TemporarilyData, InterpreterOptions } from '../typings';
import type { Context, FunctionsManager, ShouwClient as Client } from '../classes';
import * as Discord from 'discord.js';
export declare class Interpreter {
    readonly client: Client;
    readonly functions: FunctionsManager;
    readonly debug: boolean | undefined;
    code: string;
    command: CommandData;
    channel?: Channel;
    guild?: Discord.Guild;
    member?: Discord.GuildMember;
    user?: Discord.User;
    context?: Context;
    args?: string[];
    content: string | undefined;
    embeds: Discord.EmbedBuilder[];
    attachments: Discord.AttachmentBuilder[];
    components: readonly (JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>> | ActionRowData<MessageActionRowComponentData | MessageActionRowComponentBuilder> | APIActionRowComponent<APIMessageActionRowComponent>)[];
    stickers: Discord.Sticker[];
    flags: number | string | bigint | undefined;
    message: Discord.Message | undefined;
    noop: () => void;
    helpers: HelpersData;
    Temporarily: TemporarilyData;
    discord: typeof Discord;
    constructor(cmd: CommandData, options: InterpreterOptions);
    initialize(): Promise<{
        error: boolean;
        id: string | undefined;
        result: string | null;
    }>;
    private unpack;
    private extractArguments;
    private extractFunctions;
    error(options: {
        message: string;
        solution?: string;
    }): Promise<void>;
}

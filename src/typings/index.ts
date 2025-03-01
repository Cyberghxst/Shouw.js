import type * as Discord from 'discord.js';
import type * as DiscordType from 'discord.js';
import type { Context, ShouwClient } from '../classes';
import type { CheckCondition, Interpreter, ParamType } from '../core';

declare global {
    interface String {
        unescape(): string;
        escape(): string;
    }
}

interface Objects {
    [key: string | symbol | number]: unknown;
}

export interface InterpreterOptions {
    client: ShouwClient;
    guild?: Discord.Guild;
    channel?: DiscordType.Channel;
    member?: Discord.GuildMember;
    user?: Discord.User;
    context?: Context;
    args?: string[];
    debug?: boolean;
    Temporarily?: TemporarilyData;
}

export interface FunctionData extends Objects {
    name: string;
    description?: string;
    brackets?: boolean;
    type?: string;
    async?: boolean;
    params?: {
        name?: string;
        description?: string;
        required?: boolean;
        type?: ParamType;
    }[];
}

export interface CommandData extends Objects {
    name?: string;
    aliases?: string | string[];
    code: string;
    type: string;
    prototype?: string;
}

export interface FunctionResultData extends Omit<InterpreterOptions, 'client'> {
    result: string | unknown;
    error?: boolean;
    embeds?: Discord.EmbedBuilder[];
    attachments?: Discord.AttachmentBuilder[];
    components?: Discord.ActionRowBuilder[];
    flags?: number | string | bigint;
    message?: Discord.Message;
}

export interface TemporarilyData {
    arrays: Objects;
    variables: Objects;
    splits: Array<string>;
    randoms: Objects;
    timezone: string;
}

export interface HelpersData {
    condition: typeof CheckCondition;
    interpreter: typeof Interpreter;
    unescape: (str: string) => string;
    escape: (str: string) => string;
}

export interface ShouwClientOptions extends DiscordType.ClientOptions {
    token: undefined | string;
    events: Array<keyof DiscordType.ClientEvents>;
    prefix: string | string[];
}

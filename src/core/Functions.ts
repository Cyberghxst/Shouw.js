import {
    ApplicationEmoji,
    AttachmentBuilder,
    AutoModerationRule,
    BaseChannel,
    Emoji,
    Guild,
    GuildEmoji,
    GuildForumTag,
    GuildMember,
    Invite,
    Message,
    MessageReaction,
    PermissionsString,
    Role,
    Sticker,
    TextBasedChannel,
    User,
    Webhook
} from 'discord.js';
import type { FunctionData, FunctionResultData, TemporarilyData } from '../typings';
import type { Interpreter } from './Interpreter';

export enum ParamType {
    URL = 0,
    String = 1,
    BigInt = 2,
    Unknown = 3,
    TextChannel = 4,
    OverwritePermission = 5,
    Number = 6,
    User = 7,
    Date = 8,
    Guild = 9,
    RoleOrUser = 10,
    Invite = 11,
    Permission = 12,
    Json = 13,
    Color = 14,
    Enum = 15,
    ForumTag = 16,
    Emoji = 17,
    GuildEmoji = 18,
    Boolean = 19,
    Attachment = 20,
    Reaction = 21,
    Message = 22,
    Channel = 23,
    Role = 24,
    Webhook = 25,
    Sticker = 26,
    Time = 27,
    Member = 28,
    ApplicationEmoji = 29,
    AutomodRule = 30
}

export class Functions {
    public readonly name?: string;
    public readonly brackets?: boolean;
    public readonly description?: string;
    public readonly type?: string;
    public readonly params?: {
        name?: string;
        description?: string;
        required?: boolean;
        type?: ParamType;
    }[];

    constructor(data: FunctionData) {
        if (!data) return;
        this.name = data.name;
        this.brackets = data.brackets;
        this.description = data.description;
        this.type = data.type;
        this.params = data.params ?? [];
    }

    public code(_ctx?: Interpreter, _params?: Array<unknown>, _data?: TemporarilyData): FunctionResultData {
        return { result: void 0 };
    }
}

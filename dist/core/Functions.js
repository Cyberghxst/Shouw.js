'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Functions = exports.ParamType = void 0;
var ParamType;
(function (ParamType) {
    ParamType[(ParamType['URL'] = 0)] = 'URL';
    ParamType[(ParamType['String'] = 1)] = 'String';
    ParamType[(ParamType['BigInt'] = 2)] = 'BigInt';
    ParamType[(ParamType['Unknown'] = 3)] = 'Unknown';
    ParamType[(ParamType['TextChannel'] = 4)] = 'TextChannel';
    ParamType[(ParamType['OverwritePermission'] = 5)] = 'OverwritePermission';
    ParamType[(ParamType['Number'] = 6)] = 'Number';
    ParamType[(ParamType['User'] = 7)] = 'User';
    ParamType[(ParamType['Date'] = 8)] = 'Date';
    ParamType[(ParamType['Guild'] = 9)] = 'Guild';
    ParamType[(ParamType['RoleOrUser'] = 10)] = 'RoleOrUser';
    ParamType[(ParamType['Invite'] = 11)] = 'Invite';
    ParamType[(ParamType['Permission'] = 12)] = 'Permission';
    ParamType[(ParamType['Json'] = 13)] = 'Json';
    ParamType[(ParamType['Color'] = 14)] = 'Color';
    ParamType[(ParamType['Enum'] = 15)] = 'Enum';
    ParamType[(ParamType['ForumTag'] = 16)] = 'ForumTag';
    ParamType[(ParamType['Emoji'] = 17)] = 'Emoji';
    ParamType[(ParamType['GuildEmoji'] = 18)] = 'GuildEmoji';
    ParamType[(ParamType['Boolean'] = 19)] = 'Boolean';
    ParamType[(ParamType['Attachment'] = 20)] = 'Attachment';
    ParamType[(ParamType['Reaction'] = 21)] = 'Reaction';
    ParamType[(ParamType['Message'] = 22)] = 'Message';
    ParamType[(ParamType['Channel'] = 23)] = 'Channel';
    ParamType[(ParamType['Role'] = 24)] = 'Role';
    ParamType[(ParamType['Webhook'] = 25)] = 'Webhook';
    ParamType[(ParamType['Sticker'] = 26)] = 'Sticker';
    ParamType[(ParamType['Time'] = 27)] = 'Time';
    ParamType[(ParamType['Member'] = 28)] = 'Member';
    ParamType[(ParamType['ApplicationEmoji'] = 29)] = 'ApplicationEmoji';
    ParamType[(ParamType['AutomodRule'] = 30)] = 'AutomodRule';
})(ParamType || (exports.ParamType = ParamType = {}));
class Functions {
    constructor(data) {
        if (!data) return;
        this.name = data.name;
        this.brackets = data.brackets;
        this.description = data.description;
        this.type = data.type;
        this.params = data.params ?? [];
    }
    code(_discord, _params, _data) {
        return { result: '' };
    }
}
exports.Functions = Functions;

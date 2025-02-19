"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Functions = exports.ParamType = void 0;
var ParamType;
(function (ParamType) {
    ParamType[ParamType["URL"] = 0] = "URL";
    ParamType[ParamType["String"] = 1] = "String";
    ParamType[ParamType["BigInt"] = 2] = "BigInt";
    ParamType[ParamType["Unknown"] = 3] = "Unknown";
    ParamType[ParamType["Number"] = 4] = "Number";
    ParamType[ParamType["Json"] = 5] = "Json";
    ParamType[ParamType["Color"] = 6] = "Color";
    ParamType[ParamType["Boolean"] = 7] = "Boolean";
})(ParamType || (exports.ParamType = ParamType = {}));
class Functions {
    constructor(data) {
        if (!data)
            return;
        this.name = data.name;
        this.brackets = data.brackets;
        this.description = data.description;
        this.type = data.type;
        this.params = data.params ?? [];
    }
    code(_ctx, _params, _data) {
        return { result: void 0 };
    }
}
exports.Functions = Functions;

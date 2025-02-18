"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../core");
class Get extends core_1.Functions {
    constructor() {
        super({
            name: '$get',
            description: 'Will retrieve temporary variables stored ny $let',
            brackets: true,
            params: [
                {
                    name: 'varname',
                    description: 'Temporary variable you want to retrieve',
                    required: true,
                    type: core_1.ParamType.String
                }
            ]
        });
    }
    code(_ctx, [varname], data) {
        return {
            result: data.variables[varname]
        };
    }
}
exports.default = Get;

'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('../../core');
class Let extends core_1.Functions {
    constructor() {
        super({
            name: '$let',
            description: 'Will store temporary variables which can be retrieved by $let',
            brackets: true,
            params: [
                {
                    name: 'varname',
                    description: 'Name of the temporary variable',
                    required: true,
                    type: core_1.ParamType.String
                },
                {
                    name: 'value',
                    description: 'Value of the temporary variable you want to save',
                    required: true,
                    type: core_1.ParamType.String
                }
            ]
        });
    }
    code(_ctx, [varname, value], data) {
        data.variables[varname] = value;
        return {
            result: void 0
        };
    }
}
exports.default = Let;

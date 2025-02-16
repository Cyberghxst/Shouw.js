'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('../../core');
class IF extends core_1.Functions {
    constructor() {
        super({
            name: '$checkCondition',
            description: 'Check a condition wether true or false',
            brackets: true,
            params: [
                {
                    name: 'condition',
                    description: 'The condition you want to check',
                    required: true,
                    type: core_1.ParamType.String
                }
            ]
        });
    }
    code(ctx, [condition]) {
        return {
            result: ctx.helpers.condition.solve(condition)
        };
    }
}
exports.default = IF;

import { Functions, type Interpreter, ParamType } from '../../core';
import type { FunctionData, FunctionResultData } from '../../typings';

export default class CheckCondition extends Functions {
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
                    type: ParamType.String
                }
            ]
        } as FunctionData);
    }

    code(ctx: Interpreter, [condition]: [string]): FunctionResultData {
        return {
            result: ctx.helpers.condition.solve(condition)
        };
    }
}

import { Functions, type Interpreter, ParamType } from '../../core';
import type { FunctionData, FunctionResultData, TemporarilyData } from '../../typings';

export default class Get extends Functions {
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
                    type: ParamType.String
                }
            ]
        } as FunctionData);
    }

    code(_ctx: Interpreter, [varname]: [string], data: TemporarilyData): FunctionResultData {
        return {
            result: data.variables[varname]
        };
    }
}

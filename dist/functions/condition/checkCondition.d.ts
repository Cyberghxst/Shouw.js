import { Functions, type Interpreter } from '../../core';
import type { FunctionResultData } from '../../typings';
export default class CheckCondition extends Functions {
    constructor();
    code(ctx: Interpreter, [condition]: [string]): FunctionResultData;
}

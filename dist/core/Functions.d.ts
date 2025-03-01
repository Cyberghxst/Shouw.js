import type { FunctionData, FunctionResultData, TemporarilyData } from '../typings';
import type { Interpreter } from './Interpreter';
export declare enum ParamType {
    URL = 0,
    String = 1,
    BigInt = 2,
    Unknown = 3,
    Number = 4,
    Json = 5,
    Color = 6,
    Boolean = 7
}
export declare class Functions {
    readonly name?: string;
    readonly brackets?: boolean;
    readonly description?: string;
    readonly type?: string;
    readonly params?: {
        name?: string;
        description?: string;
        required?: boolean;
        type?: ParamType;
    }[];
    constructor(data: FunctionData);
    code(_ctx?: Interpreter, _params?: Array<unknown>, _data?: TemporarilyData): FunctionResultData;
}

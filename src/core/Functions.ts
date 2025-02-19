import type { FunctionData, FunctionResultData, TemporarilyData } from '../typings';
import type { Interpreter } from './Interpreter';

export enum ParamType {
    URL = 0,
    String = 1,
    BigInt = 2,
    Unknown = 3,
    Number = 4,
    Json = 5,
    Color = 6,
    Boolean = 7
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

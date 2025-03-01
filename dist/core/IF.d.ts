import { Interpreter } from './Interpreter';
export declare function IF(code: string, ctx: Interpreter): Promise<{
    error: boolean;
    code: string;
}>;

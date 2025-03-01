export declare class CheckCondition {
    static hasAnd(msg: string): boolean;
    static hasOr(msg: string): boolean;
    static hasEqual(msg: string): boolean;
    static hasNotEqual(msg: string): boolean;
    static hasGreater(msg: string): boolean;
    static hasLesser(msg: string): boolean;
    static hasGE(msg: string): boolean;
    static hasLE(msg: string): boolean;
    static solveEqual(msg: string): boolean;
    static solveNotEqual(msg: string): boolean;
    static solveGreater(msg: string): boolean;
    static solveLesser(msg: string): boolean;
    static solveLE(msg: string): boolean;
    static solveGE(msg: string): boolean;
    static solveAnd(msg: string): string;
    static solveOr(msg: string): string;
    static solve(msg: string): any;
}

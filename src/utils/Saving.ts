import type { CommandData } from '../typings';

export class Saving extends Map<string | number, CommandData> {
    constructor() {
        super();
    }

    public filter(fn: (value: CommandData, index: number, array: CommandData[]) => CommandData[]): CommandData[] {
        return Array.from(this.V).filter(fn);
    }

    public filterKeys(
        fn: (key: string | number, index: number, array: Array<string | number>) => Array<string | number>
    ): Array<string | number> {
        return Array.from(this.K).filter(fn);
    }

    public find(
        fn: (value: CommandData, index: number, array: CommandData[]) => CommandData | undefined
    ): CommandData | undefined {
        return Array.from(this.V).find(fn);
    }

    public some(fn: (value: CommandData, index: number, array: CommandData[]) => boolean): boolean {
        return Array.from(this.V).some(fn);
    }

    public override has(key: string): boolean {
        return super.has(key);
    }

    public get K() {
        return [...this.keys()];
    }

    public get V() {
        return [...this.values()];
    }
}

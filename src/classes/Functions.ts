import * as fs from 'node:fs';
import * as path from 'node:path';
import type { FunctionData } from '../typings';
import type { ShouwClient } from './ShouwClient';

export class FunctionsManager extends Map<string, FunctionData> {
    public readonly client: ShouwClient;

    constructor(client: ShouwClient) {
        super();
        this.client = client;
    }

    public load(basePath: string, debug: boolean) {
        const files = fs.readdirSync(basePath);
        for (const file of files) {
            const filePath = path.join(basePath, file);
            const stat = fs.lstatSync(filePath);
            if (stat.isDirectory()) {
                this.load(filePath, debug);
            } else {
                if (!file.endsWith('.js')) continue;
                const RawFunction = require(filePath).default;
                const func = new RawFunction();
                this.create(func);
                if (debug) console.log(`Function loaded: ${func.name}`);
            }
        }
    }

    public create(data: FunctionData) {
        super.set(data.name, data);
    }

    public override delete(name: string) {
        return super.delete(name);
    }

    public filter(func: (value: FunctionData) => boolean): FunctionData[] {
        return Array.from(this.V()).filter(func);
    }

    public filterKeys(func: (key: string) => boolean): string[] {
        return Array.from(this.K()).filter(func);
    }

    public V(): Array<FunctionData> {
        return [...super.values()];
    }

    public K(): Array<string> {
        return [...super.keys()];
    }
}

import * as fs from 'node:fs';
import * as path from 'node:path';
import { Collective } from '../utils';
import type { FunctionData } from '../typings';
import type { ShouwClient } from './ShouwClient';

export class FunctionsManager extends Collective<string, FunctionData> {
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
                this.create(func.name, func);
                if (debug) console.log(`Function loaded: ${func.name}`);
            }
        }
    }
}

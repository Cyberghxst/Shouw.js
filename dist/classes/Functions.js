'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.FunctionsManager = void 0;
const fs = require('node:fs');
const path = require('node:path');
class FunctionsManager extends Map {
    constructor(client) {
        super();
        this.client = client;
    }
    load(basePath, debug) {
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
    create(data) {
        super.set(data.name, data);
    }
    delete(name) {
        return super.delete(name);
    }
    filter(func) {
        return Array.from(this.V()).filter(func);
    }
    filterKeys(func) {
        return Array.from(this.K()).filter(func);
    }
    V() {
        return [...super.values()];
    }
    K() {
        return [...super.keys()];
    }
}
exports.FunctionsManager = FunctionsManager;

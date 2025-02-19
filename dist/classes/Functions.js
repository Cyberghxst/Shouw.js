"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionsManager = void 0;
const fs = require("node:fs");
const path = require("node:path");
const utils_1 = require("../utils");
class FunctionsManager extends utils_1.Collective {
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
            }
            else {
                if (!file.endsWith('.js'))
                    continue;
                const RawFunction = require(filePath).default;
                const func = new RawFunction();
                this.create(func.name, func);
                if (debug)
                    console.log(`Function loaded: ${func.name}`);
            }
        }
    }
}
exports.FunctionsManager = FunctionsManager;

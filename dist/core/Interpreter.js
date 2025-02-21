"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const Discord = require("discord.js");
const _1 = require("./");
const chalk = require("chalk");
class Interpreter {
    constructor(cmd, options) {
        this.noop = () => { };
        this.discord = Discord;
        this.client = options.client;
        this.functions = this.client.functions;
        this.debug = options.debug;
        this.code = cmd.code;
        this.command = cmd;
        this.channel = options.channel;
        this.guild = options.guild;
        this.member = options.member;
        this.user = options.user;
        this.context = options.context;
        this.args = options.args;
        this.content = null;
        this.embeds = [];
        this.attachments = [];
        this.components = [];
        this.stickers = [];
        this.flags = null;
        this.message = null;
        this.helpers = {
            condition: _1.CheckCondition,
            interpreter: Interpreter,
            unescape: (str) => str.unescape(),
            escape: (str) => str.escape()
        };
        this.Temporarily =
            options.Temporarily ??
                {
                    arrays: {},
                    variables: {},
                    splits: [],
                    randoms: {},
                    timezone: 'UTC'
                };
    }
    async initialize() {
        let result = this.code;
        let error = false;
        const processFunction = async (code) => {
            const functions = this.extractFunctions(code);
            if (functions.length === 0)
                return code;
            let currentCode = code;
            for (const func of functions) {
                if (func.match(/(\$if|\$endif)$/i)) {
                    const RESULT = await (0, _1.IF)(currentCode, this);
                    if (RESULT.error) {
                        error = true;
                        break;
                    }
                    currentCode = await processFunction(RESULT.code);
                    break;
                }
                const unpacked = this.unpack(func, currentCode);
                if (!unpacked.all)
                    continue;
                const functionData = this.functions.get(func);
                if (!functionData || !functionData.code || typeof functionData.code !== 'function')
                    continue;
                if (functionData.brackets && !unpacked.brackets) {
                    const funcWithParams = `${func}[${functionData.params?.map((x) => x.name).join(';')}]`;
                    await this.error({
                        message: `Invalid ${func} usage: Missing brackets`,
                        solution: `Make sure to add brackets to the function. Example: ${funcWithParams}`
                    });
                    error = true;
                    break;
                }
                const processedArgs = [];
                if (unpacked.args.length > 0) {
                    for (const arg of unpacked.args) {
                        if (!arg) {
                            processedArgs.push(void 0);
                            continue;
                        }
                        if ((typeof arg === 'string' && !arg.match(/\$/g)) || typeof arg !== 'string') {
                            processedArgs.push(arg);
                            continue;
                        }
                        const processed = await processFunction(arg);
                        processedArgs.push(processed);
                    }
                }
                const DATA = (await functionData.code({
                    ...this,
                    interpreter: Interpreter,
                    data: this.Temporarily
                }, processedArgs, this.Temporarily)) ?? {};
                const result = DATA.result?.toString().escape() ?? '';
                currentCode = currentCode.replace(unpacked.all, result);
                if (DATA.error === true) {
                    error = true;
                    break;
                }
                if (DATA.embeds) {
                    this.embeds = DATA.embeds;
                }
                if (DATA.attachments) {
                    this.attachments = DATA.attachments;
                }
                if (DATA.components) {
                    this.components = DATA.components;
                }
                if (DATA.stickers) {
                    this.stickers = DATA.stickers;
                }
                if (DATA.flags) {
                    this.flags = DATA.flags;
                }
                if (DATA.message) {
                    this.message = DATA.message;
                }
            }
            return currentCode.unescape().trim();
        };
        result = await processFunction(result);
        this.code = result;
        if (error === false &&
            ((this.code && this.code !== '') ||
                this.components.length > 0 ||
                this.embeds.length > 0 ||
                this.attachments.length > 0)) {
            this.message = (await this.context?.send({
                content: this.code !== '' ? this.code : null,
                embeds: this.embeds,
                components: this.components,
                files: this.attachments,
                flags: this.flags
            }));
        }
        return {
            error: error,
            id: this.message?.id,
            result: error ? null : this.code
        };
    }
    unpack(func, code) {
        const funcStart = code.toLowerCase().indexOf(func.toLowerCase());
        if (funcStart === -1)
            return { func, args: [], brackets: false, all: null };
        if (funcStart > 0 && code[funcStart - 1] === '$') {
            return { func, args: [], brackets: false, all: func };
        }
        const openBracketIndex = code.indexOf('[', funcStart);
        if (openBracketIndex === -1)
            return { func, args: [], brackets: false, all: func };
        const textBetween = code.slice(funcStart + func.length, openBracketIndex).trim();
        if (textBetween.includes('$')) {
            return { func, args: [], brackets: false, all: func };
        }
        let bracketStack = 0;
        let closeBracketIndex = openBracketIndex;
        while (closeBracketIndex < code.length) {
            const char = code[closeBracketIndex];
            if (char === '[') {
                bracketStack++;
            }
            else if (char === ']') {
                bracketStack--;
                if (bracketStack === 0)
                    break;
            }
            closeBracketIndex++;
        }
        if (closeBracketIndex >= code.length || bracketStack > 0) {
            return { func, args: [], brackets: false, all: func };
        }
        const argsStr = code.slice(openBracketIndex + 1, closeBracketIndex).trim();
        const args = this.extractArguments(argsStr);
        const all = code.slice(funcStart, closeBracketIndex + 1);
        return { func, args, brackets: true, all };
    }
    extractArguments(argsStr) {
        const args = [];
        let depth = 0;
        let currentArg = '';
        for (let i = 0; i < argsStr.length; i++) {
            const char = argsStr[i];
            if (char === '[') {
                depth++;
                currentArg += char;
            }
            else if (char === ']') {
                depth--;
                currentArg += char;
            }
            else if (char === ';' && depth === 0) {
                args.push(currentArg.trim());
                currentArg = '';
            }
            else {
                currentArg += char;
            }
        }
        if (currentArg.trim())
            args.push(currentArg.trim());
        // @ts-ignore
        return args.map((arg) => {
            if (arg !== '')
                return arg.unescape();
            return void 0;
        });
    }
    extractFunctions(code = this.code) {
        const lines = code.split(/\n/)?.filter((line) => line.trim() !== '' || line);
        const functions = [];
        for (const line of lines) {
            const splited = line.split('$').filter((x) => x.trim() !== '');
            const lineFunctions = [];
            for (const part of splited) {
                const matchingFunctions = [...this.functions.K, '$if', '$endif'].filter((func) => func.toLowerCase() === `$${part.toLowerCase()}`.slice(0, func.length));
                if (matchingFunctions.length === 1) {
                    lineFunctions.push(matchingFunctions[0]);
                }
                else if (matchingFunctions.length > 1) {
                    lineFunctions.push(matchingFunctions.sort((a, b) => b.length - a.length)[0]);
                }
            }
            if (lineFunctions.length > 0)
                functions.push(...lineFunctions.reverse());
        }
        return functions;
    }
    async error(options) {
        try {
            await this.context?.send(`\`\`\`\n🚫 ${options.message}${options.solution ? `\n\nSo, what is the solution?\n${options.solution}` : ''}\`\`\``);
        }
        catch {
            console.log(`[${chalk.red('ERROR')}]: ${options.message}`);
            if (options.solution)
                console.log(`[${chalk.green('SOLUTION')}]: ${options.solution}`);
        }
    }
}
exports.Interpreter = Interpreter;

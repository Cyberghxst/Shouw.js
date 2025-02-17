'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Interpreter = void 0;
const Discord = require('discord.js');
const Conditions_1 = require('./Conditions');
const IF_1 = require('./IF');
class Interpreter {
    constructor(cmd, options) {
        this.noop = () => {};
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
            condition: Conditions_1.CheckCondition,
            interpreter: Interpreter,
            unescape: str => str.unescape(),
            escape: str => str.escape()
        };
        this.Temporarily = options.Temporarily ?? {
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
        const processFunction = async code => {
            let functions = this.extractFunctions(code);
            if (functions.length === 0) return code;
            let currentCode = code;
            for (let func of functions) {
                if (func.match(/^\$if$/i)) {
                    const RESULT = await (0, IF_1.IF)(currentCode, this);
                    if (RESULT.error) {
                        error = true;
                        break;
                    }
                    currentCode = await processFunction(RESULT.code);
                    break;
                }
                const unpacked = this.unpack(func, currentCode);
                if (!unpacked.all) continue;
                const functionData = this.functions.get(func);
                if (!functionData) continue;
                if (functionData.brackets && !unpacked.brackets) {
                    console.log(`Invalid ${func} usage: Missing brackets`);
                    error = true;
                    break;
                }
                const processedArgs = [];
                if (unpacked.args.length > 0) {
                    for (const arg of unpacked.args) {
                        if (!arg || typeof arg !== 'string') {
                            processedArgs.push(void 0);
                            continue;
                        } else if (typeof arg === 'string' && !arg.match(/\$/g)) {
                            processedArgs.push(arg);
                            continue;
                        }
                        const processed = await processFunction(arg);
                        processedArgs.push(processed);
                    }
                }
                const DATA =
                    (await functionData.code(
                        {
                            ...this,
                            interpreter: Interpreter,
                            data: this.Temporarily
                        },
                        processedArgs,
                        this.Temporarily
                    )) ?? {};
                const result = DATA.result?.toString().escape() ?? '';
                currentCode = currentCode.replace(unpacked.all, result);
                if (DATA.error === true) {
                    error = true;
                    break;
                }
            }
            return currentCode.unescape().trim();
        };
        result = await processFunction(result);
        this.code = result;
        return {
            result: error ? null : this.code.unescape().trim()
        };
    }
    unpack(func, code) {
        const funcStart = code.toLowerCase().indexOf(func.toLowerCase());
        if (funcStart === -1) return { func, args: [], brackets: false, all: null };
        if (funcStart > 0 && code[funcStart - 1] === '$') {
            return { func, args: [], brackets: false, all: func };
        }
        const openBracketIndex = code.indexOf('[', funcStart);
        if (openBracketIndex === -1) return { func, args: [], brackets: false, all: func };
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
            } else if (char === ']') {
                bracketStack--;
                if (bracketStack === 0) break;
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
            } else if (char === ']') {
                depth--;
                currentArg += char;
            } else if (char === ';' && depth === 0) {
                args.push(currentArg.trim());
                currentArg = '';
            } else {
                currentArg += char;
            }
        }
        if (currentArg.trim()) args.push(currentArg.trim());
        // @ts-ignore
        return args.map(arg => {
            if (arg !== '') return arg.unescape();
            return void 0;
        });
    }
    extractFunctions(code = this.code) {
        const lines = code.split(/\n/)?.filter(line => line.trim() !== '' || line);
        const functions = [];
        for (const line of lines) {
            const splited = line.split('$').filter(x => x.trim() !== '');
            const lineFunctions = [];
            for (const part of splited) {
                const matchingFunctions = [...this.functions.K(), '$if'].filter(
                    func => func.toLowerCase() === `$${part.toLowerCase()}`.slice(0, func.length)
                );
                if (matchingFunctions.length === 1) {
                    lineFunctions.push(matchingFunctions[0]);
                } else if (matchingFunctions.length > 1) {
                    lineFunctions.push(matchingFunctions.sort((a, b) => b.length - a.length)[0]);
                }
            }
            if (lineFunctions.length > 0) functions.push(...lineFunctions);
        }
        return functions;
    }
}
exports.Interpreter = Interpreter;
String.prototype.unescape = function () {
    return this.replace(/#RIGHT#/g, '[')
        .replace(/#LEFT#/g, ']')
        .replace(/#SEMI#/g, ';')
        .replace(/#COLON#/g, ':')
        .replace(/#CHAR#/g, '$')
        .replace(/#RIGHT_CLICK#/g, '>')
        .replace(/#LEFT_CLICK#/g, '<')
        .replace(/#EQUAL#/g, '=')
        .replace(/#RIGHT_BRACKET#/g, '{')
        .replace(/#LEFT_BRACKET#/g, '}')
        .replace(/#COMMA#/g, ',')
        .replace(/#LB#/g, '(')
        .replace(/#RB#/g, ')')
        .replace(/#AND#/g, '&&')
        .replace(/#OR#/g, '||');
};
String.prototype.escape = function () {
    return this.replace(/\[/g, '#RIGHT#')
        .replace(/]/g, '#LEFT#')
        .replace(/;/g, '#SEMI#')
        .replace(/:/g, '#COLON#')
        .replace(/\$/g, '#CHAR#')
        .replace(/>/g, '#RIGHT_CLICK#')
        .replace(/</g, '#LEFT_CLICK#')
        .replace(/=/g, '#EQUAL#')
        .replace(/{/g, '#RIGHT_BRACKET#')
        .replace(/}/g, '#LEFT_BRACKET#')
        .replace(/,/g, '#COMMA#')
        .replace(/\(/g, '#LB#')
        .replace(/\)/g, '#RB#')
        .replace(/&&/g, '#AND#')
        .replace(/\|\|/g, '#OR#');
};

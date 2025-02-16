import type { Channel } from 'discord.js';
import type { CommandData, HelpersData, TemporarilyData, InterpreterOptions } from '../typings';
import * as Discord from 'discord.js';
import { Context, FunctionsManager, ShouwClient as Client } from '../classes';
import { CheckCondition } from './Conditions';
import { IF } from './IF';

class Interpreter {
	public readonly client: Client;
	public readonly functions: FunctionsManager;
	public readonly debug: boolean | undefined;

	public code: string;
	public command: CommandData;
	public channel?: Channel;
	public guild?: Discord.Guild;
	public member?: Discord.GuildMember;
	public user?: Discord.User;
	public context?: Context;
	public args?: string[];
	public content: string | null;
	public embeds: Discord.EmbedBuilder[];
	public attachments: Discord.AttachmentBuilder[];
	public components: Discord.ActionRowBuilder[];
	public stickers: Discord.Sticker[];
	public flags: number | string | bigint | null;
	public message: Discord.Message | null;
	public noop: () => void = () => {};
	public helpers: HelpersData;
	public Temporarily: TemporarilyData;
	public discord: typeof Discord = Discord;

	constructor(cmd: CommandData, options: InterpreterOptions) {
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
			condition: CheckCondition,
			interpreter: Interpreter,
			unescape: (str: string) => str.unescape(),
			escape: (str: string) => str.escape()
		};
		this.Temporarily = {
			arrays: {},
			variables: {},
			splits: [],
			randoms: {},
			timezone: 'UTC'
		};
	}

	public async initialize() {
		let result = this.code;
		let error = false;

		const processFunction = async (code: string): Promise<string> => {
			let functions = this.extractFunctions(code);
			if (functions.length === 0) return code;
			let currentCode = code;
			let splitedCode = code.split(/\n/);

			for (const func of functions) {
				if (func.toLowerCase() === '$if') {
					let depth = 0;
					let position = 0;
					const functionLine = splitedCode.findIndex((code: string) => {
						const lines = code
							?.toLowerCase()
							.split(' ')
							.map((x) => x.trim());
						return lines.some((line: string) => line.startsWith(func));
					});

					while (depth >= 0 && position < splitedCode.length) {
						if (splitedCode[position].match(/\$if\[/i)) depth++;
						if (splitedCode[position].match(/\$endif/i)) depth--;
						position++;
					}

					if (depth !== 0) {
						console.log('Invalid $if usage: Missing endif');
						error = true;
						break;
					}

					const BLOCK = splitedCode.slice(functionLine, position).join('\n');
					const RESULT = await IF(BLOCK, this as InterpreterOptions);
					currentCode = currentCode.replace(BLOCK, RESULT);
					splitedCode = currentCode.split(/\n/);
					functions = this.extractFunctions(currentCode);
				}

				const unpacked = this.unpack(func, currentCode);
				if (!unpacked.all) continue;
				const functionData = this.functions.get(func);
				if (!functionData) continue;

				const processedArgs: Array<any> = [];
				if (unpacked.args.length > 0) {
					for (const arg of unpacked.args) {
						if (!arg || typeof arg !== 'string') {
							processedArgs.push(void 0);
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

				// @ts-ignore
				const result = DATA.result?.toString().escape() ?? '';
				currentCode = currentCode.replace(unpacked.all, result.toString());
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
			result: error ? null : this.code.unescape()
		};
	}

	private unpack(
		func: string,
		code: string
	): {
		func: string;
		args: Array<any>;
		brackets: any;
		all: string | null;
	} {
		const funcStart = code.indexOf(func);
		if (funcStart === -1) return { func, args: [], brackets: false, all: null };

		if (funcStart > 0 && code[funcStart - 1] === '$') {
			return { func, args: [], brackets: false, all: null };
		}

		const openBracketIndex = code.indexOf('[', funcStart);
		if (openBracketIndex === -1) return { func, args: [], brackets: false, all: func };

		const textBetween = code.slice(funcStart + func.length, openBracketIndex).trim();
		if (textBetween.includes('$')) {
			return { func, args: [], brackets: false, all: null };
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

		if (closeBracketIndex === code.length || bracketStack > 0) {
			return { func, args: [], brackets: false, all: null };
		}

		const argsStr = code.slice(openBracketIndex + 1, closeBracketIndex).trim();
		const args = this.extractArguments(argsStr);
		const all = code.slice(funcStart, closeBracketIndex + 1);

		return { func, args, brackets: true, all };
	}

	private extractArguments(argsStr: string): Array<string> {
		const args: string[] = [];
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
		return args.map((arg: string) => {
			if (arg !== '') return arg.unescape();
			return void 0;
		});
	}

	private extractFunctions(code = this.code) {
		const lines = code.split(/\n/)?.filter((line) => line.trim() !== '' || line);
		const functions: string[] = [];

		for (const line of lines) {
			const splited = line.split('$').filter((x: string) => x.trim() !== '');
			const lineFunctions: string[] = [];

			for (const part of splited) {
				const matchingFunctions = [...this.functions.K(), '$if'].filter(
					(func) => func.toLowerCase() === `$${part.toLowerCase()}`.slice(0, func.length)
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

export { Interpreter };

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

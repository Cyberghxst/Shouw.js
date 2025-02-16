import type { InterpreterOptions } from '../typings';
import { Interpreter } from './Interpreter';

export async function IF(code: string, ctx: InterpreterOptions) {
	if (!code.toLowerCase().includes('$if[')) return code;
	for (let statement of code.split(/\$if\[/gi).slice(1)) {
		const length = code.toLowerCase().split(/\$if\[/i).length - 1;
		if (!code.match(/\$endif/gi)) {
			console.log('Invalid $if usage: Missing $endif');
			return code;
		}

		const everything: string = code.split(/\$if\[/gi)[length].split(/\$endif/gi)[0];
		statement = code.split(/\$if\[/gi)[length].split(/\$endif/gi)[0];

		let condition: string = statement.split(/\n/)[0].trim();
		condition = condition.slice(0, condition.length - 1);

		const pass: boolean =
			(
				await new Interpreter(
					{
						code: `$checkCondition[${condition}]`,
						name: 'if'
					},
					ctx as InterpreterOptions
				).initialize()
			).result === 'true';

		const elseIfAction: RegExpMatchArray | null = statement.match(/\$elseif/i);
		const elseIfs: object = {};

		if (statement.match(/\$elseif/i)) {
			for (const data of statement.split(/\$elseif\[/gi).slice(1)) {
				if (!data.toLowerCase().includes('$endelseif')) {
					console.log('Invalid $elseif usage: Missing $endelseif');
					return code;
				}

				const inside: string = data.split(/\$endelseIf/gi)[0];
				let elseifCondition: string = inside.split(/\n/)[0].trim();
				elseifCondition = elseifCondition.slice(0, elseifCondition.length - 1);
				elseIfs[elseifCondition] = inside.split(/\n/).slice(1).join('\n');

				statement = statement.replace(new RegExp(`\\$elseif\\[${escapeRegExp(inside)}\\$endelseif`, 'mi'), '');
			}
		}

		const elseAction: RegExpMatchArray | null = statement.match(/\$else/i);
		const ifCode: string = elseAction
			? statement
					.split('\n')
					.slice(1)
					.join('\n')
					.split(/\$else/gi)[0]
			: statement
					.split('\n')
					.slice(1)
					.join('\n')
					.split(/\$endif/gi)[0];

		const elseCode: string = elseAction ? statement.split(/\$else/gi)[1].split(/\$endif/gi)[0] : '';

		let passes: boolean = false;
		let lastCode: string = '';

		if (elseIfAction) {
			for (const data of Object.entries(elseIfs)) {
				if (!passes) {
					const response: boolean =
						(
							await new Interpreter(
								{
									code: `$checkCondition[${data[0]}]`,
									name: 'if'
								},
								ctx as InterpreterOptions
							).initialize()
						).result === 'true';

					if (response) {
						passes = true;
						lastCode = data[1];
					}
				}
			}
		}

		code = code.replace(/\$if\[/gi, '$if[').replace(/\$endif/gi, '$endif');
		code = code.replace(`$if[${everything}$endif`, pass ? ifCode : passes ? lastCode : elseCode);
	}

	return code;
}

function escapeRegExp(string: string) {
	return string.replace(/[.*+?^${}()|[\]\\\n]/g, '\\$&');
}

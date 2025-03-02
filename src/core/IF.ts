import { Interpreter } from './Interpreter';

export async function IF(
    code: string,
    ctx: Interpreter
): Promise<{
    error: boolean;
    code: string;
}> {
    if (!code.match(/\$endif/gi)) {
        await ctx.error({
            message: 'Invalid $if usage: Missing $endif',
            solution: 'Make sure to always use $endif at the end of the $if block'
        });

        return {
            error: true,
            code: code
        };
    }

    let result = code;
    const ifStatements = code.split(/\$if\[/gi).slice(1);

    for (let statement of ifStatements) {
        const conditionBlock =
            code
                .split(/\$if\[/gi)
                .pop()
                ?.split(/\$endif/gi)[0] || '';
        const condition = extractCondition(statement);

        const conditionResult =
            (
                await new Interpreter(
                    {
                        code: `$checkCondition[${condition}]`,
                        name: 'if',
                        type: 'parsing'
                    },
                    ctx as Interpreter,
                    {
                        sendMessage: false,
                        returnId: false,
                        returnResult: true,
                        returnError: false,
                        returnData: false
                    }
                ).initialize()
            ).result === 'true';

        const elseIfBlocks: Record<string, string> = {};
        const elseIfMatches = statement.match(/\$elseif/gi);

        if (elseIfMatches) {
            for (const elseIf of statement.split(/\$elseif\[/gi).slice(1)) {
                if (!elseIf.match(/\$endelseif/gi)) {
                    await ctx.error({
                        message: 'Invalid $elseif usage: Missing $endelseif',
                        solution: 'Make sure to always use $endelseif at the end of the $elseif block'
                    });

                    return {
                        error: true,
                        code: result
                    };
                }

                const elseifContent = elseIf.split(/\$endelseif/gi)[0];
                const elseifCondition = extractCondition(elseifContent);
                elseIfBlocks[elseifCondition] = elseifContent.slice(elseifCondition.length + 1);

                statement = statement.replace(
                    new RegExp(`\\$elseif\\[${escapeRegExp(elseifContent)}\\$endelseif`, 'mi'),
                    ''
                );
            }
        }

        const elseBlockMatch = statement.match(/\$else/i);
        const ifCodeBlock = elseBlockMatch
            ? statement
                  .split(`${condition}]`)
                  .slice(1)
                  .join('\n')
                  .split(/\$else/gi)[0]
            : statement
                  .split(`${condition}]`)
                  .slice(1)
                  .join('\n')
                  .split(/\$endif/gi)[0];

        const elseCodeBlock = elseBlockMatch ? statement.split(/\$else/gi)[1].split(/\$endif/gi)[0] : '';

        let finalCode = '';
        let isConditionPassed = false;

        if (elseIfBlocks) {
            for (const [elseifCondition, elseifCode] of Object.entries(elseIfBlocks)) {
                if (!isConditionPassed) {
                    const elseifConditionResult =
                        (
                            await new Interpreter(
                                {
                                    code: `$checkCondition[${elseifCondition}]`,
                                    name: 'if',
                                    type: 'parsing'
                                },
                                ctx as Interpreter,
                                {
                                    sendMessage: false,
                                    returnId: false,
                                    returnResult: true,
                                    returnError: false,
                                    returnData: false
                                }
                            ).initialize()
                        ).result === 'true';

                    if (elseifConditionResult) {
                        isConditionPassed = true;
                        finalCode = elseifCode;
                    }
                }
            }
        }

        result = code
            .replace(/\$if\[/gi, '$if[')
            .replace(/\$endif/gi, '$endif')
            .replace(
                `$if[${conditionBlock}$endif`,
                conditionResult ? ifCodeBlock : isConditionPassed ? finalCode : elseCodeBlock
            );
    }

    return { error: false, code: result };
}

function extractCondition(code: string): string {
    let nestingLevel = 1;
    let position = 0;
    while (nestingLevel > 0 && position < code.length) {
        if (code[position] === '[') nestingLevel++;
        if (code[position] === ']') {
            nestingLevel--;
            if (nestingLevel === 0) break;
        }

        position++;
    }

    return code.slice(0, position);
}

function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\\n]/g, '\\$&');
}

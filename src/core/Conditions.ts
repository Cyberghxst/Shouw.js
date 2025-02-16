export class CheckCondition {
	private static hasAnd(msg: string) {
		return msg.includes('&&');
	}

	private static hasOr(msg: string) {
		return msg.includes('||');
	}

	private static hasEqual(msg: string) {
		return msg.includes('==');
	}

	private static hasNotEqual(msg: string) {
		return msg.includes('!=');
	}

	private static hasGreater(msg: string) {
		return msg.includes('>');
	}

	private static hasLesser(msg: string) {
		return msg.includes('<');
	}

	private static hasGE(msg: string) {
		return msg.includes('>=');
	}

	private static hasLE(msg: string) {
		return msg.includes('<=');
	}

	private static solveEqual(msg: string) {
		let pass = true;
		const parts = msg.split('==').map((part) => part.trim());
		if (parts[0].unescape() !== parts[1].unescape()) pass = false;
		return pass;
	}

	private static solveNotEqual(msg: string) {
		let pass = true;
		const parts = msg.split('!=');
		// @ts-ignore
		if (parts[0].unescape() === parts[1].unescape()) pass = false;
		return pass;
	}

	private static solveGreater(msg: string) {
		let pass = true;
		let parts: string[] | number[] = msg.split('>');
		parts = parts.every((x: string) => Number.isNaN(Number(x))) ? parts : parts.map((x: string) => Number(x));
		if (parts[0] <= parts[1]) pass = false;
		return pass;
	}

	private static solveLesser(msg: string) {
		let pass = true;
		let parts: string[] | number[] = msg.split('<');
		parts = parts.every((x: string) => Number.isNaN(Number(x))) ? parts : parts.map((x: string) => Number(x));
		if (parts[0] >= parts[1]) pass = false;
		return pass;
	}

	private static solveLE(msg: string) {
		let pass = true;
		let parts: string[] | number[] = msg.split('<=');
		parts = parts.every((x: string) => Number.isNaN(Number(x))) ? parts : parts.map((x: string) => Number(x));

		if (parts[0] > parts[1]) pass = false;
		return pass;
	}

	private static solveGE(msg: string) {
		let pass = true;
		let parts: string[] | number[] = msg.split('>=');
		parts = parts.every((x: string) => Number.isNaN(Number(x))) ? parts : parts.map((x: string) => Number(x));

		if (parts[0] < parts[1]) pass = false;
		return pass;
	}

	private static solveAnd(msg: string) {
		const parts = msg.split('&&');
		const final: string[] = [];
		for (let part of parts) {
			const has = part.includes(')') ? ')' : '';
			part = part.split(')')[0];
			if (CheckCondition.hasOr(part)) final.push(CheckCondition.solveOr(part) + has);
			else if (CheckCondition.hasEqual(part)) final.push(CheckCondition.solveEqual(part) + has);
			else if (CheckCondition.hasNotEqual(part)) final.push(CheckCondition.solveNotEqual(part) + has);
			else if (CheckCondition.hasGE(part)) final.push(CheckCondition.solveGE(part) + has);
			else if (CheckCondition.hasLE(part)) final.push(CheckCondition.solveLE(part) + has);
			else if (CheckCondition.hasGreater(part)) final.push(CheckCondition.solveGreater(part) + has);
			else if (CheckCondition.hasLesser(part)) final.push(CheckCondition.solveLesser(part) + has);
			else if (part.trim() === '') final.push(part);
		}

		return final.join('&&');
	}

	private static solveOr(msg: string) {
		const parts = msg.split('||');
		const final: string[] = [];
		for (let part of parts) {
			const has = part.includes(')') ? ')' : '';
			part = part.split(')')[0];
			if (CheckCondition.hasEqual(part)) final.push(CheckCondition.solveEqual(part) + has);
			else if (CheckCondition.hasNotEqual(part)) final.push(CheckCondition.solveNotEqual(part) + has);
			else if (CheckCondition.hasGE(part)) final.push(CheckCondition.solveGE(part) + has);
			else if (CheckCondition.hasLE(part)) final.push(CheckCondition.solveLE(part) + has);
			else if (CheckCondition.hasGreater(part)) final.push(CheckCondition.solveGreater(part) + has);
			else if (CheckCondition.hasLesser(part)) final.push(CheckCondition.solveLesser(part) + has);
			else if (part.trim() === '') final.push(part);
		}
		return final.join('||');
	}

	public static solve(msg: string) {
		if (!msg) return false;
		const parts = msg.split('(');
		const final: string[] = [];

		for (const part of parts) {
			if (part.trim() === '') {
				final.push('');
				continue;
			}

			const solve = CheckCondition.solveAnd(part);
			final.push(solve);
		}

		let result = final.join('(');
		if (result.split('(').length !== result.split(')').length)
			result = result + ')'.repeat(result.split('(').length - result.split(')').length);

		try {
			return eval(result);
		} catch {
			return false;
		}
	}
}

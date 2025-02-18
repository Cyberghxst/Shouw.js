"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckCondition = void 0;
// biome-ignore lint:
class CheckCondition {
    static hasAnd(msg) {
        return msg.includes('&&');
    }
    static hasOr(msg) {
        return msg.includes('||');
    }
    static hasEqual(msg) {
        return msg.includes('==');
    }
    static hasNotEqual(msg) {
        return msg.includes('!=');
    }
    static hasGreater(msg) {
        return msg.includes('>');
    }
    static hasLesser(msg) {
        return msg.includes('<');
    }
    static hasGE(msg) {
        return msg.includes('>=');
    }
    static hasLE(msg) {
        return msg.includes('<=');
    }
    static solveEqual(msg) {
        let pass = false;
        const parts = msg.split('==').map(part => part.trim());
        if (parts[0].unescape() === parts[1].unescape())
            pass = true;
        return pass;
    }
    static solveNotEqual(msg) {
        let pass = false;
        const parts = msg.split('!=');
        if (parts[0].unescape() !== parts[1].unescape())
            pass = true;
        return pass;
    }
    static solveGreater(msg) {
        let pass = true;
        let parts = msg.split('>');
        parts = parts.every((x) => Number.isNaN(Number(x))) ? parts : parts.map((x) => Number(x));
        if (parts[0] <= parts[1])
            pass = false;
        return pass;
    }
    static solveLesser(msg) {
        let pass = true;
        let parts = msg.split('<');
        parts = parts.every((x) => Number.isNaN(Number(x))) ? parts : parts.map((x) => Number(x));
        if (parts[0] >= parts[1])
            pass = false;
        return pass;
    }
    static solveLE(msg) {
        let pass = true;
        let parts = msg.split('<=');
        parts = parts.every((x) => Number.isNaN(Number(x))) ? parts : parts.map((x) => Number(x));
        if (parts[0] > parts[1])
            pass = false;
        return pass;
    }
    static solveGE(msg) {
        let pass = true;
        let parts = msg.split('>=');
        parts = parts.every((x) => Number.isNaN(Number(x))) ? parts : parts.map((x) => Number(x));
        if (parts[0] < parts[1])
            pass = false;
        return pass;
    }
    static solveAnd(msg) {
        const parts = msg.split('&&');
        const final = [];
        for (let part of parts) {
            const has = part.includes(')') ? ')' : '';
            part = part.split(')')[0];
            if (CheckCondition.hasOr(part))
                final.push(CheckCondition.solveOr(part) + has);
            else if (CheckCondition.hasEqual(part))
                final.push(CheckCondition.solveEqual(part) + has);
            else if (CheckCondition.hasNotEqual(part))
                final.push(CheckCondition.solveNotEqual(part) + has);
            else if (CheckCondition.hasGE(part))
                final.push(CheckCondition.solveGE(part) + has);
            else if (CheckCondition.hasLE(part))
                final.push(CheckCondition.solveLE(part) + has);
            else if (CheckCondition.hasGreater(part))
                final.push(CheckCondition.solveGreater(part) + has);
            else if (CheckCondition.hasLesser(part))
                final.push(CheckCondition.solveLesser(part) + has);
            else if (part.trim() === '')
                final.push(part);
        }
        return final.join('&&');
    }
    static solveOr(msg) {
        const parts = msg.split('||');
        const final = [];
        for (let part of parts) {
            const has = part.includes(')') ? ')' : '';
            part = part.split(')')[0];
            if (CheckCondition.hasEqual(part))
                final.push(CheckCondition.solveEqual(part) + has);
            else if (CheckCondition.hasNotEqual(part))
                final.push(CheckCondition.solveNotEqual(part) + has);
            else if (CheckCondition.hasGE(part))
                final.push(CheckCondition.solveGE(part) + has);
            else if (CheckCondition.hasLE(part))
                final.push(CheckCondition.solveLE(part) + has);
            else if (CheckCondition.hasGreater(part))
                final.push(CheckCondition.solveGreater(part) + has);
            else if (CheckCondition.hasLesser(part))
                final.push(CheckCondition.solveLesser(part) + has);
            else if (part.trim() === '')
                final.push(part);
        }
        return final.join('||');
    }
    static solve(msg) {
        if (!msg)
            return false;
        const parts = msg.split('(');
        const final = [];
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
            // biome-ignore lint:
            return eval(result);
        }
        catch {
            return false;
        }
    }
}
exports.CheckCondition = CheckCondition;

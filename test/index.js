const { ShouwClient, Interpreter, CheckCondition } = require('../dist');

const client = new ShouwClient({
	intents: []
});

const code = `$if[uwu==uwu]
fist block
$elseif[uwu==owo]
second block
$endelseif
$else
third block
$endif
$checkCondition[hello==hello]`;

new Interpreter(
	{
		name: 'test',
		code: code
	},
	{
		client
	}
).initialize();

// Test simple condition
console.log('Test condition:', CheckCondition.solve('meow==meow'));

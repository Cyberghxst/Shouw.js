const { ShouwClient, Interpreter } = require('../dist');
const client = new ShouwClient({ intents: [] });

const code = `
$if[2==8]1$elseif[82==829]2$endelseif$else3$endif 
`;
const codse = `
$if[$checkCondition[meow==uwu]==false]
first block
$elseif[uwu==owo]
second block
$endelseif
$else
third block
$endif
$description[params;but;not;closed]
$description[uwu]
`;

console.log('CODE:\n\n' + code + '\n\n');
const now = Date.now();

new Interpreter(
	{
		name: 'test',
		code: code
	},
	{
		client
	}
)
	.initialize()
	.then((x) => {
		console.log('\n\nRESULT:\n\n' + x.result);
		console.log(`\n${Date.now() - now}ms\n\n\n`);
	});

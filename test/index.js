const { ShouwClient, Interpreter } = require('../dist');
const client = new ShouwClient({ intents: [] });

const code = `$let[vars;uwu]
$get[vars]
$if[$get[vars]==uwu]
first block
$endif
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

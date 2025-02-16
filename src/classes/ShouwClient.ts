import * as path from 'node:path';
import type { ShouwClientOptions } from '../typings';
import { BaseClient } from './BaseClient';
import { FunctionsManager } from './Functions';

export class ShouwClient extends BaseClient {
	public functions: FunctionsManager;

	constructor(options: ShouwClientOptions) {
		super(options);
		this.functions = new FunctionsManager(this);
		this.functions.load(path.join(__dirname, '../functions'), false);
	}
}

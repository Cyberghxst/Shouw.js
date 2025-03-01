import type { Message } from 'discord.js';
import { type ShouwClient } from '../classes';
export default function Events(message: Message, client: ShouwClient): Promise<void>;

import { Injections } from '../decorators/discord.decorator.js';
import {ChatInputCommandInteraction} from "discord.js";

const { Discord, Command } = Injections();

@Discord
export class FunCommands {
    @Command('Ping the bot')
    public async ping(interaction: ChatInputCommandInteraction) {
        await interaction.editReply('Pong!');
    }

    @Command('Say something')
    public async say(interaction: ChatInputCommandInteraction) {
        await interaction.editReply('This command is not implemented yet.');
    }
}
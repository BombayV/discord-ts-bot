import { Injections } from '../decorators/discord.decorator.js';

const { Discord, Command } = Injections();

@Discord
export class FunCommands {
    @Command('Ping the bot')
    public async ping(interaction: any) {
        await interaction.editReply('Pong!');
    }

    @Command('Say something')
    public async say(interaction: any) {
        await interaction.editReply('This command is not implemented yet.');
    }
}
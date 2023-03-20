import {Client, Collection, IntentsBitField} from 'discord.js';
import {config} from 'dotenv';
import readdirp from 'readdirp';
import {Database} from './util/Database.js';
import type {Command} from './util/types';

config();

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds],
});

const commandFiles = readdirp(
    __dirname + '/commands',
    {
        fileFilter: '*.js',
        directoryFilter: '!sub',
    },
);

const commands = new Collection<string, Command>();

(async () => {
    for await (const dir of commandFiles) {
        const cmd: Command = require(dir.fullPath)
            .default;
        commands.set(cmd.name, cmd);
    }
})();

client.once('ready', async () => {
    await Database.connectDb();
    console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const cmd = commands.get(interaction.commandName);
        if (!cmd) return;
        try {
            await cmd.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        }
    }
});

client.login(process.env['DISCORD_TOKEN']);

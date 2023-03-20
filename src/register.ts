import {SlashCommandBuilder, Routes} from 'discord.js';
import {REST} from '@discordjs/rest';
import {config} from 'dotenv';

config();

const token = process.env['DISCORD_TOKEN']!;
const clientId = process.env['CLIENT_ID']!;
//const guildId = process.env['DEV_GUILD_ID']!;

const commands = [
	new SlashCommandBuilder()
		.setName('help')
		.setDescription('Where am I?'),
    new SlashCommandBuilder()
        .setName('sudoku')
        .setDescription('Sudoku')
        .addSubcommandGroup((cmd) =>
            cmd
                .setName('board')
                .setDescription('Sudoku board commands')
                .addSubcommand((cmd) =>
                    cmd
                        .setName('edit')
                        .setDescription('Edit your sudoku board'),
                )
                .addSubcommand((cmd) =>
                    cmd
                        .setName('view')
                        .setDescription('View your sudoku board'),
                )
                .addSubcommand((cmd) =>
                    cmd
                        .setName('solve')
                        .setDescription(
                            'Automatically solve your sudoku board',
                        ),
                )
                .addSubcommand((cmd) =>
                    cmd
                        .setName('validate')
                        .setDescription(
                            'Check if your sudoku board is valid',
                        ),
                ),
        )
        .addSubcommandGroup((cmd) =>
            cmd
                .setName('saves')
                .setDescription('Sudoku board save management')
                .addSubcommand((cmd) =>
                    cmd
                        .setName('list')
                        .setDescription('List your saved sudoku boards'),
                )
                .addSubcommand((cmd) =>
                    cmd
                        .setName('save')
                        .setDescription(
                            "Save your current board so you don't lose progress",
                        )
                        .addStringOption((opt) =>
                            opt
                                .setName('name')
                                .setDescription('A name for your board'),
                        ),
                )
                .addSubcommand((cmd) =>
                    cmd
                        .setName('load')
                        .setDescription('Load your sudoku board from a save_id')
                        .addStringOption((opt) =>
                            opt
                                .setName('save_id')
                                .setDescription(
                                    'The ID of the board you want to load',
                                )
                                .setRequired(true),
                        ),
                )
                .addSubcommand((cmd) =>
                    cmd
                        .setName('delete')
                        .setDescription('Delete a saved sudoku board')
                        .addStringOption((opt) =>
                            opt
                                .setName('save_id')
                                .setDescription('The ID of the save to delete')
                                .setRequired(true),
                        ),
                ),
        ),
].map((command) => command.toJSON());

const rest = new REST({version: '10'}).setToken(token);

rest.put(Routes.applicationCommands(clientId), {body: commands})
    .then((data: any) =>
        console.log(
            `Successfully registered ${data.length} application commands.`,
        ),
    )
    .catch(console.error);

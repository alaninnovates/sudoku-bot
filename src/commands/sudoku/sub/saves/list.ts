import {ChatInputCommandInteraction, Colors, EmbedBuilder} from 'discord.js';
import {Database} from '../../../../util/Database';

export const listCommand = async (interaction: ChatInputCommandInteraction) => {
    const saves = await Database.getSaves(interaction.user.id);
    if (!saves.length) {
        await interaction.reply({
            content: 'You have no saves',
            ephemeral: true,
        });
        return;
    }
    const saveList = Object.values(saves)
        .map(
            (save) =>
                `ID: **${save.saveId}**\nName: \`${
                    save.name
                }\`\nCreated at: ${save.timestamp.toLocaleDateString()}\n`,
        )
        .join('\n');
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Your saves')
                .setDescription(saveList)
                .setColor(Colors.Green),
        ],
        ephemeral: true,
    });
};

import type {ChatInputCommandInteraction} from 'discord.js';
import {Database} from '../../../../util/Database';

export const deleteCommand = async (
    interaction: ChatInputCommandInteraction,
) => {
    const saveId = interaction.options.getString('save-id', true);
    const save = await Database.getSavedBoard(interaction.user.id, saveId);
    if (!save) {
        await interaction.reply({
            content: 'That save does not exist',
            ephemeral: true,
        });
        return;
    }
    await Database.deleteSave(interaction.user.id, saveId);
    await interaction.reply({
        content: 'Your save has been deleted',
        ephemeral: true,
    });
};

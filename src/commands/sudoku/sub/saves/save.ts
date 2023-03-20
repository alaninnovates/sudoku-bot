import type {ChatInputCommandInteraction} from 'discord.js';
import {BoardState} from '../../../../util/BoardState';
import {MAX_NAME_LENGTH, MAX_SAVES} from '../../../../util/config';
import {Database} from '../../../../util/Database';

export const saveCommand = async (interaction: ChatInputCommandInteraction) => {
    const changesMade = BoardState.areChangesMade(interaction.user.id);
    if (!changesMade) {
        await interaction.reply({
            content:
                'No changes have been made to the board from the default board. Your changes were not saved',
            ephemeral: true,
        });
        return;
    }
    if ((await Database.getSaves(interaction.user.id)).length >= MAX_SAVES) {
        // In the future, maybe:
        // In order to get more saves, subscribe to premium.
        await interaction.reply({
            content: 'You have reached the maximum number of saves',
            ephemeral: true,
        });
        return;
    }
    const name = interaction.options.getString('name') ?? 'Untitled';
    if (name.length > MAX_NAME_LENGTH) {
        await interaction.reply({
            content: `The name must be less than ${MAX_NAME_LENGTH} characters`,
            ephemeral: true,
        });
        return;
    }
    const board = BoardState.getBoard(interaction.user.id);
    await Database.saveBoard(interaction.user.id, board, name);
    await interaction.reply({
        content:
            'Your board has been saved. Use `/sudoku saves list` to list your saves',
        ephemeral: true,
    });
};

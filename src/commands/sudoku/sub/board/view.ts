import type {ChatInputCommandInteraction} from 'discord.js';
import {BoardState} from '../../../../util/BoardState';
import {renderBoard} from '../../../../util/image';

export const viewCommand = async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply({
        files: [
            {
                attachment: await renderBoard({
                    state: BoardState.getBoard(interaction.user.id).state,
                }),
                name: 'board.png',
            },
        ],
    });
};

import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
} from 'discord.js';
import {BoardState} from '../../../../util/BoardState';
import {Database} from '../../../../util/Database';

export const loadCommand = async (interaction: ChatInputCommandInteraction) => {
    const confirmation = await interaction.reply({
        content:
            'Are you sure you want to load this save? This will overwrite your current board. You will not be able to undo this action.',
        components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId('yes')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
            ),
        ],
    });
    const resp = await confirmation.awaitMessageComponent({
        componentType: ComponentType.Button,
        filter: (i) => i.user.id === interaction.user.id,
        time: 10000,
    });
    if (resp.customId === 'cancel') {
        await interaction.editReply({
            content: 'Cancelled',
            components: [],
        });
        return;
    }
    await interaction.editReply({
        content: 'Loading save...',
        components: [],
    });
    const save = await Database.getSavedBoard(
        interaction.user.id,
        interaction.options.getString('save_id')!,
    );
    if (!save) {
        await interaction.editReply({
            content: 'Save not found. Double check that your save_id is valid.',
        });
        return;
    }
    BoardState.overrideBoard(interaction.user.id, {
        userId: interaction.user.id,
        state: save.state,
    });
    await interaction.editReply({
        content: 'Successfully loaded save',
    });
};

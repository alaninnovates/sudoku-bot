import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    SelectMenuBuilder,
} from 'discord.js';
import {BoardState} from '../../../../util/BoardState';
import {renderBoard} from '../../../../util/image';

const paginateBuilder = (buttons: ButtonBuilder[]) => {
    const rows = [];
    for (let i = 0; i < buttons.length; i += 5) {
        rows.push(
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                buttons.slice(i, i + 5),
            ),
        );
    }
    return rows;
};

const backButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('back')
        .setLabel('Back')
        .setStyle(ButtonStyle.Danger),
);

const rowComponents = paginateBuilder(
    new Array(9).fill(1).map((_, i) =>
        new ButtonBuilder()
            .setCustomId(i.toString())
            .setLabel(`Row ${i + 1}`)
            .setStyle(ButtonStyle.Success),
    ),
);

const cellComponents = [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('set-cell')
            .setLabel('Set Cell Value')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('clear-cell')
            .setLabel('Clear Cell')
            .setStyle(ButtonStyle.Danger),
    ),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('set-primary-cell')
            .setLabel('Set as Primary Cell')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('clear-primary-cell')
            .setLabel('Remove Primary Cell status')
            .setStyle(ButtonStyle.Danger),
    ),
    backButton.addComponents(
        new ButtonBuilder()
            .setCustomId('back-to-row')
            .setLabel('Back to Row Selection')
            .setStyle(ButtonStyle.Primary),
    ),
];

export const editCommand = async (interaction: ChatInputCommandInteraction) => {
    const boardMessage = await interaction.reply({
        files: [
            {
                attachment: await renderBoard({
                    state: BoardState.getBoard(interaction.user.id).state,
                }),
                name: 'board.png',
            },
        ],
        components: rowComponents,
    });
    const collector = boardMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 1000 * 60 * 10,
        filter: (i) => i.user.id === interaction.user.id,
    });
    let state: {
        step: 'row' | 'column' | 'value';
        row: number;
        column: number;
    } = {
        step: 'row',
        row: 0,
        column: 0,
    };
    const getFileWithBoardState = async () => ({
        attachment: await renderBoard(
            {
                state: BoardState.getBoard(interaction.user.id).state,
            },
            {
                coords: [state.row, state.column],
                type: 'box',
            },
        ),
        name: 'board.png',
    });

    collector.on('collect', async (i) => {
        await i.deferUpdate();
        if (i.customId === 'back') {
            if (state.step === 'column') {
                await i.editReply({
                    embeds: [],
                    files: [
                        {
                            attachment: await renderBoard({
                                state: BoardState.getBoard(interaction.user.id)
                                    .state,
                            }),
                            name: 'board.png',
                        },
                    ],
                    components: rowComponents,
                });
                state.step = 'row';
                return;
            } else if (state.step === 'value') {
                state.step = 'row';
            }
        } else if (i.customId === 'back-to-row') {
            await i.editReply({
                embeds: [],
                files: [
                    {
                        attachment: await renderBoard({
                            state: BoardState.getBoard(interaction.user.id)
                                .state,
                        }),
                        name: 'board.png',
                    },
                ],
                components: rowComponents,
            });
            state.step = 'row';
            return;
        }
        switch (state.step) {
            case 'row':
                const r = parseInt(i.customId);
                const row = isNaN(r) ? state.row : r;
                await i.editReply({
                    files: [
                        {
                            attachment: await renderBoard(
                                {
                                    state: BoardState.getBoard(
                                        interaction.user.id,
                                    ).state,
                                },
                                {
                                    coords: [row, 0],
                                    type: 'row',
                                },
                            ),
                            name: 'board.png',
                        },
                    ],
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Selection state`)
                            .setDescription(`Row ${row + 1}`),
                    ],
                    components: [
                        ...paginateBuilder(
                            new Array(9).fill(1).map((_, i) =>
                                new ButtonBuilder()
                                    .setCustomId(i.toString())
                                    .setLabel(`Column ${i + 1}`)
                                    .setStyle(ButtonStyle.Success),
                            ),
                        ),
                        backButton,
                    ],
                });
                state.step = 'column';
                state.row = row;
                break;
            case 'column':
                const column = parseInt(i.customId);
                await i.editReply({
                    files: [
                        {
                            attachment: await renderBoard(
                                {
                                    state: BoardState.getBoard(
                                        interaction.user.id,
                                    ).state,
                                },
                                {
                                    coords: [state.row, column],
                                    type: 'box',
                                },
                            ),
                            name: 'board.png',
                        },
                    ],
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Selection state`)
                            .setDescription(
                                `Row ${state.row + 1}\nColumn ${
                                    column + 1
                                }\nCoords: (${state.row + 1}, ${column + 1})`,
                            ),
                    ],
                    components: cellComponents,
                });
                state.step = 'value';
                state.column = column;
                break;
            case 'value':
                switch (i.customId) {
                    case 'set-cell':
                        const m = await i.editReply({
                            components: [
                                new ActionRowBuilder<SelectMenuBuilder>().addComponents(
                                    new SelectMenuBuilder()
                                        .setCustomId('value')
                                        .setPlaceholder('Select a value')
                                        .addOptions(
                                            ...new Array(9)
                                                .fill(1)
                                                .map((_, i) => ({
                                                    label: `${i + 1}`,
                                                    value: `${i + 1}`,
                                                })),
                                        ),
                                ),
                            ],
                        });
                        const v = await m.awaitMessageComponent({
                            componentType: ComponentType.SelectMenu,
                            filter: (i) => i.user.id === interaction.user.id,
                            time: 60 * 1000,
                        });
                        const selectedValue = parseInt(v.values[0]!);
                        BoardState.setPosition(
                            interaction.user.id,
                            state.row,
                            state.column,
                            selectedValue,
                            'default',
                        );
                        await v.update({
                            files: [await getFileWithBoardState()],
                            components: cellComponents,
                        });
                        break;
                    case 'clear-cell':
                        BoardState.setPosition(
                            interaction.user.id,
                            state.row,
                            state.column,
                            0,
                            'default',
                        );
                        await i.editReply({
                            files: [await getFileWithBoardState()],
                            components: cellComponents,
                        });
                        break;
                    case 'set-primary-cell':
                        BoardState.setPosition(
                            interaction.user.id,
                            state.row,
                            state.column,
                            'default',
                            true,
                        );
                        await i.editReply({
                            files: [await getFileWithBoardState()],
                            components: cellComponents,
                        });
                        break;
                    case 'clear-primary-cell':
                        BoardState.setPosition(
                            interaction.user.id,
                            state.row,
                            state.column,
                            'default',
                            false,
                        );
                        await i.editReply({
                            files: [await getFileWithBoardState()],
                            components: cellComponents,
                        });
                        break;
                }
                break;
        }
    });
};

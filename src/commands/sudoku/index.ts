import type {Command} from '../../util/types';
import {editCommand} from './sub/board/edit';
import {viewCommand} from './sub/board/view';
import {solveCommand} from './sub/board/solve';
import {validateCommand} from "./sub/board/validate";
import {deleteCommand} from './sub/saves/delete';
import {listCommand} from './sub/saves/list';
import {loadCommand} from './sub/saves/load';
import {saveCommand} from './sub/saves/save';

export default {
    name: 'sudoku',
    description: 'Sudoku game',
    async execute(interaction) {
        switch (interaction.options.getSubcommandGroup()) {
            case 'board':
                switch (interaction.options.getSubcommand()) {
                    case 'view':
                        await viewCommand(interaction);
                        break;
                    case 'edit':
                        await editCommand(interaction);
                        break;
                    case 'solve':
                        await solveCommand(interaction);
                        break;
                    case 'validate':
                        await validateCommand(interaction);
                        break;
                }
                break;
            case 'saves':
                switch (interaction.options.getSubcommand()) {
                    case 'list':
                        await listCommand(interaction);
                        break;
                    case 'save':
                        await saveCommand(interaction);
                        break;
                    case 'load':
                        await loadCommand(interaction);
                        break;
                    case 'delete':
                        await deleteCommand(interaction);
                        break;
                }
        }
    },
} as Command;

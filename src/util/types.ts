import type {ChatInputCommandInteraction} from 'discord.js';

interface BoardLocation {
    value: number | undefined;
    provided: boolean;
}

export type BoardStateT = BoardLocation[][];

export interface SudokuBoard {
    userId: string;
    state: BoardStateT;
}

export interface Command {
    name: string;
    description: string;

    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

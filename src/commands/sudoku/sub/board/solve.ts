import type {ChatInputCommandInteraction} from "discord.js";
import {BoardState} from "../../../../util/BoardState";
import type {BoardStateT} from "../../../../util/types";
import {isValidBoard} from "../../../../util/validate";

const canPlace = (board: BoardStateT, row: number, col: number, value: number): boolean => {
    for (let i = 0; i < 9; i++) {
        if (board[row]![i]!.value === value) {
            return false;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (board[i]![col]!.value === value) {
            return false;
        }
    }
    const row_start = row - row % 3;
    const col_start = col - col % 3;
    for (let i = row_start; i < row_start + 3; i++) {
        for (let j = col_start; j < col_start + 3; j++) {
            if (board[i]![j]!.value === value) {
                return false;
            }
        }
    }
    return true;
}

const backtrack = (board: BoardStateT, row: number, col: number): BoardStateT | boolean => {
    if (row === 9) {
        return true;
    }
    if (col === 9) {
        return backtrack(board, row + 1, 0);
    }
    if (board[row]![col]!.value !== undefined) {
        return backtrack(board, row, col + 1);
    }
    for (let i = 1; i <= 9; i++) {
        if (canPlace(board, row, col, i)) {
            board[row]![col] = {
                value: i,
                provided: false,
            };
            if (backtrack(board, row, col + 1)) {
                return board;
            }
            board[row]![col] = {
                value: undefined,
                provided: false,
            };
        }
    }
    return false;
}

export const solveCommand = async (interaction: ChatInputCommandInteraction) => {
    const state = BoardState.getBoard(interaction.user.id).state;
    const stateCopy = state.slice();
    const newState = backtrack(stateCopy, 0, 0);
    if (typeof newState === "boolean" || !isValidBoard(newState)) {
        await interaction.reply("I couldn't solve that board, most likely because it was invalid.");
    } else {
        BoardState.overrideBoard(interaction.user.id, {
            userId: interaction.user.id,
            state: newState,
        });
        await interaction.reply("Solved! Use `/sudoku board view` to see your solved sudoku.");
    }
}
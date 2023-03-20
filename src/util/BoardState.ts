import {Collection} from '@discordjs/collection';
import type {Snowflake} from 'discord.js';
import type {SudokuBoard} from './types';

/*
[[0, 0, 9, 0, 0, 0, 0, 1, 5],
[5, 0, 0, 4, 0, 9, 7, 0, 0],
[4, 7, 3, 5, 6, 1, 9, 0, 0],
[0, 0, 0, 7, 4, 0, 0, 9, 6],
[0, 0, 0, 0, 0, 0, 0, 8, 0],
[0, 0, 4, 8, 3, 0, 1, 5, 0],
[1, 3, 5, 9, 0, 0, 0, 0, 2],
[0, 0, 6, 2, 5, 7, 0, 3, 0],
[7, 2, 0, 0, 1, 0, 0, 0, 9]]

const state = .map(row => row.map(num => ({
    value: num === 0 ? undefined : num,
    provided: num !== 0,
})));
*/

const getInitialBoard = (userId: string): SudokuBoard => ({
    userId,
    state: new Array(9).fill(null).map(() =>
        new Array(9).fill({
            value: undefined,
            provided: false,
        }),
    ),
});

export namespace BoardState {
    const board = new Collection<Snowflake, SudokuBoard>();
    export const areChangesMade = (userId: Snowflake): boolean => {
        const userBoard = board.get(userId);
        if (!userBoard) return false;
        return userBoard.state.some((row) => row.some((cell) => cell.value));
    };
    export const getBoard = (userId: Snowflake): SudokuBoard =>
        board.get(userId) ?? getInitialBoard(userId);
    export const overrideBoard = (userId: Snowflake, b: SudokuBoard) =>
        board.set(userId, b);
    export const setPosition = (
        userId: Snowflake,
        x: number,
        y: number,
        value: number | 'default',
        provided: boolean | 'default',
    ) => {
        const p =
            typeof provided === 'boolean'
                ? provided
                : getBoard(userId).state[x]![y]!.provided ?? false;
        const v =
            typeof value === 'number'
                ? value
                : getBoard(userId).state[x]![y]!.value ?? 0;
        const userBoard = board.get(userId);
        if (userBoard) {
            userBoard.state[x]![y] = {
                value: v,
                provided: p,
            };
            board.set(userId, userBoard);
        } else {
            const b = getInitialBoard(userId);
            b.state[x]![y] = {
                value: v,
                provided: p,
            };
            board.set(userId, b);
        }
    };
}

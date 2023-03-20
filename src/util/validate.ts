import type {BoardStateT} from "./types";

const isUniqueRow = (nums: number[]): boolean => {
    const s = new Set();
    for (const num of nums) {
        if (s.has(num)) return false;
        s.add(num);
    }
    return true;
}

const rotateMatrix = (matrix: number[][]): number[][] => {
    return matrix[0]!.map((_val, index) => matrix.map(row => row[index]!).reverse())
};

export const areInputsFilled = (board: BoardStateT): boolean => {
    for (const row of board) {
        for (const col of row) {
            if (col.value === undefined) return false;
        }
    }
    return true;
}

export const areRowsValid = (board: BoardStateT): boolean => {
    for (const row of board) {
        if (!isUniqueRow(row.map(r => r.value!))) return false;
    }
    return true;
}

export const areColumnsValid = (board: BoardStateT): boolean => {
    const rotated = rotateMatrix(board.map(b => b.map(r => r.value!)));
    for (const col of rotated) {
        if (!isUniqueRow(col)) return false;
    }
    return true;
}

export const areBoxesValid = (board: BoardStateT): boolean => {
    const boxes: number[][] = new Array(9).fill([]);
    for (let i = 0; i < 9; ++i) {
        for (let j = 0; j < 9; ++j) {
            const boxIdx = Math.floor((i / 3)) * 3 + Math.floor(j / 3);
            boxes[boxIdx]!.push(board[i]![j]!.value!);
        }
    }
    for (const box of boxes) {
        if (!isUniqueRow(box)) return false;
    }
    return true;
}

export const isValidBoard = (board: BoardStateT): boolean =>
    areInputsFilled(board) && areRowsValid(board) && areColumnsValid(board) && areBoxesValid(board);
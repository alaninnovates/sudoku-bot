import type {SudokuBoard} from './types';
import {Canvas} from 'canvas-constructor/napi-rs';

const BOX_SIZE = 50;

export const renderBoard = (
    board: Omit<SudokuBoard, 'userId'>,
    highlight:
        | {
        coords: [number, number];
        type: 'row' | 'box';
    }
        | undefined = undefined,
) => {
    return new Canvas(BOX_SIZE * 9, BOX_SIZE * 9)
        .setColor('#ffffff')
        .printRectangle(0, 0, BOX_SIZE * 9, BOX_SIZE * 9)
        .setColor('#000000')
        .setTextFont('30px sans-serif')
        .setTextAlign('center')
        .setTextBaseline('middle')
        .process((ctx) => {
            if (highlight) {
                const type = highlight.type;
                ctx.save()
                    .setColor('yellow')
                    .printRectangle(
                        type === 'row' ? 0 : highlight.coords[1] * BOX_SIZE,
                        highlight.coords[0] * BOX_SIZE,
                        type === 'row' ? ctx.width : BOX_SIZE,
                        BOX_SIZE,
                    )
                    .restore();
            }
        })
        .process((ctx) => {
            // print a 9x9 grid for sudoku
            for (let i = 0; i < 9; i++) {
                ctx.beginPath()
                    .setStrokeWidth(i % 3 === 0 ? 3 : 1)
                    .moveTo(0, i * BOX_SIZE)
                    .lineTo(BOX_SIZE * 10, i * BOX_SIZE)
                    .stroke()
                    .beginPath()
                    .moveTo(i * BOX_SIZE, 0)
                    .lineTo(i * BOX_SIZE, BOX_SIZE * 10)
                    .stroke();
            }
        })
        .process((ctx) => {
            for (let i = 0; i < board.state.length; i++) {
                for (let j = 0; j < board.state.length; j++) {
                    const cell = board.state[j]![i]!;
                    if (!cell.value) continue;
                    ctx.save()
                        .beginPath()
                        .setStroke(cell.provided ? '#000000' : '#4477dd')
                        .setLineWidth(5)
                        .arc(
                            BOX_SIZE * (i + 0.5),
                            BOX_SIZE * (j + 0.5),
                            BOX_SIZE / 2 - 5,
                            0,
                            Math.PI * 2,
                        )
                        .stroke()
                        .closePath()
                        .restore()
                        .printText(
                            cell.value.toString(),
                            25 + BOX_SIZE * i,
                            25 + BOX_SIZE * j,
                        );
                }
            }
        })
        .pngAsync();
};
